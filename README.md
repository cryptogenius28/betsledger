# BetsLedger

Crypto casino, sportsbook, and gambling tools directory built on Next.js 14 App Router + Supabase.

## Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (Postgres + RLS)
- **Styling**: CSS custom properties (no Tailwind — ledger design system in `app/globals.css`)
- **Fonts**: Fraunces / Source Sans 3 / IBM Plex Mono via `next/font/google`
- **Deployment**: Vercel

## Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and note your **Project URL** and **anon key** from Project Settings → API.

### 2. Run migrations

In the Supabase SQL Editor, run these files in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_seed_sample_listings.sql`

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings
4. Deploy — Vercel auto-detects Next.js

### Custom domain

In Vercel → Project → Domains, add `betsledger.com`. Then in your domain registrar (where you purchased betsledger.com), point the DNS to Vercel's nameservers or add the A/CNAME records Vercel specifies.

## Project structure

```
app/
├── page.tsx                          Homepage
├── layout.tsx                        Root layout (fonts, header, footer)
├── globals.css                       Design tokens + all component styles
├── sitemap.ts                        Auto-generated sitemap
├── robots.ts
├── [vertical]/
│   ├── page.tsx                      Category/ranking pages
│   └── [slug]/page.tsx               Individual review pages
├── compare/
│   ├── page.tsx                      Comparison index
│   └── [slugA]-vs-[slugB]/page.tsx   Head-to-head pages
├── best/
│   ├── page.tsx                      Rankings index
│   └── [vertical]/[modifier]/page.tsx  "Best X for Y" pages
├── about/page.tsx
├── methodology/page.tsx
└── responsible-gambling/page.tsx

components/
├── SiteHeader.tsx
├── SiteFooter.tsx
├── RankedListingCard.tsx
├── AttributeTable.tsx
├── AffiliateCTA.tsx
└── RelatedListings.tsx

lib/
├── format.ts           Attribute formatting + compare winner logic
├── modifiers.ts        "Best X for Y" modifier config (add new keywords here)
└── supabase/
    ├── server.ts       Server Component client
    └── client.ts       Browser client

types/
└── database.ts         Vertical union type, VERTICAL_LABELS, Listing interface

supabase/migrations/
├── 001_initial_schema.sql
└── 002_seed_sample_listings.sql
```

## Adding listings

Insert rows into `listings` and `listing_attributes` via a new migration file or the Supabase Table Editor. The attribute keys used in listing cards and comparisons are defined in `lib/format.ts`.

## Adding "Best X for Y" pages

Edit `lib/modifiers.ts` — add a new key to `MODIFIER_CONFIG` and add the applicable verticals to `MODIFIER_VERTICAL_ALLOW`. The new pages and sitemap entries are generated automatically on the next build.

## Adding comparison pages

Insert a row into `comparison_pairs` with `slug_a`, `slug_b`, `vertical`, and `is_active = true`. The comparison page and sitemap entry appear on the next build.
