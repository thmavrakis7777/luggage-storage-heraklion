import { createClient } from '@supabase/supabase-js';

/**
 * Uses the public anon/publishable key only. This is safe to use server-side
 * or client-side: Row Level Security is enabled with no policies on
 * `bookings`/`booking_items`, so the anon role has no direct table access at
 * all — every write and read goes through `create_booking` /
 * `get_booking_by_reference`, and the latter returns no personal data. The
 * service role key is never used here.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
