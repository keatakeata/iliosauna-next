// Re-export safe Supabase client and utilities
// This prevents API errors from cascading and breaking the application
export { 
  supabase, 
  syncUserWithSupabase, 
  safeSupabaseQuery,
  isSupabaseConfigured 
} from './supabase-safe'