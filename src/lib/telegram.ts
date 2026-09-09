import { formatCents, LUGGAGE_SIZES } from './pricing';
import type { BookingInput } from './booking-schema';
import type { PriceBreakdown } from './pricing';

interface NotifyArgs {
  reference: string;
  input: BookingInput;
  price: PriceBreakdown;
}

const SIZE_LABELS = { backpack: 'Backpack', cabin: 'Cabin / Medium', large: 'Large' } as const;

/**
 * Best-effort Telegram notification. Must NEVER throw or block the booking
 * response — the Supabase row is already the source of truth by the time
 * this runs. Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (server-only
 * env vars, never sent to the client). Silently no-ops if unset so the
 * booking flow works before those credentials exist.
 */
export async function notifyTelegram({ reference, input, price }: NotifyArgs): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[telegram] Skipped notification: TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not set.');
    return;
  }

  const itemsLine = LUGGAGE_SIZES.filter((size) => input.items[size] > 0)
    .map((size) => `${input.items[size]}× ${SIZE_LABELS[size]}`)
    .join(', ');

  const dateLine =
    input.dropoffDate === input.pickupDate
      ? input.dropoffDate
      : `${input.dropoffDate} → ${input.pickupDate}`;

  const text = [
    '🧳 *NEW BOOKING*',
    '',
    `*Reference:* ${reference}`,
    `*Name:* ${escapeMarkdown(input.customerName)}`,
    `*Phone:* ${escapeMarkdown(input.customerPhone)}`,
    `*Dates:* ${escapeMarkdown(dateLine)} (${price.storageDays} day${price.storageDays === 1 ? '' : 's'})`,
    `*Drop-off:* ${input.dropoffTime}`,
    `*Pick-up:* ${input.pickupTime}`,
    `*Luggage:* ${escapeMarkdown(itemsLine)} (${price.totalBags} bag${price.totalBags === 1 ? '' : 's'} total)`,
    '',
    `*Original price:* ${formatCents(price.originalPriceCents)}`,
    `*${price.discountPercentage}% discount:* -${formatCents(price.discountAmountCents)}`,
    `*Final price:* ${formatCents(price.finalPriceCents)}`,
    `*Payment:* Pay at store (cash or card)`,
    `*Language:* ${input.language.toUpperCase()}`,
  ].join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(`[telegram] Notification failed with status ${res.status}`);
    }
  } catch (err) {
    console.error('[telegram] Notification error:', err instanceof Error ? err.message : err);
  }
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}
