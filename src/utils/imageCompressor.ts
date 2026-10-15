/**
 * Image compression utility to ensure images uploaded or embedded in slides,
 * artifacts, categories, and questions are optimized for web, localStorage quota,
 * and Firestore document size limits (max 1MB per Firestore document).
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1200,
  maxHeight: 900,
  quality: 0.78,
  mimeType: 'image/jpeg',
};

/**
 * Compresses an image File using HTML Canvas and returns a lightweight base64 data URL.
 * Typically reduces a 2MB-10MB photo down to 50KB-140KB.
 */
export async function compressImageFile(
  file: File,
  options?: CompressionOptions
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    // If file is SVG, keep as is if small, or read as text
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const { maxWidth, maxHeight } = opts;

      // Calculate constrained dimensions preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to FileReader if canvas context unavailable
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      // Draw with smooth interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Output as compressed JPEG or WebP
      try {
        const dataUrl = canvas.toDataURL(opts.mimeType, opts.quality);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

/**
 * Compresses an existing base64 data URL if it exceeds the specified character limit.
 * Firestore document maximum size is 1,048,576 bytes; we ensure images are < 400KB.
 */
export async function compressDataUrlIfNeeded(
  dataUrl: string,
  maxChars = 400000,
  options?: CompressionOptions
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image') || dataUrl.length <= maxChars) {
    return dataUrl;
  }

  // SVGs are vector, don't re-compress on canvas
  if (dataUrl.startsWith('data:image/svg')) {
    return dataUrl;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const { maxWidth, maxHeight } = opts;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const compressed = canvas.toDataURL(opts.mimeType, opts.quality);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

/**
 * Check if a data URL or image string exceeds the Firestore safe limit (max 500,000 characters).
 */
export function isImageTooLargeForFirestore(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('data:') && url.length > 500000;
}
