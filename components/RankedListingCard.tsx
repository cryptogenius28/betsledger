import Link from 'next/link'
import type { Listing } from '@/types/database'
import { formatAttributeValue } from '@/lib/format'

interface RankedListingCardProps {
  rank: number
  listing: Listing
  highlightCount?: number
}

const EXCLUDED_KEYS = new Set(['pro', 'con'])

export default function RankedListingCard({ listing, rank, highlightCount = 3 }: RankedListingCardProps) {
  const highlights = (listing.listing_attributes ?? [])
    .filter((a) => !EXCLUDED_KEYS.has(a.key))
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, highlightCount)

  return (
    <Link href={`/${listing.vertical}/${listing.slug}`} className="ranked-entry">
      <span className="entry-number">{String(rank).padStart(2, '0')}</span>

      <div className="entry-main">
        <h3>{listing.name}</h3>
        <p>{listing.short_description}</p>
        {highlights.length > 0 && (
          <div className="entry-highlights">
            {highlights.map((attr) => {
              const { text, verified } = formatAttributeValue(attr)
              return (
                <span className={`entry-highlight${verified ? ' is-verified' : ''}`} key={attr.key}>
                  <span className="entry-highlight-label">{attr.label ?? attr.key}</span>
                  {text}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <div className="entry-side">
        {listing.rating != null && (
          <span className="mini-stamp">{listing.rating.toFixed(1)}</span>
        )}
        <span className="entry-cta">Read Review</span>
      </div>
    </Link>
  )
}
