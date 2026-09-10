# Luggage Storage Heraklion City Center

Marketing site and booking system for **Luggage Storage Heraklion City Center**, a luggage storage business at Sfakianaki 4, Heraklion, Crete. Built with Next.js (App Router), React, Tailwind CSS, Framer Motion, next-intl, and Supabase.

## Features

- Editorial, premium design with restrained animation (respects `prefers-reduced-motion`)
- Seven-language site (English, Greek, German, Italian, Spanish, Dutch, French) with localized URLs, hreflang, and per-locale SEO metadata
- 30-second booking flow — no account, no email, no online payment
- Server-side, database-enforced pricing (never trusts client-submitted prices)
- Supabase backend with Row Level Security locked to two RPC entry points (no direct table access from the browser)
- Best-effort Telegram notification on new bookings (never blocks the booking itself)
- `LocalBusiness`/`SelfStorage` and `FAQPage` JSON-LD structured data — no fabricated ratings, hours, or coordinates

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Telegram + site URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [.env.example](.env.example). At minimum for local development you need:

- `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, hreflang, sitemap, OG tags
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, safe to expose; RLS restricts what they can do
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — optional; booking notifications are skipped (not failed) if unset

## Database

The `bookings`/`booking_items` tables and their `SECURITY DEFINER` RPC functions (`create_booking`, `get_booking_by_reference`, `mark_telegram_notified`) live in the `luggage-storage-heraklion` Supabase project. Price fields are always recalculated inside `create_booking` from `luggage_size` and `quantity` — client-submitted prices are never trusted, and that same function re-validates opening hours, past dates, and a per-phone booking rate limit, since it's directly callable with the public anon key. RLS is enabled with no policies on either table, so the anon key has no direct table access at all (no SELECT/INSERT/UPDATE/DELETE) — every write and read goes through the RPC functions, which are the only exposed surface.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, Framer Motion
- **i18n:** next-intl
- **Backend:** Supabase (Postgres + RLS + RPC)
- **Deployment:** Docker, Vercel, or any Node.js host

## License

Private — not for redistribution.
