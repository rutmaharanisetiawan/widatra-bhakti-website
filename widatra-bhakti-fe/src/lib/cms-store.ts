// Company Profile (About page) imagery — backed by the real Laravel
// /company-profile API (a public GET, admin-only PUT).

import { api } from "@/lib/api-client";

export type CompanyProfile = {
  heroImage: string;
  facilityGallery: string[]; // [large aerial, production, scientist] — matches about.tsx layout
  leadershipPhotos: string[];
};

const DEFAULT_PROFILE: CompanyProfile = { heroImage: "", facilityGallery: [], leadershipPhotos: [] };

type ApiCompanyProfile = {
  hero_image: string;
  hero_image_url: string | null;
  facility_gallery: string[] | null;
  facility_gallery_urls: string[] | null;
  leadership_photos: string[] | null;
};

function mapProfile(p: ApiCompanyProfile): CompanyProfile {
  return {
    heroImage: p.hero_image,
    facilityGallery: p.facility_gallery ?? [],
    leadershipPhotos: p.leadership_photos ?? [],
  };
}

const EVENT_NAME = "widatra-company-profile-changed";

let cache: CompanyProfile = DEFAULT_PROFILE;
let loaded = false;
let inFlight: Promise<void> | null = null;

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT_NAME));
}

export function onCompanyProfileChange(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT_NAME, cb);
    window.removeEventListener("storage", cb);
  };
}

async function loadProfile(): Promise<void> {
  try {
    cache = mapProfile(await api.get<ApiCompanyProfile>("/company-profile"));
  } catch {
    cache = DEFAULT_PROFILE;
  } finally {
    loaded = true;
    emitChange();
  }
}

export function initCompanyProfileStore() {
  if (typeof window === "undefined") return;
  if (loaded || inFlight) return;
  inFlight = loadProfile().finally(() => (inFlight = null));
}

export function getCompanyProfile(): CompanyProfile {
  return cache;
}

export async function saveCompanyProfile(profile: CompanyProfile): Promise<CompanyProfile> {
  const updated = mapProfile(
    await api.put<ApiCompanyProfile>("/company-profile", {
      hero_image: profile.heroImage,
      facility_gallery: profile.facilityGallery,
      leadership_photos: profile.leadershipPhotos,
    })
  );
  cache = updated;
  loaded = true;
  emitChange();
  return updated;
}
