import multer from "multer";
import path from "path";
import { STORAGE_ROOT, ensureDir, hashName } from "../config/storage.js";

/**
 * Multer factory writing into Laravel's public disk under `<folder>/<hashName>`.
 * After upload, `file.storedPath` holds the relative path (e.g. "cvs/AbC...xyz.pdf"),
 * which is exactly what Laravel's `$file->store($folder, 'public')` returns.
 */
export function uploadTo(folder: string, opts: { maxSizeMb?: number; allowedExt?: string[] } = {}) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(STORAGE_ROOT, folder);
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const name = hashName(file.originalname);
      (file as Express.Multer.File & { storedPath?: string }).storedPath = `${folder}/${name}`;
      cb(null, name);
    },
  });

  return multer({
    storage,
    limits: { fileSize: (opts.maxSizeMb ?? 10) * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!opts.allowedExt || opts.allowedExt.length === 0) return cb(null, true);
      const ext = path.extname(file.originalname).replace(".", "").toLowerCase();
      if (opts.allowedExt.includes(ext)) return cb(null, true);
      const err = new Error(`The ${file.fieldname} field must be a file of type: ${opts.allowedExt.join(", ")}.`) as Error & {
        status?: number;
        field?: string;
      };
      err.status = 422;
      err.field = file.fieldname;
      cb(err);
    },
  });
}

export function storedPathOf(file: Express.Multer.File | undefined): string | null {
  if (!file) return null;
  return (file as Express.Multer.File & { storedPath?: string }).storedPath ?? null;
}
