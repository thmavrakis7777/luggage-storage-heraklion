import { formatCents, LUGGAGE_SIZES } from './pricing';
import { getSupabaseClient } from './supabase';
import type { BookingInput } from './booking-schema';
import type { PriceBreakdown } from './pricing';

interface NotifyArgs {
  reference: string;
  input: BookingInput;
  price: PriceBreakdown;
}

const SIZE_LABELS = { backpack: 'Backpack', cabin: 'Cabin / Medium', large: 'Large' } as const;

/** Parses a YYYY-MM-DD date string as UTC (no local-timezone drift) and
 * renders it in a short, mobile-friendly form, e.g. "Mon, 14 Sep 2026". */
function formatDateForTelegram(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/**
 * Best-effort Telegram notification to the business (bot token identifies
 * the chat/group via TELEGRAM_CHAT_ID, so this works the same whether that
 * chat has one phone or several). Must NEVER throw or block the booking
 * response — the Supabase row is already the source of truth by the time
 * this runs. Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (server-only
 * env vars, never sent to the client, never logged). Silently no-ops if
 * unset so the booking flow works before those credentials exist.
 *
 * Returns whether the notification was actually sent, so the caller can
 * record it — but a `false` return must never be treated as a booking
 * failure by anything downstream.
 */
export async function notifyTelegram({ reference, input, price }: NotifyArgs): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[telegram] Skipped notification: TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not set.');
    return false;
  }

  const itemsLine = LUGGAGE_SIZES.filter((size) => input.items[size] > 0)
    .map((size) => `${input.items[size]}× ${SIZE_LABELS[size]}`)
    .join(', ');

  const text = [
    '🧳 *NEW BOOKING*',
    '',
    `*Reference:* ${reference}`,
    `*Status:* Pending`,
    '',
    `*Customer:* ${escapeMarkdown(input.customerName)}`,
    `*Phone:* ${escapeMarkdown(input.customerPhone)}`,
    '',
    `*Drop-off:* ${formatDateForTelegram(input.dropoffDate)} · ${input.dropoffTime}`,
    `*Pick-up:* ${formatDateForTelegram(input.pickupDate)} · ${input.pickupTime}`,
    `*Duration:* ${price.storageDays} day${price.storageDays === 1 ? '' : 's'}`,
    '',
    `*Luggage:* ${escapeMarkdown(itemsLine)} (${price.totalBags} bag${price.totalBags === 1 ? '' : 's'} total)`,
    '',
    `*Original price:* ${formatCents(price.originalPriceCents)}`,
    `*${price.discountPercentage}% discount:* -${formatCents(price.discountAmountCents)}`,
    `*Final price:* ${formatCents(price.finalPriceCents)}`,
    `*Payment:* Cash/Card at store`,
    '',
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
      return false;
    }
  } catch (err) {
    console.error('[telegram] Notification error:', err instanceof Error ? err.message : err);
    return false;
  }

  await markNotified(reference);
  return true;
}

/** Records that this booking's Telegram notification was sent, so a future
 * retry of this same reference (e.g. a resend/cron sweep) won't re-notify.
 * Best-effort: never throws, never blocks the (already-sent) notification
 * or the booking response. */
async function markNotified(reference: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.rpc('mark_telegram_notified', {
      p_booking_reference: reference,
    });
    if (error) {
      console.error('[telegram] Failed to record notification timestamp:', error.message);
    }
  } catch (err) {
    console.error(
      '[telegram] Unexpected error recording notification timestamp:',
      err instanceof Error ? err.message : err
    );
  }
}

/** Escapes the characters Telegram's legacy `Markdown` parse mode treats as
 * special (unlike MarkdownV2, only these four need it) so a customer name
 * or phone number can never break message formatting or start unintended
 * bold/italic runs. */
function escapeMarkdown(text: string): string {
  return text.replace(/[_*`[]/g, '\\$&');
}
