import type { Listing } from '@/types/database'

interface AffiliateCTAProps {
  listing: Listing
  label: string
}

export default function AffiliateCTA({ listing, label }: AffiliateCTAProps) {
  if (!listing.affiliate_url) return null

  return (
    <a
      href={listing.affiliate_url}
      className="affiliate-cta"
      target="_blank"
      rel="nofollow sponsored noopener"
    >
      {label} →
    </a>
  )
}
