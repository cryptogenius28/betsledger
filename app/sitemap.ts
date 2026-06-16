import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ALL_VERTICALS } from '@/types/database'
import { MODIFIER_VERTICAL_ALLOW } from '@/lib/modifiers'

const BASE_URL = 'https://betsledger.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()

  // 1. Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/compare`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/best`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/methodology`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/responsible-gambling`, changeFrequency: 'monthly', priority: 0.5 },
    ...ALL_VERTICALS.map((v) => ({
      url: `${BASE_URL}/${v}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ]

  // 2. Individual listing/review pages
  const { data: listings } = await supabase
    .from('listings')
    .select('vertical, slug, updated_at')

  const listingPages: MetadataRoute.Sitemap = (listings ?? []).map((l) => ({
    url: `${BASE_URL}/${l.vertical}/${l.slug}`,
    lastModified: l.updated_at ? new Date(l.updated_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 3. Comparison pages
  const { data: pairs } = await supabase
    .from('comparison_pairs')
    .select('slug_a, slug_b, updated_at')
    .eq('is_active', true)

  const comparisonPages: MetadataRoute.Sitemap = (pairs ?? []).map((p) => ({
    url: `${BASE_URL}/compare/${p.slug_a}-vs-${p.slug_b}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // 4. "Best X for Y" pages — all explicitly allowed vertical/modifier combos
  const bestForPages: MetadataRoute.Sitemap = Object.entries(MODIFIER_VERTICAL_ALLOW).flatMap(
    ([modifier, verticals]) =>
      verticals.map((vertical) => ({
        url: `${BASE_URL}/best/${vertical}/${modifier}`,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
  )

  return [...staticPages, ...listingPages, ...comparisonPages, ...bestForPages]
}
