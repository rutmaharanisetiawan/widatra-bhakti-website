import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { validate, sendData, notFound, param, forbidden } from "../utils/http.js";
import { formatUserResponse } from "../utils/userSerializer.js";
import { recordAudit } from "../utils/auditLogger.js";
import { isSuper } from "../policies/access.js";
import { nowDb, toIso } from "../utils/dates.js";

const VALID_ROLES = [
  "Super Admin",
  "Content Admin",
  "HR Manager",
  "Event Moderator",
  "Factory Tour Admin",
  "Internal Employee",
  "External User",
  "Administrator",
  "Content Editor",
  "CSR Coordinator",
] as const;

const UpdateRoleSchema = z.object({
  role: z.enum(VALID_ROLES),
});

const SetStatusSchema = z.object({
  status: z.enum(["Active", "Disabled"]),
});

async function findUserByIdOrPublicId(identifier: string) {
  if (/^\d+$/.test(identifier)) {
    return await prisma.users.findUnique({
      where: { id: BigInt(identifier) },
    });
  }
  return await prisma.users.findUnique({
    where: { public_id: identifier },
  });
}

export async function listUsers(req: Request, res: Response) {
  if (!isSuper(req.user)) {
    return forbidden("This action is unauthorized.");
  }

  const users = await prisma.users.findMany({
    orderBy: { created_at: "desc" },
  });

  const formatted = await Promise.all(users.map(formatUserResponse));
  sendData(res, formatted);
}

export async function updateUserRole(req: Request, res: Response) {
  if (!isSuper(req.user)) {
    return forbidden("This action is unauthorized.");
  }

  const id = param(req.params.id);
  const user = await findUserByIdOrPublicId(id);
  if (!user) {
    return notFound("User not found.");
  }

  const { role } = validate(UpdateRoleSchema, req.body);
  const now = nowDb();

  // 1. Update user primary role column
  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: { role, updated_at: now },
  });

  // 2. Synchronize Spatie model_has_roles
  const matchingRoles = await prisma.roles.findMany({
    where: { name: role },
  });

  // Remove old model_has_roles entries
  await prisma.model_has_roles.deleteMany({
    where: {
      model_id: user.id,
      model_type: "App\\Models\\User",
    },
  });

  // Add new model_has_roles entries
  for (const r of matchingRoles) {
    await prisma.model_has_roles.create({
      data: {
        role_id: r.id,
        model_id: user.id,
        model_type: "App\\Models\\User",
      },
    });
  }

  // 3. Record audit log
  await recordAudit(req, {
    action: "UPDATE_ROLE",
    resource_type: "User",
    resource_id: String(user.id),
    payload: { new_role: role },
  });

  sendData(res, await formatUserResponse(updatedUser));
}

export async function updateUserStatus(req: Request, res: Response) {
  if (!isSuper(req.user)) {
    return forbidden("This action is unauthorized.");
  }

  const id = param(req.params.id);
  const user = await findUserByIdOrPublicId(id);
  if (!user) {
    return notFound("User not found.");
  }

  const { status } = validate(SetStatusSchema, req.body);
  const now = nowDb();

  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: { status, updated_at: now },
  });

  await recordAudit(req, {
    action: "UPDATE_STATUS",
    resource_type: "User",
    resource_id: String(user.id),
    payload: { new_status: status },
  });

  sendData(res, await formatUserResponse(updatedUser));
}

export async function getAuditLogs(req: Request, res: Response) {
  if (!isSuper(req.user)) {
    return forbidden("This action is unauthorized.");
  }

  const logs = await prisma.audit_logs.findMany({
    orderBy: { created_at: "desc" },
    take: 100,
  });

  const serialized = logs.map((log) => ({
    id: Number(log.id),
    user_id: log.user_id !== null ? Number(log.user_id) : null,
    user_name: log.user_name,
    action: log.action,
    resource_type: log.resource_type,
    resource_id: log.resource_id,
    payload: log.payload ? (typeof log.payload === "string" ? JSON.parse(log.payload) : log.payload) : null,
    ip_address: log.ip_address,
    user_agent: log.user_agent,
    created_at: toIso(log.created_at),
    updated_at: toIso(log.updated_at),
  }));

  sendData(res, serialized);
}
