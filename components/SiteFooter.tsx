import Link from 'next/link'
import { PRIMARY_VERTICALS, VERTICAL_LABELS } from '@/types/database'

export default function SiteFooter() {
  const midpoint = Math.ceil(PRIMARY_VERTICALS.length / 2)
  const columnA = PRIMARY_VERTICALS.slice(0, midpoint)
  const columnB = PRIMARY_VERTICALS.slice(midpoint)

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <h3>Browse</h3>
          {columnA.map((vertical) => (
            <Link key={vertical} href={`/${vertical}`}>
              {VERTICAL_LABELS[vertical]}
            </Link>
          ))}
        </div>
        <div>
          <h3>&nbsp;</h3>
          {columnB.map((vertical) => (
            <Link key={vertical} href={`/${vertical}`}>
              {VERTICAL_LABELS[vertical]}
            </Link>
          ))}
        </div>
        <div>
          <h3>For Affiliates</h3>
          <Link href="/affiliate-programs">Affiliate Programs</Link>
          <Link href="/compare">Compare Operators</Link>
        </div>
        <div>
          <h3>Site</h3>
          <Link href="/about">About BetsLedger</Link>
          <Link href="/methodology">Our Ratings Methodology</Link>
          <Link href="/responsible-gambling">Responsible Gambling</Link>
        </div>
      </div>
      <p className="footer-note">
        BetsLedger contains affiliate links. We may earn a commission if you sign up through a
        link on this site, at no extra cost to you. This does not influence our ratings, which
        are based on the criteria described in our methodology. Gambling involves risk — only
        wager what you can afford to lose, and must be 18+ (21+ in some jurisdictions). If you or
        someone you know has a gambling problem, contact the National Council on Problem Gambling
        at 1-800-522-4700.
      </p>
    </footer>
  )
}
