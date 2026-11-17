import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

/**
 * Database health check. Vercel Cron (vercel.json) calls it once a day so the
 * free Supabase project never goes 7 days without activity — a paused project
 * makes every online booking fail. An uptime monitor can watch it too: it
 * answers 503 whenever bookings can't reach Supabase.
 *
 * Read-only: it asks the same lookup function the success page uses for a
 * reference no booking can have (real ones look like `XX-XXXXXX`), so no
 * booking is read or written and nothing is sent to Telegram.
 *
 * When CRON_SECRET is set, Vercel sends `Authorization: Bearer $CRON_SECRET`
 * with its cron calls and any other caller gets 401 (an uptime monitor must
 * then send the same header).
 */
const PROBE_REFERENCE = 'health-check';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const { error } = await getSupabaseClient().rpc('get_booking_by_reference', {
      p_reference: PROBE_REFERENCE,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[api/health] Supabase check failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
