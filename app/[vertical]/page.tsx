import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RankedListingCard from '@/components/RankedListingCard'
import {
  ALL_VERTICALS,
  VERTICAL_LABELS,
  VERTICAL_DESCRIPTIONS,
  type Listing,
  type Vertical,
} from '@/types/database'

interface PageProps {
  params: { vertical: string }
}

function isVertical(value: string): value is Vertical {
  return value in VERTICAL_LABELS
}

async function getListings(vertical: Vertical): Promise<Listing[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('listings')
    .select(`*, listing_attributes (key, value, label, display_order)`)
    .eq('vertical', vertical)
    .order('rating', { ascending: false, nullsFirst: false })

  return (data ?? []) as Listing[]
}

export async function generateStaticParams() {
  return ALL_VERTICALS.map((vertical) => ({ vertical }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isVertical(params.vertical)) return {}

  const label = VERTICAL_LABELS[params.vertical]
  const isFlagship = params.vertical === 'affiliate-programs'

  const title = isFlagship
    ? `${label}: Commission Rates & Payout Terms (2026)`
    : `Best ${label} in 2026: Ranked & Reviewed`

  const description = isFlagship
    ? 'Compare commission rates, cookie durations, and payout terms across the top crypto gambling affiliate programs.'
    : `${VERTICAL_DESCRIPTIONS[params.vertical]} Ranked by licensing, payout speed, and provably fair verification.`

  return {
    title,
    description,
    alternates: { canonical: `https://betsledger.com/${params.vertical}` },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  if (!isVertical(params.vertical)) notFound()

  const listings = await getListings(params.vertical)
  const label = VERTICAL_LABELS[params.vertical]
  const isFlagship = params.vertical === 'affiliate-programs'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: listings.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@type': 'Product', name: l.name },
    })),
  }

  return (
    <main className="ledger-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="category-header">
        <p className="category-eyebrow">{isFlagship ? 'Affiliate Directory' : 'Category'}</p>
        <h1>{isFlagship ? label : `Best ${label} in 2026`}</h1>
        <p>
          {VERTICAL_DESCRIPTIONS[params.vertical]} {listings.length}{' '}
          {isFlagship ? 'programs' : 'operators'} tracked.
        </p>
      </header>

      {listings.length === 0 ? (
        <p>No listings yet in this category. Check back soon.</p>
      ) : (
        <div className="ranked-list">
          {listings.map((listing, index) => (
            <RankedListingCard key={listing.id} rank={index + 1} listing={listing} />
          ))}
        </div>
      )}
    </main>
  )
}
