import type { Vertical } from '@/types/database'

export interface ModifierConfig {
  label: string
  filterAttr?: string
  filterValue?: string
  sortAttr: string
  sortDir: 'asc' | 'desc'
}

// ---------------------------------------------------------------------
// Modifiers — each one maps to a "Best X for Y" keyword angle.
// Add new modifiers here as you discover keyword opportunities; the
// sitemap and page template pick them up automatically.
// ---------------------------------------------------------------------
export const MODIFIER_CONFIG: Record<string, ModifierConfig> = {
  beginners: {
    label: 'Beginners',
    sortAttr: 'ease_of_use_score',
    sortDir: 'desc',
  },
  'high-rollers': {
    label: 'High Rollers',
    sortAttr: 'rating',
    sortDir: 'desc',
  },
  'fast-withdrawals': {
    label: 'Fast Withdrawals',
    sortAttr: 'withdrawal_speed_minutes',
    sortDir: 'asc',
  },
  'provably-fair': {
    label: 'Provably Fair Games',
    filterAttr: 'provably_fair',
    filterValue: 'true',
    sortAttr: 'rating',
    sortDir: 'desc',
  },
  bitcoin: {
    label: 'Bitcoin',
    filterAttr: 'supported_cryptocurrencies',
    filterValue: 'BTC',
    sortAttr: 'rating',
    sortDir: 'desc',
  },
  ethereum: {
    label: 'Ethereum',
    filterAttr: 'supported_cryptocurrencies',
    filterValue: 'ETH',
    sortAttr: 'rating',
    sortDir: 'desc',
  },
  'us-players': {
    label: 'US Players',
    filterAttr: 'dual_currency_model',
    filterValue: '',
    sortAttr: 'ease_of_use_score',
    sortDir: 'desc',
  },
  'live-betting': {
    label: 'Live Betting',
    filterAttr: 'live_betting',
    filterValue: 'true',
    sortAttr: 'rating',
    sortDir: 'desc',
  },
  'no-kyc': {
    label: 'No KYC',
    filterAttr: 'kyc_required',
    filterValue: 'false',
    sortAttr: 'rating',
    sortDir: 'desc',
  },
  'low-house-edge': {
    label: 'Low House Edge',
    sortAttr: 'house_edge',
    sortDir: 'asc',
  },
  'high-rakeback': {
    label: 'High Rakeback',
    sortAttr: 'rakeback',
    sortDir: 'desc',
  },
  'crypto-payment': {
    label: 'Crypto Payment',
    filterAttr: 'crypto_payment_accepted',
    filterValue: 'true',
    sortAttr: 'speed_rating',
    sortDir: 'desc',
  },
  'revenue-share': {
    label: 'Revenue Share',
    filterAttr: 'commission_type',
    filterValue: 'Revenue Share',
    sortAttr: 'rating',
    sortDir: 'desc',
  },
}

// Verticals where a given modifier makes semantic sense.
// Entries not in this map fall through to notFound() at build time.
export const MODIFIER_VERTICAL_ALLOW: Record<string, Vertical[]> = {
  beginners: ['crypto-casinos', 'sweepstakes-casinos', 'crypto-sportsbooks'],
  'high-rollers': ['crypto-casinos', 'crypto-poker', 'crypto-sportsbooks'],
  'fast-withdrawals': ['crypto-casinos', 'crypto-sportsbooks', 'crypto-poker'],
  'provably-fair': ['crypto-casinos', 'bitcoin-dice'],
  bitcoin: ['crypto-casinos', 'crypto-sportsbooks', 'crypto-poker', 'prediction-markets'],
  ethereum: ['crypto-casinos', 'crypto-sportsbooks', 'crypto-poker', 'prediction-markets'],
  'us-players': ['sweepstakes-casinos'],
  'live-betting': ['crypto-sportsbooks'],
  'no-kyc': ['crypto-casinos', 'bitcoin-dice'],
  'low-house-edge': ['bitcoin-dice'],
  'high-rakeback': ['crypto-poker'],
  'crypto-payment': ['vpns'],
  'revenue-share': ['affiliate-programs'],
}
