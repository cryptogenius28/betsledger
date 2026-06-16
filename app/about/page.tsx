import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About BetsLedger',
  description: 'What BetsLedger tracks, how the site is funded, and who it is for.',
  alternates: { canonical: 'https://betsledger.com/about' },
}

export default function AboutPage() {
  return (
    <main className="ledger-page">
      <header className="category-header">
        <p className="category-eyebrow">About</p>
        <h1>About BetsLedger</h1>
        <p>
          A running ledger of crypto casinos, sportsbooks, poker rooms, and the tools that go
          with them.
        </p>
      </header>

      <section className="ledger-section" style={{ marginTop: 0 }}>
        <h2>What We Track</h2>
        <p>
          BetsLedger is a directory and comparison site covering crypto casinos, sweepstakes and
          social casinos, sportsbooks, dice and provably fair games, poker rooms, prediction
          markets, and the VPNs that support access to them. Each listing is entered with details
          on licensing, supported cryptocurrencies, payout speed, and bonus terms, then scored
          against the criteria described in our methodology.
        </p>
      </section>

      <section className="ledger-section">
        <h2>How the Site Is Funded</h2>
        <p>
          BetsLedger is supported by affiliate commissions. When you sign up for an operator
          through a link on this site, we may earn a commission at no extra cost to you. These
          relationships do not influence our ratings — every listing is scored against the same
          criteria whether or not an affiliate relationship exists.
        </p>
      </section>

      <section className="ledger-section">
        <h2>Eligibility</h2>
        <p>
          Operators listed on BetsLedger are intended for adults of legal gambling age in
          jurisdictions where online and crypto gambling is permitted. Availability varies by
          region — always confirm an operator is licensed to operate where you live before signing
          up.
        </p>
      </section>

      <p>
        For details on how we evaluate operators, see our{' '}
        <Link href="/methodology">ratings methodology</Link>. If gambling has become a problem for
        you or someone you know, visit our{' '}
        <Link href="/responsible-gambling">responsible gambling</Link> page.
      </p>
    </main>
  )
}
