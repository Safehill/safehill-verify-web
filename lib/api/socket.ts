import { WS_BASE_URL } from '@/lib/api/api';
import type { AuthedSession } from '@/lib/auth/auth-context';
import type {
  AuthCredentialsMessage,
  AuthSessionInitializationMessage,
} from '@/lib/api/models/ws/messages';
import { useAuth } from '@/lib/auth/auth-context';
import { base64ToArrayBuffer } from '@/lib/crypto/base64';
import {
  generateSymmetricKey,
  importPrivateKeySigning,
  initializePrivateKeyAgreement,
} from '@/lib/crypto/keys';
import { useCallback, useEffect, useState } from 'react';

export type SessionWebSocketState = {
  session: AuthSessionInitializationMessage | null;
  symmetricKey: CryptoKey | null;
  authedSession: AuthedSession | null;
  setAuthedSession: (authedSession: AuthedSession | null) => void;
  error: string | null;
  isConnecting: boolean;
  retry: () => void;
};

export const SessionEncryption = {
  symmetricKey: null as CryptoKey | null,
  isInitializing: false,
};

export const WebsocketSessionStatus = {
  isConnecting: false,
  wsRef: null as WebSocket | null,
};

export function resetWebSocketState() {
  if (WebsocketSessionStatus.wsRef) {
    WebsocketSessionStatus.wsRef.close();
    WebsocketSessionStatus.wsRef = null;
  }
  WebsocketSessionStatus.isConnecting = false;
  SessionEncryption.symmetricKey = null;
  SessionEncryption.isInitializing = false;
}

export function useSessionWebSocket(): SessionWebSocketState {
  const [websocketSession, setWebsocketSession] =
    useState<AuthSessionInitializationMessage | null>(null);
  const [localAuthedSession, setLocalLocalAuthedSession] =
    useState<AuthedSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { setAuthedSession } = useAuth();

  // Perform init once
  if (
    typeof window !== 'undefined' &&
    !SessionEncryption.symmetricKey &&
    !SessionEncryption.isInitializing
  ) {
    // console.log('Creating encryption key');
    SessionEncryption.isInitializing = true;

    generateSymmetricKey().then((key) => {
      SessionEncryption.symmetricKey = key;
    });
  }

  async function decryptData(
    base64Ciphertext: string,
    base64IV: string,
    symmetricKey: CryptoKey
  ): Promise<ArrayBuffer> {
    const ciphertextBuffer = base64ToArrayBuffer(base64Ciphertext);
    const iv = new Uint8Array(base64ToArrayBuffer(base64IV));

    return await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      symmetricKey,
      ciphertextBuffer
    );
  }

  const connect = useCallback(() => {
    if (WebsocketSessionStatus.wsRef) {
      WebsocketSessionStatus.wsRef.close();
    }
    WebsocketSessionStatus.isConnecting = true;
    setError(null);
    setLocalLocalAuthedSession(null);
    setWebsocketSession(null);

    const ws = new WebSocket(`${WS_BASE_URL}/web/sessions`);
    WebsocketSessionStatus.wsRef = ws;
    // console.log('Connecting to WS:', ws.url);

    ws.onopen = () => {
      // console.log('WS open');
    };

    ws.onmessage = async (event) => {
      const sessionRaw = JSON.parse(event.data);
      const content = JSON.parse(sessionRaw['content']);
      switch (sessionRaw['type']) {
        case 'session-inititalized':
          setWebsocketSession(content as AuthSessionInitializationMessage);
          WebsocketSessionStatus.isConnecting = false;
          break;
        case 'auth-credentials': {
          if (!SessionEncryption.symmetricKey) {
            // console.error(
            //   "auth credentials received but symmetric key wasn't initialized. This isn't supposed to happen."
            // );
            return;
          }

          const credentialsMessage = content as AuthCredentialsMessage;
          const privateKeyData = await decryptData(
            credentialsMessage.encryptedPrivateKey,
            credentialsMessage.encryptedPrivateKeyIV,
            SessionEncryption.symmetricKey
          );
          const privateSignatureData = await decryptData(
            credentialsMessage.encryptedPrivateSignature,
            credentialsMessage.encryptedPrivateSignatureIV,
            SessionEncryption.symmetricKey
          );
          const privateKey = await initializePrivateKeyAgreement(
            privateKeyData
          );
          const privateSignature = await importPrivateKeySigning(
            privateSignatureData
          );
          const newSession = {
            authToken: credentialsMessage.authToken,
            privateKey: privateKey,
            privateSignature: privateSignature,
            user: credentialsMessage.user,
          } as AuthedSession;
          setLocalLocalAuthedSession(newSession);
          break;
        }
      }
    };

    ws.onerror = (_e) => {
      // console.error('WS error', e);
      setError('Failed to connect to the server');
      WebsocketSessionStatus.isConnecting = false;
      setLocalLocalAuthedSession(null);
      setWebsocketSession(null);
    };

    ws.onclose = () => {
      // console.log('WS close');
      if (!websocketSession) {
        setError('WebSocket closed before session information was received.');
      }
      WebsocketSessionStatus.isConnecting = true;
      setLocalLocalAuthedSession(null);
      setWebsocketSession(null);
    };
  }, [websocketSession]);

  // Connect on load
  useEffect(() => {
    if (WebsocketSessionStatus.isConnecting) {
      return;
    }
    if (websocketSession) {
      return;
    }

    setLocalLocalAuthedSession(null);

    connect();
  }, [connect, websocketSession]);

  return {
    session: websocketSession,
    symmetricKey: SessionEncryption.symmetricKey,
    authedSession: localAuthedSession,
    setAuthedSession,
    error,
    isConnecting: WebsocketSessionStatus.isConnecting,
    retry: connect,
  };
}
