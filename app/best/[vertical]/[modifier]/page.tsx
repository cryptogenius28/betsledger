import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RankedListingCard from '@/components/RankedListingCard'
import { VERTICAL_LABELS, type Listing, type Vertical } from '@/types/database'
import { MODIFIER_CONFIG, MODIFIER_VERTICAL_ALLOW } from '@/lib/modifiers'

interface PageProps {
  params: { vertical: string; modifier: string }
}

function isVertical(value: string): value is Vertical {
  return value in VERTICAL_LABELS
}

async function getRankedListings(vertical: Vertical, modifier: string) {
  const config = MODIFIER_CONFIG[modifier]
  if (!config) return null

  // Check this vertical/modifier combo is allowed
  const allowed = MODIFIER_VERTICAL_ALLOW[modifier]
  if (allowed && !allowed.includes(vertical)) return null

  const supabase = createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select(`id, name, slug, logo_url, affiliate_url, vertical, short_description, rating, listing_attributes (key, value, label, display_order)`)
    .eq('vertical', vertical)

  if (!listings) return null

  let filtered = listings as Listing[]

  // Filter by attribute value if configured
  if (config.filterAttr && config.filterValue) {
    filtered = filtered.filter((l) =>
      l.listing_attributes?.some(
        (a) =>
          a.key === config.filterAttr &&
          a.value.toLowerCase().includes(config.filterValue!.toLowerCase())
      )
    )
  }

  // Sort by attribute value
  filtered.sort((a, b) => {
    const aVal = parseFloat(
      a.listing_attributes?.find((x) => x.key === config.sortAttr)?.value ?? '0'
    )
    const bVal = parseFloat(
      b.listing_attributes?.find((x) => x.key === config.sortAttr)?.value ?? '0'
    )
    return config.sortDir === 'desc' ? bVal - aVal : aVal - bVal
  })

  return { listings: filtered, config }
}

export async function generateStaticParams() {
  const params: { vertical: string; modifier: string }[] = []

  for (const [modifier, verticals] of Object.entries(MODIFIER_VERTICAL_ALLOW)) {
    for (const vertical of verticals) {
      params.push({ vertical, modifier })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isVertical(params.vertical)) return {}
  const config = MODIFIER_CONFIG[params.modifier]
  if (!config) return {}

  const verticalLabel = VERTICAL_LABELS[params.vertical]
  const title = `Best ${verticalLabel} for ${config.label} (2026)`
  const description = `Top-ranked ${verticalLabel.toLowerCase()} for ${config.label.toLowerCase()}, sorted by ${config.sortAttr.replace(/_/g, ' ')} and verified on BetsLedger.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://betsledger.com/best/${params.vertical}/${params.modifier}`,
    },
  }
}

export default async function BestForPage({ params }: PageProps) {
  if (!isVertical(params.vertical)) notFound()

  const result = await getRankedListings(params.vertical, params.modifier)
  if (!result || result.listings.length === 0) notFound()

  const { listings, config } = result
  const verticalLabel = VERTICAL_LABELS[params.vertical]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${verticalLabel} for ${config.label}`,
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Product', name: l.name },
    })),
  }

  const sortLabel = config.sortAttr.replace(/_/g, ' ')

  return (
    <main className="ledger-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="category-header">
        <p className="category-eyebrow">Rankings — {verticalLabel}</p>
        <h1>
          Best {verticalLabel} for {config.label} in 2026
        </h1>
        <p>
          We ranked {listings.length} {verticalLabel.toLowerCase()} by {sortLabel} to find the
          best fit for {config.label.toLowerCase()}.
        </p>
      </header>

      <div className="ranked-list">
        {listings.map((listing, index) => (
          <RankedListingCard
            key={listing.id}
            rank={index + 1}
            listing={listing}
            highlightCount={3}
          />
        ))}
      </div>

      <section className="ledger-section">
        <h2>Frequently Asked Questions</h2>
        <h3>
          What&apos;s the best {verticalLabel.toLowerCase().replace(/s$/, '')} for{' '}
          {config.label.toLowerCase()}?
        </h3>
        <p>
          {listings[0]?.name} ranks #1 for {config.label.toLowerCase()} based on our analysis of{' '}
          {sortLabel}. See the full ranking above for how all {listings.length} options compare.
        </p>

        <h3>How often are these rankings updated?</h3>
        <p>
          Rankings are refreshed when operators change their fees, licensing, or terms in a way
          that materially affects the scoring criteria. Check our{' '}
          <a href="/methodology">methodology page</a> for full details.
        </p>
      </section>
    </main>
  )
}
