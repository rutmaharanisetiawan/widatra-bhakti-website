// Media Library store — backed by the real Laravel /media API.
// Consumers keep using `media:<id>` reference strings exactly as before
// (the backend uses the same MediaAsset::REF_PREFIX convention), so
// products/news/csr/jobs/cms forms that store an `img` reference need no
// changes at all. `resolveMediaUrl()` stays synchronous by reading an
// in-memory cache that is populated from the API and kept warm after every
// mutation.

import { api, absoluteUrl } from "@/lib/api-client";

export const MEDIA_FOLDERS = [
  "Products",
  "News & Event",
  "CSR",
  "Factory Tour",
  "Company Profile",
  "Gallery",
  "Others",
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

export type MediaAsset = {
  id: string;
  name: string;
  url: string;
  folder: MediaFolder;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

type ApiMediaAsset = {
  id: string;
  name: string;
  url: string;
  folder: MediaFolder;
  type: string;
  size: number;
  created_at: string | null;
  updated_at: string | null;
};

function mapAsset(a: ApiMediaAsset): MediaAsset {
  return {
    id: a.id,
    name: a.name,
    url: absoluteUrl(a.url),
    folder: a.folder,
    type: a.type,
    size: a.size,
    createdAt: a.created_at ?? "",
    updatedAt: a.updated_at ?? "",
  };
}

const REF_PREFIX = "media:";
const EVENT_NAME = "widatra-media-store-changed";

let cache: MediaAsset[] = [];
let loaded = false;
let inFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

export function onMediaStoreChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

async function loadAll(): Promise<void> {
  try {
    const assets = await api.get<ApiMediaAsset[]>("/media?folder=All");
    cache = assets.map(mapAsset);
  } catch {
    cache = [];
  } finally {
    loaded = true;
    emitChange();
  }
}

/** Kicks off (or reuses) the background fetch that populates the cache. */
export function initMediaStore() {
  if (typeof window === "undefined") return;
  if (loaded || inFlight) return;
  inFlight = loadAll().finally(() => {
    inFlight = null;
  });
}

async function refresh(): Promise<void> {
  inFlight = loadAll();
  await inFlight;
  inFlight = null;
}

/** Synchronous read of the last-loaded cache (used for optimistic UI). */
export function getAllMedia(): MediaAsset[] {
  return cache.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getMediaAsset(id: string): MediaAsset | undefined {
  return cache.find((a) => a.id === id);
}

export function getMediaByFolder(folder: MediaFolder | "All"): MediaAsset[] {
  const all = getAllMedia();
  if (folder === "All") return all;
  return all.filter((a) => a.folder === folder);
}

export function searchMedia(query: string, folder: MediaFolder | "All" = "All"): MediaAsset[] {
  const q = query.trim().toLowerCase();
  const scoped = getMediaByFolder(folder);
  if (!q) return scoped;
  return scoped.filter((a) => a.name.toLowerCase().includes(q));
}

export class MediaStorageError extends Error {}

export type NewMediaInput = {
  name: string;
  /** A data: URI (from `fileToOptimizedImage`) or an already-hosted URL. */
  url: string;
  folder: MediaFolder;
  type: string;
  size: number;
};

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function addMediaAsset(input: NewMediaInput): Promise<MediaAsset> {
  try {
    const blob = input.url.startsWith("data:") ? await dataUrlToBlob(input.url) : null;
    const form = new FormData();
    if (blob) {
      form.append("file", blob, input.name);
    } else {
      // Already a hosted URL — fetch it client-side then re-upload as a file
      // so the backend always owns a real stored copy.
      const res = await fetch(input.url);
      const fetched = await res.blob();
      form.append("file", fetched, input.name);
    }
    form.append("folder", input.folder);
    form.append("name", input.name);

    const created = await api.upload<ApiMediaAsset>("/media", form, "POST");
    const asset = mapAsset(created);
    cache.unshift(asset);
    emitChange();
    return asset;
  } catch (err) {
    throw new MediaStorageError(err instanceof Error ? err.message : "Couldn't upload the image.");
  }
}

export async function renameMediaAsset(id: string, name: string): Promise<MediaAsset | undefined> {
  const updated = await api.patch<ApiMediaAsset>(`/media/${id}/rename`, { name });
  const asset = mapAsset(updated);
  cache = cache.map((a) => (a.id === id ? asset : a));
  emitChange();
  return asset;
}

export async function moveMediaAsset(id: string, folder: MediaFolder): Promise<MediaAsset | undefined> {
  const updated = await api.patch<ApiMediaAsset>(`/media/${id}/move`, { folder });
  const asset = mapAsset(updated);
  cache = cache.map((a) => (a.id === id ? asset : a));
  emitChange();
  return asset;
}

export async function replaceMediaAssetFile(
  id: string,
  file: { url: string; type: string; size: number }
): Promise<MediaAsset | undefined> {
  try {
    const blob = file.url.startsWith("data:") ? await dataUrlToBlob(file.url) : await (await fetch(file.url)).blob();
    const form = new FormData();
    form.append("file", blob, `replacement.${(file.type.split("/")[1] || "jpg")}`);
    const updated = await api.upload<ApiMediaAsset>(`/media/${id}/replace`, form, "POST");
    const asset = mapAsset(updated);
    cache = cache.map((a) => (a.id === id ? asset : a));
    emitChange();
    return asset;
  } catch (err) {
    throw new MediaStorageError(err instanceof Error ? err.message : "Couldn't save the replacement image.");
  }
}

export async function deleteMediaAsset(id: string): Promise<void> {
  await api.delete(`/media/${id}`);
  cache = cache.filter((a) => a.id !== id);
  emitChange();
}

export { refresh as refreshMediaStore };

// ---------------------------------------------------------------------------
// Reference helpers — used by every consuming module.
// ---------------------------------------------------------------------------

export function toMediaRef(id: string): string {
  return `${REF_PREFIX}${id}`;
}

export function isMediaRef(value: string | undefined | null): value is string {
  return !!value && value.startsWith(REF_PREFIX);
}

export function mediaRefId(value: string): string {
  return value.slice(REF_PREFIX.length);
}

/**
 * Resolve any stored image value (a `media:<id>` reference OR a legacy raw
 * URL/import path) to a displayable URL. Reads the in-memory cache, which is
 * populated from the backend and refreshed after every mutation.
 */
export function resolveMediaUrl(value: string | undefined | null): string {
  if (!value) return "";
  if (isMediaRef(value)) {
    const asset = getMediaAsset(mediaRefId(value));
    return asset?.url ?? "";
  }
  return value;
}

/** Resolve a reference to its full asset record (for name/folder display), if it is a media reference. */
export function resolveMediaAsset(value: string | undefined | null): MediaAsset | undefined {
  if (!value || !isMediaRef(value)) return undefined;
  return getMediaAsset(mediaRefId(value));
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
