/** Accepted phone format, shared by the booking form (instant feedback) and
 * the server schema (authoritative): an optional leading +, then 6–20
 * digits, spaces, brackets or dashes. Kept free of zod so the form can
 * import it without pulling the schema library into the browser bundle. */
export const PHONE_PATTERN = /^[+\d][\d\s()-]{5,19}$/;

/** Dots and slashes are common separators (e.g. 695.150.8538) that
 * PHONE_PATTERN doesn't allow — they become spaces instead of getting a
 * real number rejected. */
export function normalizePhone(raw: string): string {
  return raw.replace(/[./]/g, ' ').trim();
}
