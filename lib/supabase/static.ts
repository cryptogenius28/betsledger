import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Used only in generateStaticParams (and other build-time-only contexts).
// Unlike lib/supabase/server.ts, this does NOT touch next/headers' cookies(),
// which throws when called outside an active request — exactly the
// situation generateStaticParams runs in during `next build`.
// Safe here because these are always public, anonymous, read-only queries.
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
