// News & Event store — backed by the real Laravel /articles API.
// Same synchronous-read / background-refresh cache pattern as
// products-store.ts. Admin views (including drafts) require an
// authenticated request with the manage-content permission, which the
// api-client attaches automatically via the stored Sanctum token.

import { api } from "@/lib/api-client";
import { ARTICLES, type Article } from "@/lib/news-data";

const EVENT_NAME = "widatra-news-store-changed";

type ApiArticle = {
  slug: string;
  cat: string;
  date: string;
  read: string | null;
  title: string;
  excerpt: string;
  img: string;
  img_url: string | null;
  content: string;
  gallery: string[] | null;
  tags: string[] | null;
  author: string | null;
  author_role: string | null;
  status: Article["status"];
  views?: number;
};

function getStableViews(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 850) + 24;
}

function mapArticle(a: ApiArticle): Article {
  return {
    slug: a.slug,
    cat: a.cat,
    date: a.date,
    read: a.read ?? undefined,
    title: a.title,
    excerpt: a.excerpt,
    img: a.img_url || a.img,
    content: a.content,
    gallery: a.gallery ?? [],
    tags: a.tags ?? [],
    author: a.author ?? undefined,
    authorRole: a.author_role ?? undefined,
    status: a.status ?? "Published",
    views: a.views || getStableViews(a.slug),
  };
}

function toApiPayload(input: Omit<Article, "slug"> & { slug?: string }) {
  return {
    slug: input.slug,
    cat: input.cat,
    date: input.date,
    read: input.read,
    title: input.title,
    excerpt: input.excerpt,
    img: input.img,
    content: input.content,
    gallery: input.gallery ?? [],
    tags: input.tags ?? [],
    author: input.author,
    author_role: input.authorRole,
    status: input.status ?? "Published",
  };
}

// All-articles cache (admin, includes drafts) and published-only cache
// (public) are kept separately since they hit different endpoints/permissions.
let allCache: Article[] = [];
let publishedCache: Article[] = [];
let allLoaded = false;
let publishedLoaded = false;
let allInFlight: Promise<void> | null = null;
let publishedInFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onNewsStoreChange(cb: () => void) {
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
    const articles = await api.get<ApiArticle[]>("/articles");
    const mapped = articles.map(mapArticle);
    const apiSlugs = new Set(mapped.map((a) => a.slug));
    const fallback = ARTICLES.filter((a) => !apiSlugs.has(a.slug));
    publishedCache = [...mapped, ...fallback];
  } catch {
    publishedCache = [...ARTICLES];
  } finally {
    publishedLoaded = true;
    emitChange();
  }
}

async function loadAll(): Promise<void> {
  try {
    const articles = await api.get<ApiArticle[]>("/articles?all=1");
    const mapped = articles.map(mapArticle);
    const apiSlugs = new Set(mapped.map((a) => a.slug));
    const fallback = ARTICLES.filter((a) => !apiSlugs.has(a.slug));
    allCache = [...mapped, ...fallback];
  } catch {
    allCache = [...ARTICLES];
  } finally {
    allLoaded = true;
    emitChange();
  }
}

/** Kicks off both public + admin fetches (harmless if the admin one 403s for a non-logged-in visitor). */
export function initNewsStore() {
  if (typeof window === "undefined") return;
  if (!publishedLoaded && !publishedInFlight) {
    publishedInFlight = loadPublished().finally(() => (publishedInFlight = null));
  }
}

/** Call from Admin pages to also load drafts. */
export function initNewsAdminStore() {
  if (typeof window === "undefined") return;
  if (!allLoaded && !allInFlight) {
    allInFlight = loadAll().finally(() => (allInFlight = null));
  }
}

export async function refreshNewsStore(): Promise<void> {
  await Promise.all([loadPublished(), loadAll()]);
}

/** All articles, including drafts — used by the Admin module. */
export function getAllArticles(): Article[] {
  return allLoaded ? allCache : publishedCache;
}

/** Only published articles — used by the public News page. */
export function getPublishedArticles(): Article[] {
  return publishedCache;
}

export function getStoredArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug) ?? getPublishedArticles().find((a) => a.slug === slug);
}

export async function fetchArticle(slug: string): Promise<Article | undefined> {
  try {
    return mapArticle(await api.get<ApiArticle>(`/articles/${encodeURIComponent(slug)}`));
  } catch {
    return undefined;
  }
}

export async function fetchRelatedArticles(slug: string): Promise<Article[]> {
  try {
    const articles = await api.get<ApiArticle[]>(`/articles/${encodeURIComponent(slug)}/related`);
    return articles.map(mapArticle);
  } catch {
    return [];
  }
}

export function relatedStoredArticles(slug: string, cat: string, limit = 3) {
  return getPublishedArticles()
    .filter((a) => a.cat === cat && a.slug !== slug)
    .slice(0, limit);
}

export type NewArticleInput = Omit<Article, "slug"> & { slug?: string };

export async function addArticle(input: NewArticleInput): Promise<Article> {
  const created = mapArticle(await api.post<ApiArticle>("/articles", toApiPayload(input)));
  allCache = [created, ...allCache];
  if (created.status === "Published") publishedCache = [created, ...publishedCache];
  emitChange();
  return created;
}

export async function updateArticle(originalSlug: string, input: Article): Promise<Article | undefined> {
  const updated = mapArticle(
    await api.put<ApiArticle>(`/articles/${encodeURIComponent(originalSlug)}`, toApiPayload(input))
  );
  allCache = allCache.map((a) => (a.slug === originalSlug ? updated : a));
  publishedCache =
    updated.status === "Published"
      ? [updated, ...publishedCache.filter((a) => a.slug !== originalSlug && a.slug !== updated.slug)]
      : publishedCache.filter((a) => a.slug !== originalSlug);
  emitChange();
  return updated;
}

export async function deleteArticle(slug: string): Promise<void> {
  await api.delete(`/articles/${encodeURIComponent(slug)}`);
  allCache = allCache.filter((a) => a.slug !== slug);
  publishedCache = publishedCache.filter((a) => a.slug !== slug);
  emitChange();
}

export async function setArticleStatus(slug: string, status: Article["status"]): Promise<void> {
  const updated = mapArticle(await api.patch<ApiArticle>(`/articles/${encodeURIComponent(slug)}/status`, { status }));
  allCache = allCache.map((a) => (a.slug === slug ? updated : a));
  publishedCache =
    updated.status === "Published"
      ? [updated, ...publishedCache.filter((a) => a.slug !== slug)]
      : publishedCache.filter((a) => a.slug !== slug);
  emitChange();
}
