// Applicant "My Documents" store — backed by the real Laravel /documents API.

import { api } from "@/lib/api-client";

export type StoredDocument = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
};

type ApiDocument = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string | null;
};

function mapDocument(d: ApiDocument): StoredDocument {
  return { id: d.id, name: d.name, url: d.url, type: d.type, size: d.size, uploadedAt: d.uploaded_at ?? "" };
}

const EVENT_NAME = "widatra-documents-store-changed";

let cache: StoredDocument[] = [];
let loaded = false;
let inFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onDocumentsStoreChange(cb: () => void) {
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
    const documents = await api.get<ApiDocument[]>("/documents");
    cache = documents.map(mapDocument);
  } catch {
    cache = [];
  } finally {
    loaded = true;
    emitChange();
  }
}

export function initDocumentsStore() {
  if (typeof window === "undefined") return;
  if (loaded || inFlight) return;
  inFlight = loadAll().finally(() => (inFlight = null));
}

export async function refreshDocumentsStore(): Promise<void> {
  inFlight = loadAll();
  await inFlight;
  inFlight = null;
}

export function getAllDocuments(): StoredDocument[] {
  return cache
    .slice()
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export async function uploadDocument(file: File): Promise<StoredDocument> {
  const form = new FormData();
  form.append("file", file);
  const created = mapDocument(await api.upload<ApiDocument>("/documents", form, "POST"));
  cache = [created, ...cache];
  emitChange();
  return created;
}

export async function deleteDocument(id: string): Promise<void> {
  await api.delete(`/documents/${encodeURIComponent(id)}`);
  cache = cache.filter((d) => d.id !== id);
  emitChange();
}

export function formatDocumentSize(bytes: number): string {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
