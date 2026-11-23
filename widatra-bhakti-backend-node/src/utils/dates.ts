/**
 * Timezone bridge between MySQL (wall-clock in Asia/Jakarta, session tz = SYSTEM/WIB)
 * and Prisma (which reads/writes DATETIME/TIMESTAMP text as if it were UTC).
 *
 * Prisma Date objects therefore carry the *Jakarta wall-clock* in their UTC fields.
 * These helpers convert in both directions so the JSON output is byte-identical to
 * Laravel's `toIso8601String()` (e.g. "2026-07-28T08:05:03+07:00") and rows written
 * by Node are read correctly by Laravel (and vice-versa).
 */

const OFFSET_MINUTES = Number(process.env.DB_TIMEZONE_OFFSET_MINUTES ?? 420); // +07:00 (WIB)
const OFFSET_MS = OFFSET_MINUTES * 60_000;

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

function offsetSuffix(): string {
  const sign = OFFSET_MINUTES >= 0 ? "+" : "-";
  const abs = Math.abs(OFFSET_MINUTES);
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

/** Prisma DateTime (timestamp column) -> Laravel-style ISO 8601 with local offset. */
export function toIso(d: Date | null | undefined): string | null {
  if (!d) return null;
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}${offsetSuffix()}`
  );
}

/** Prisma DateTime (DATE column) -> "YYYY-MM-DD". */
export function toDateString(d: Date | null | undefined): string | null {
  if (!d) return null;
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Prisma DateTime (TIME column) -> "HH:mm" (or "HH:mm:ss" when withSeconds). */
export function toTimeString(d: Date | null | undefined, withSeconds = false): string | null {
  if (!d) return null;
  const base = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  return withSeconds ? `${base}:${pad(d.getUTCSeconds())}` : base;
}

/** Parses "HH:mm" or "HH:mm:ss" into a Date object for Prisma MySQL @db.Time column. */
export function parseTimeInput(timeStr: string): Date {
  const clean = timeStr.trim();
  const parts = clean.split(":");
  const hh = (parts[0] || "00").padStart(2, "0");
  const mm = (parts[1] || "00").padStart(2, "0");
  const ss = (parts[2] || "00").padStart(2, "0");
  return new Date(`1970-01-01T${hh}:${mm}:${ss}.000Z`);
}

/** "Now" expressed as a Date whose UTC fields are the local wall-clock (for writes). */
export function nowDb(): Date {
  const d = new Date(Date.now() + OFFSET_MS);
  d.setUTCMilliseconds(0);
  return d;
}

/**
 * Parse user input into a value Prisma will write as local wall-clock.
 * - "YYYY-MM-DD"           -> DATE (midnight, no shift)
 * - "HH:mm" / "HH:mm:ss"   -> TIME (1970-01-01 base, no shift)
 * - full datetime / ISO    -> real instant converted to local wall-clock
 */
export function parseDateInput(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return new Date(value.getTime() + OFFSET_MS);
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T00:00:00.000Z`);
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(s)) {
    const t = s.length === 5 ? `${s}:00` : s;
    return new Date(`1970-01-01T${t}.000Z`);
  }
  // "YYYY-MM-DD HH:mm(:ss)" without zone = already local wall-clock
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s)) {
    const norm = s.replace(" ", "T");
    return new Date(`${norm.length === 16 ? `${norm}:00` : norm}.000Z`);
  }
  const parsed = new Date(s);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getTime() + OFFSET_MS);
}

/** True instant (ms since epoch) of a Prisma wall-clock Date — for comparisons/sorting. */
export function realTime(d: Date | null | undefined): number | null {
  return d ? d.getTime() - OFFSET_MS : null;
}
