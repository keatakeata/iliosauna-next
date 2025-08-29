import { createClient } from '@supabase/supabase-js'

// Safe wrapper for Supabase operations with comprehensive error handling
// This prevents API errors from cascading and breaking the entire application

// Check if environment variables are properly set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a safe client that won't crash if credentials are missing
let supabaseClient: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Don't persist session since we use Clerk
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'x-application-name': 'iliosauna'
        }
      }
    })
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    supabaseClient = null
  }
}

// Export a safe proxy that handles errors gracefully
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!supabaseClient) {
      console.warn(`Supabase client not initialized. Skipping ${String(prop)} operation.`)
      // Return a mock object that doesn't break the app
      return () => ({
        from: () => ({
          select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
            select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
            order: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
          })
        })
      })
    }
    return supabaseClient[prop as keyof typeof supabaseClient]
  }
})

// Safe user sync function with comprehensive error handling
export async function syncUserWithSupabase(clerkUser: any) {
  if (!clerkUser) {
    console.debug('No Clerk user provided for sync')
    return null
  }
  
  // Check if Supabase is properly configured
  if (!supabaseUrl || !supabaseAnonKey || !supabaseClient) {
    console.warn('Supabase not configured - skipping user sync')
    return null
  }
  
  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Supabase request timeout')), 10000)
    )
    
    // Check if user exists in our database
    const existingUserPromise = supabaseClient
      .from('customers')
      .select('*')
      .eq('clerk_user_id', clerkUser.id)
      .single()
    
    const { data: existingUser, error: fetchError } = await Promise.race([
      existingUserPromise,
      timeoutPromise
    ]) as any
    
    // If user exists, return it
    if (existingUser) {
      return existingUser
    }
    
    // If fetch error is not "no rows", log it
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError.message)
      return null
    }
    
    // Create new customer profile with safe defaults
    const newUserData = {
      clerk_user_id: clerkUser.id,
      email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
      first_name: clerkUser.firstName || '',
      last_name: clerkUser.lastName || '',
      created_at: new Date().toISOString()
    }
    
    const createUserPromise = supabaseClient
      .from('customers')
      .insert(newUserData)
      .select()
      .single()
    
    const { data: newUser, error: createError } = await Promise.race([
      createUserPromise,
      timeoutPromise
    ]) as any
    
    if (createError) {
      // Handle duplicate key error gracefully
      if (createError.code === '23505') {
        console.debug('User already exists, fetching existing record')
        const { data: existingUser } = await supabaseClient
          .from('customers')
          .select('*')
          .eq('clerk_user_id', clerkUser.id)
          .single()
        return existingUser
      }
      // Handle RLS policy errors silently - this is expected if policies are not configured
      if (createError.message?.includes('row-level security policy')) {
        console.debug('RLS policy prevents user creation - this is expected without proper Supabase setup')
        // Return a mock user object so the app continues to work
        return {
          id: clerkUser.id,
          clerk_user_id: clerkUser.id,
          email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          created_at: new Date().toISOString()
        }
      }
      console.debug('Could not sync user with Supabase:', createError.message)
      return null
    }
    
    return newUser
  } catch (error: any) {
    // Catch all errors including timeouts
    if (error?.message === 'Supabase request timeout') {
      console.error('Supabase request timed out - service may be unavailable')
    } else {
      console.error('Error syncing user with Supabase:', error?.message || error)
    }
    return null
  }
}

// Safe query wrapper with error boundaries
export async function safeSupabaseQuery<T = any>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  if (!supabaseClient) {
    return { 
      data: null, 
      error: new Error('Supabase client not initialized') 
    }
  }
  
  try {
    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) => 
      setTimeout(() => resolve({ 
        data: null, 
        error: new Error('Query timeout - Supabase may be unavailable') 
      }), 15000)
    )
    
    const result = await Promise.race([queryFn(), timeoutPromise])
    return result
  } catch (error: any) {
    console.error('Supabase query error:', error)
    return { 
      data: null, 
      error: error 
    }
  }
}

// Check if Supabase is available
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseClient)
}