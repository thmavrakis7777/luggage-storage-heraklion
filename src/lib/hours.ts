/**
 * Confirmed opening hours and the conditional advance-booking rule, kept in
 * one place so the booking form warning, the Location section, and
 * structured data all read from the same source instead of duplicating
 * hard-coded hours across components.
 *
 * Opening hours:
 *   Mon-Fri  09:00-21:00
 *   Sat      09:00-20:00
 *   Sun      10:00-20:00
 *
 * Advance booking is required (staff on-site by appointment only):
 *   Monday    after 15:00
 *   Wednesday after 15:00
 *   Saturday  after 15:00
 *   Sunday    all day
 */

export interface DayHours {
  open: string;
  close: string;
}

/** 0 = Sunday ... 6 = Saturday, matching Date#getUTCDay(). */
export const OPENING_HOURS: Record<number, DayHours> = {
  0: { open: '10:00', close: '20:00' },
  1: { open: '09:00', close: '21:00' },
  2: { open: '09:00', close: '21:00' },
  3: { open: '09:00', close: '21:00' },
  4: { open: '09:00', close: '21:00' },
  5: { open: '09:00', close: '21:00' },
  6: { open: '09:00', close: '20:00' },
};

/** Grouped for display, matching how the hours are naturally communicated. */
export const OPENING_HOURS_DISPLAY = [
  { labelKey: 'weekdays', open: '09:00', close: '21:00' },
  { labelKey: 'saturday', open: '09:00', close: '20:00' },
  { labelKey: 'sunday', open: '10:00', close: '20:00' },
] as const;

/** Same grouping, shaped for schema.org OpeningHoursSpecification. */
export const OPENING_HOURS_SCHEMA = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], open: '09:00', close: '21:00' },
  { days: ['Saturday'], open: '09:00', close: '20:00' },
  { days: ['Sunday'], open: '10:00', close: '20:00' },
] as const;

const ADVANCE_BOOKING_CUTOFF = '15:00';
/** Monday, Wednesday, Saturday — matches Date#getUTCDay() (0=Sun). */
const ADVANCE_BOOKING_AFTERNOON_DAYS = new Set([1, 3, 6]);

/** Day-of-week for a plain YYYY-MM-DD date string, with zero dependence on
 * the executing environment's local timezone (Heraklion's calendar date is
 * fixed regardless of server/browser timezone — this just reads it back
 * without ever converting between zones). */
export function weekdayOf(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Whether the given drop-off date/time falls in a window where staff is
 * only on-site by appointment, so advance booking is required rather than
 * a walk-in.
 */
export function isAdvanceBookingRequired(dropoffDate: string, dropoffTime: string): boolean {
  const weekday = weekdayOf(dropoffDate);
  if (weekday === 0) return true;
  return ADVANCE_BOOKING_AFTERNOON_DAYS.has(weekday) && dropoffTime >= ADVANCE_BOOKING_CUTOFF;
}
