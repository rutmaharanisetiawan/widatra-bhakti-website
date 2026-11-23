import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "widatra-bhakti-secure-jwt-secret-key-2026-production";

export interface AuthenticatedUser {
  id: bigint;
  public_id: string;
  name: string;
  email: string;
  phone?: string | null;
  account_type: "internal" | "external";
  role: string;
  roles: string[];
  permissions: string[];
  employee_id?: string | null;
  department?: string | null;
  position?: string | null;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      /** Sanctum personal_access_tokens.id when authenticated via a Laravel token */
      sanctumTokenId?: bigint;
    }
  }
}

/** Spatie roles + permissions for a user id (deduplicated across guards). */
export async function loadRolesAndPermissions(userId: bigint, primaryRole: string) {
  const pivots = await prisma.model_has_roles.findMany({ where: { model_id: userId } });
  const roleIds = pivots.map((p) => p.role_id);
  const roles = roleIds.length ? await prisma.roles.findMany({ where: { id: { in: roleIds } } }) : [];
  const permPivots = roleIds.length
    ? await prisma.role_has_permissions.findMany({ where: { role_id: { in: roleIds } } })
    : [];
  const permIds = permPivots.map((p) => p.permission_id);
  const perms = permIds.length ? await prisma.permissions.findMany({ where: { id: { in: permIds } } }) : [];

  return {
    spatieRoles: Array.from(new Set(roles.map((r) => r.name))),
    roles: Array.from(new Set([primaryRole, ...roles.map((r) => r.name)].filter(Boolean))),
    permissions: Array.from(new Set(perms.map((p) => p.name))),
  };
}

/** Resolve a bearer token (Node JWT or Laravel Sanctum "<id>|<plain>") to a user id. */
async function resolveToken(token: string): Promise<{ userId: bigint; sanctumTokenId?: bigint } | null> {
  if (token.includes("|")) {
    const [tokenId, plain] = token.split("|", 2);
    if (!/^\d+$/.test(tokenId) || !plain) return null;
    const hashed = crypto.createHash("sha256").update(plain).digest("hex");
    const pat = await prisma.personal_access_tokens.findFirst({ where: { id: BigInt(tokenId), token: hashed } });
    if (!pat) return null;
    if (pat.expires_at && pat.expires_at.getTime() < Date.now()) return null;
    return { userId: pat.tokenable_id, sanctumTokenId: pat.id };
  }
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string | number };
  return { userId: BigInt(decoded.userId) };
}

async function buildUser(token: string): Promise<{ user: AuthenticatedUser; sanctumTokenId?: bigint } | null> {
  const resolved = await resolveToken(token);
  if (!resolved) return null;
  const user = await prisma.users.findUnique({ where: { id: resolved.userId } });
  if (!user) return null;
  const { roles, permissions } = await loadRolesAndPermissions(user.id, user.role);
  return {
    sanctumTokenId: resolved.sanctumTokenId,
    user: {
      id: user.id,
      public_id: user.public_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      account_type: user.account_type as "internal" | "external",
      role: user.role,
      roles,
      permissions,
      employee_id: user.employee_id,
      department: user.department,
      position: user.position,
      status: user.status,
    },
  };
}

function bearer(req: Request): string | null {
  const h = req.headers["authorization"];
  return h && h.startsWith("Bearer ") ? h.slice(7).trim() || null : null;
}

/** Equivalent of Laravel `auth:sanctum`. */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = bearer(req);
  if (!token) return res.status(401).json({ message: "Unauthenticated." });
  try {
    const result = await buildUser(token);
    if (!result) return res.status(401).json({ message: "Unauthenticated." });
    if (result.user.status === "Disabled") {
      return res.status(403).json({ message: "This account has been disabled. Contact an administrator." });
    }
    req.user = result.user;
    req.sanctumTokenId = result.sanctumTokenId;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthenticated." });
  }
}

/** Equivalent of `$request->user('sanctum')` on public routes: attach the user if a valid token exists. */
export async function optionalAuthenticateToken(req: Request, _res: Response, next: NextFunction) {
  const token = bearer(req);
  if (token) {
    try {
      const result = await buildUser(token);
      if (result && result.user.status === "Active") {
        req.user = result.user;
        req.sanctumTokenId = result.sanctumTokenId;
      }
    } catch {
      /* anonymous */
    }
  }
  next();
}
