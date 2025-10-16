import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'bxybmggj',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export async function getSaunasPageData() {
  const query = `*[_type == "saunaspage"][0]{
    _id,
    section1,
    section2,
    section3,
    section4{
      title,
      subtitle,
      features[]{
        _key,
        id,
        title,
        description,
        cardImageUrl,
        modalContent{
          award,
          title,
          subtitle,
          awardText,
          mainImageUrl,
          gallery[]{
            _key,
            imageUrl,
            alt
          },
          contentSections[]{
            _key,
            _type,
            ...
          }
        }
      }
    },
    section5,
    section6
  }`;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching Saunas page data:', error);
    return null;
  }
}
