'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FileMetadataLoaderProps } from './FileDetailsProps';
import { FingerprintMatchDTO } from './FileDetailsProps';
import MessageView from '../shared/MessageView';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ImageMatchesLoader: React.FC<FileMetadataLoaderProps> = ({
  currentFile,
  fingerprint,
  onApiResponse,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    AxiosInstance.post<FingerprintMatchDTO[]>('/fingerprint/retrieve-similar', {
      fingerprint: fingerprint,
    })
      .then((response) => {
        console.log('received response ' + response.status);
        onApiResponse(response.data);
      })
      .catch((error) => {
        console.log('received error ' + error.message);
        setErrorMessage(error.message);
      });
  }, []);

  if (errorMessage)
    return <MessageView message={'Error: ' + errorMessage} sizeClass={4} />;

  return (
    <>
      <MessageView
        message={'Looking for similar images … (' + fingerprint + ')'}
        sizeClass={4}
      />
    </>
  );
};

export default ImageMatchesLoader;
