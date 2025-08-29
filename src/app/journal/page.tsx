'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client setup
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2024-01-01'
});

const builder = imageUrlBuilder(sanityClient);

function urlFor(source: any) {
  return builder.image(source);
}

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  mainImage: any;
  categories: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    color?: string;
  }>;
  tags: string[];
  author: {
    name: string;
    slug: { current: string };
    image?: any;
  };
  readingTime?: number;
  featured?: boolean;
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  color?: string;
  postCount?: number;
}

export default function JournalPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Fetch blog posts from Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const postsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          excerpt,
          publishedAt,
          mainImage,
          tags,
          featured,
          readingTime,
          categories[]->{
            _id,
            title,
            slug,
            color
          },
          author->{
            name,
            slug,
            image
          }
        }`;
        
        // Fetch categories
        const categoriesQuery = `*[_type == "category"] | order(order asc) {
          _id,
          title,
          slug,
          color,
          "postCount": count(*[_type == "blogPost" && references(^._id)])
        }`;
        
        const [postsData, categoriesData] = await Promise.all([
          sanityClient.fetch(postsQuery),
          sanityClient.fetch(categoriesQuery)
        ]);
        
        setPosts(postsData);
        setFilteredPosts(postsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setLoading(false);
        // Use fallback static data if Sanity fails
        const fallbackPosts = [
          {
            _id: '1',
            title: "The Science Behind Infrared Saunas",
            slug: { current: "science-behind-infrared-saunas" },
            excerpt: "Discover the proven health benefits of regular sauna use, from improved cardiovascular health to enhanced recovery.",
            publishedAt: "2024-12-15",
            categories: [{ _id: '1', title: 'Health', slug: { current: 'health' }, color: '#4CAF50' }],
            tags: ['wellness', 'health', 'science'],
            author: { name: 'Dr. Sarah Mitchell', slug: { current: 'sarah-mitchell' } },
            readingTime: 5,
            mainImage: null
          },
          {
            _id: '2',
            title: "Designing Your Backyard Wellness Retreat",
            slug: { current: "designing-backyard-wellness-retreat" },
            excerpt: "Transform your outdoor space into a personal sanctuary with thoughtful design and strategic placement.",
            publishedAt: "2024-12-10",
            categories: [{ _id: '2', title: 'Design', slug: { current: 'design' }, color: '#9B8B7E' }],
            tags: ['design', 'backyard', 'installation'],
            author: { name: 'Alex Chen', slug: { current: 'alex-chen' } },
            readingTime: 7,
            mainImage: null
          },
          {
            _id: '3',
            title: "Sauna Maintenance: A Complete Guide",
            slug: { current: "sauna-maintenance-complete-guide" },
            excerpt: "Keep your Ilio sauna in pristine condition with our comprehensive maintenance tips and seasonal care guide.",
            publishedAt: "2024-12-05",
            categories: [{ _id: '3', title: 'Technical', slug: { current: 'technical' }, color: '#FF9800' }],
            tags: ['maintenance', 'care', 'technical'],
            author: { name: 'Mike Johnson', slug: { current: 'mike-johnson' } },
            readingTime: 10,
            mainImage: null
          }
        ];
        setPosts(fallbackPosts as any);
        setFilteredPosts(fallbackPosts as any);
        setCategories([
          { _id: '1', title: 'Health', slug: { current: 'health' }, color: '#4CAF50', postCount: 1 },
          { _id: '2', title: 'Design', slug: { current: 'design' }, color: '#9B8B7E', postCount: 1 },
          { _id: '3', title: 'Technical', slug: { current: 'technical' }, color: '#FF9800', postCount: 1 }
        ]);
      }
    };
    
    fetchData();
    
    // Trigger animations
    const timer = setTimeout(() => setPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Filter posts based on search, category, and tags
  useEffect(() => {
    let filtered = [...posts];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post =>
        post.categories?.some(cat => cat.slug.current === selectedCategory)
      );
    }
    
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags?.includes(selectedTag)
      );
    }
    
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, selectedTag, posts]);

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar animated={true} />
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        height: '60vh',
        minHeight: '400px',
        backgroundImage: `url('https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48eefde667db736f79.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.3) 100%)',
          zIndex: 1
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          color: '#FFFFFF',
          maxWidth: '900px',
          padding: '0 2rem'
        }}>
          <h1 style={{
            opacity: pageLoaded ? 1 : 0,
            transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 100,
            letterSpacing: '0.1em',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            color: 'white'
          }}>
            Wellness Journal
          </h1>
          <p style={{
            opacity: pageLoaded ? 1 : 0,
            transform: pageLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1s ease-out 1.05s, transform 1s ease-out 1.05s',
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: 100,
            letterSpacing: '0.2em',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
            color: 'white'
          }}>
            Insights on sauna wellness, design, and lifestyle
          </p>
        </div>
      </section>
      
      {/* Search and Filter Section */}
      <section style={{ background: '#f8f8f8', padding: '40px 0' }}>
        <div className="ilio-container">
          {/* Search Bar */}
          <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            <input
              type="text"
              placeholder="Search articles, topics, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '50px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#9B8B7E'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
            />
          </div>
          
          {/* Category Filters */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '0.5rem 1.5rem',
                border: 'none',
                borderRadius: '25px',
                backgroundColor: selectedCategory === 'all' ? '#9B8B7E' : 'white',
                color: selectedCategory === 'all' ? 'white' : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem'
              }}
            >
              All Posts ({posts.length})
            </button>
            {categories.map(category => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.slug.current)}
                style={{
                  padding: '0.5rem 1.5rem',
                  border: 'none',
                  borderRadius: '25px',
                  backgroundColor: selectedCategory === category.slug.current 
                    ? (category.color || '#9B8B7E') 
                    : 'white',
                  color: selectedCategory === category.slug.current ? 'white' : '#666',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95rem'
                }}
              >
                {category.title} ({category.postCount || 0})
              </button>
            ))}
          </div>
          
          {/* Tags Cloud */}
          {allTags.length > 0 && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', color: '#666' }}>Popular Tags:</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {allTags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: selectedTag === tag ? '#9B8B7E' : '#f0f0f0',
                      color: selectedTag === tag ? 'white' : '#666',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section style={{ background: 'white', padding: '60px 0', flex: 1 }}>
        <div className="ilio-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No articles found matching your criteria.</p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {filteredPosts.filter(post => post.featured).length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem', color: '#333' }}>
                    Featured Articles
                  </h2>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                    gap: '2rem'
                  }}>
                    {filteredPosts.filter(post => post.featured).map(post => (
                      <Link 
                        key={post._id} 
                        href={`/journal/${post.slug.current}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <article style={{
                          background: 'white',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer',
                          border: '2px solid #9B8B7E'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                        }}
                        >
                          {post.mainImage && (
                            <div style={{ 
                              position: 'relative',
                              paddingBottom: '50%',
                              overflow: 'hidden'
                            }}>
                              <img 
                                src={urlFor(post.mainImage).width(800).height(400).url()}
                                alt={post.mainImage.alt || post.title}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          )}
                          <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                              {post.categories?.map(category => (
                                <span key={category._id} style={{
                                  padding: '0.25rem 0.75rem',
                                  backgroundColor: category.color || '#f8f8f8',
                                  color: category.color ? 'white' : '#666',
                                  borderRadius: '4px',
                                  fontSize: '0.85rem'
                                }}>
                                  {category.title}
                                </span>
                              ))}
                            </div>
                            <h3 style={{ 
                              fontSize: '1.5rem',
                              fontWeight: 300,
                              marginBottom: '0.75rem',
                              color: '#333'
                            }}>
                              {post.title}
                            </h3>
                            <p style={{
                              color: '#666',
                              lineHeight: '1.6',
                              marginBottom: '1rem'
                            }}>
                              {post.excerpt}
                            </p>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.875rem',
                              color: '#999'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {post.author?.image && (
                                  <img 
                                    src={urlFor(post.author.image).width(30).height(30).url()}
                                    alt={post.author.name}
                                    style={{ 
                                      width: '30px', 
                                      height: '30px', 
                                      borderRadius: '50%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                )}
                                <span>{post.author?.name}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '1rem' }}>
                                {post.readingTime && (
                                  <span>{post.readingTime} min read</span>
                                )}
                                <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Regular Posts */}
              <div>
                {filteredPosts.filter(post => !post.featured).length > 0 && (
                  <h2 style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: 300, 
                    marginBottom: '2rem', 
                    color: '#333' 
                  }}>
                    {filteredPosts.filter(post => post.featured).length > 0 ? 'Recent Articles' : 'All Articles'}
                  </h2>
                )}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '2rem'
                }}>
                  {filteredPosts.filter(post => !post.featured).map(post => (
                    <Link 
                      key={post._id} 
                      href={`/journal/${post.slug.current}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <article style={{
                        background: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
                      }}
                      >
                        {post.mainImage && (
                          <div style={{ 
                            position: 'relative',
                            paddingBottom: '60%',
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={urlFor(post.mainImage).width(600).height(360).url()}
                              alt={post.mainImage.alt || post.title}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        )}
                        <div style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {post.categories?.map(category => (
                              <span key={category._id} style={{
                                padding: '0.2rem 0.6rem',
                                backgroundColor: category.color ? `${category.color}20` : '#f8f8f8',
                                color: category.color || '#9B8B7E',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                              }}>
                                {category.title}
                              </span>
                            ))}
                          </div>
                          <h3 style={{ 
                            fontSize: '1.25rem',
                            fontWeight: 300,
                            marginBottom: '0.5rem',
                            color: '#333'
                          }}>
                            {post.title}
                          </h3>
                          <p style={{
                            color: '#666',
                            lineHeight: '1.5',
                            marginBottom: '1rem',
                            fontSize: '0.95rem'
                          }}>
                            {post.excerpt}
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            color: '#999'
                          }}>
                            <span>{post.author?.name}</span>
                            <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}