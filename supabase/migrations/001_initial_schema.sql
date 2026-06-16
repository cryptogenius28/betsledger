-- BetsLedger initial schema
-- Mirrors the Cryptoffiliate listings/listing_attributes pattern so the
-- existing page templates (review, best-for, compare, sitemap) port over
-- with minimal changes.

-- ---------------------------------------------------------------------
-- Verticals are stored as a constrained text column rather than a join
-- table, matching the VERTICAL_LABELS pattern used in the Next.js config.
-- ---------------------------------------------------------------------
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  vertical text not null check (vertical in (
    'crypto-casinos',
    'sweepstakes-casinos',
    'crypto-sportsbooks',
    'bitcoin-dice',
    'crypto-poker',
    'prediction-markets',
    'vpns',
    'affiliate-programs'
  )),
  logo_url text,
  affiliate_url text,
  short_description text,
  long_description text,
  rating numeric(2,1) check (rating >= 0 and rating <= 5),
  founded_year int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vertical, slug)
);

create index if not exists idx_listings_vertical on listings (vertical);
create index if not exists idx_listings_slug on listings (slug);

-- ---------------------------------------------------------------------
-- Flexible key/value attributes per listing. Used for vertical-specific
-- fields (e.g. supported_cryptocurrencies, state_restrictions,
-- house_edge) without needing a new column per vertical.
-- ---------------------------------------------------------------------
create table if not exists listing_attributes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings (id) on delete cascade,
  key text not null,
  value text not null,
  label text,
  display_order int not null default 0
);

create index if not exists idx_listing_attributes_listing_id on listing_attributes (listing_id);
create index if not exists idx_listing_attributes_key on listing_attributes (key);

-- ---------------------------------------------------------------------
-- Precomputed comparison pairs for /compare/[slugA]-vs-[slugB] pages.
-- Only active pairs are included in the sitemap.
-- ---------------------------------------------------------------------
create table if not exists comparison_pairs (
  id uuid primary key default gen_random_uuid(),
  slug_a text not null,
  slug_b text not null,
  vertical text not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (slug_a, slug_b)
);

-- ---------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_listings_updated_at on listings;
create trigger trg_listings_updated_at
  before update on listings
  for each row
  execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security: public read-only, no anon writes
-- ---------------------------------------------------------------------
alter table listings enable row level security;
alter table listing_attributes enable row level security;
alter table comparison_pairs enable row level security;

create policy "Public read access on listings"
  on listings for select
  using (true);

create policy "Public read access on listing_attributes"
  on listing_attributes for select
  using (true);

create policy "Public read access on comparison_pairs"
  on comparison_pairs for select
  using (is_active = true);
