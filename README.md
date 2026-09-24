# Luggage Storage Heraklion City Center

Marketing site and booking system for **Luggage Storage Heraklion City Center**, a luggage storage business at Sfakianaki 4, Heraklion, Crete. Built with Next.js (App Router), React, Tailwind CSS, next-intl, and Supabase.

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

## Changing Prices or Opening Hours

Prices and hours are enforced in the database **and** repeated in the code and the copy. Change every place below, or the site will show one number and charge another.

### Prices and discounts

- [ ] **Database — what customers are actually charged.** In the Supabase SQL editor, edit `create_booking`: the `v_price_per_day` case (`backpack` 3.00, `cabin` 4.00, `large` 5.00) and the discount line `case when v_storage_days >= 3 then 25 else 10 end`.
- [ ] **`src/lib/pricing.ts`** — `PRICE_PER_DAY_CENTS` (in cents), `STANDARD_DISCOUNT_PERCENTAGE`, `LONG_STAY_DISCOUNT_PERCENTAGE`, `LONG_STAY_MIN_DAYS`. Drives the booking form's price summary, the Telegram message and the prices in the structured data.
- [ ] **`messages/*.json`, all 7 languages** — the `pricing.*.price` amounts, `benefits.price`, and every mention of the 10% / 25% / 3-day discount (`meta.title`, `meta.description`, `hero.ctaPrimary`, `walkIn.subtitle`, `benefits.discount`, `benefits.longStay`, `pricing.discountNote`, `pricing.cta`, `faq.items.discount.answer`, `faq.items.longStay.answer`, `finalCta.subtitle`, `journal.ctaText`). Find them with `grep -n "€\|%" messages/*.json`.
- [ ] **`src/content/journal/posts/*.ts`** — the articles quote prices and discounts in EN and EL. Find them with `grep -rln "€\|%" src/content/journal/posts`.

### Opening hours

- [ ] **Database.** In the Supabase SQL editor, edit `is_within_opening_hours` (the per-weekday `case`). `create_booking` calls it and has a comment repeating the hours.
- [ ] **`src/lib/hours.ts`** — `OPENING_HOURS` (booking time slots), `OPENING_HOURS_DISPLAY` (Location section), `OPENING_HOURS_SCHEMA` (structured data) and the comment at the top. For the by-appointment rule: `ADVANCE_BOOKING_CUTOFF` and `ADVANCE_BOOKING_AFTERNOON_DAYS`.
- [ ] **`messages/*.json`, all 7 languages** — `walkIn.subtitle` and `hours.advanceBookingNote` spell out the by-appointment times (French writes `15h00`).
- [ ] **`src/content/journal/posts/*.ts`** — most articles quote the hours. Find them with `grep -rln "21:00\|20:00" src/content/journal/posts`.

### After either change

- [ ] Bump `HOME_UPDATED` / `HOME_WITH_JOURNAL_UPDATED` / `BOOK_UPDATED` in `src/app/sitemap.ts` for the pages whose copy changed.
- [ ] Make a test booking and check that the confirmation page and the Telegram message show the new price.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4
- **i18n:** next-intl
- **Backend:** Supabase (Postgres + RLS + RPC)
- **Deployment:** Vercel, or any Node.js host (`npm run build && npm start`)

## License

Private — not for redistribution.
