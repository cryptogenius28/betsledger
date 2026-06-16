import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { VERTICAL_LABELS, type Vertical } from '@/types/database'

export const metadata: Metadata = {
  title: 'Compare Crypto Casinos, Sportsbooks & Tools',
  description:
    'Head-to-head comparisons of crypto casinos, sportsbooks, poker rooms, VPNs, and more.',
  alternates: { canonical: 'https://betsledger.com/compare' },
}

interface PairWithNames {
  slugA: string
  slugB: string
  vertical: Vertical
  nameA: string
  nameB: string
}

async function getComparisonPairs(): Promise<PairWithNames[]> {
  const supabase = createClient()

  const { data: pairs } = await supabase
    .from('comparison_pairs')
    .select('slug_a, slug_b, vertical')
    .eq('is_active', true)

  if (!pairs || pairs.length === 0) return []

  const { data: listings } = await supabase.from('listings').select('slug, name, vertical')
  const nameMap = new Map((listings ?? []).map((l) => [`${l.vertical}:${l.slug}`, l.name as string]))

  return pairs.map((p) => ({
    slugA: p.slug_a,
    slugB: p.slug_b,
    vertical: p.vertical as Vertical,
    nameA: nameMap.get(`${p.vertical}:${p.slug_a}`) ?? p.slug_a,
    nameB: nameMap.get(`${p.vertical}:${p.slug_b}`) ?? p.slug_b,
  }))
}

export default async function ComparisonIndexPage() {
  const pairs = await getComparisonPairs()

  return (
    <main className="ledger-page">
      <header className="category-header">
        <p className="category-eyebrow">Comparisons</p>
        <h1>Compare Operators</h1>
        <p>
          Head-to-head breakdowns across every category — see exactly where each operator pulls
          ahead.
        </p>
      </header>

      {pairs.length === 0 ? (
        <p>No comparisons published yet. Check back soon.</p>
      ) : (
        <div className="vertical-grid">
          {pairs.map((pair) => (
            <Link
              key={`${pair.slugA}-vs-${pair.slugB}`}
              href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
              className="vertical-card"
            >
              <span className="vertical-count" style={{ marginTop: 0 }}>
                {VERTICAL_LABELS[pair.vertical]}
              </span>
              <h3>
                {pair.nameA} vs {pair.nameB}
              </h3>
              <p>
                See how {pair.nameA} and {pair.nameB} compare on ratings, fees, and features.
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
