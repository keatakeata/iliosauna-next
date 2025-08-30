import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { sanityFetch, urlFor } from '../../../../sanity/lib/client';
import { blogPostQuery, blogPostsQuery } from '../../../../sanity/lib/queries';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  mainImage: any;
  body: any[];
  publishedAt: string;
  author: {
    name: string;
    bio: string;
    image: any;
  };
  categories: Array<{
    title: string;
    slug: { current: string };
  }>;
  tags: string[];
  readingTime: number;
  relatedPosts: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    mainImage: any;
    excerpt: string;
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export async function generateStaticParams() {
  const posts = await sanityFetch<BlogPost[]>({ 
    query: blogPostsQuery,
    tags: ['blog']
  });

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await sanityFetch<BlogPost>({ 
    query: blogPostQuery,
    params: { slug: params.slug },
    tags: ['blog', params.slug]
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords?.join(', ') || post.tags?.join(', '),
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const components = {
  types: {
    image: ({ value }: any) => (
      <div style={{ margin: '2rem 0' }}>
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || ''}
          width={800}
          height={450}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px'
          }}
        />
        {value.caption && (
          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#666',
            marginTop: '0.5rem'
          }}>
            {value.caption}
          </p>
        )}
      </div>
    ),
    callout: ({ value }: any) => (
      <div style={{
        padding: '1.5rem',
        background: value.type === 'info' ? '#e3f2fd' : 
                   value.type === 'warning' ? '#fff3e0' :
                   value.type === 'success' ? '#e8f5e9' : '#ffebee',
        borderLeft: `4px solid ${
          value.type === 'info' ? '#2196f3' : 
          value.type === 'warning' ? '#ff9800' :
          value.type === 'success' ? '#4caf50' : '#f44336'
        }`,
        borderRadius: '4px',
        margin: '2rem 0'
      }}>
        {value.text}
      </div>
    ),
    youtube: ({ value }: any) => {
      const videoId = value.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return videoId ? (
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%',
          margin: '2rem 0'
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px'
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null;
    }
  },
  block: {
    h1: ({ children }: any) => (
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 300,
        marginTop: '3rem',
        marginBottom: '1.5rem',
        lineHeight: '1.2'
      }}>
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 300,
        marginTop: '2.5rem',
        marginBottom: '1.25rem',
        lineHeight: '1.3'
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 400,
        marginTop: '2rem',
        marginBottom: '1rem',
        lineHeight: '1.4'
      }}>
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p style={{
        fontSize: '1.125rem',
        lineHeight: '1.8',
        marginBottom: '1.5rem',
        color: '#333'
      }}>
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: '4px solid #8B7355',
        paddingLeft: '2rem',
        margin: '2rem 0',
        fontStyle: 'italic',
        fontSize: '1.25rem',
        color: '#666'
      }}>
        {children}
      </blockquote>
    )
  },
  marks: {
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        style={{
          color: '#8B7355',
          textDecoration: 'underline'
        }}
      >
        {children}
      </a>
    ),
    code: ({ children }: any) => (
      <code style={{
        background: '#f4f4f4',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '0.9em',
        fontFamily: 'monospace'
      }}>
        {children}
      </code>
    )
  }
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await sanityFetch<BlogPost>({ 
    query: blogPostQuery,
    params: { slug: params.slug },
    tags: ['blog', params.slug]
  });

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Featured Image */}
      <section style={{
        position: 'relative',
        minHeight: '70vh',
        backgroundImage: post.mainImage ? 
          `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${urlFor(post.mainImage).width(1920).url()}')` :
          `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '60px'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          padding: '0 20px',
          maxWidth: '900px'
        }}>
          {post.categories && post.categories.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              {post.categories.map((cat) => (
                <span
                  key={cat.slug.current}
                  style={{
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginRight: '1rem',
                    opacity: 0.9
                  }}
                >
                  {cat.title}
                </span>
              ))}
            </div>
          )}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 200,
            letterSpacing: '0.02em',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            {post.title}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            fontSize: '1rem',
            opacity: 0.9
          }}>
            {post.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    style={{ borderRadius: '50%' }}
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTime && (
              <span>{post.readingTime} min read</span>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article style={{ padding: '0 20px', marginBottom: '80px' }}>
        <div style={{
          maxWidth: '750px',
          margin: '0 auto'
        }}>
          {/* Excerpt */}
          {post.excerpt && (
            <p style={{
              fontSize: '1.375rem',
              lineHeight: '1.7',
              color: '#555',
              marginBottom: '3rem',
              fontWeight: 300
            }}>
              {post.excerpt}
            </p>
          )}

          {/* Body Content */}
          <div className="prose">
            <PortableText 
              value={post.body} 
              components={components}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.25rem 1rem',
                      background: '#f5f5f5',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      color: '#666'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author && post.author.bio && (
            <div style={{
              marginTop: '3rem',
              padding: '2rem',
              background: '#f9f9f9',
              borderRadius: '8px',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center'
            }}>
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(80).height(80).url()}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  style={{ borderRadius: '50%', flexShrink: 0 }}
                />
              )}
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  marginBottom: '0.5rem',
                  fontWeight: 400
                }}>
                  {post.author.name}
                </h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  {post.author.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section style={{
          padding: '60px 20px',
          background: '#f9f9f9'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 200,
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              Related Articles
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {post.relatedPosts.slice(0, 3).map((relatedPost) => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost.slug.current}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <article style={{
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease'
                  }}
                  className="related-card"
                  >
                    {relatedPost.mainImage && (
                      <div style={{
                        position: 'relative',
                        paddingBottom: '60%'
                      }}>
                        <Image
                          src={urlFor(relatedPost.mainImage).width(400).height(240).url()}
                          alt={relatedPost.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 300,
                        marginBottom: '0.75rem'
                      }}>
                        {relatedPost.title}
                      </h3>
                      <p style={{
                        color: '#666',
                        lineHeight: '1.6',
                        fontSize: '0.95rem'
                      }}>
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        .related-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <Footer />
    </>
  );
}