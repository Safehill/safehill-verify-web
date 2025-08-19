export type AssetSimilarMatchRequestDTO = {
  perceptualHash?: string;
  embeddings: string;
  maxDistance: number; // 0 to 1
};
