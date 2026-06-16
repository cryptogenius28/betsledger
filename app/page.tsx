import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  PRIMARY_VERTICALS,
  VERTICAL_LABELS,
  VERTICAL_DESCRIPTIONS,
  type Vertical,
} from '@/types/database'

interface HomeListing {
  vertical: Vertical
  name: string
  slug: string
  short_description: string | null
  rating: number | null
}

export default async function HomePage() {
  const supabase = createClient()

  const { data } = await supabase
    .from('listings')
    .select('vertical, name, slug, short_description, rating')

  const listings = (data ?? []) as HomeListing[]

  const countsByVertical = PRIMARY_VERTICALS.reduce<Record<string, number>>((acc, vertical) => {
    acc[vertical] = listings.filter((l) => l.vertical === vertical).length
    return acc
  }, {})

  const topListings = [...listings]
    .filter((l) => l.vertical !== 'affiliate-programs' && l.rating != null)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)

  return (
    <main className="home-page">
      <section className="hero">
        <p className="hero-eyebrow">Vol. I — 2026 Edition</p>
        <h1>Every crypto casino, sportsbook, and tool — entered, verified, ranked.</h1>
        <p>
          BetsLedger tracks {listings.length}+ operators across casinos, sportsbooks, poker
          rooms, dice games, prediction markets, and the tools that go with them — each one
          rated on licensing, payout speed, and provably fair verification.
        </p>
        <a href="#browse" className="hero-cta">
          Open the Ledger
        </a>
      </section>

      <Link href="/affiliate-programs" className="flagship-spotlight">
        <div>
          <p className="flagship-eyebrow">For Creators &amp; Affiliates</p>
          <h2>Crypto Gambling Affiliate Programs</h2>
          <p>
            Compare commission rates, cookie durations, and payout terms across the top crypto
            casino, sportsbook, and VPN affiliate programs.
          </p>
        </div>
        <span className="hero-cta" style={{ borderColor: 'var(--brass)', color: 'var(--brass)' }}>
          Browse Programs
        </span>
      </Link>

      <div id="browse" className="section-heading">
        <h2>Browse by Category</h2>
      </div>
      <div className="vertical-grid">
        {PRIMARY_VERTICALS.map((vertical) => (
          <Link key={vertical} href={`/${vertical}`} className="vertical-card">
            <h3>{VERTICAL_LABELS[vertical]}</h3>
            <p>{VERTICAL_DESCRIPTIONS[vertical]}</p>
            <span className="vertical-count">{countsByVertical[vertical] ?? 0} listed</span>
          </Link>
        ))}
      </div>

      {topListings.length > 0 && (
        <>
          <div className="section-heading">
            <h2>Highest-Rated This Month</h2>
            <Link href="/best">View all rankings</Link>
          </div>
          <div className="top-listings-grid">
            {topListings.map((listing) => (
              <Link
                key={`${listing.vertical}-${listing.slug}`}
                href={`/${listing.vertical}/${listing.slug}`}
                className="top-listing-card"
              >
                <span className="top-listing-vertical">{VERTICAL_LABELS[listing.vertical]}</span>
                <h3>{listing.name}</h3>
                <p>{listing.short_description}</p>
                {listing.rating != null && (
                  <span className="top-listing-rating">{listing.rating.toFixed(1)} / 5</span>
                )}
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="section-heading">
        <h2>How We Rate</h2>
      </div>
      <section className="ledger-section" style={{ marginTop: 0 }}>
        <div className="methodology-row">
          <span className="methodology-mark">✓</span>
          <div>
            <h3>Licensing &amp; Regulation</h3>
            <p>
              We confirm each operator&apos;s gaming license and issuing jurisdiction, and note
              where access is restricted for US, UK, or EU players.
            </p>
          </div>
        </div>
        <div className="methodology-row">
          <span className="methodology-mark">✓</span>
          <div>
            <h3>Payout Speed &amp; Reliability</h3>
            <p>
              We track average withdrawal times and flag operators with excessive holds, hidden
              fees, or unresolved payout complaints.
            </p>
          </div>
        </div>
        <div className="methodology-row">
          <span className="methodology-mark">✓</span>
          <div>
            <h3>Provably Fair Verification</h3>
            <p>
              For casinos and dice games, we confirm the operator publishes a provably fair
              algorithm that players can independently verify.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
