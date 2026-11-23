import { Request, Response, NextFunction } from "express";
import type { AuthenticatedUser } from "../middleware/auth.js";

/**
 * Single source of truth for the 8-role RBAC matrix (mirrors the frontend
 * admin-shell sidebar). Every check looks at ALL of the user's roles — the
 * primary `users.role` column plus Spatie `model_has_roles` — to support multi-role.
 *
 * Legacy role names kept for backward compatibility with existing accounts:
 *  - "Administrator"   ≈ Super Admin
 *  - "Content Editor"  ≈ Content Admin
 *  - "CSR Coordinator" → News & CSR only
 */

export const SUPER_ROLES = ["Super Admin", "Administrator"] as const;

export const ACCESS = {
  /** Products, Company CMS, Factory-tour content, Media Library mutations */
  content: ["Content Admin", "Content Editor"],
  /** News & Events + CSR programs */
  articles: ["Content Admin", "Content Editor", "CSR Coordinator"],
  /** Contact inbox */
  contact: ["Content Admin", "Content Editor"],
  /** Job postings + ATS applications + interviews + HR notes */
  hr: ["HR Manager"],
  /** Community event moderation */
  events: ["Event Moderator"],
  /** Factory tour booking management */
  tours: ["Factory Tour Admin"],
  /** Users & roles, audit logs */
  users: [] as string[],
} as const;

export type AccessArea = keyof typeof ACCESS;

export const ADMIN_ROLES = [
  "Super Admin",
  "Administrator",
  "Content Admin",
  "Content Editor",
  "HR Manager",
  "Event Moderator",
  "Factory Tour Admin",
  "CSR Coordinator",
];

export function rolesOf(user: AuthenticatedUser | undefined): string[] {
  if (!user) return [];
  return Array.from(new Set([user.role, ...(user.roles || [])].filter(Boolean)));
}

export function isSuper(user: AuthenticatedUser | undefined): boolean {
  const roles = rolesOf(user);
  return SUPER_ROLES.some((r) => roles.includes(r));
}

export function isAdmin(user: AuthenticatedUser | undefined): boolean {
  const roles = rolesOf(user);
  return ADMIN_ROLES.some((r) => roles.includes(r));
}

/** Can the user manage the given module? Super roles always pass. */
export function can(user: AuthenticatedUser | undefined, area: AccessArea): boolean {
  if (!user) return false;
  if (isSuper(user)) return true;
  const roles = rolesOf(user);
  return (ACCESS[area] as readonly string[]).some((r) => roles.includes(r));
}

/** Route middleware: 401 when anonymous, 403 when the role is not allowed. */
export function requireAccess(area: AccessArea) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated." });
    if (!can(req.user, area)) {
      return res.status(403).json({ message: "This action is unauthorized." });
    }
    next();
  };
}

/** Route middleware: account_type gate (internal / external). */
export function requireAccountType(type: "internal" | "external") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated." });
    if (req.user.account_type !== type) {
      return res.status(403).json({ message: `This module is only available to ${type} accounts.` });
    }
    next();
  };
}
