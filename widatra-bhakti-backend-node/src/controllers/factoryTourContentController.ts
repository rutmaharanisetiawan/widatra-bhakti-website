import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { validate, sendData } from "../utils/http.js";
import { resolveMediaUrl, resolveMediaUrls } from "../utils/mediaResolver.js";
import { recordAudit } from "../utils/auditLogger.js";
import { nowDb } from "../utils/dates.js";

const SaveFactoryTourContentSchema = z.object({
  hero_image: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().nullable(),
});

async function getCurrentFactoryTourContent() {
  let content = await prisma.factory_tour_content.findFirst({
    orderBy: { id: "asc" },
  });
  if (!content) {
    const now = nowDb();
    content = await prisma.factory_tour_content.create({
      data: {
        hero_image: null,
        gallery: [],
        created_at: now,
        updated_at: now,
      },
    });
  }
  return content;
}

export async function serializeFactoryTourContent(c: any) {
  const gallery = Array.isArray(c.gallery)
    ? c.gallery
    : typeof c.gallery === "string"
    ? JSON.parse(c.gallery)
    : [];

  return {
    hero_image: c.hero_image,
    hero_image_url: await resolveMediaUrl(c.hero_image),
    gallery,
    gallery_urls: await resolveMediaUrls(gallery),
  };
}

export async function getFactoryTourContent(_req: Request, res: Response) {
  const content = await getCurrentFactoryTourContent();
  sendData(res, await serializeFactoryTourContent(content));
}

export async function updateFactoryTourContent(req: Request, res: Response) {
  const input = validate(SaveFactoryTourContentSchema, req.body);
  const current = await getCurrentFactoryTourContent();

  const updated = await prisma.factory_tour_content.update({
    where: { id: current.id },
    data: {
      hero_image: input.hero_image !== undefined ? input.hero_image : current.hero_image,
      gallery:
        input.gallery !== undefined
          ? (input.gallery as any)
          : current.gallery ?? undefined,
      updated_at: nowDb(),
    },
  });

  await recordAudit(req, {
    action: "update",
    resource_type: "FactoryTourContent",
    resource_id: String(current.id),
  });

  sendData(res, await serializeFactoryTourContent(updated));
}
