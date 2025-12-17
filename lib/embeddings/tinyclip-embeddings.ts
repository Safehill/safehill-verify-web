import { unzipSync } from 'fflate';

import { get, set } from 'idb-keyval';
import * as ort from 'onnxruntime-web';

const MODEL_KEY = 'tinyclip_model';
const MODEL_ZIP_URL =
  'https://s3.us-east-2.wasabisys.com/safehill-ml-prod/latest/TinyCLIP.onnx.zip';

let session: ort.InferenceSession | null = null;

/**
 * Load TinyCLIP ONNX model using ONNX Runtime Web
 */
/**
 * Wrapper for IndexedDB get with timeout
 */
async function getWithTimeout<T>(
  key: string,
  timeoutMs: number = 5000
): Promise<T | undefined> {
  return Promise.race([
    get<T>(key),
    new Promise<undefined>((resolve) =>
      setTimeout(() => {
        resolve(undefined);
      }, timeoutMs)
    ),
  ]);
}

export async function loadTinyCLIPModel(): Promise<void> {
  if (session) {
    console.log('[TinyCLIP] Session already exists, skipping load');
    return;
  }

  console.log('[TinyCLIP] Starting model load');
  console.log('[TinyCLIP] Checking IndexedDB cache...');
  let modelBuffer = await getWithTimeout<ArrayBuffer>(MODEL_KEY);
  console.log('[TinyCLIP] IndexedDB check complete, cached:', !!modelBuffer);

  if (!modelBuffer) {
    console.log(
      '[TinyCLIP] Model not cached, downloading from:',
      MODEL_ZIP_URL
    );
    const res = await fetch(MODEL_ZIP_URL);
    console.log(
      '[TinyCLIP] Download response received, size:',
      res.headers.get('content-length')
    );

    const zipBuffer = await res.arrayBuffer();
    console.log(
      '[TinyCLIP] ZIP downloaded, size:',
      zipBuffer.byteLength,
      'bytes'
    );

    console.log('[TinyCLIP] Unzipping...');
    const unzipped = unzipSync(new Uint8Array(zipBuffer));
    const modelBytes = unzipped['TinyCLIP.onnx'];
    if (!modelBytes) {
      throw new Error('Model file not found in zip');
    }
    console.log('[TinyCLIP] Unzipped model size:', modelBytes.length, 'bytes');

    modelBuffer = modelBytes.buffer;
    console.log('[TinyCLIP] Caching to IndexedDB...');
    await set(MODEL_KEY, modelBuffer);
    console.log('[TinyCLIP] Model cached successfully');
  } else {
    console.log('[TinyCLIP] Model loaded from IndexedDB cache');
  }

  console.log('[TinyCLIP] Creating ONNX inference session...');
  console.log('[TinyCLIP] Model buffer size:', modelBuffer.byteLength, 'bytes');

  const sessionStartTime = Date.now();
  session = await ort.InferenceSession.create(modelBuffer);
  const sessionDuration = Date.now() - sessionStartTime;

  console.log(
    '[TinyCLIP] ONNX session created successfully in',
    sessionDuration,
    'ms'
  );
}

/**
 * Resize and preprocess ImageData to [1, 3, 224, 224] Float32Array
 */
async function prepareInput(imageData: ImageData): Promise<Float32Array> {
  // Resize the image to 224x224 using an offscreen canvas
  const canvas = new OffscreenCanvas(224, 224);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Draw input ImageData to resized canvas
  const tempCanvas = new OffscreenCanvas(imageData.width, imageData.height);
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) {
    throw new Error('Could not get temp canvas context');
  }
  tempCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0, 224, 224);

  const resized = ctx.getImageData(0, 0, 224, 224);
  const { data } = resized;

  const floatArray = new Float32Array(3 * 224 * 224);

  for (let i = 0; i < 224 * 224; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;

    // Normalize using ImageNet mean/std
    floatArray[i] = (r - 0.485) / 0.229; // R
    floatArray[i + 224 * 224] = (g - 0.456) / 0.224; // G
    floatArray[i + 2 * 224 * 224] = (b - 0.406) / 0.225; // B
  }

  return floatArray;
}

/**
 * Generate embedding from ImageData (auto-resizes if needed)
 */
export async function generateEmbeddingFromImageData(
  imageData: ImageData
): Promise<Float32Array> {
  if (!session) {
    throw new Error('Model not loaded');
  }

  const input = await prepareInput(imageData);

  // console.log('First 10 pixels:', input.slice(0, 10)); // R channel
  // console.log('G sample:', input.slice(224 * 224, 224 * 224 + 10));
  // console.log('B sample:', input.slice(2 * 224 * 224, 2 * 224 * 224 + 10));

  const tensor = new ort.Tensor('float32', input, [1, 3, 224, 224]);

  const feeds: Record<string, ort.Tensor> = {};
  feeds[session.inputNames[0]] = tensor;

  const results = await session.run(feeds);
  const output = results[session.outputNames[0]];

  return output.data as Float32Array;
}

/**
 * Serialize Float32Array embedding to a base64 string for efficient network transport.
 * Base64 is generally preferred over raw Uint8Array in JSON bodies for REST APIs.
 */
export function serializeEmbeddingToBase64(embedding: Float32Array): string {
  const buffer = new ArrayBuffer(embedding.length * 4);
  const view = new DataView(buffer);

  embedding.forEach((value, i) => {
    view.setFloat32(i * 4, value, true);
  });

  const uint8Array = new Uint8Array(buffer);

  // Convert to binary string safely
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }

  const base64String = btoa(binary);
  // console.log('serialized embedding to base64:', base64String);
  return base64String;
}

/**
 * Deserialize a base64 string back into a Float32Array embedding.
 */
export function deserializeBase64ToEmbedding(
  base64String: string
): Float32Array {
  // Decode Base64 string to a binary string
  const binaryString = atob(base64String);

  // Convert binary string to Uint8Array
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create Float32Array from the Uint8Array buffer
  // Note: We need to create a new ArrayBuffer because the one backing `bytes` might not be aligned for DataView
  const buffer = new ArrayBuffer(bytes.length);
  const view = new DataView(buffer);
  bytes.forEach((byte, i) => view.setUint8(i, byte)); // Copy bytes over

  const length = buffer.byteLength / 4;
  const embedding = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    // Read Float32 values from the buffer. `true` for little-endian.
    embedding[i] = view.getFloat32(i * 4, true);
  }
  return embedding;
}
