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

  const booking = data[0];
  const storageDays = computeStorageDays(input.dropoffDate, input.pickupDate);
  const price = calculatePrice(input.items, storageDays);

  // Best-effort — never blocks or fails the booking response.
  await notifyTelegram({ reference: booking.booking_reference, input, price });

  return NextResponse.json({ reference: booking.booking_reference }, { status: 201 });
}
