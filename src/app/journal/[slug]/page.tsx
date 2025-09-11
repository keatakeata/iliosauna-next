'use client';
// BUILD FIX v3: Removed force-dynamic for React 19 compatibility
// export const dynamic = 'force-dynamic';
// BUILD FIX v2: Added browser guards - FORCE REBUILD 2024-01-11

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { client } from '../../../../sanity/lib/client';

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
// Analytics removed for build fix
import { PortableText } from '@portabletext/react';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  mainImage: any;
  body: any[];
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
}

export default function BlogPostPage() {
  // Analytics removed for build fix
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : params.slug?.[0] || '';

  // Add CSS animations and sticky styles
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .blog-sidebar-left {
        position: -webkit-sticky !important;
        position: sticky !important;
        top: 100px !important;
        align-self: start !important;
        height: fit-content !important;
        max-height: calc(100vh - 120px) !important;
        overflow-y: auto !important;
        will-change: transform !important;
      }
      .blog-sidebar-right {
        position: -webkit-sticky !important;
        position: sticky !important;
        top: 100px !important;
        align-self: start !important;
        height: fit-content !important;
        will-change: transform !important;
      }
      .blog-content-grid {
        display: grid !important;
        align-items: start !important;
      }
      @media (max-width: 1200px) {
        .blog-sidebar-left,
        .blog-sidebar-right {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // params and slug already declared above
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [tableOfContents, setTableOfContents] = useState<Array<{id: string, text: string, level: number}>>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1400);
  const [showMobileTOC, setShowMobileTOC] = useState(false);
  const [showMobileShare, setShowMobileShare] = useState(false);
  const [shareButtonsVisible, setShareButtonsVisible] = useState<boolean[]>([]);
  const shareTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  // Simple visibility state for mobile buttons
  const [showMobileButtons, setShowMobileButtons] = useState(false);

  // Initialize share buttons visibility array
  useEffect(() => {
    // 7 buttons: X, Facebook, LinkedIn, Pinterest, WhatsApp, Reddit, Email
    setShareButtonsVisible(new Array(7).fill(false));
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      shareTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      
      try {
        // Fetch the blog post from our API (server-side)
        const response = await fetch(`/api/blog/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        
        const { post: data } = await response.json();
        
        if (data) {
          console.log('✅ Fetched blog post:', data.title);
          setPost(data);
          
          // Dynamically update meta tags for social sharing
          const updateMetaTags = () => {
            if (typeof window === 'undefined') return;
            const url = window.location.href;
            const title = data.title || 'Blog Post';
            const description = data.excerpt || '';
            const image = data.mainImage ? getImageUrl(data.mainImage, 1200, 630) : '';
            
            // Update document title
            document.title = `${title} | Illig Sauna`;
            
            // Helper function to update or create meta tag
            const setMetaTag = (property: string, content: string, isProperty = true) => {
              const attrName = isProperty ? 'property' : 'name';
              let meta = document.querySelector(`meta[${attrName}="${property}"]`) as HTMLMetaElement;
              if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attrName, property);
                document.head.appendChild(meta);
              }
              meta.content = content;
            };
            
            // Open Graph tags for Facebook
            setMetaTag('og:title', title);
            setMetaTag('og:description', description);
            setMetaTag('og:url', url);
            setMetaTag('og:type', 'article');
            if (image) setMetaTag('og:image', image);
            
            // Twitter Card tags
            setMetaTag('twitter:card', 'summary_large_image', false);
            setMetaTag('twitter:title', title, false);
            setMetaTag('twitter:description', description, false);
            if (image) setMetaTag('twitter:image', image, false);
            
            // LinkedIn uses Open Graph tags, but also respects these
            setMetaTag('description', description, false);
          };
          
          updateMetaTags();
          
          // Analytics tracking removed for build fix
          console.log('Blog Post Viewed:', {
            post_id: data._id,
            post_title: data.title,
            post_slug: slug,
            categories: data.categories?.map((c: any) => c.title) || [],
            tags: data.tags || []
          });
          
          // Set related posts if available
          if (data.relatedPosts) {
            setRelatedPosts(data.relatedPosts);
          }
        } else {
          console.log('❌ No blog post found for slug:', slug);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simple scroll handling - show buttons after hero section
  useEffect(() => {
    if (typeof window === 'undefined' || windowWidth > 1200) return; // Only for mobile
    
    const handleScroll = () => {
      // Check if we're past the hero section
      const heroHeight = window.innerHeight * 0.65; // Hero is 65vh
      const isPastHero = window.scrollY > heroHeight;
      
      // Simple show/hide - no animations
      setShowMobileButtons(isPastHero);
    };
    
    // Check initial position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [windowWidth]);


  // Helper function to generate consistent IDs
  const generateId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
  };

  // Generate table of contents from body content (excluding H1 titles)
  useEffect(() => {
    if (post?.body) {
      const toc: Array<{id: string, text: string, level: number}> = [];
      post.body.forEach((block: any) => {
        // Only include h2 and h3 in table of contents, not h1 (main titles)
        if (block._type === 'block' && block.style && ['h2', 'h3'].includes(block.style)) {
          const text = block.children?.map((child: any) => child.text).join('') || '';
          const id = generateId(text);
          const level = parseInt(block.style.replace('h', ''));
          toc.push({ id, text, level });
        }
      });
      setTableOfContents(toc);
    }
  }, [post]);

  // Scroll observer for active section - REAL-TIME tracking
  useEffect(() => {
    let rafId: number;
    
    const handleScroll = () => {
      if (!contentRef.current || tableOfContents.length === 0) return;
      
      const headings = contentRef.current.querySelectorAll('h2[id], h3[id]');
      const scrollPosition = window.scrollY + 150;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're at the bottom of the page
      const isAtBottom = window.scrollY + windowHeight >= documentHeight - 100;
      
      if (isAtBottom && headings.length > 0) {
        // Select the last section if we're at the bottom
        const lastHeading = headings[headings.length - 1];
        setActiveSection(lastHeading.id);
        return;
      }
      
      let currentSection = '';
      let minDistance = Infinity;
      
      // Find the closest heading above the current scroll position
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const distance = Math.abs(scrollPosition - top);
        
        if (top <= scrollPosition && distance < minDistance) {
          minDistance = distance;
          currentSection = heading.id;
        }
      });
      
      // Don't select any section if we're at the very top of the page
      // Only activate the first section when we've scrolled past the hero/title area
      if (!currentSection && headings.length > 0) {
        const firstHeading = headings[0];
        const firstHeadingTop = firstHeading.getBoundingClientRect().top + window.scrollY;
        // Only activate if we're close to or past the first heading
        if (window.scrollY + 300 >= firstHeadingTop) {
          currentSection = headings[0].id;
        }
      }
      
      // Only update if the section has actually changed
      setActiveSection(prev => {
        if (prev !== currentSection) {
          return currentSection;
        }
        return prev;
      });
    };

    // Use requestAnimationFrame for smooth, real-time updates
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [post, tableOfContents]);

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // Increased offset to account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      // Set active section immediately for better UX
      setActiveSection(id);
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Double-check active section after scroll completes
      setTimeout(() => {
        setActiveSection(id);
      }, 500);
    }
  };

  // Share functions
  const shareOnTwitter = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const text = post?.title || '';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = post?.title || '';
    // Facebook sharer.php only accepts 'u' parameter for URL
    // The title/text will be fetched from Open Graph meta tags
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    // LinkedIn simplified their sharing - now only accepts URL
    // Title and description should come from Open Graph meta tags
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnPinterest = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const description = post?.excerpt || post?.title || '';
    const image = post?.mainImage ? getImageUrl(post.mainImage, 1200, 630) : '';
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(description)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const text = post?.title || '';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const shareOnReddit = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = post?.title || '';
    window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
  };

  const shareViaEmail = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const subject = post?.title || 'Check out this article';
    const body = `Check out this article: ${post?.title || ''}\n\n${post?.excerpt || ''}\n\nRead more: ${url}`;
    // Use window.location.href for mailto to ensure it works across all browsers
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  // Custom components for PortableText
  const portableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <div style={{ margin: '2rem 0' }}>
            <img
              src={getImageUrl(value, 800, 600)}
              alt={value.alt || ''}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px'
              }}
            />
            {value.caption && (
              <p style={{
                textAlign: 'center',
                fontSize: '0.9rem',
                color: '#666',
                marginTop: '0.5rem',
                fontStyle: 'italic'
              }}>
                {value.caption}
              </p>
            )}
          </div>
        );
      }
    },
    block: {
      h1: ({ children }: any) => {
        const text = React.Children.toArray(children).join('');
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
        return (
          <h1 
            id={id}
            style={{
              fontSize: '2.8rem',
              fontWeight: 200,
              margin: '3rem 0 1.5rem',
              color: '#1D140B',
              letterSpacing: '0.08em',
              lineHeight: '1.2',
              scrollMarginTop: '100px'
            }}
          >
            {children}
          </h1>
        );
      },
      h2: ({ children }: any) => {
        const text = React.Children.toArray(children).join('');
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
        return (
          <h2 
            id={id}
            style={{
              fontSize: '2.2rem',
              fontWeight: 200,
              margin: '2.5rem 0 1.25rem',
              color: '#1D140B',
              letterSpacing: '0.06em',
              lineHeight: '1.3',
              scrollMarginTop: '100px'
            }}
          >
            {children}
          </h2>
        );
      },
      h3: ({ children }: any) => {
        const text = React.Children.toArray(children).join('');
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
        return (
          <h3 
            id={id}
            style={{
              fontSize: '1.6rem',
              fontWeight: 300,
              margin: '2rem 0 1rem',
              color: '#1D140B',
              letterSpacing: '0.04em',
              scrollMarginTop: '100px'
            }}
          >
            {children}
          </h3>
        );
      },
      normal: ({ children }: any) => (
        <p style={{
          fontSize: '1.125rem',
          lineHeight: '1.9',
          marginBottom: '1.5rem',
          color: '#6B7280',
          letterSpacing: '0.01em',
          fontWeight: 400
        }}>
          {children}
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote style={{
          borderLeft: '4px solid #BF5813',
          paddingLeft: '2rem',
          margin: '2.5rem 0',
          fontStyle: 'italic',
          color: '#8B7D6B',
          backgroundColor: '#FAF8F5',
          padding: '1.5rem 2rem',
          borderRadius: '0 8px 8px 0',
          boxShadow: '0 2px 10px rgba(191, 88, 19, 0.08)'
        }}>
          {children}
        </blockquote>
      )
    },
    marks: {
      strong: ({ children }: any) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
      em: ({ children }: any) => <em>{children}</em>,
      link: ({ value, children }: any) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
        return (
          <a 
            href={value?.href} 
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            style={{ 
              color: '#BF5813', 
              textDecoration: 'none',
              borderBottom: '1px solid rgba(191, 88, 19, 0.3)',
              transition: 'all 0.3s ease',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = '#BF5813';
              e.currentTarget.style.color = '#A04810';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = 'rgba(191, 88, 19, 0.3)';
              e.currentTarget.style.color = '#BF5813';
            }}
          >
            {children}
          </a>
        );
      }
    },
    list: {
      bullet: ({ children }: any) => (
        <ul style={{
          marginBottom: '1.25rem',
          paddingLeft: '1.5rem',
          lineHeight: '1.8'
        }}>
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol style={{
          marginBottom: '1.25rem',
          paddingLeft: '1.5rem',
          lineHeight: '1.8'
        }}>
          {children}
        </ol>
      )
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar animated={true} />
        <div style={{ padding: '150px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar animated={true} />
        <div style={{ padding: '150px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>
            Article Not Found
          </h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            href="/journal" 
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: '#9B8B7E',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              transition: 'all 0.3s ease'
            }}
          >
            ← Back to Journal
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative',
      overflow: 'visible' // Ensure no overflow hidden breaking sticky
    }}>
      <Navbar animated={true} />
      
      {/* Clean Hero Image */}
      <section style={{ 
        position: 'relative',
        height: '65vh',
        minHeight: '450px',
        maxHeight: '700px',
        overflow: 'hidden'
      }}>
        {post.mainImage?.asset ? (
          <img
            src={getImageUrl(post.mainImage, 1920, 1080)}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #9B8B7E 0%, #8B5A3C 100%)'
          }} />
        )}
        
        {/* Subtle category badge overlay */}
        {post.categories && post.categories.length > 0 && windowWidth <= 768 && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            zIndex: 10
          }}>
            {post.categories[0] && (
              <span 
                className="mobile-category-badge"
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.6rem',
                  backgroundColor: post.categories[0].color ? `${post.categories[0].color}20` : 'rgba(155, 139, 126, 0.2)',
                  color: post.categories[0].color || '#9B8B7E',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  border: `1px solid ${post.categories[0].color || '#9B8B7E'}30`,
                  transition: 'background-color 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = post.categories[0].color ? `${post.categories[0].color}95` : 'rgba(155, 139, 126, 0.95)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = post.categories[0].color ? `${post.categories[0].color}20` : 'rgba(155, 139, 126, 0.2)';
                }}
              >
                {post.categories[0].title}
              </span>
            )}
          </div>
        )}
      </section>

      {/* Clean Article Title */}
      <section style={{
        background: 'white',
        padding: '3rem 0 2rem'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 100,
            letterSpacing: '0.03em',
            lineHeight: '1.2',
            color: '#1D140B',
            marginBottom: '0.5rem'
          }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* Main Content Container with Sidebars */}
      <div 
        className="blog-content-grid"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: windowWidth > 1200 ? '250px 1fr 250px' : '1fr',
          gap: '3rem',
          padding: '3rem 2rem 0',
          position: 'relative',
          alignItems: 'start' // This is crucial for sticky to work in grid
        }}>
        {/* Left Sidebar - Table of Contents - Only show on large screens */}
        {tableOfContents.length > 0 && windowWidth > 1200 && (
          <aside className="blog-sidebar-left">
            <div style={{
              backgroundColor: '#FAF8F5',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#8B7D6B',
                marginBottom: '1rem'
              }}>
                Table of Contents
              </h3>
              <nav style={{ position: 'relative' }}>
                                  {tableOfContents.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        width: '3px',
                        backgroundColor: '#BF5813',
                        zIndex: 1,
                        borderRadius: '1.5px',
                        top: activeSection ? tableOfContents.findIndex(item => item.id === activeSection) * 36 : 0,
                        height: 36,
                        opacity: activeSection && tableOfContents.some(item => item.id === activeSection) ? 1 : 0,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  )}
                                {tableOfContents.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '36px',
                      textAlign: 'left',
                      padding: '0 0.75rem 0 1rem',
                      paddingLeft: `${1 + (item.level - 1) * 0.75}rem`,
                      fontSize: item.level === 1 ? '0.9rem' : '0.8rem',
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      border: 'none',
                      borderLeft: '3px solid rgba(0, 0, 0, 0)',
                      cursor: 'pointer',
                      lineHeight: '36px',
                      position: 'relative',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: activeSection === item.id ? '#BF5813' : '#6B7280',
                      fontWeight: activeSection === item.id ? 500 : 400,
                      transition: 'none'
                    }}
                    animate={{
                      x: activeSection === item.id ? 4 : 0,
                      color: activeSection === item.id ? '#BF5813' : '#6B7280'
                    }}
                    whileHover={{
                      color: '#BF5813',
                      backgroundColor: 'rgba(191, 88, 19, 0.05)',
                      x: 4
                    }}
                    transition={{
                      x: { type: 'spring', stiffness: 400, damping: 25 },
                      color: { duration: 0.2 }
                    }}
                  >
                    {item.text}
                  </motion.button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Center - Main Article Content */}
        <article 
          ref={contentRef}
          style={{ 
            maxWidth: '850px', 
            width: '100%',
            padding: '0 0 80px',
            animation: 'fadeIn 1s ease-out 0.3s both'
          }}
        >
          {/* Excerpt with improved styling */}
          {post.excerpt && (
          <p style={{
            fontSize: '1.4rem',
            lineHeight: '1.8',
            color: '#6B7280',
            marginBottom: '3.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '2px solid #F8F4EB',
            fontWeight: 300,
            letterSpacing: '0.02em',
            fontStyle: 'italic'
          }}>
            {post.excerpt}
          </p>
        )}

        {/* Body Content */}
        <div className="blog-content">
          {post.body && post.body.length > 0 ? (
            <PortableText 
              value={post.body} 
              components={portableTextComponents}
            />
          ) : (
            <p style={{ color: '#666' }}>No content available for this article.</p>
          )}
        </div>

        {/* Tags with improved styling */}
        {post.tags && post.tags.length > 0 && (
          <div style={{
            marginTop: '4rem',
            paddingTop: '3rem',
            borderTop: '2px solid #F8F4EB'
          }}>
            <p style={{ 
              color: '#8B7D6B', 
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>
              Tagged With
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/journal?tag=${tag}`}
                  style={{
                    padding: '0.5rem 1.25rem',
                    backgroundColor: '#FAF8F5',
                    color: '#8B7D6B',
                    border: '1px solid #F8F4EB',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontWeight: 400,
                    letterSpacing: '0.02em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#BF5813';
                    e.currentTarget.style.color = '#FAF8F5';
                    e.currentTarget.style.borderColor = '#BF5813';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF8F5';
                    e.currentTarget.style.color = '#8B7D6B';
                    e.currentTarget.style.borderColor = '#F8F4EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Journal with improved button */}
        <div style={{ 
          marginTop: '5rem', 
          paddingTop: '3rem',
          borderTop: '1px solid #F8F4EB',
          textAlign: 'center' 
        }}>
          <Link 
            href="/journal" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2.5rem',
              backgroundColor: '#BF5813',
              color: '#FAF8F5',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '0.95rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
              boxShadow: '0 4px 20px rgba(191, 88, 19, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#A04810';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(191, 88, 19, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#BF5813';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(191, 88, 19, 0.15)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Journal
          </Link>
        </div>
        </article>

        {/* Right Sidebar - Article Info & Sharing - Only show on large screens */}
        {windowWidth > 1200 && (
        <aside className="blog-sidebar-right">
          <div style={{
            backgroundColor: '#FAF8F5',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}>
            {/* Article Meta Info Section */}
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid rgba(139, 125, 107, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                fontSize: '0.85rem',
                color: '#666'
              }}>
                {/* Category Badge */}
                {post.categories && post.categories.length > 0 && post.categories[0] && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.75rem',
                      backgroundColor: post.categories[0].color ? `${post.categories[0].color}15` : 'rgba(155, 139, 126, 0.15)',
                      color: post.categories[0].color || '#9B8B7E',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      border: `1px solid ${post.categories[0].color || '#9B8B7E'}30`
                    }}>
                      {post.categories[0].title}
                    </span>
                  </div>
                )}
                
                {post.author && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem'
                  }}>
                    {post.author.image?.asset && (
                      <img
                        src={getImageUrl(post.author.image, 32, 32)}
                        alt={post.author.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <span style={{ 
                      fontWeight: 500,
                      color: '#333'
                    }}>
                      {post.author.name}
                    </span>
                  </div>
                )}
                
                {post.publishedAt && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <time>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>
                )}
                
                {post.readingTime && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{post.readingTime} min read</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Share Section */}
            <div style={{
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8B7D6B',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Share
              </h3>
            
            {/* Animated Circular Share Component */}
            <div 
              className="share-container"
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '140px',
                width: '100%',
                margin: '0 auto'
              }}
              onMouseEnter={() => {
                // Clear any pending hide animations
                shareTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
                shareTimeoutsRef.current = [];
                
                // Show buttons with sequential animation
                const newVisible = new Array(7).fill(false);
                shareTimeoutsRef.current = newVisible.map((_, index) => {
                  return setTimeout(() => {
                    setShareButtonsVisible(prev => {
                      const updated = [...prev];
                      updated[index] = true;
                      return updated;
                    });
                  }, index * 50); // 50ms between each button
                });
              }}
              onMouseLeave={(e) => {
                // Check if we're moving to a child element
                try {
                  const relatedTarget = e.relatedTarget as HTMLElement;
                  if (relatedTarget && e.currentTarget && e.currentTarget.contains && e.currentTarget.contains(relatedTarget)) {
                    return;
                  }
                } catch (error) {
                  // If contains check fails, continue with hiding animation
                }
                
                // Clear any pending show animations
                shareTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
                shareTimeoutsRef.current = [];
                
                // Add grace period before hiding
                const hideTimeout = setTimeout(() => {
                  // Hide buttons with reverse sequential animation
                  const totalButtons = 7;
                  shareTimeoutsRef.current = Array.from({ length: totalButtons }, (_, index) => {
                    return setTimeout(() => {
                      setShareButtonsVisible(prev => {
                        const updated = [...prev];
                        updated[totalButtons - 1 - index] = false;
                        return updated;
                      });
                    }, index * 30); // 30ms between each button
                  });
                }, 150); // 150ms grace period
                
                shareTimeoutsRef.current.push(hideTimeout);
              }}
            >
              {/* Main Share Button */}
              <button style={{
                position: 'absolute',
                display: 'grid',
                placeItems: 'center',
                padding: '15px 20px',
                border: 'none',
                background: '#BF5813',
                boxShadow: '0 4px 20px rgba(191, 88, 19, 0.3)',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                zIndex: 100,
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)',
                top: '50%',
                left: '50%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#A04810';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(191, 88, 19, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#BF5813';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(191, 88, 19, 0.3)';
              }}
              >
                <svg width={24} height={24} fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.75 5.125a3.125 3.125 0 1 1 .754 2.035l-8.397 3.9a3.124 3.124 0 0 1 0 1.88l8.397 3.9a3.125 3.125 0 1 1-.61 1.095l-8.397-3.9a3.125 3.125 0 1 1 0-4.07l8.397-3.9a3.125 3.125 0 0 1-.144-.94Z" />
                </svg>
              </button>
              
              {/* Copy Link Button - Top (12 o'clock) */}
              <button
                className="share-button"
                onClick={() => {
                  if (typeof window !== 'undefined' && navigator?.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                }}
                style={{
                  position: 'absolute',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '12px',
                  border: 'none',
                  background: '#FAF8F5',
                  boxShadow: shareButtonsVisible[0] ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transform: shareButtonsVisible[0] 
                    ? `translate(${Math.cos(-90 * Math.PI / 180) * 70}px, ${Math.sin(-90 * Math.PI / 180) * 70}px) scale(1)`
                    : 'translate(0, 0) scale(0.8)',
                  opacity: shareButtonsVisible[0] ? '1' : '0',
                  pointerEvents: shareButtonsVisible[0] ? 'auto' : 'none',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#9B8B7E';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) {
                    svg.setAttribute('stroke', 'white');
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAF8F5';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) {
                    svg.setAttribute('stroke', '#1D140B');
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D140B" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>
              
              {/* X (Twitter) Button */}
              <button
                className="share-button"
                onClick={shareOnTwitter}
                style={{
                  position: 'absolute',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '12px',
                  border: 'none',
                  background: '#FAF8F5',
                  boxShadow: shareButtonsVisible[1] ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transform: shareButtonsVisible[1]
                    ? `translate(${Math.cos(-39 * Math.PI / 180) * 70}px, ${Math.sin(-39 * Math.PI / 180) * 70}px) scale(1)`
                    : 'translate(0, 0) scale(0.8)',
                  opacity: shareButtonsVisible[1] ? '1' : '0',
                  pointerEvents: shareButtonsVisible[1] ? 'auto' : 'none',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000000';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', 'white');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAF8F5';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', '#1D140B');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1D140B">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              
              {/* Facebook Button */}
              <button
                className="share-button"
                onClick={shareOnFacebook}
                style={{
                  position: 'absolute',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '12px',
                  border: 'none',
                  background: '#FAF8F5',
                  boxShadow: shareButtonsVisible[2] ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transform: shareButtonsVisible[2]
                    ? `translate(${Math.cos(12 * Math.PI / 180) * 70}px, ${Math.sin(12 * Math.PI / 180) * 70}px) scale(1)`
                    : 'translate(0, 0) scale(0.8)',
                  opacity: shareButtonsVisible[2] ? '1' : '0',
                  pointerEvents: shareButtonsVisible[2] ? 'auto' : 'none',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1877F2';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', 'white');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAF8F5';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', '#1D140B');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1D140B">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              
              {/* LinkedIn Button */}
              <button
                className="share-button"
                onClick={shareOnLinkedIn}
                style={{
                  position: 'absolute',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '12px',
                  border: 'none',
                  background: '#FAF8F5',
                  boxShadow: shareButtonsVisible[3] ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transform: shareButtonsVisible[3]
                    ? `translate(${Math.cos(63 * Math.PI / 180) * 70}px, ${Math.sin(63 * Math.PI / 180) * 70}px) scale(1)`
                    : 'translate(0, 0) scale(0.8)',
                  opacity: shareButtonsVisible[3] ? '1' : '0',
                  pointerEvents: shareButtonsVisible[3] ? 'auto' : 'none',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0077B5';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', 'white');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAF8F5';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', '#1D140B');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1D140B">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
              
              {/* WhatsApp Button */}
              <button
                className="share-button"
                onClick={shareOnWhatsApp}
                style={{
                  position: 'absolute',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '12px',
                  border: 'none',
                  background: '#FAF8F5',
                  boxShadow: shareButtonsVisible[4] ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transform: shareButtonsVisible[4]
                    ? `translate(${Math.cos(114 * Math.PI / 180) * 70}px, ${Math.sin(114 * Math.PI / 180) * 70}px) scale(1)`
                    : 'translate(0, 0) scale(0.8)',
                  opacity: shareButtonsVisible[4] ? '1' : '0',
                  pointerEvents: shareButtonsVisible[4] ? 'auto' : 'none',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#25D366';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', 'white');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAF8F5';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', '#1D140B');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1D140B">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.671.149-.2.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </button>
              
              {/* Reddit Button */}
              <button
                className="share-button"
                onClick={shareOnReddit}
                style={{
                  position: 'absolute',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '12px',
                  border: 'none',
                  background: '#FAF8F5',
                  boxShadow: shareButtonsVisible[5] ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transform: shareButtonsVisible[5]
                    ? `translate(${Math.cos(165 * Math.PI / 180) * 70}px, ${Math.sin(165 * Math.PI / 180) * 70}px) scale(1)`
                    : 'translate(0, 0) scale(0.8)',
                  opacity: shareButtonsVisible[5] ? '1' : '0',
                  pointerEvents: shareButtonsVisible[5] ? 'auto' : 'none',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF4500';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', 'white');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAF8F5';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.setAttribute('fill', '#1D140B');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1D140B">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </button>
              
              {/* Email Button */}
              <button
                className="share-button"
                onClick={shareViaEmail}
                style={{
                  position: 'absolute',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '12px',
                  border: 'none',
                  background: '#FAF8F5',
                  boxShadow: shareButtonsVisible[6] ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transform: shareButtonsVisible[6]
                    ? `translate(${Math.cos(216 * Math.PI / 180) * 70}px, ${Math.sin(216 * Math.PI / 180) * 70}px) scale(1)`
                    : 'translate(0, 0) scale(0.8)',
                  opacity: shareButtonsVisible[6] ? '1' : '0',
                  pointerEvents: shareButtonsVisible[6] ? 'auto' : 'none',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#6B7280';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) {
                    svg.setAttribute('stroke', 'white');
                    svg.setAttribute('fill', 'none');
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FAF8F5';
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) {
                    svg.setAttribute('stroke', '#1D140B');
                    svg.setAttribute('fill', 'none');
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D140B" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-10 5L2 7"/>
                </svg>
              </button>
            </div>
            </div>
          </div>
        </aside>
        )}
      </div>

      {/* Related Posts with improved design */}
      {relatedPosts.length > 0 && (
        <section style={{
          backgroundColor: '#FAF8F5',
          padding: '80px 20px',
          borderTop: '1px solid #F8F4EB'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 200,
              marginBottom: '3rem',
              textAlign: 'center',
              color: '#1D140B',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Continue Reading
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost._id}
                  href={`/journal/${relatedPost.slug.current}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(191, 88, 19, 0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(191, 88, 19, 0.15)';
                    e.currentTarget.style.borderColor = '#BF5813';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(191, 88, 19, 0.08)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  >
                    {relatedPost.mainImage?.asset && (
                      <img
                        src={getImageUrl(relatedPost.mainImage, 400, 250)}
                        alt={relatedPost.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <div style={{ padding: '2rem' }}>
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: 200,
                        marginBottom: '0.75rem',
                        color: '#1D140B',
                        letterSpacing: '0.05em',
                        lineHeight: '1.3'
                      }}>
                        {relatedPost.title}
                      </h3>
                      <p style={{
                        color: '#6B7280',
                        fontSize: '0.95rem',
                        lineHeight: '1.7',
                        marginBottom: '1rem'
                      }}>
                        {relatedPost.excerpt}
                      </p>
                      {relatedPost.publishedAt && (
                        <time style={{
                          fontSize: '0.85rem',
                          color: '#8B7D6B',
                          fontWeight: 300
                        }}>
                          {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </time>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Floating Action Buttons - UPDATED POSITIONS */}
      {windowWidth <= 1200 && (
        <>
          {/* Mobile Table of Contents Button */}
          {tableOfContents.length > 0 && (
            <button
              onClick={() => setShowMobileTOC(!showMobileTOC)}
              style={{
                position: 'fixed',
                bottom: '15%', // 15% from bottom - stacked above share button
                right: '20px',
                padding: '12px 16px',
                borderRadius: '4px',
                backgroundColor: '#9B8B7E',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 20px rgba(155, 139, 126, 0.3)',
                cursor: 'pointer',
                display: showMobileButtons ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
            >
              <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                {/* Simple hamburger/X icon */}
                {showMobileTOC ? (
                  // X icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <>
                    <span style={{ position: 'absolute', left: 0, top: '4px', width: '20px', height: '2px', backgroundColor: 'white' }} />
                    <span style={{ position: 'absolute', left: 0, top: '9px', width: '20px', height: '2px', backgroundColor: 'white' }} />
                    <span style={{ position: 'absolute', left: 0, top: '14px', width: '20px', height: '2px', backgroundColor: 'white' }} />
                  </>
                )}
              </div>
            </button>
          )}

          {/* Mobile Share Button */}
          <button
            onClick={() => setShowMobileShare(!showMobileShare)}
            style={{
              position: 'fixed',
              bottom: '10%', // 10% from bottom - stacked below TOC button
              right: '20px',
              padding: '15px 20px',
              borderRadius: '4px',
              backgroundColor: '#BF5813',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 20px rgba(191, 88, 19, 0.3)',
              cursor: 'pointer',
              display: showMobileButtons ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            {/* Simple share/X icon toggle */}
            {showMobileShare ? (
              // X icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Share icon
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 5.125a3.125 3.125 0 1 1 .754 2.035l-8.397 3.9a3.124 3.124 0 0 1 0 1.88l8.397 3.9a3.125 3.125 0 1 1-.61 1.095l-8.397-3.9a3.125 3.125 0 1 1 0-4.07l8.397-3.9a3.125 3.125 0 0 1-.144-.94Z" />
              </svg>
            )}
          </button>
          
          {/* Mobile Share Buttons - Animated Horizontal Line */}
          <AnimatePresence>
            {showMobileShare && (
              <>
                {/* Copy Link - First in horizontal line */}
                <motion.button
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: -70, 
                    y: 0,
                    scale: 1 
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  transition={{ delay: 0, type: 'spring', bounce: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredButton('copy')}
                  onHoverEnd={() => setHoveredButton(undefined)}
                  onClick={() => {
                    if (typeof window !== 'undefined' && navigator?.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                    setShowMobileShare(false);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                  style={{
                    position: 'fixed',
                    bottom: '10%',
                    right: '20px',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: hoveredButton === 'copy' ? '#9B8B7E' : '#FAF8F5',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 999
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={hoveredButton === 'copy' ? 'white' : '#3D2914'} strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </motion.button>
                
                {/* X (Twitter) - Second in horizontal line */}
                <motion.button
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: -130, 
                    y: 0,
                    scale: 1 
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  transition={{ delay: 0.05, type: 'spring', bounce: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredButton('twitter')}
                  onHoverEnd={() => setHoveredButton(undefined)}
                  onClick={shareOnTwitter}
                  style={{
                    position: 'fixed',
                    bottom: '10%',
                    right: '20px',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: hoveredButton === 'twitter' ? '#000000' : '#FAF8F5',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 999
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={hoveredButton === 'twitter' ? 'white' : '#3D2914'}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </motion.button>
                
                {/* Facebook - Third in horizontal line */}
                <motion.button
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: -190, 
                    y: 0,
                    scale: 1 
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredButton('facebook')}
                  onHoverEnd={() => setHoveredButton(undefined)}
                  onClick={shareOnFacebook}
                  style={{
                    position: 'fixed',
                    bottom: '10%',
                    right: '20px',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: hoveredButton === 'facebook' ? '#1877F2' : '#FAF8F5',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 999
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={hoveredButton === 'facebook' ? 'white' : '#3D2914'}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.button>
                
                {/* LinkedIn - Fourth in horizontal line */}
                <motion.button
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: -250, 
                    y: 0,
                    scale: 1 
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  transition={{ delay: 0.15, type: 'spring', bounce: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredButton('linkedin')}
                  onHoverEnd={() => setHoveredButton(undefined)}
                  onClick={shareOnLinkedIn}
                  style={{
                    position: 'fixed',
                    bottom: '10%',
                    right: '20px',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: hoveredButton === 'linkedin' ? '#0077B5' : '#FAF8F5',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 999
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={hoveredButton === 'linkedin' ? 'white' : '#3D2914'}>
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </motion.button>
                
                {/* Email - Fifth in horizontal line */}
                <motion.button
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: -310, 
                    y: 0,
                    scale: 1 
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredButton('email')}
                  onHoverEnd={() => setHoveredButton(undefined)}
                  onClick={shareViaEmail}
                  style={{
                    position: 'fixed',
                    bottom: '10%',
                    right: '20px',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: hoveredButton === 'email' ? '#EA4335' : '#FAF8F5',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 999
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={hoveredButton === 'email' ? 'white' : '#3D2914'} strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-10 5L2 7"/>
                  </svg>
                </motion.button>
                
                {/* WhatsApp - Sixth in horizontal line */}
                <motion.button
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: -370, 
                    y: 0,
                    scale: 1 
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
                  transition={{ delay: 0.25, type: 'spring', bounce: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredButton('whatsapp')}
                  onHoverEnd={() => setHoveredButton(undefined)}
                  onClick={shareOnWhatsApp}
                  style={{
                    position: 'fixed',
                    bottom: '10%',
                    right: '20px',
                    padding: '12px',
                    borderRadius: '4px',
                    backgroundColor: hoveredButton === 'whatsapp' ? '#25D366' : '#FAF8F5',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 999
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={hoveredButton === 'whatsapp' ? 'white' : '#3D2914'}>
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Mobile Table of Contents Modal */}
                      {showMobileTOC && (
              <div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                style={{
                  position: 'fixed',
                  bottom: 'calc(15% + 60px)', // Position above the TOC button
                  right: '20px',
                  width: '280px',
                  maxHeight: 'calc(80vh - 160px)', // Adjust max height for bottom positioning
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  zIndex: 999,
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  padding: '1rem',
                  borderBottom: '1px solid #eee'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    margin: 0
                  }}>Table of Contents</h3>
                </div>
                <div style={{
                  maxHeight: 'calc(70vh - 200px)', // Adjust for bottom positioning
                  overflowY: 'auto',
                  padding: '0.5rem'
                }}>
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        // Keep TOC open after selecting
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem',
                        paddingLeft: `${0.5 + (item.level - 1) * 0.75}rem`,
                        fontSize: '0.9rem',
                        color: activeSection === item.id ? '#BF5813' : '#333',
                        backgroundColor: activeSection === item.id ? 'rgba(191, 88, 19, 0.05)' : 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
                  </>
      )}

      {/* Toast Notification - Moved outside mobile conditional */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: windowWidth <= 768 ? '50%' : 'auto',
              right: windowWidth <= 768 ? 'auto' : '20px',
              transform: windowWidth <= 768 ? 'translateX(-50%)' : 'none',
              backgroundColor: '#333',
              color: '#4ADE80',
              padding: '12px 24px',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10000,
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}// Force rebuild
