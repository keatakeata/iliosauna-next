import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bxybmggj',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
})

try {
  console.log('🔍 Fetching OUR STORY content structure...')
  const query = `*[_type == "ourstory"] | order(_updatedAt desc) [0] {
    _id,
    _type,
    heroSection,
    passionSection,
    builtInCanadaSection,
    craftsmanshipSection,
    valuesSection,
    ctaSection
  }`

  const data = await client.fetch(query)

  if (data) {
    console.log('✅ Document found!')
    console.log('🎯 ID:', data._id)
    console.log('📝 Type:', data._type)

    console.log('\n=== FIELDS ANALYSIS ===')
    Object.keys(data).forEach(key => {
      if (key.startsWith('_')) return

      const value = data[key]
      const type = typeof value
      console.log(`📋 ${key}: ${type}`, type === 'object' ? (Array.isArray(value) ? '[Array]' : '{Object}') : value)
    })

    console.log('\n=== NESTED STRUCTURE ===')
    console.log('heroSection:', JSON.stringify(data.heroSection, null, 2))
  } else {
    console.log('❌ No document found')
    console.log('🔧 May need to import content first')
  }
} catch (error) {
  console.error('❌ Error:', error.message)
}
