import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { HttpError } from "../utils/http.js";

/** Global JSON error handler — Laravel-compatible error shapes. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, ...(err.errors ? { errors: err.errors } : {}) });
  }

  if (err instanceof multer.MulterError) {
    const field = err.field || "file";
    const message =
      err.code === "LIMIT_FILE_SIZE" ? `The ${field} field must not be greater than the allowed size.` : err.message;
    return res.status(422).json({ message, errors: { [field]: [message] } });
  }

  const e = err as { status?: number; field?: string; message?: string; type?: string };
  if (e?.status === 422 && e.field) {
    return res.status(422).json({ message: e.message, errors: { [e.field]: [e.message] } });
  }

  if (e?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body." });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") return res.status(404).json({ message: "Resource not found." });
    if (err.code === "P2002") {
      const target = (err.meta?.target as string | string[] | undefined) ?? "field";
      const field = Array.isArray(target) ? target[0] : String(target).replace(/^.*_(\w+)_unique$/, "$1");
      const message = `The ${field} has already been taken.`;
      return res.status(422).json({ message, errors: { [field]: [message] } });
    }
  }

  console.error("[Unhandled error]", err);
  return res.status(500).json({ message: "Server Error" });
}
