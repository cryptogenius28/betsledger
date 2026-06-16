import type { ListingAttribute } from '@/types/database'
import { formatAttributeValue } from '@/lib/format'

interface AttributeTableProps {
  attributes?: ListingAttribute[]
}

// Keys rendered elsewhere (pros/cons section), not in the generic table.
const EXCLUDED_KEYS = new Set(['pro', 'con'])

export default function AttributeTable({ attributes }: AttributeTableProps) {
  const rows = (attributes ?? [])
    .filter((a) => !EXCLUDED_KEYS.has(a.key))
    .sort((a, b) => a.display_order - b.display_order)

  if (rows.length === 0) return null

  return (
    <section className="ledger-section">
      <h2>At a Glance</h2>
      {rows.map((attr) => {
        const { text, verified } = formatAttributeValue(attr)
        return (
          <div className="ledger-row" key={attr.key}>
            <span className="ledger-label">{attr.label ?? attr.key}</span>
            <span className={`ledger-value${verified ? ' is-verified' : ''}`}>{text}</span>
          </div>
        )
      })}
    </section>
  )
}
