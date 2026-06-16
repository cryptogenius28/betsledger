import type { ListingAttribute } from '@/types/database'

export const BOOLEAN_ATTRIBUTE_KEYS = new Set([
  'provably_fair',
  'live_betting',
  'parlay_support',
  'no_purchase_amoe_available',
  'kyc_required',
  'no_logs_policy',
  'crypto_payment_accepted',
])

export interface FormattedAttribute {
  text: string
  verified: boolean
}

// Formats a raw listing_attributes row for display. Handles booleans
// (rendered as Yes/No, with "Yes" treated as a positive/verified signal)
// and the state_restrictions key (rendered as a count + state list).
export function formatAttributeValue(attr: ListingAttribute): FormattedAttribute {
  if (BOOLEAN_ATTRIBUTE_KEYS.has(attr.key)) {
    const isTrue = attr.value.toLowerCase() === 'true'
    return { text: isTrue ? 'Yes' : 'No', verified: isTrue }
  }

  if (attr.key === 'state_restrictions') {
    const states = attr.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    return { text: `Unavailable in ${states.length} states`, verified: false }
  }

  return { text: attr.value, verified: false }
}

// ---------------------------------------------------------------------
// Compare-page winner logic
// ---------------------------------------------------------------------

// Numeric attribute keys where a higher value is better.
export const HIGHER_IS_BETTER_KEYS = new Set([
  'rating',
  'ease_of_use_score',
  'security_score',
  'game_count',
  'server_count',
  'speed_rating',
])

// Numeric attribute keys where a lower value is better.
export const LOWER_IS_BETTER_KEYS = new Set(['withdrawal_speed_minutes', 'price_monthly'])

export type ComparisonWinner = 'a' | 'b' | 'tie' | null

// Determines which of two values for a given attribute key "wins" a
// head-to-head comparison. Returns null when the key isn't a type we
// know how to compare (free-text fields are shown side by side with no
// winner highlighted).
export function compareAttributeWinner(
  key: string,
  valueA: string | undefined,
  valueB: string | undefined
): ComparisonWinner {
  if (valueA === undefined || valueB === undefined) return null

  if (BOOLEAN_ATTRIBUTE_KEYS.has(key)) {
    const a = valueA.toLowerCase() === 'true'
    const b = valueB.toLowerCase() === 'true'
    if (a === b) return 'tie'
    return a ? 'a' : 'b'
  }

  if (HIGHER_IS_BETTER_KEYS.has(key) || LOWER_IS_BETTER_KEYS.has(key)) {
    const numA = parseFloat(valueA)
    const numB = parseFloat(valueB)
    if (Number.isNaN(numA) || Number.isNaN(numB)) return null
    if (numA === numB) return 'tie'
    const aWins = LOWER_IS_BETTER_KEYS.has(key) ? numA < numB : numA > numB
    return aWins ? 'a' : 'b'
  }

  return null
}
