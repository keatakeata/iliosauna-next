import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bxybmggj'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

// Client for fetching data in the app
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for better performance
  perspective: 'published',
  stega: false,
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Helper function for fetching data with proper typing and timeout
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
  allowInDev = false,
}: {
  query: string
  params?: any
  tags?: string[]
  allowInDev?: boolean
}): Promise<QueryResponse | null> {
  try {
    // For critical pages like Journal, always try to fetch
    if (allowInDev || process.env.NODE_ENV === 'production') {
      const result = await client.fetch<QueryResponse>(query, params, {
        next: {
          revalidate: 60, // Cache for 1 minute
          tags,
        },
      });
      
      return result;
    }
    
    console.log('Skipping Sanity fetch in development');
    return null as QueryResponse;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    // Return null instead of throwing to prevent page crashes
    return null as QueryResponse;
  }
}