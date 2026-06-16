import { createClient } from '@/lib/supabase/server'
import type { Vertical } from '@/types/database'

interface RelatedListingsProps {
  vertical: Vertical
  excludeSlug: string
}

export default async function RelatedListings({ vertical, excludeSlug }: RelatedListingsProps) {
  const supabase = createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('id, name, slug, short_description, rating')
    .eq('vertical', vertical)
    .neq('slug', excludeSlug)
    .order('rating', { ascending: false })
    .limit(4)

  if (!listings || listings.length === 0) return null

  return (
    <section className="ledger-section">
      <h2>Other Listings in This Category</h2>
      <div className="related-grid">
        {listings.map((listing) => (
          <a
            key={listing.id}
            href={`/${vertical}/${listing.slug}`}
            className="related-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h3>{listing.name}</h3>
            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--rule-dark)' }}>
              {listing.short_description}
            </p>
            {listing.rating != null && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {listing.rating.toFixed(1)} / 5
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}
