/**
 * Custom error types for upload operations
 */

import type { AssetSimilarMatchDTO } from '@/lib/api/models/dto/Asset';

/**
 * Error thrown when attempting to upload an asset that is already claimed by another user.
 * This is a permanent error - retrying will not succeed.
 * The user should contact support to resolve ownership conflicts.
 */
export class AssetClaimedError extends Error {
  /**
   * Array of similar/conflicting assets that prevented creation.
   * Will be populated when server returns this data in 403 response.
   */
  public conflictingAssets?: AssetSimilarMatchDTO[];

  constructor(
    message: string = 'This asset has already been claimed by another user',
    conflictingAssets?: AssetSimilarMatchDTO[]
  ) {
    super(message);
    this.name = 'AssetClaimedError';
    this.conflictingAssets = conflictingAssets;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssetClaimedError);
    }
  }
}

/**
 * Error thrown when the embedding model fails to load or times out.
 * The user should retry loading the model.
 */
export class EmbeddingModelError extends Error {
  public readonly canRetry: boolean;

  constructor(message: string, canRetry: boolean = true) {
    super(message);
    this.name = 'EmbeddingModelError';
    this.canRetry = canRetry;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmbeddingModelError);
    }
  }
}
