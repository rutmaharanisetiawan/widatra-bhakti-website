import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { validate, sendData } from "../utils/http.js";
import { resolveMediaUrl, resolveMediaUrls } from "../utils/mediaResolver.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb } from "../utils/dates.js";

const SaveCompanyProfileSchema = z.object({
  hero_image: z.string().optional().nullable(),
  facility_gallery: z.array(z.string()).optional().nullable(),
  leadership_photos: z.any().optional().nullable(),
});

async function getCurrentCompanyProfile() {
  let profile = await prisma.company_profile.findFirst({
    orderBy: { id: "asc" },
  });
  if (!profile) {
    const now = nowDb();
    profile = await prisma.company_profile.create({
      data: {
        hero_image: null,
        facility_gallery: [],
        leadership_photos: {},
        created_at: now,
        updated_at: now,
      },
    });
  }
  return profile;
}

export async function serializeCompanyProfile(cp: any) {
  const gallery = Array.isArray(cp.facility_gallery)
    ? cp.facility_gallery
    : typeof cp.facility_gallery === "string"
    ? JSON.parse(cp.facility_gallery)
    : [];

  return {
    hero_image: cp.hero_image,
    hero_image_url: await resolveMediaUrl(cp.hero_image),
    facility_gallery: gallery,
    facility_gallery_urls: await resolveMediaUrls(gallery),
    leadership_photos:
      typeof cp.leadership_photos === "string"
        ? JSON.parse(cp.leadership_photos)
        : cp.leadership_photos ?? {},
  };
}

export async function getCompanyProfile(_req: Request, res: Response) {
  const profile = await getCurrentCompanyProfile();
  sendData(res, await serializeCompanyProfile(profile));
}

export async function updateCompanyProfile(req: Request, res: Response) {
  const input = validate(SaveCompanyProfileSchema, req.body);
  const current = await getCurrentCompanyProfile();

  const updated = await prisma.company_profile.update({
    where: { id: current.id },
    data: {
      hero_image: input.hero_image !== undefined ? input.hero_image : current.hero_image,
      facility_gallery:
        input.facility_gallery !== undefined
          ? (input.facility_gallery as any)
          : current.facility_gallery ?? undefined,
      leadership_photos:
        input.leadership_photos !== undefined
          ? (input.leadership_photos as any)
          : current.leadership_photos ?? undefined,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "update",
    resource_type: "CompanyProfile",
    resource_id: String(current.id),
  });

  sendData(res, await serializeCompanyProfile(updated));
}
