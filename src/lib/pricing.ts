export const LUGGAGE_SIZES = ['backpack', 'cabin', 'large'] as const;
export type LuggageSize = (typeof LUGGAGE_SIZES)[number];

/** Prices in eurocents to avoid floating-point rounding errors. */
export const PRICE_PER_DAY_CENTS: Record<LuggageSize, number> = {
  backpack: 300,
  cabin: 400,
  large: 500,
};

export const STANDARD_DISCOUNT_PERCENTAGE = 10;
export const LONG_STAY_DISCOUNT_PERCENTAGE = 25;
export const LONG_STAY_MIN_DAYS = 3;

/** Quantity booked per luggage size, e.g. { backpack: 2, cabin: 0, large: 1 }. */
export type LuggageQuantities = Record<LuggageSize, number>;

export interface PriceBreakdown {
  storageDays: number;
  totalBags: number;
  originalPriceCents: number;
  discountPercentage: number;
  discountAmountCents: number;
  finalPriceCents: number;
}

/** Parses a YYYY-MM-DD date string as a UTC day count, with zero dependence
 * on the executing environment's local timezone — the same date string
 * always yields the same day number everywhere. */
function toUTCDayNumber(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

/**
 * Inclusive day count: both the drop-off day and the pick-up day are
 * charged (confirmed business rule — "they charge for the day they come").
 * A same-day drop-off/pick-up is always at least 1 day.
 */
export function computeStorageDays(dropoffDate: string, pickupDate: string): number {
  const days = toUTCDayNumber(pickupDate) - toUTCDayNumber(dropoffDate) + 1;
  return Math.max(1, days);
}

export function totalBags(items: LuggageQuantities): number {
  return LUGGAGE_SIZES.reduce((sum, size) => sum + (items[size] || 0), 0);
}

/**
 * Server-authoritative pricing (also mirrored in the `create_booking`
 * Postgres function, which is what actually persists the charge — this copy
 * exists for the Telegram notification and any client-side preview, never
 * as the source of truth for what a customer is charged).
 *
 * 3+ days (inclusive count) replaces the standard 10% online discount with
 * 25% — it does not stack.
 */
export function calculatePrice(items: LuggageQuantities, storageDays: number): PriceBreakdown {
  const bags = totalBags(items);
  const originalPriceCents = LUGGAGE_SIZES.reduce(
    (sum, size) => sum + PRICE_PER_DAY_CENTS[size] * (items[size] || 0) * storageDays,
    0
  );
  const discountPercentage =
    storageDays >= LONG_STAY_MIN_DAYS ? LONG_STAY_DISCOUNT_PERCENTAGE : STANDARD_DISCOUNT_PERCENTAGE;
  const discountAmountCents = Math.round((originalPriceCents * discountPercentage) / 100);
  const finalPriceCents = originalPriceCents - discountAmountCents;

  return {
    storageDays,
    totalBags: bags,
    originalPriceCents,
    discountPercentage,
    discountAmountCents,
    finalPriceCents,
  };
}

export function formatCents(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}
