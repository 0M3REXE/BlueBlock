import { createClient } from '@supabase/supabase-js';

// Basic server client (stateless). For auth session management you'll later
// integrate cookies or RLS impersonation via service key on server actions.
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Supabase env vars missing');
  }
  return createClient(url, anon, { auth: { persistSession: false } });
}
