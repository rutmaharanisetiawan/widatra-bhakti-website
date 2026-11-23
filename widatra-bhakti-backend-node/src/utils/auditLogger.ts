import { Request } from "express";
import { prisma } from "../config/prisma.js";
import { nowDb } from "./dates.js";

export interface LogAuditOptions {
  action: string;
  resourceType: string;
  resourceId?: string | number | bigint | null;
  payload?: unknown;
  req?: Request;
  /** Override the actor (defaults to req.user) — e.g. right after login/registration. */
  userId?: number | bigint | null;
  userName?: string | null;
}

/** Port of App\Models\AuditLog::record(). Never throws. */
export async function logAudit({ action, resourceType, resourceId, payload, req, userId, userName }: LogAuditOptions) {
  try {
    const actorId = userId ?? req?.user?.id ?? null;
    const actorName = userName ?? req?.user?.name ?? null;
    const now = nowDb();
    await prisma.audit_logs.create({
      data: {
        user_id: actorId !== null && actorId !== undefined ? BigInt(actorId) : null,
        user_name: actorName,
        action,
        resource_type: resourceType,
        resource_id: resourceId !== null && resourceId !== undefined ? String(resourceId) : null,
        payload: payload ? (typeof payload === "string" ? payload : JSON.stringify(payload)) : null,
        ip_address: req ? (req.ip || req.socket.remoteAddress || null)?.replace(/^::ffff:/, "") ?? null : null,
        user_agent: req ? (req.headers["user-agent"] as string) || null : null,
        created_at: now,
        updated_at: now,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}

export async function recordAudit(
  req: Request,
  opts: { action: string; resource_type: string; resource_id?: string | number | bigint | null; payload?: unknown }
) {
  return logAudit({
    req,
    action: opts.action,
    resourceType: opts.resource_type,
    resourceId: opts.resource_id,
    payload: opts.payload,
  });
}
