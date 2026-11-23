import { prisma } from "../config/prisma.js";
import { nowDb } from "./dates.js";

export type NotificationTone = "info" | "success" | "warning" | "urgent";

export interface SendNotificationOptions {
  userId: bigint | number | string;
  title: string;
  body?: string | null;
  tone?: NotificationTone;
  link?: string | null;
}

export async function sendNotification({
  userId,
  title,
  body,
  tone = "info",
  link,
}: SendNotificationOptions) {
  try {
    const now = nowDb();
    return await prisma.notifications.create({
      data: {
        user_id: BigInt(userId),
        title,
        body: body ?? null,
        tone: tone as any,
        link: link ?? null,
        created_at: now,
        updated_at: now,
      },
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
    return null;
  }
}
