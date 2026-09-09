import { NextRequest, NextResponse } from 'next/server';
import { bookingInputSchema } from '@/lib/booking-schema';
import { calculatePrice, computeStorageDays, LUGGAGE_SIZES } from '@/lib/pricing';
import { getSupabaseClient } from '@/lib/supabase';
import { notifyTelegram } from '@/lib/telegram';
import { isRateLimited } from '@/lib/rate-limit';

function todayInHeraklion(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = bookingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const input = parsed.data;

  // Honeypot: a real browser never fills this hidden field.
  if (input.website) {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 });
  }

  if (input.dropoffDate < todayInHeraklion()) {
    return NextResponse.json(
      { error: 'validation_failed', issues: [{ path: ['dropoffDate'], message: 'date_in_past' }] },
      { status: 400 }
    );
  }

  const itemsPayload = LUGGAGE_SIZES.filter((size) => input.items[size] > 0).map((size) => ({
    luggage_size: size,
    quantity: input.items[size],
  }));

  let reference: string;
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.rpc('create_booking', {
      p_customer_name: input.customerName,
      p_customer_phone: input.customerPhone,
      p_dropoff_date: input.dropoffDate,
      p_pickup_date: input.pickupDate,
      p_dropoff_time: input.dropoffTime,
      p_pickup_time: input.pickupTime,
      p_items: itemsPayload,
      p_language: input.language,
    });

    if (error || !data || data.length === 0) {
      console.error('[api/book] Supabase insert failed:', error?.message);
      return NextResponse.json({ error: 'booking_failed' }, { status: 500 });
    }

    reference = data[0].booking_reference;
  } catch (err) {
    // Never let a Supabase/config failure surface its message to the client —
    // no fake success, no technical detail, just a generic failure the
    // client already maps to a localized error string.
    console.error('[api/book] Unexpected error creating booking:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'booking_failed' }, { status: 500 });
  }

  // The booking is already saved at this point — a failure below (e.g. the
  // best-effort Telegram notification) must never turn into a false
  // "booking_failed" response for a booking that actually succeeded.
  const storageDays = computeStorageDays(input.dropoffDate, input.pickupDate);
  const price = calculatePrice(input.items, storageDays);
  await notifyTelegram({ reference, input, price });

  return NextResponse.json({ reference }, { status: 201 });
}
