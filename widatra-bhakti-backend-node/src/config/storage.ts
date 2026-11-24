import path from "path";
import fs from "fs";
import crypto from "crypto";

/**
 * Standalone storage public disk (storage/app/public) for uploaded files.
 * Supports being run from either repo root or widatra-bhakti-backend-node directory.
 */
const defaultStoragePath = fs.existsSync(path.join(process.cwd(), "widatra-bhakti-backend-node"))
  ? path.join(process.cwd(), "widatra-bhakti-backend-node", "storage", "app", "public")
  : path.join(process.cwd(), "storage", "app", "public");

export const STORAGE_ROOT = path.resolve(
  process.env.STORAGE_PATH || defaultStoragePath
);

// Ensure the storage root directory exists
ensureDir(STORAGE_ROOT);

/** Matches application backend URL so generated URLs point to the active Node.js server. */
export const APP_URL = (
  process.env.APP_URL || `http://localhost:${process.env.PORT || 8001}`
).replace(/\/$/, "");

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
