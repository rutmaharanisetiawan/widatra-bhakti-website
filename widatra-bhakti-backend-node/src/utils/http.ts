import { Response } from "express";
import { z } from "zod";

/**
 * HTTP helpers that reproduce Laravel's JSON error contract exactly, because the
 * frontend `ApiError` reads `{ message, errors: { field: [msg] } }`.
 */

export class HttpError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/** Laravel ValidationException -> 422 { message, errors }. */
export function validationError(
  errorsOrField: Record<string, string | string[]> | string,
  maybeMessage?: string
): never {
  const normalized: Record<string, string[]> = {};
  if (typeof errorsOrField === "string") {
    normalized[errorsOrField] = [maybeMessage || "The given data was invalid."];
  } else {
    for (const [k, v] of Object.entries(errorsOrField)) {
      const arr = Array.isArray(v) ? v : [v];
      if (arr.length) normalized[k] = arr;
    }
  }
  const keys = Object.keys(normalized);
  const first = keys.length ? normalized[keys[0]][0] : "The given data was invalid.";
  const extra = keys.reduce((n, k) => n + normalized[k].length, 0) - 1;
  const message = extra > 0 ? `${first} (and ${extra} more error${extra > 1 ? "s" : ""})` : first;
  throw new HttpError(422, message, normalized);
}

export function notFound(message = "Resource not found."): never {
  throw new HttpError(404, message);
}

export function forbidden(message = "This action is unauthorized."): never {
  throw new HttpError(403, message);
}

export function unauthenticated(message = "Unauthenticated."): never {
  throw new HttpError(401, message);
}

/**
 * Validate `data` against a zod schema; throws a Laravel-shaped 422 on failure.
 * Field paths are joined with "." (e.g. "education.0.school") like Laravel.
 */
export function validate<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_";
    (errors[key] ??= []).push(issue.message);
  }
  throw validationError(errors);
}

/** Express route param as a string (Express 5 types params as string | string[]). */
export function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] : value ?? "";
}

/** Parse a JSON-ish field that may arrive as a JSON string in multipart/form-data. */
export function parseMaybeJson<T = unknown>(value: unknown, fallback: T): T {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Laravel boolean coercion for form-data ("1", "true", "on"). */
export function toBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return ["1", "true", "on", "yes"].includes(String(value ?? "").toLowerCase());
}

export function sendData(res: Response, data: unknown, status = 200) {
  return res.status(status).json({ data });
}

export function sendMessage(res: Response, message: string, status = 200) {
  return res.status(status).json({ message });
}
