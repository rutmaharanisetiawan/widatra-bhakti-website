// Factory Tour page imagery — backed by the real Laravel
// /factory-tour-content API (a public GET, admin-only PUT).

import { api } from "@/lib/api-client";

export type FactoryTourContent = {
  heroImage: string;
  gallery: string[];
};

const DEFAULT_CONTENT: FactoryTourContent = { heroImage: "", gallery: [] };

type ApiFactoryTourContent = {
  hero_image: string;
  hero_image_url: string | null;
  gallery: string[] | null;
  gallery_urls: string[] | null;
};

function mapContent(c: ApiFactoryTourContent): FactoryTourContent {
  return { heroImage: c.hero_image, gallery: c.gallery ?? [] };
}

const EVENT_NAME = "widatra-factory-tour-content-changed";

let cache: FactoryTourContent = DEFAULT_CONTENT;
let loaded = false;
let inFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onFactoryTourContentChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

async function loadContent(): Promise<void> {
  try {
    cache = mapContent(await api.get<ApiFactoryTourContent>("/factory-tour-content"));
  } catch {
    cache = DEFAULT_CONTENT;
  } finally {
    loaded = true;
    emitChange();
  }
}

export function initFactoryTourContentStore() {
  if (typeof window === "undefined") return;
  if (loaded || inFlight) return;
  inFlight = loadContent().finally(() => (inFlight = null));
}

export function getFactoryTourContent(): FactoryTourContent {
  return cache;
}

export async function saveFactoryTourContent(content: FactoryTourContent): Promise<FactoryTourContent> {
  const updated = mapContent(
    await api.put<ApiFactoryTourContent>("/factory-tour-content", {
      hero_image: content.heroImage,
      gallery: content.gallery,
    })
  );
  cache = updated;
  loaded = true;
  emitChange();
  return updated;
}
