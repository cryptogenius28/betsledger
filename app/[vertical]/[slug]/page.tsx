import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AttributeTable from '@/components/AttributeTable'
import AffiliateCTA from '@/components/AffiliateCTA'
import RelatedListings from '@/components/RelatedListings'
import { VERTICAL_LABELS, type Listing, type Vertical } from '@/types/database'

interface PageProps {
  params: { vertical: string; slug: string }
}

function isVertical(value: string): value is Vertical {
  return value in VERTICAL_LABELS
}

async function getListing(vertical: Vertical, slug: string): Promise<Listing | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('listings')
    .select(`*, listing_attributes (key, value, label, display_order)`)
    .eq('vertical', vertical)
    .eq('slug', slug)
    .single()

  return data as Listing | null
}

export async function generateStaticParams() {
  const supabase = createClient()
  const { data: listings } = await supabase.from('listings').select('vertical, slug')

  return (listings ?? []).map((l) => ({ vertical: l.vertical, slug: l.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isVertical(params.vertical)) return {}

  const listing = await getListing(params.vertical, params.slug)
  if (!listing) return {}

  return {
    title: `${listing.name} Review (2026): Fees, Features, Pros & Cons`,
    description: `In-depth ${listing.name} review covering bonuses, supported cryptocurrencies, and whether it's worth using in 2026.`,
    alternates: { canonical: `https://betsledger.com/${params.vertical}/${params.slug}` },
  }
}

export default async function ListingPage({ params }: PageProps) {
  if (!isVertical(params.vertical)) notFound()

  const listing = await getListing(params.vertical, params.slug)
  if (!listing) notFound()

  const pros = (listing.listing_attributes ?? [])
    .filter((a) => a.key === 'pro')
    .sort((a, b) => a.display_order - b.display_order)
  const cons = (listing.listing_attributes ?? [])
    .filter((a) => a.key === 'con')
    .sort((a, b) => a.display_order - b.display_order)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Product', name: listing.name },
    reviewRating: listing.rating
      ? { '@type': 'Rating', ratingValue: listing.rating, bestRating: '5' }
      : undefined,
  }

  return (
    <main className="ledger-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="ledger-header">
        {listing.rating != null && (
          <div className="stamp">
            <span className="stamp-value">{listing.rating.toFixed(1)}</span>
            <span className="stamp-label">/ 5 Verified</span>
          </div>
        )}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brass)', margin: '0 0 0.5rem' }}>
          {VERTICAL_LABELS[params.vertical]}
        </p>
        <h1>{listing.name} Review: Is It Worth It in 2026?</h1>
        <p className="lead">{listing.short_description}</p>
      </header>

      <AffiliateCTA listing={listing} label={`Visit ${listing.name}`} />

      <AttributeTable attributes={listing.listing_attributes} />

      {(pros.length > 0 || cons.length > 0) && (
        <section className="ledger-section">
          <h2>Pros & Cons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: 'var(--verified)', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                Pros
              </h3>
              <ul>
                {pros.map((p) => (
                  <li key={p.value}>{p.value}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ color: 'var(--wager)', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
                Cons
              </h3>
              <ul>
                {cons.map((c) => (
                  <li key={c.value}>{c.value}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <RelatedListings vertical={params.vertical} excludeSlug={params.slug} />
    </main>
  )
}
