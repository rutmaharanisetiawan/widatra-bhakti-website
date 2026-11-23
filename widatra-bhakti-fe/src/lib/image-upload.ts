// Frontend-only helper for turning a picked/dropped File into something the
// Media Library store can safely persist to localStorage.
//
// Two problems this solves beyond a plain FileReader.readAsDataURL():
// 1. Validation — restrict to the formats the Media Library supports
//    (JPG/JPEG, PNG, SVG, WebP), regardless of what the OS file picker
//    filter actually enforced (drag & drop bypasses `accept` entirely).
// 2. Size — phone/camera photos are routinely 3-10MB, which blows past
//    localStorage's ~5-10MB per-origin quota after only one or two
//    uploads. Raster images above MAX_DIMENSION are downscaled and
//    re-encoded client-side before being stored. SVGs are vector and left
//    untouched.

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/svg+xml", "image/webp"] as const;
export const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".svg", ".webp"] as const;

/** Value for <input accept> / drop-zone hints. */
export const ACCEPTED_IMAGE_ACCEPT_ATTR = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_IMAGE_EXTENSIONS].join(",");

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;
const MAX_SOURCE_BYTES = 15 * 1024 * 1024; // 15MB safety cap on the original file

export function isAcceptedImageFile(file: File): boolean {
  if ((ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) return true;
  const lower = file.name.toLowerCase();
  return ACCEPTED_IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function isSvgFile(file: File): boolean {
  return file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
}

/** Approximate decoded byte size of a data: URL, for display/quota purposes. */
export function dataUrlByteSize(url: string): number {
  const commaIndex = url.indexOf(",");
  const base64 = commaIndex >= 0 ? url.slice(commaIndex + 1) : url;
  return Math.round((base64.length * 3) / 4);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) reject(new Error(`Couldn't read "${file.name}".`));
      else resolve(result);
    };
    reader.onerror = () => reject(new Error(`Couldn't read "${file.name}".`));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't decode image."));
    img.src = src;
  });
}

export type OptimizedImage = { url: string; type: string; size: number };

/**
 * Validate + prepare a File for storage. Throws a human-readable Error for
 * unsupported types or oversized files — callers should catch and toast it.
 */
export async function fileToOptimizedImage(file: File): Promise<OptimizedImage> {
  if (!isAcceptedImageFile(file)) {
    throw new Error(`"${file.name}" isn't a supported format. Use JPG, JPEG, PNG, SVG, or WebP.`);
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(`"${file.name}" is too large (max 15MB).`);
  }

  const rawUrl = await readAsDataUrl(file);

  // SVGs are vector — never rasterize, just store as-is.
  if (isSvgFile(file)) {
    return { url: rawUrl, type: "image/svg+xml", size: dataUrlByteSize(rawUrl) };
  }

  try {
    const img = await loadImage(rawUrl);
    if (img.width <= MAX_DIMENSION && img.height <= MAX_DIMENSION) {
      return { url: rawUrl, type: file.type || "image/jpeg", size: dataUrlByteSize(rawUrl) };
    }
    const scale = MAX_DIMENSION / Math.max(img.width, img.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return { url: rawUrl, type: file.type || "image/jpeg", size: dataUrlByteSize(rawUrl) };
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // Keep PNG for transparency-capable sources, JPEG otherwise for smaller payloads.
    const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const url = canvas.toDataURL(outType, outType === "image/jpeg" ? JPEG_QUALITY : undefined);
    return { url, type: outType, size: dataUrlByteSize(url) };
  } catch {
    // If decoding/resizing fails for any reason, fall back to the original file untouched.
    return { url: rawUrl, type: file.type || "image/jpeg", size: dataUrlByteSize(rawUrl) };
  }
}
