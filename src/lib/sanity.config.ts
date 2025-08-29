// Sanity.io Configuration
// This is a temporary configuration using fetch API
// Will be replaced with official Sanity client when npm issues are resolved

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

// Helper function to build Sanity API URLs
export function buildSanityUrl(query: string) {
  const { projectId, dataset, apiVersion } = sanityConfig;
  const encodedQuery = encodeURIComponent(query);
  return `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodedQuery}`;
}

// Fetch data from Sanity using GROQ query
export async function fetchFromSanity(query: string) {
  try {
    const url = buildSanityUrl(query);
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    throw error;
  }
}

// Image URL builder
export function sanityImageUrl(imageRef: string, width?: number) {
  const { projectId, dataset } = sanityConfig;
  const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageRef}`;
  
  if (width) {
    return `${baseUrl}?w=${width}&auto=format`;
  }
  
  return `${baseUrl}?auto=format`;
}