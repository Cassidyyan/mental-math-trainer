import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../database.types'

// Client-side Supabase client (use in components)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
