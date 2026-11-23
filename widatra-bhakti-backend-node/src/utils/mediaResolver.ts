import { prisma } from "../config/prisma.js";
import { storageUrl } from "../config/storage.js";

export const MEDIA_REF_PREFIX = "media:";

export function isMediaRef(val: string | null | undefined): boolean {
  return typeof val === "string" && val.startsWith(MEDIA_REF_PREFIX);
}

export function extractMediaId(val: string): string {
  return val.slice(MEDIA_REF_PREFIX.length);
}

/**
 * Resolves a media ref `media:<id>` or raw URL into a full displayable URL.
 */
export async function resolveMediaUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (!isMediaRef(value)) {
    return value;
  }
  const id = extractMediaId(value);
  try {
    const asset = await prisma.media_assets.findUnique({
      where: { id },
      select: { path: true },
    });
    if (asset?.path) {
      return storageUrl(asset.path);
    }
  } catch {
    // fallback
  }
  return value;
}

/**
 * Batch resolve media URLs for array of refs.
 */
export async function resolveMediaUrls(values: string[] | null | undefined): Promise<string[]> {
  if (!values || !Array.isArray(values)) return [];
  return Promise.all(values.map((v) => resolveMediaUrl(v).then((res) => res || v)));
}
