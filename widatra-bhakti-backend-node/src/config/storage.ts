import path from "path";
import fs from "fs";
import crypto from "crypto";

/**
 * Shares Laravel's `public` disk (storage/app/public) so every file uploaded by either
 * backend resolves to the same `/storage/<path>` URL during the side-by-side migration.
 */
export const STORAGE_ROOT = path.resolve(
  process.env.STORAGE_PATH || path.join(process.cwd(), "..", "widatra-bhakti-backend", "storage", "app", "public")
);

/** Matches Laravel `APP_URL` so generated URLs are identical to the PHP backend. */
export const APP_URL = (process.env.APP_URL || "http://localhost:8000").replace(/\/$/, "");

/** Laravel `Storage::disk('public')->url($path)` equivalent. */
export function storageUrl(relPath: string | null | undefined): string | null {
  if (!relPath) return null;
  if (/^https?:\/\//i.test(relPath)) return relPath;
  return `${APP_URL}/storage/${relPath.replace(/^\/+/, "")}`;
}

export function absoluteStoragePath(relPath: string): string {
  return path.join(STORAGE_ROOT, relPath);
}

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

/** Laravel `hashName()` equivalent: 40 random alphanumerics + original extension. */
export function hashName(originalName: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(40);
  let name = "";
  for (let i = 0; i < 40; i++) name += alphabet[bytes[i] % alphabet.length];
  const ext = path.extname(originalName || "").toLowerCase();
  return `${name}${ext}`;
}

/** Laravel `Storage::disk('public')->delete($path)` equivalent (silent if missing). */
export function deleteStoredFile(relPath: string | null | undefined): void {
  if (!relPath || /^https?:\/\//i.test(relPath)) return;
  try {
    fs.unlinkSync(absoluteStoragePath(relPath));
  } catch {
    /* ignore */
  }
}
