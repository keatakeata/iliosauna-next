'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Temporarily disabled motion for React 19 compatibility
// import { motion, div } from 'motion/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExpandableSearch from '@/components/ExpandableSearch';

// Helper function to build Sanity image URLs
function getImageUrl(image: any, width: number, height: number): string {
  if (!image?.asset?._ref) {
    return `https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=${width}&h=${height}&fit=crop`;
  }
  
  const projectId = 'bxybmggj';
  const dataset = 'production';
  const ref = image.asset._ref;
  const [_file, id, dimensions, format] = ref.split('-');
  const [w, h] = dimensions.split('x');
  
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=${width}&h=${height}&fit=crop`;
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

// BUILD FIX: Removed conflicting force-dynamic export for React 19 compatibility

export default function JournalPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Page load animation and mobile detection
  useEffect(() => {
    // Page view tracking removed (analytics disabled)
    console.log('Journal page loaded');
    
    // Trigger animations
    const timer = setTimeout(() => setPageLoaded(true), 50);
    
    // Detect mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch from our API route which handles server-side Sanity fetching
        const response = await fetch('/api/blog/posts');
        const data = await response.json();
        
        const postsData = data.posts;
        const categoriesData = data.categories;

        // If we have real posts from Sanity, use them
        if (postsData && postsData.length > 0) {
          console.log('✅ Loaded', postsData.length, 'real blog posts from Sanity');
          setPosts(postsData);
          setFilteredPosts(postsData);
        } else {
          console.log('📝 No blog posts found in Sanity yet');
          setPosts([]);
          setFilteredPosts([]);
        }

        // Set categories if available
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          // Default categories if none exist
          setCategories([
            { _id: 'wellness', title: 'Wellness', slug: { current: 'wellness' }, color: '#9B8B7E', postCount: 0 },
            { _id: 'design', title: 'Design', slug: { current: 'design' }, color: '#8B5A3C', postCount: 0 },
            { _id: 'maintenance', title: 'Maintenance', slug: { current: 'maintenance' }, color: '#B08D57', postCount: 0 }
          ]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter posts based on search, category, and tags
  useEffect(() => {
    let filtered = [...posts];
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        (post.author?.name && post.author.name.toLowerCase().includes(searchLower))
      );
      
      // Track search (analytics disabled)
      console.log('Blog search:', searchTerm, 'Results:', filtered.length);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post =>
        post.categories?.some(cat => {
          // Handle malformed slugs by cleaning them first
          const slugValue = cat.slug.current;
          const cleanSlug = slugValue.split(/[A-Z]/)[0] || slugValue;
          return cleanSlug === selectedCategory || slugValue.startsWith(selectedCategory);
        })
      );
      
      // Track category filter (analytics disabled)
      console.log('Blog category filter:', selectedCategory, 'Results:', filtered.length);
    }
    
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags?.includes(selectedTag)
      );
      
      // Track tag filter (analytics disabled)
      console.log('Blog tag filter:', selectedTag, 'Results:', filtered.length);
    }
    
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, selectedTag, posts]);

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  const handlePostClick = useCallback((post: BlogPost) => {
    // Track post click (analytics disabled)
    console.log('Blog post clicked:', post.title, post.slug.current);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  }, [selectedTag]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('');
  }, []);

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
        backgroundPosition: isMobile ? '80% center' : 'center',
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
      <section style={{ background: '#f8f8f8', padding: '20px 0' }}>
        <div className="ilio-container">
          <div
            style={{ opacity: pageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
          >
            {/* Search Bar and Filters Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* Search Component */}
              <ExpandableSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search articles"
              />
              
              {/* Category Filter Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => handleCategorySelect('all')}
                  className="category-button"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: selectedCategory === 'all' ? '#9B8B7E' : 'rgba(155, 139, 126, 0.1)',
                    color: selectedCategory === 'all' ? 'white' : '#9B8B7E',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    border: selectedCategory === 'all' ? 'none' : '1px solid rgba(155, 139, 126, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: selectedCategory === 'all' ? '500' : '400'
                  }}
                >
                  All Posts {loading ? '' : `(${posts.length})`}
                </button>
                
                {categories.map((category, index) => {
                  const cleanSlug = (category.slug.current.split(/[A-Z]/)[0] || category.slug.current);
                  const isSelected = selectedCategory === cleanSlug;
                  
                  return (
                    <button
                      key={category._id}
                      onClick={() => handleCategorySelect(cleanSlug)}
                      className="category-button"
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: isSelected ? (category.color || '#9B8B7E') : `${category.color || '#9B8B7E'}15`,
                        color: isSelected ? 'white' : (category.color || '#9B8B7E'),
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        border: isSelected ? 'none' : `1px solid ${category.color || '#9B8B7E'}40`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: isSelected ? '500' : '400'
                      }}
                    >
                      {category.title} {loading ? '' : `(${category.postCount || 0})`}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Tags Section */}
            <div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{ marginTop: '1rem' }}
            >
              {allTags.length > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ 
                    marginBottom: '0.5rem', 
                    color: '#666',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    Popular Tags:
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '0.5rem', 
                    flexWrap: 'wrap' 
                  }}>
                    {allTags.map((tag, index) => (
                      <button
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        className="tag-button"
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: selectedTag === tag ? '#9B8B7E' : '#f0f0f0',
                          color: selectedTag === tag ? 'white' : '#666',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Results count */}
            <div>
              {(searchTerm || selectedCategory !== 'all' || selectedTag) && posts.length > 0 && (
                <div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{ textAlign: 'center', marginTop: '0.75rem' }}
                >
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>
                    Showing {filteredPosts.length} of {posts.length} articles
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section style={{ background: 'white', padding: '60px 0', flex: 1 }}>
        <div className="ilio-container">
          <div mode="wait">
            {loading ? (
              <div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-[#9B8B7E] border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-xl text-gray-600">Loading articles from Sanity...</p>
              </div>
            ) : posts.length === 0 ? (
              <div
                key="no-posts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
              >
                <h2
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
                  className="text-3xl font-light text-gray-800 mb-4"
                >
                  Coming Soon
                </h2>
                <p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 max-w-2xl mx-auto mb-6"
                >
                  We're currently preparing exciting content about sauna wellness, design tips, and maintenance guides. 
                  Check back soon for our first articles!
                </p>
                <div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6"
                >
                  <p className="text-gray-500 text-sm">
                    In the meantime, explore our <Link href="/saunas" className="text-[#9B8B7E] hover:underline">sauna collection</Link> or <Link href="/contact" className="text-[#9B8B7E] hover:underline">contact us</Link> with any questions.
                  </p>
                </div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
              >
                <p
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}
                  className="text-xl text-gray-600 mb-6"
                >
                  No articles found matching your criteria.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="clear-filters-button px-6 py-2 border border-[#9B8B7E] rounded-lg bg-transparent text-[#9B8B7E] hover:bg-[#9B8B7E] hover:text-white transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                key="posts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Featured Posts */}
                {filteredPosts.filter(post => post.featured).length > 0 && (
                  <div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-12"
                  >
                    <div style={{ marginBottom: '3rem' }}>
                      <h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{
                          fontSize: '2rem',
                          fontWeight: 100,
                          color: '#333',
                          letterSpacing: '0.05em',
                          marginBottom: '0.75rem'
                        }}
                      >
                        Featured Articles
                      </h2>
                      <div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{
                          height: '1px',
                          background: 'linear-gradient(90deg, #9B8B7E 0%, #9B8B7E 30%, transparent 100%)',
                          transformOrigin: 'left',
                          maxWidth: '200px'
                        }}
                      />
                    </div>
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
                          <article className="featured-post-card" style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            border: '2px solid #9B8B7E'
                          }}
                          >
                            {post.mainImage && (
                              <div style={{ 
                                position: 'relative',
                                paddingBottom: '50%',
                                overflow: 'hidden',
                                background: '#f0f0f0'
                              }}>
                              <img
                                src={getImageUrl(post.mainImage, 800, 400)}
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
                              {post.categories && post.categories.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                  {post.categories.map(category => (
                                    <span key={category._id} style={{
                                      padding: '0.25rem 0.75rem',
                                      backgroundColor: category.color || '#9B8B7E',
                                      color: 'white',
                                      borderRadius: '4px',
                                      fontSize: '0.85rem'
                                    }}>
                                      {category.title}
                                    </span>
                                  ))}
                                </div>
                              )}
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
                                {post.excerpt || 'Click to read more...'}
                              </p>
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.875rem',
                                color: '#999'
                              }}>
                                <span>{post.author?.name || 'Ilio Team'}</span>
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
                <div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: filteredPosts.filter(post => post.featured).length > 0 ? 0.4 : 0.2 }}
                >
                  {filteredPosts.filter(post => !post.featured).length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                      <h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        style={{
                          fontSize: '2rem',
                          fontWeight: 100,
                          color: '#333',
                          letterSpacing: '0.05em',
                          marginBottom: '0.75rem'
                        }}
                      >
                        {filteredPosts.filter(post => post.featured).length > 0 ? 'Recent Articles' : 'All Articles'}
                      </h2>
                      <div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        style={{
                          height: '1px',
                          background: 'linear-gradient(90deg, #9B8B7E 0%, #9B8B7E 30%, transparent 100%)',
                          transformOrigin: 'left',
                          maxWidth: '200px'
                        }}
                      />
                    </div>
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
                        <article className="regular-post-card" style={{
                          background: 'white',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                          cursor: 'pointer'
                        }}
                        >
                          {post.mainImage && (
                            <div style={{ 
                              position: 'relative',
                              paddingBottom: '60%',
                              overflow: 'hidden',
                              background: '#f0f0f0'
                            }}>
                              <img
                                src={getImageUrl(post.mainImage, 700, 420)}
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
                            {post.categories && post.categories.length > 0 && (
                              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                {post.categories.map(category => (
                                  <span key={category._id} style={{
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: category.color || '#9B8B7E',
                                    color: 'white',
                                    borderRadius: '3px',
                                    fontSize: '0.75rem'
                                  }}>
                                    {category.title}
                                  </span>
                                ))}
                              </div>
                            )}
                            <h3 style={{ 
                              fontSize: '1.25rem',
                              fontWeight: 400,
                              marginBottom: '0.75rem',
                              color: '#333',
                              lineHeight: '1.4'
                            }}>
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p style={{
                                color: '#666',
                                fontSize: '0.9rem',
                                lineHeight: '1.6',
                                marginBottom: '1rem'
                              }}>
                                {post.excerpt}
                              </p>
                            )}
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.8rem',
                              color: '#999'
                            }}>
                              <span>{post.author?.name || 'Ilio Team'}</span>
                              <div style={{ display: 'flex', gap: '0.75rem' }}>
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
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}