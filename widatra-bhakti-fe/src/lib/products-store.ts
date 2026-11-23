// Product catalog store — backed by the real Laravel /products API.
// Keeps the same `Product` shape (camelCase) and the same synchronous
// getAllProducts()/getStoredProduct() reads that existing components rely
// on, by caching the API response in memory and refreshing it after every
// mutation (same pattern as media-store.ts).

import { api } from "@/lib/api-client";
import { resolveMediaUrl } from "@/lib/media-store";
import type { Product } from "@/lib/products-data";
import ivBag from "@/assets/iv-bag.jpg";

const EVENT_NAME = "widatra-products-store-changed";

type ApiProduct = {
  code: string;
  name: string;
  category: Product["category"];
  brand: Product["brand"];
  osmolarity: string;
  calorie: string;
  nie: string;
  packaging: string[];
  sizes: string[];
  indication: string;
  benefits: string[];
  applications: string[];
  storage: string;
  shelf_life: string;
  composition: string;
  manufacturing_note: string;
  img: string;
  img_url: string | null;
  tagline: string;
};

function mapProduct(p: ApiProduct): Product {
  const resolved = p.img_url || resolveMediaUrl(p.img) || p.img;
  return {
    code: p.code,
    name: p.name,
    category: p.category,
    brand: p.brand,
    osmolarity: p.osmolarity,
    calorie: p.calorie,
    nie: p.nie,
    packaging: p.packaging ?? [],
    sizes: p.sizes ?? [],
    indication: p.indication,
    benefits: p.benefits ?? [],
    applications: p.applications ?? [],
    storage: p.storage,
    shelfLife: p.shelf_life,
    composition: p.composition,
    manufacturingNote: p.manufacturing_note,
    img: resolved && !resolved.startsWith("media:") ? resolved : ivBag,
    tagline: p.tagline,
  };
}

function toApiPayload(input: Omit<Product, "code"> & { code?: string }) {
  return {
    code: input.code,
    name: input.name,
    category: input.category,
    brand: input.brand,
    osmolarity: input.osmolarity,
    calorie: input.calorie,
    nie: input.nie,
    packaging: input.packaging,
    sizes: input.sizes,
    indication: input.indication,
    benefits: input.benefits,
    applications: input.applications,
    storage: input.storage,
    shelf_life: input.shelfLife,
    composition: input.composition,
    manufacturing_note: input.manufacturingNote,
    img: input.img,
    tagline: input.tagline,
  };
}

let cache: Product[] = [];
let loaded = false;
let inFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onProductsStoreChange(cb: () => void) {
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
    const products = await api.get<ApiProduct[]>("/products");
    cache = products.map(mapProduct);
  } catch {
    cache = [];
  } finally {
    loaded = true;
    emitChange();
  }
}

export function initProductsStore() {
  if (typeof window === "undefined") return;
  if (loaded || inFlight) return;
  inFlight = loadAll().finally(() => {
    inFlight = null;
  });
}

export async function refreshProductsStore(): Promise<void> {
  inFlight = loadAll();
  await inFlight;
  inFlight = null;
}

export function getAllProducts(): Product[] {
  return cache;
}

export function getStoredProduct(code: string): Product | undefined {
  return cache.find((p) => p.code.toLowerCase() === code.toLowerCase());
}

/** Fetches a single product directly (used by the public detail page loader so it works even before the list cache warms up). */
export async function fetchProduct(code: string): Promise<Product | undefined> {
  try {
    const product = mapProduct(await api.get<ApiProduct>(`/products/${encodeURIComponent(code)}`));
    cache = [product, ...cache.filter((p) => p.code !== product.code)];
    emitChange();
    return product;
  } catch {
    return undefined;
  }
}

export function relatedStoredProducts(code: string, category: Product["category"]) {
  return getAllProducts()
    .filter((p) => p.category === category && p.code !== code)
    .slice(0, 3);
}

export type NewProductInput = Omit<Product, "code"> & { code?: string };

export async function addProduct(input: NewProductInput): Promise<Product> {
  const created = mapProduct(await api.post<ApiProduct>("/products", toApiPayload(input)));
  cache = [created, ...cache];
  emitChange();
  return created;
}

export async function updateProduct(originalCode: string, input: Product): Promise<Product | undefined> {
  const updated = mapProduct(
    await api.put<ApiProduct>(`/products/${encodeURIComponent(originalCode)}`, toApiPayload(input))
  );
  cache = cache.map((p) => (p.code === originalCode ? updated : p));
  emitChange();
  return updated;
}

export async function deleteProduct(code: string): Promise<void> {
  await api.delete(`/products/${encodeURIComponent(code)}`);
  cache = cache.filter((p) => p.code !== code);
  emitChange();
}
