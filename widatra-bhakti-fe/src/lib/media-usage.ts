// Scans every module that can reference a Media Library asset and reports
// back where a given asset is currently used. Kept as a separate module from
// media-store.ts to avoid circular imports (this file depends on the other
// content stores; they never need to depend on this file).

import { getAllProducts } from "@/lib/products-store";
import { getAllArticles } from "@/lib/news-store";
import { getAllCsrPrograms } from "@/lib/csr-store";
import { getFactoryTourContent } from "@/lib/factory-tour-content-store";
import { getCompanyProfile } from "@/lib/cms-store";
import { toMediaRef } from "@/lib/media-store";

export type MediaUsageRef = {
  module: "Product" | "News & Event" | "CSR" | "Factory Tour" | "Company Profile";
  label: string;
  href?: string;
};

export function getMediaUsages(assetId: string): MediaUsageRef[] {
  const ref = toMediaRef(assetId);
  const usages: MediaUsageRef[] = [];

  for (const p of getAllProducts()) {
    if (p.img === ref) usages.push({ module: "Product", label: p.name, href: `/products/${p.code}` });
  }

  for (const a of getAllArticles()) {
    const hits = a.img === ref || (a.gallery ?? []).includes(ref);
    if (hits) usages.push({ module: "News & Event", label: a.title, href: `/news/${a.slug}` });
  }

  for (const c of getAllCsrPrograms()) {
    const hits = c.img === ref || (c.gallery ?? []).includes(ref);
    if (hits) usages.push({ module: "CSR", label: c.title });
  }

  const tour = getFactoryTourContent();
  if (tour.heroImage === ref) usages.push({ module: "Factory Tour", label: "Hero image", href: "/factory-tour" });
  tour.gallery.forEach((g, i) => {
    if (g === ref) usages.push({ module: "Factory Tour", label: `Gallery slot ${i + 1}`, href: "/factory-tour" });
  });

  const profile = getCompanyProfile();
  if (profile.heroImage === ref) usages.push({ module: "Company Profile", label: "About hero image", href: "/about" });
  profile.facilityGallery.forEach((g, i) => {
    if (g === ref) usages.push({ module: "Company Profile", label: `Facility photo ${i + 1}`, href: "/about" });
  });
  profile.leadershipPhotos.forEach((g, i) => {
    if (g === ref) usages.push({ module: "Company Profile", label: `Leadership photo ${i + 1}`, href: "/about" });
  });

  return usages;
}
