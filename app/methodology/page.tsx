import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Ratings Methodology',
  description: 'How BetsLedger evaluates and rates crypto casinos, sportsbooks, and tools.',
  alternates: { canonical: 'https://betsledger.com/methodology' },
}

export default function MethodologyPage() {
  return (
    <main className="ledger-page">
      <header className="category-header">
        <p className="category-eyebrow">Methodology</p>
        <h1>Our Ratings Methodology</h1>
        <p>
          Every operator in the ledger is scored out of 5.0 against the same core criteria,
          regardless of category.
        </p>
      </header>

      <section className="ledger-section" style={{ marginTop: 0 }}>
        <h2>Licensing &amp; Regulation</h2>
        <p>
          We confirm each operator&apos;s gaming license and the jurisdiction that issued it.
          Operators without a verifiable license, or that misrepresent their licensing status, are
          scored down accordingly. We also note regions where access is restricted — for example,
          most crypto casinos geo-block US and UK players regardless of licensing elsewhere.
        </p>
      </section>

      <section className="ledger-section">
        <h2>Payout Speed &amp; Reliability</h2>
        <p>
          We track average withdrawal times across supported cryptocurrencies and flag operators
          with a pattern of excessive holds, surprise fees, or unresolved payout complaints.
          Faster, more predictable withdrawals score higher.
        </p>
      </section>

      <section className="ledger-section">
        <h2>Provably Fair Verification</h2>
        <p>
          For casinos, dice, and other games of chance, we check whether the operator publishes a
          provably fair algorithm — a cryptographic method that lets players independently verify
          that game outcomes weren&apos;t manipulated. Operators that support this, and make it
          easy to verify, score higher in this category.
        </p>
      </section>

      <section className="ledger-section">
        <h2>The Rating Scale</h2>
        <div className="ledger-row">
          <span className="ledger-label">4.5 – 5.0</span>
          <span className="ledger-value is-verified">Exceptional</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">4.0 – 4.4</span>
          <span className="ledger-value">Strong, minor drawbacks</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">3.5 – 3.9</span>
          <span className="ledger-value">Solid, notable limitations</span>
        </div>
        <div className="ledger-row">
          <span className="ledger-label">Below 3.5</span>
          <span className="ledger-value">Listed for reference, significant caveats</span>
        </div>
      </section>

      <section className="ledger-section">
        <h2>How Often We Update</h2>
        <p>
          Listings are reviewed periodically and updated when an operator changes its licensing,
          fee structure, or terms in a way that affects its rating. Bonus offers and promotions
          change frequently — always confirm current terms on the operator&apos;s site before
          signing up.
        </p>
      </section>
    </main>
  )
}
