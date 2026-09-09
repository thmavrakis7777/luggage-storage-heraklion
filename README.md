# Luggage Storage Heraklion City Center

Marketing site and booking system for **Luggage Storage Heraklion City Center**, a luggage storage business at Sfakianaki 4, Heraklion, Crete. Built with Next.js (App Router), React, Tailwind CSS, Framer Motion, next-intl, and Supabase.

## Features

- Editorial, premium design with restrained animation (respects `prefers-reduced-motion`)
- Six-language site (English, Greek, German, Italian, Spanish, Dutch) with localized URLs, hreflang, and per-locale SEO metadata
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
- `SUPABASE_SERVICE_ROLE_KEY` / `ADMIN_PASSWORD` — required only for the admin panel (server-only, never exposed to the client)

## Database

The `bookings` table and its two public RPC functions (`create_booking`, `get_booking_by_reference`) live in the `luggage-storage-heraklion` Supabase project. Price fields are always recalculated by a Postgres trigger from `luggage_size` and `number_of_bags` — client-submitted prices are never trusted. The anon key has no direct table access (no SELECT/UPDATE/DELETE, no INSERT policy); every write and read goes through the RPC functions, which are the only exposed surface.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, Framer Motion
- **i18n:** next-intl
- **Backend:** Supabase (Postgres + RLS + RPC)
- **Deployment:** Docker, Vercel, or any Node.js host

## License

Private — not for redistribution.
