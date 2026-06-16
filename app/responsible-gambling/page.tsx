import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Responsible Gambling',
  description:
    'Resources for safer gambling, including the National Problem Gambling Helpline and tools offered by crypto gambling operators.',
  alternates: { canonical: 'https://betsledger.com/responsible-gambling' },
}

export default function ResponsibleGamblingPage() {
  return (
    <main className="ledger-page">
      <header className="category-header">
        <p className="category-eyebrow">Responsible Gambling</p>
        <h1>Gambling Should Stay Entertainment, Not a Habit</h1>
        <p>
          BetsLedger covers crypto gambling operators, but we want every visitor to play safely.
          If gambling stops being fun, these resources can help.
        </p>
      </header>

      <section className="ledger-section" style={{ marginTop: 0 }}>
        <h2>Get Help</h2>
        <p>
          If you or someone you know may have a gambling problem, contact the National Problem
          Gambling Helpline by calling or texting <strong>1-800-MY-RESET</strong>, or visit{' '}
          ncpgambling.org/chat. The helpline is operated by the National Council on Problem
          Gambling, is free and confidential, and is available 24/7 by call, text, or chat. The
          previous helpline number, 1-800-522-4700, also remains active.
        </p>
      </section>

      <section className="ledger-section">
        <h2>Signs to Watch For</h2>
        <ul>
          <li>Spending more time or money on gambling than intended, or chasing losses</li>
          <li>Feeling anxious, irritable, or preoccupied when not gambling</li>
          <li>Hiding gambling activity from family or friends, or lying about losses</li>
          <li>Using money meant for bills, savings, or essentials to gamble</li>
          <li>Borrowing money or selling assets to fund gambling</li>
        </ul>
        <p>
          If any of these sound familiar, the National Council on Problem Gambling also offers a
          confidential self-assessment at ncpgambling.org.
        </p>
      </section>

      <section className="ledger-section">
        <h2>Tools for Safer Play</h2>
        <p>
          Most reputable operators offer tools to help you stay in control, including deposit
          limits, loss limits, time-out periods, and full self-exclusion. If an operator listed on
          BetsLedger doesn&apos;t make these tools easy to find, that&apos;s worth factoring into
          your decision regardless of its other ratings.
        </p>
      </section>

      <section className="ledger-section">
        <h2>Age Requirements</h2>
        <p>
          You must meet the legal gambling age in your jurisdiction to use any operator listed on
          BetsLedger — 18+ in most places, and 21+ for online casinos and sportsbooks in most US
          states that permit them. Sweepstakes and social casinos may have their own age and
          eligibility rules, detailed in our{' '}
          <a href="/sweepstakes-casinos">Sweepstakes &amp; Social Casinos</a> category.
        </p>
      </section>
    </main>
  )
}
