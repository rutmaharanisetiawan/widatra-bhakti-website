import { Request, Response, NextFunction } from "express";

export function requireInternal(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated. Silakan login terlebih dahulu.",
    });
  }

  if (req.user.account_type !== "internal") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak: Fitur ini khusus untuk Karyawan Internal PT Widatra Bhakti.",
    });
  }

  next();
}

export function requireExternal(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated. Silakan login terlebih dahulu.",
    });
  }

  if (req.user.account_type !== "external") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak: Karyawan Internal tidak dapat mengakses formulir kandidat eksternal / pelamar kerja.",
    });
  }

  next();
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated. Silakan login terlebih dahulu.",
      });
    }

    const userRoles = req.user.roles || [req.user.role];

    // Super Admin / Administrator bypass
    if (userRoles.includes("Super Admin") || userRoles.includes("Administrator")) {
      return next();
    }

    const hasRole = allowedRoles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak: Anda membutuhkan role [${allowedRoles.join(", ")}] untuk mengakses modul ini.`,
      });
    }

    next();
  };
}

export function requirePermission(...requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated. Silakan login terlebih dahulu.",
      });
    }

    const userRoles = req.user.roles || [req.user.role];

    // Super Admin / Administrator bypass
    if (userRoles.includes("Super Admin") || userRoles.includes("Administrator")) {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak: Anda tidak memiliki permission yang diperlukan untuk tindakan ini.",
      });
    }

    next();
  };
}

export function requireAnyAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated. Silakan login terlebih dahulu.",
    });
  }

  const adminRoles = [
    "Super Admin",
    "Administrator",
    "Content Admin",
    "Content Editor",
    "HR Manager",
    "Event Moderator",
    "Factory Tour Admin",
    "CSR Coordinator",
  ];

  const userRoles = req.user.roles || [req.user.role];
  const isAdmin = adminRoles.some((r) => userRoles.includes(r));

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak: Hanya akun Administrator yang dapat mengakses panel ini.",
    });
  }

  next();
}
