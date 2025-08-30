const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'bxybmggj',
  dataset: 'production',
  useCdn: false,
  token: 'skPU0antdEBikgAsYVPMU3jJhTTb7UOuN2v4Ljv6xToh8OFdR34e1fsTbDnnFFgQJMFFNuRZQgP2mF9h2ywjbBD46aeG9FsRmGiKJDqcrqZgObXo8l9COlnJaWydC5LwnIX5qgKfk0oHb82QO0VcXCRm4kKLnbtqXgygq4wH3jzy3BQTmc0v',
  apiVersion: '2024-01-01'
});

async function createBlogPost() {
  try {
    const doc = {
      _type: 'blogPost',
      title: 'Welcome to Ilio Sauna Blog',
      slug: {
        _type: 'slug',
        current: 'welcome-to-ilio-sauna-blog'
      },
      excerpt: 'Discover the world of luxury saunas and wellness. Learn about the health benefits, design tips, and maintenance guides for your personal sauna.',
      publishedAt: new Date().toISOString(),
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Welcome to the Ilio Sauna blog! We are excited to share our passion for wellness and luxury outdoor living with you.'
            }
          ]
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Why Choose a Sauna?'
            }
          ]
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Saunas have been proven to provide numerous health benefits including improved cardiovascular health, stress relief, and better sleep quality.'
            }
          ]
        }
      ]
    };

    const result = await client.create(doc);
    console.log('Blog post created successfully!');
    console.log('ID:', result._id);
    console.log('View at: http://localhost:4448/journal');
  } catch (error) {
    console.error('Error creating blog post:', error);
  }
}

createBlogPost();