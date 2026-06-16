export type Vertical =
  | 'crypto-casinos'
  | 'sweepstakes-casinos'
  | 'crypto-sportsbooks'
  | 'bitcoin-dice'
  | 'crypto-poker'
  | 'prediction-markets'
  | 'vpns'
  | 'affiliate-programs'

export const VERTICAL_LABELS: Record<Vertical, string> = {
  'crypto-casinos': 'Crypto Casinos',
  'sweepstakes-casinos': 'Sweepstakes & Social Casinos',
  'crypto-sportsbooks': 'Crypto Sportsbooks',
  'bitcoin-dice': 'Bitcoin Dice & Provably Fair Games',
  'crypto-poker': 'Crypto Poker Rooms',
  'prediction-markets': 'Crypto Prediction Markets',
  vpns: 'VPNs for Crypto Gambling Access',
  'affiliate-programs': 'Crypto Gambling Affiliate Programs',
}

export const VERTICAL_DESCRIPTIONS: Record<Vertical, string> = {
  'crypto-casinos': 'Slots, live dealer, and crypto-native originals games.',
  'sweepstakes-casinos': 'Dual-currency social casinos, accessible in most US states.',
  'crypto-sportsbooks': 'Sports betting platforms accepting BTC, ETH, and more.',
  'bitcoin-dice': 'Provably fair dice and instant-bet games.',
  'crypto-poker': 'Crypto-funded poker rooms, ring games, and tournaments.',
  'prediction-markets': 'Markets for betting on real-world outcomes with crypto.',
  vpns: 'Access geo-restricted crypto gambling platforms safely.',
  'affiliate-programs': 'Commission rates, cookie windows, and payout terms for creators.',
}

// Verticals included in the public-facing vertical nav / sitemap.
// The flagship affiliate-programs vertical is surfaced separately
// (homepage hero, header nav, footer) rather than in the standard grid.
export const PRIMARY_VERTICALS: Vertical[] = [
  'crypto-casinos',
  'sweepstakes-casinos',
  'crypto-sportsbooks',
  'bitcoin-dice',
  'crypto-poker',
  'prediction-markets',
  'vpns',
]

// All routable verticals, including the flagship affiliate-programs
// category. Use this for generateStaticParams on /[vertical] and the
// sitemap.
export const ALL_VERTICALS: Vertical[] = [...PRIMARY_VERTICALS, 'affiliate-programs']

export interface ListingAttribute {
  key: string
  value: string
  label: string | null
  display_order: number
}

export interface Listing {
  id: string
  name: string
  slug: string
  vertical: Vertical
  logo_url: string | null
  affiliate_url: string | null
  short_description: string | null
  long_description: string | null
  rating: number | null
  founded_year: number | null
  created_at: string
  updated_at: string
  listing_attributes?: ListingAttribute[]
}

export interface ComparisonPair {
  slug_a: string
  slug_b: string
  vertical: Vertical
  is_active: boolean
  updated_at: string
}

// Looks up a single attribute value by key from a listing's attribute array.
export function getAttr(listing: Listing, key: string): string | undefined {
  return listing.listing_attributes?.find((a) => a.key === key)?.value
}
