import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(url && /^https?:\/\//.test(url) && key && !url.includes('tu-proyecto'))
export const supabase = isSupabaseConfigured ? createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' },
}) : null
