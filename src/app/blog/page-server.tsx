import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { sanityFetch, urlFor } from '../../../sanity/lib/client';
import { blogPostsQuery } from '../../../sanity/lib/queries';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: any;
  publishedAt: string;
  author: {
    name: string;
    image: any;
  };
  categories: Array<{
    title: string;
    slug: { current: string };
  }>;
  tags: string[];
  readingTime: number;
  featured: boolean;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BlogPage() {
  const posts = await sanityFetch<BlogPost[]>({ 
    query: blogPostsQuery,
    tags: ['blog']
  });

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '60vh',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48b776b0e1ab1d7c18.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '80px'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 100,
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            Journal
          </h1>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: 200,
            maxWidth: '600px',
            margin: '0 auto',
            opacity: 0.9
          }}>
            Insights on wellness, design, and the art of living well
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section style={{ padding: '0 20px', marginBottom: '80px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 200,
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              Featured Articles
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {featuredPosts.slice(0, 3).map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  className="blog-card"
                >
                  <article style={{
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    {post.mainImage && (
                      <div style={{
                        position: 'relative',
                        paddingBottom: '60%',
                        overflow: 'hidden'
                      }}>
                        <Image
                          src={urlFor(post.mainImage).width(800).height(480).url()}
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ padding: '2rem' }}>
                      {post.categories && post.categories.length > 0 && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          {post.categories.map((cat) => (
                            <span
                              key={cat.slug.current}
                              style={{
                                fontSize: '0.875rem',
                                color: '#8B7355',
                                marginRight: '1rem'
                              }}
                            >
                              {cat.title}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 300,
                        marginBottom: '1rem',
                        lineHeight: '1.3'
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
                        <span>{formatDate(post.publishedAt)}</span>
                        {post.readingTime && (
                          <span>{post.readingTime} min read</span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section style={{ padding: '0 20px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 200,
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            {featuredPosts.length > 0 ? 'All Articles' : 'Latest Articles'}
          </h2>
          
          {regularPosts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {regularPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    transition: 'transform 0.3s ease'
                  }}
                  className="blog-card"
                >
                  <article style={{
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    height: '100%'
                  }}>
                    {post.mainImage && (
                      <div style={{
                        position: 'relative',
                        paddingBottom: '60%',
                        overflow: 'hidden'
                      }}>
                        <Image
                          src={urlFor(post.mainImage).width(600).height(360).url()}
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 300,
                        marginBottom: '0.75rem',
                        lineHeight: '1.3'
                      }}>
                        {post.title}
                      </h3>
                      <p style={{
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '1rem',
                        fontSize: '0.95rem'
                      }}>
                        {post.excerpt}
                      </p>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#999'
                      }}>
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 300,
                marginBottom: '1rem'
              }}>
                No blog posts yet
              </h3>
              <p style={{
                color: '#666',
                marginBottom: '2rem'
              }}>
                Check back soon for insights on wellness and luxury living.
              </p>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .blog-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <Footer />
    </>
  );
}