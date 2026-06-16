import { Metadata } from 'next'
import Link from 'next/link'
import { VERTICAL_LABELS } from '@/types/database'
import { MODIFIER_CONFIG, MODIFIER_VERTICAL_ALLOW } from '@/lib/modifiers'

export const metadata: Metadata = {
  title: 'Best Crypto Casinos & Sportsbooks for Every Use Case (2026)',
  description:
    'Ranked lists of the best crypto casinos, sportsbooks, VPNs, and more — filtered by use case, feature, and cryptocurrency.',
  alternates: { canonical: 'https://betsledger.com/best' },
}

export default function BestIndexPage() {
  // Build a flat list of all valid vertical/modifier combos grouped by vertical
  const byVertical = Object.entries(MODIFIER_VERTICAL_ALLOW).reduce<
    Record<string, { modifier: string; label: string }[]>
  >((acc, [modifier, verticals]) => {
    const config = MODIFIER_CONFIG[modifier]
    if (!config) return acc
    for (const vertical of verticals) {
      if (!acc[vertical]) acc[vertical] = []
      acc[vertical].push({ modifier, label: config.label })
    }
    return acc
  }, {})

  return (
    <main className="ledger-page">
      <header className="category-header">
        <p className="category-eyebrow">Rankings</p>
        <h1>Best Lists &amp; Rankings</h1>
        <p>
          Every operator ranked for a specific use case — beginners, high rollers, fast
          withdrawals, provably fair games, and more.
        </p>
      </header>

      {Object.entries(byVertical).map(([vertical, modifiers]) => (
        <div key={vertical} style={{ marginBottom: '2.5rem' }}>
          <div className="section-heading">
            <h2>{VERTICAL_LABELS[vertical as keyof typeof VERTICAL_LABELS]}</h2>
          </div>
          <div className="vertical-grid">
            {modifiers.map(({ modifier, label }) => (
              <Link
                key={modifier}
                href={`/best/${vertical}/${modifier}`}
                className="vertical-card"
              >
                <h3>
                  Best {VERTICAL_LABELS[vertical as keyof typeof VERTICAL_LABELS]} for {label}
                </h3>
                <p>
                  Ranked by the criteria that matter most for {label.toLowerCase()}.
                </p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}
