const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'bxybmggj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

const sampleBlogPosts = [
  {
    _type: 'blogPost',
    title: 'The Science Behind Sauna Therapy: Health Benefits Explained',
    slug: { current: 'science-behind-sauna-therapy' },
    excerpt: 'Discover the scientifically-proven health benefits of regular sauna use, from cardiovascular improvements to stress reduction and enhanced recovery.',
    publishedAt: new Date('2024-01-15').toISOString(),
    featured: true,
    readingTime: 8,
    tags: ['health', 'wellness', 'science', 'therapy'],
    body: [
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'Introduction to Sauna Therapy' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'For centuries, cultures around the world have recognized the therapeutic power of heat therapy. Modern science now confirms what traditional wisdom has long known: regular sauna use offers profound health benefits that extend far beyond simple relaxation.' }]
      },
      {
        _type: 'block',
        style: 'h3',
        children: [{ _type: 'span', text: 'Cardiovascular Benefits' }]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Studies show that regular sauna bathing can reduce the risk of cardiovascular disease by up to 50%. The heat exposure improves circulation, reduces blood pressure, and enhances arterial compliance.' }]
      }
    ]
  },
  {
    _type: 'blogPost',
    title: 'Designing Your Perfect Home Sauna: A Complete Guide',
    slug: { current: 'designing-perfect-home-sauna' },
    excerpt: 'From choosing the right wood to optimizing layout and ventilation, learn everything you need to create your ideal home sauna sanctuary.',
    publishedAt: new Date('2024-01-20').toISOString(),
    featured: false,
    readingTime: 12,
    tags: ['design', 'home-improvement', 'cedar', 'installation'],
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Creating a home sauna is more than just a renovation project—it\'s an investment in your wellness and lifestyle. This comprehensive guide will walk you through every aspect of designing a sauna that perfectly suits your needs and space.' }]
      }
    ]
  },
  {
    _type: 'blogPost',
    title: 'Cedar vs. Other Woods: Why We Choose Canadian Red Cedar',
    slug: { current: 'cedar-vs-other-woods' },
    excerpt: 'Explore why Canadian Red Cedar remains the gold standard for premium saunas, offering unmatched durability, aroma, and therapeutic properties.',
    publishedAt: new Date('2024-01-25').toISOString(),
    featured: false,
    readingTime: 6,
    tags: ['materials', 'cedar', 'quality', 'craftsmanship'],
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'When it comes to sauna construction, the choice of wood is paramount. While various woods can be used, Canadian Red Cedar stands apart for its exceptional properties that make it ideal for the sauna environment.' }]
      }
    ]
  },
  {
    _type: 'blogPost',
    title: 'The Finnish Sauna Tradition: Lessons for Modern Wellness',
    slug: { current: 'finnish-sauna-tradition' },
    excerpt: 'Learn from centuries of Finnish sauna culture and discover how to incorporate authentic traditions into your modern wellness routine.',
    publishedAt: new Date('2024-02-01').toISOString(),
    featured: true,
    readingTime: 10,
    tags: ['culture', 'finland', 'tradition', 'wellness'],
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'In Finland, the sauna is more than a luxury—it\'s a way of life. With over 3 million saunas for a population of 5.5 million, Finland offers valuable insights into the art of sauna bathing.' }]
      }
    ]
  },
  {
    _type: 'blogPost',
    title: 'Sauna Maintenance 101: Keeping Your Investment Pristine',
    slug: { current: 'sauna-maintenance-guide' },
    excerpt: 'Essential tips and best practices for maintaining your cedar sauna, ensuring longevity and optimal performance for years to come.',
    publishedAt: new Date('2024-02-05').toISOString(),
    featured: false,
    readingTime: 7,
    tags: ['maintenance', 'care', 'tips', 'longevity'],
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Proper maintenance is key to preserving the beauty and functionality of your cedar sauna. With the right care routine, your sauna will provide decades of therapeutic enjoyment.' }]
      }
    ]
  }
];

// Create categories first
const categories = [
  {
    _type: 'category',
    title: 'Wellness',
    slug: { current: 'wellness' },
    color: '#9B8B7E',
    order: 1
  },
  {
    _type: 'category',
    title: 'Design',
    slug: { current: 'design' },
    color: '#8B5A3C',
    order: 2
  },
  {
    _type: 'category',
    title: 'Materials',
    slug: { current: 'materials' },
    color: '#B08D57',
    order: 3
  },
  {
    _type: 'category',
    title: 'Culture',
    slug: { current: 'culture' },
    color: '#4A4A4A',
    order: 4
  }
];

// Create author
const author = {
  _type: 'author',
  name: 'Ilio Sauna Team',
  slug: { current: 'ilio-team' },
  bio: 'Expert craftsmen and wellness enthusiasts dedicated to bringing premium sauna experiences to your home.'
};

async function createSampleContent() {
  try {
    console.log('Creating author...');
    const createdAuthor = await client.create(author);
    console.log('✓ Author created:', createdAuthor.name);

    console.log('\nCreating categories...');
    const createdCategories = [];
    for (const category of categories) {
      const created = await client.create(category);
      createdCategories.push(created);
      console.log('✓ Category created:', created.title);
    }

    console.log('\nCreating blog posts...');
    for (const post of sampleBlogPosts) {
      // Assign author and random categories
      post.author = { _type: 'reference', _ref: createdAuthor._id };
      
      // Assign 1-2 random categories to each post
      const numCategories = Math.floor(Math.random() * 2) + 1;
      const selectedCategories = [];
      for (let i = 0; i < numCategories; i++) {
        const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
        if (!selectedCategories.find(c => c._ref === randomCategory._id)) {
          selectedCategories.push({ _type: 'reference', _ref: randomCategory._id });
        }
      }
      post.categories = selectedCategories;

      const created = await client.create(post);
      console.log('✓ Blog post created:', created.title);
    }

    console.log('\n✅ All sample content created successfully!');
    console.log('Visit your Sanity Studio to see the new content.');
  } catch (error) {
    console.error('Error creating content:', error);
    console.log('\nNote: You may need to set up a SANITY_API_TOKEN environment variable');
    console.log('Get your token from: https://www.sanity.io/manage/project/bxybmggj/api');
  }
}

createSampleContent();