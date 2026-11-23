// CSR Programs store — backed by the real Laravel /csr-programs API.
// Same pattern as news-store.ts (separate public/admin caches, since the
// admin "all" listing requires manage-content authorization).

import { api } from "@/lib/api-client";
import type { CsrProgram } from "@/lib/csr-data";

const EVENT_NAME = "widatra-csr-store-changed";

type ApiCsrProgram = {
  slug: string;
  pillar: string;
  location: string;
  date: string;
  title: string;
  excerpt: string;
  img: string;
  img_url: string | null;
  content: string;
  gallery: string[] | null;
  impact: string | null;
  status: CsrProgram["status"];
};

function mapProgram(p: ApiCsrProgram): CsrProgram {
  return {
    slug: p.slug,
    pillar: p.pillar,
    location: p.location,
    date: p.date,
    title: p.title,
    excerpt: p.excerpt,
    img: p.img,
    content: p.content,
    gallery: p.gallery ?? [],
    impact: p.impact ?? undefined,
    status: p.status ?? "Published",
  };
}

function toApiPayload(input: Omit<CsrProgram, "slug"> & { slug?: string }) {
  return {
    slug: input.slug,
    pillar: input.pillar,
    location: input.location,
    date: input.date,
    title: input.title,
    excerpt: input.excerpt,
    img: input.img,
    content: input.content,
    gallery: input.gallery ?? [],
    impact: input.impact,
    status: input.status ?? "Published",
  };
}

let allCache: CsrProgram[] = [];
let publishedCache: CsrProgram[] = [];
let allLoaded = false;
let publishedLoaded = false;
let allInFlight: Promise<void> | null = null;
let publishedInFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onCsrStoreChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

async function loadPublished(): Promise<void> {
  try {
    const programs = await api.get<ApiCsrProgram[]>("/csr-programs");
    publishedCache = programs.map(mapProgram);
  } catch {
    publishedCache = [];
  } finally {
    publishedLoaded = true;
    emitChange();
  }
}

async function loadAll(): Promise<void> {
  try {
    const programs = await api.get<ApiCsrProgram[]>("/csr-programs?all=1");
    allCache = programs.map(mapProgram);
  } catch {
    allCache = [];
  } finally {
    allLoaded = true;
    emitChange();
  }
}

export function initCsrStore() {
  if (typeof window === "undefined") return;
  if (!publishedLoaded && !publishedInFlight) {
    publishedInFlight = loadPublished().finally(() => (publishedInFlight = null));
  }
}

export function initCsrAdminStore() {
  if (typeof window === "undefined") return;
  if (!allLoaded && !allInFlight) {
    allInFlight = loadAll().finally(() => (allInFlight = null));
  }
}

export async function refreshCsrStore(): Promise<void> {
  await Promise.all([loadPublished(), loadAll()]);
}

export function getAllCsrPrograms(): CsrProgram[] {
  return allLoaded ? allCache : publishedCache;
}

export function getPublishedCsrPrograms(): CsrProgram[] {
  return publishedCache;
}

export function getStoredCsrProgram(slug: string): CsrProgram | undefined {
  return getAllCsrPrograms().find((p) => p.slug === slug) ?? getPublishedCsrPrograms().find((p) => p.slug === slug);
}

export type NewCsrProgramInput = Omit<CsrProgram, "slug"> & { slug?: string };

export async function addCsrProgram(input: NewCsrProgramInput): Promise<CsrProgram> {
  const created = mapProgram(await api.post<ApiCsrProgram>("/csr-programs", toApiPayload(input)));
  allCache = [created, ...allCache];
  if (created.status === "Published") publishedCache = [created, ...publishedCache];
  emitChange();
  return created;
}

export async function updateCsrProgram(originalSlug: string, input: CsrProgram): Promise<CsrProgram | undefined> {
  const updated = mapProgram(
    await api.put<ApiCsrProgram>(`/csr-programs/${encodeURIComponent(originalSlug)}`, toApiPayload(input))
  );
  allCache = allCache.map((p) => (p.slug === originalSlug ? updated : p));
  publishedCache =
    updated.status === "Published"
      ? [updated, ...publishedCache.filter((p) => p.slug !== originalSlug && p.slug !== updated.slug)]
      : publishedCache.filter((p) => p.slug !== originalSlug);
  emitChange();
  return updated;
}

export async function deleteCsrProgram(slug: string): Promise<void> {
  await api.delete(`/csr-programs/${encodeURIComponent(slug)}`);
  allCache = allCache.filter((p) => p.slug !== slug);
  publishedCache = publishedCache.filter((p) => p.slug !== slug);
  emitChange();
}

export async function setCsrProgramStatus(slug: string, status: CsrProgram["status"]): Promise<void> {
  const updated = mapProgram(
    await api.patch<ApiCsrProgram>(`/csr-programs/${encodeURIComponent(slug)}/status`, { status })
  );
  allCache = allCache.map((p) => (p.slug === slug ? updated : p));
  publishedCache =
    updated.status === "Published"
      ? [updated, ...publishedCache.filter((p) => p.slug !== slug)]
      : publishedCache.filter((p) => p.slug !== slug);
  emitChange();
}
