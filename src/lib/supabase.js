import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Flag to check if credentials are set
export const isSupabaseConfigured = !!(supabaseUrl.trim() && supabaseAnonKey.trim());

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase configuration is missing. " +
    "Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
  );
}

// Export the supabase client instance (or a graceful fallback mock)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured.') }),
          eq: () => Promise.resolve({ data: [], error: new Error('Supabase not configured.') }),
          or: () => Promise.resolve({ data: [], error: new Error('Supabase not configured.') })
        }),
        insert: () => Promise.resolve({ data: [], error: new Error('Supabase not configured.') }),
        update: () => ({
          eq: () => Promise.resolve({ data: [], error: new Error('Supabase not configured.') })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: [], error: new Error('Supabase not configured.') })
        })
      }),
      auth: {
        signInWithPassword: () => Promise.resolve({ data: {}, error: new Error('Supabase not configured.') }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => {
          return {
            data: { subscription: { unsubscribe: () => {} } }
          };
        },
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      }
    };
