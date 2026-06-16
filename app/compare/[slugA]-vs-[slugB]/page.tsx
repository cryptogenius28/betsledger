import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import AffiliateCTA from '@/components/AffiliateCTA'
import { VERTICAL_LABELS, type Listing, type ListingAttribute } from '@/types/database'
import { formatAttributeValue, compareAttributeWinner } from '@/lib/format'

interface PageProps {
  params: { slugA: string; slugB: string }
}

const EXCLUDED_KEYS = new Set(['pro', 'con'])

interface ComparisonData {
  listingA: Listing
  listingB: Listing
}

async function getComparisonData(slugA: string, slugB: string): Promise<ComparisonData | null> {
  const supabase = createClient()

  const { data: pair } = await supabase
    .from('comparison_pairs')
    .select('slug_a, slug_b, vertical')
    .eq('slug_a', slugA)
    .eq('slug_b', slugB)
    .eq('is_active', true)
    .single()

  if (!pair) return null

  const { data: listings } = await supabase
    .from('listings')
    .select(`*, listing_attributes (key, value, label, display_order)`)
    .eq('vertical', pair.vertical)
    .in('slug', [slugA, slugB])

  if (!listings || listings.length !== 2) return null

  const listingA = listings.find((l) => l.slug === slugA) as Listing | undefined
  const listingB = listings.find((l) => l.slug === slugB) as Listing | undefined
  if (!listingA || !listingB) return null

  return { listingA, listingB }
}

interface ComparisonRow {
  key: string
  label: string
  attrA?: ListingAttribute
  attrB?: ListingAttribute
  order: number
}

function getComparisonRows(listingA: Listing, listingB: Listing): ComparisonRow[] {
  const attrsA = new Map(
    (listingA.listing_attributes ?? [])
      .filter((a) => !EXCLUDED_KEYS.has(a.key))
      .map((a) => [a.key, a])
  )
  const attrsB = new Map(
    (listingB.listing_attributes ?? [])
      .filter((a) => !EXCLUDED_KEYS.has(a.key))
      .map((a) => [a.key, a])
  )

  const allKeys = new Set([...Array.from(attrsA.keys()), ...Array.from(attrsB.keys())])

  const rows: ComparisonRow[] = Array.from(allKeys).map((key) => {
    const attrA = attrsA.get(key)
    const attrB = attrsB.get(key)
    return {
      key,
      label: attrA?.label ?? attrB?.label ?? key,
      attrA,
      attrB,
      order: Math.min(attrA?.display_order ?? 99, attrB?.display_order ?? 99),
    }
  })

  return rows.sort((x, y) => x.order - y.order)
}

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data: pairs } = await supabase
    .from('comparison_pairs')
    .select('slug_a, slug_b')
    .eq('is_active', true)

  return (pairs ?? []).map((p) => ({ slugA: p.slug_a, slugB: p.slug_b }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getComparisonData(params.slugA, params.slugB)
  if (!data) return {}

  const { listingA, listingB } = data

  return {
    title: `${listingA.name} vs ${listingB.name}: Which Is Better in 2026?`,
    description: `Compare ${listingA.name} and ${listingB.name} side by side on ratings, fees, supported cryptocurrencies, and more.`,
    alternates: {
      canonical: `https://betsledger.com/compare/${params.slugA}-vs-${params.slugB}`,
    },
  }
}

export default async function ComparePage({ params }: PageProps) {
  const data = await getComparisonData(params.slugA, params.slugB)
  if (!data) notFound()

  const { listingA, listingB } = data
  const rows = getComparisonRows(listingA, listingB)

  const overallWinner = compareAttributeWinner(
    'rating',
    listingA.rating?.toString(),
    listingB.rating?.toString()
  )

  const verdict =
    overallWinner === 'a'
      ? `${listingA.name} edges out ${listingB.name} with a higher overall rating, but check the category breakdown below — ${listingB.name} may still be the better fit depending on what matters most to you.`
      : overallWinner === 'b'
        ? `${listingB.name} edges out ${listingA.name} with a higher overall rating, but check the category breakdown below — ${listingA.name} may still be the better fit depending on what matters most to you.`
        : `${listingA.name} and ${listingB.name} are rated similarly overall — the category breakdown below highlights where each one pulls ahead.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Which is better, ${listingA.name} or ${listingB.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: verdict },
      },
    ],
  }

  return (
    <main className="ledger-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="compare-header">
        <p className="category-eyebrow">{VERTICAL_LABELS[listingA.vertical]} Comparison</p>
        <h1>
          {listingA.name} vs {listingB.name}
        </h1>
      </header>

      <div className="compare-columns">
        <div className="compare-column">
          {listingA.rating != null && (
            <span className="mini-stamp on-dark">{listingA.rating.toFixed(1)}</span>
          )}
          <h2>{listingA.name}</h2>
          <p>{listingA.short_description}</p>
          <AffiliateCTA listing={listingA} label={`Visit ${listingA.name}`} />
        </div>

        <span className="compare-vs">VS</span>

        <div className="compare-column">
          {listingB.rating != null && (
            <span className="mini-stamp on-dark">{listingB.rating.toFixed(1)}</span>
          )}
          <h2>{listingB.name}</h2>
          <p>{listingB.short_description}</p>
          <AffiliateCTA listing={listingB} label={`Visit ${listingB.name}`} />
        </div>
      </div>

      <section className="ledger-section" style={{ marginTop: 0 }}>
        <h2>Head-to-Head</h2>
        <div className="compare-table">
          <div className="compare-row">
            <span className="compare-label">Overall Rating</span>
            <span className={`compare-value${overallWinner === 'a' ? ' is-winner' : ''}`}>
              {listingA.rating?.toFixed(1) ?? '—'}
            </span>
            <span className={`compare-value${overallWinner === 'b' ? ' is-winner' : ''}`}>
              {listingB.rating?.toFixed(1) ?? '—'}
            </span>
          </div>
          {rows.map((row) => {
            const winner = compareAttributeWinner(row.key, row.attrA?.value, row.attrB?.value)
            const a = row.attrA ? formatAttributeValue(row.attrA) : null
            const b = row.attrB ? formatAttributeValue(row.attrB) : null

            return (
              <div className="compare-row" key={row.key}>
                <span className="compare-label">{row.label}</span>
                <span className={`compare-value${winner === 'a' ? ' is-winner' : ''}`}>
                  {a?.text ?? '—'}
                </span>
                <span className={`compare-value${winner === 'b' ? ' is-winner' : ''}`}>
                  {b?.text ?? '—'}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="ledger-section">
        <h2>Frequently Asked Questions</h2>
        <h3>
          Which is better, {listingA.name} or {listingB.name}?
        </h3>
        <p>{verdict}</p>
      </section>
    </main>
  )
}
