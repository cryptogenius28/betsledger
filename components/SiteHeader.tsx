import Link from 'next/link'
import { PRIMARY_VERTICALS, VERTICAL_LABELS } from '@/types/database'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          Bets<span>Ledger</span>
        </Link>
        <nav className="site-nav">
          {PRIMARY_VERTICALS.map((vertical) => (
            <Link key={vertical} href={`/${vertical}`}>
              {VERTICAL_LABELS[vertical]}
            </Link>
          ))}
          <Link href="/affiliate-programs" className="is-flagship">
            Affiliate Programs
          </Link>
        </nav>
      </div>
    </header>
  )
}
