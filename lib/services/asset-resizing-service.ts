import {
  AssetQuality,
  getAllVersionSpecs,
  type AssetVersionSpec,
} from '@/lib/crypto/asset-versions';

export interface ResizedVersion {
  quality: AssetQuality;
  file: File;
  width: number;
  height: number;
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  // If image is already smaller than max dimensions, keep original size
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return {
      width: originalWidth,
      height: originalHeight,
    };
  }

  const aspectRatio = originalWidth / originalHeight;

  let targetWidth = originalWidth;
  let targetHeight = originalHeight;

  // Scale down based on width constraint
  if (originalWidth > maxWidth) {
    targetWidth = maxWidth;
    targetHeight = Math.round(maxWidth / aspectRatio);
  }

  // Further scale down if height still exceeds max
  if (targetHeight > maxHeight) {
    targetHeight = maxHeight;
    targetWidth = Math.round(maxHeight * aspectRatio);
  }

  return {
    width: targetWidth,
    height: targetHeight,
  };
}

/**
 * Resize a single image to fit within max dimensions
 */
async function resizeImage(
  file: File,
  spec: AssetVersionSpec,
  quality: number = 0.92
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const { width, height } = calculateDimensions(
        img.width,
        img.height,
        spec.maxWidth,
        spec.maxHeight
      );

      // If dimensions didn't change, return original file as blob
      if (width === img.width && height === img.height) {
        resolve({
          blob: file,
          width: img.width,
          height: img.height,
        });
        return;
      }

      // Create canvas and resize
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Use high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }

          resolve({
            blob,
            width,
            height,
          });
        },
        file.type || 'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
}

/**
 * AssetResizingService - create multiple quality versions of images
 */
export class AssetResizingService {
  /**
   * Create all quality versions for a file
   * Returns versions in order: low, high
   *
   * @param file - Original file to resize
   * @returns Array of resized versions with metadata
   */
  async createVersions(file: File): Promise<ResizedVersion[]> {
    console.debug('AssetResizingService.createVersions started', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const specs = getAllVersionSpecs();
    const versions: ResizedVersion[] = [];

    for (const spec of specs) {
      console.debug('AssetResizingService.createVersions processing version', {
        fileName: file.name,
        versionName: spec.name,
        maxWidth: spec.maxWidth,
        maxHeight: spec.maxHeight,
      });

      const { blob, width, height } = await resizeImage(file, spec);

      // Create a new File object from the blob
      const versionFile = new File([blob], `${file.name}_${spec.name}`, {
        type: file.type || 'image/jpeg',
        lastModified: Date.now(),
      });

      const quality =
        spec.name === 'low' ? AssetQuality.LOW : AssetQuality.HIGH;

      versions.push({
        quality,
        file: versionFile,
        width,
        height,
      });

      console.debug('AssetResizingService.createVersions version created', {
        fileName: file.name,
        versionName: spec.name,
        originalSize: file.size,
        resizedSize: blob.size,
        dimensions: `${width}x${height}`,
      });
    }

    console.debug('AssetResizingService.createVersions completed', {
      fileName: file.name,
      versionCount: versions.length,
    });

    return versions;
  }

  /**
   * Create versions for multiple files
   */
  async createVersionsForFiles(
    files: File[]
  ): Promise<Map<File, ResizedVersion[]>> {
    console.debug('AssetResizingService.createVersionsForFiles started', {
      fileCount: files.length,
    });

    const resultMap = new Map<File, ResizedVersion[]>();

    for (const file of files) {
      const versions = await this.createVersions(file);
      resultMap.set(file, versions);
    }

    console.debug('AssetResizingService.createVersionsForFiles completed', {
      fileCount: files.length,
      totalVersions: Array.from(resultMap.values()).reduce(
        (sum, versions) => sum + versions.length,
        0
      ),
    });

    return resultMap;
  }
}
