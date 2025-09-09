const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'bxybmggj',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || 'your-write-token-here',
  apiVersion: '2024-01-01'
});

const ourStoryContent = {
  _type: 'ourstory',
  _id: 'ourstory-page',
  heroSection: {
    title: 'Our Story',
    subtitle: 'Redefining Luxury Wellness in BC',
    backgroundImageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48008e7f401389f87a.jpeg'
  },
  passionSection: {
    title: 'A Passion for Wellness, Made Accessible',
    paragraph1: 'After years observing the sauna industry, we noticed something troubling: premium saunas were selling for over $40,000, putting the wellness benefits of regular sauna use out of reach for most Canadians. We believed there had to be a better way.',
    paragraph2: 'That belief drove us to reimagine what a luxury sauna company could be. By cutting out excessive markups and focusing on direct relationships with our customers, we\'ve created premium saunas that rival those costing three times as much.',
    quote: 'We provide an affordable luxury product that can be easily installed in a short time frame – bringing the transformative power of sauna wellness to more Canadian homes.'
  },
  builtInCanadaSection: {
    title: 'Built in Canada',
    paragraph1: 'Every Ilio sauna is proudly crafted in British Columbia using locally sourced Western Red Cedar and time-tested construction techniques.',
    paragraph2: 'We believe in supporting local artisans and maintaining the highest quality standards from forest to finish.',
    slideshowImages: [
      {
        imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e9d671d8e63bf298.jpeg',
        alt: 'Built in Canada 1'
      },
      {
        imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e916f4a1773c4544.jpeg',
        alt: 'Built in Canada 2'
      },
      {
        imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb487377cf367b8827bf.jpeg',
        alt: 'Built in Canada 3'
      },
      {
        imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg',
        alt: 'Built in Canada 4'
      },
      {
        imageUrl: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6deefde6fa237370e2.jpeg',
        alt: 'Built in Canada 5'
      }
    ]
  },
  craftsmanshipSection: {
    title: 'BC Craftsmanship Meets Scandinavian Tradition',
    description: 'Every Ilio sauna is meticulously crafted in British Columbia using locally sourced materials whenever possible. We combine West Coast craftsmanship with time-honored Scandinavian sauna traditions to create something truly special.',
    features: [
      {
        title: 'Premium Materials',
        description: 'Canadian red cedar and industry-leading heaters ensure durability and an authentic sauna experience.'
      },
      {
        title: 'Handcrafted Quality',
        description: 'Each unit is carefully built by skilled BC artisans – not mass-produced – ensuring exceptional attention to detail.'
      },
      {
        title: 'Modern Innovation',
        description: 'WiFi-controlled systems bring convenience to tradition, letting you start your sauna from anywhere.'
      }
    ]
  },
  valuesSection: {
    title: 'What We Stand For',
    paragraph1: 'At Ilio, we believe that wellness should be a daily ritual, not a luxury reserved for the few. We stand for quality without compromise, craftsmanship that honors tradition while embracing innovation, and transparency in everything we do.',
    paragraph2: 'Our commitment extends beyond delivering exceptional saunas. We\'re dedicated to educating our customers about the profound benefits of heat therapy, supporting sustainable forestry practices, and contributing to the wellness of our communities.',
    paragraph3: 'When you choose Ilio, you\'re not just investing in a sauna – you\'re joining a movement that believes wellness should be accessible, sustainable, and transformative for all Canadians.'
  },
  ctaSection: {
    title: 'Ready to Transform Your Wellness Journey?',
    description: 'Discover how an Ilio sauna can elevate your daily wellness routine',
    primaryButtonText: 'Explore Our Saunas',
    primaryButtonLink: '/saunas',
    secondaryButtonText: 'Get in Touch',
    secondaryButtonLink: '/contact'
  }
};

async function createOurStoryContent() {
  try {
    console.log('Creating Our Story content in Sanity...');
    
    // First, try to delete existing document if it exists
    try {
      await client.delete('ourstory-page');
      console.log('Deleted existing Our Story content');
    } catch (error) {
      console.log('No existing Our Story content to delete');
    }
    
    // Create the new document
    const result = await client.create(ourStoryContent);
    console.log('✅ Our Story content created successfully!');
    console.log('Document ID:', result._id);
    
    console.log('\n🎉 All sections populated:');
    console.log('- Hero Section');
    console.log('- Passion for Wellness Section');
    console.log('- Built in Canada Section (with 5 slideshow images)');
    console.log('- BC Craftsmanship Section (with 3 feature cards)');
    console.log('- What We Stand For Section');
    console.log('- Ready to Transform Section (CTA)');
    
  } catch (error) {
    console.error('❌ Error creating Our Story content:', error);
  }
}

createOurStoryContent();