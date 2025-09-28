"use client";
import { createClient } from '@supabase/supabase-js';

// Browser Supabase client (uses public anon key only)
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    console.warn('Supabase env vars missing');
  }
  return createClient(url || '', anon || '');
}
