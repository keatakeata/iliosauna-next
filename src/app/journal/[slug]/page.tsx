'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Use fetch API directly to avoid Sanity client issues
        const response = await fetch(
          `https://bxybmggj.api.sanity.io/v2024-01-01/data/query/production?query=*[_type == "blogPost" %26%26 slug.current == "${slug}"][0]`
        );
        const data = await response.json();
        
        if (data.result) {
          setPost(data.result);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Post Not Found</h1>
          <p>The blog post you are looking for does not exist.</p>
          <Link 
            href="/journal" 
            style={{ 
              color: '#9B8B7E', 
              marginTop: '20px', 
              display: 'inline-block',
              textDecoration: 'underline'
            }}
          >
            ← Back to Journal
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Simple content renderer
  const renderContent = (body: any[]) => {
    if (!body) return <p>{post.excerpt || 'No content available.'}</p>;
    
    return body.map((block: any, index: number) => {
      if (block._type === 'block') {
        const text = block.children?.map((child: any) => child.text).join('') || '';
        
        switch (block.style) {
          case 'h1':
            return <h1 key={index} style={{ fontSize: '2.5rem', fontWeight: 300, margin: '2rem 0 1rem' }}>{text}</h1>;
          case 'h2':
            return <h2 key={index} style={{ fontSize: '2rem', fontWeight: 300, margin: '1.5rem 0 1rem' }}>{text}</h2>;
          case 'h3':
            return <h3 key={index} style={{ fontSize: '1.5rem', fontWeight: 400, margin: '1rem 0 0.5rem' }}>{text}</h3>;
          case 'blockquote':
            return (
              <blockquote key={index} style={{ 
                borderLeft: '4px solid #9B8B7E', 
                paddingLeft: '1rem', 
                fontStyle: 'italic', 
                margin: '2rem 0' 
              }}>
                {text}
              </blockquote>
            );
          default:
            return <p key={index} style={{ marginBottom: '1rem', lineHeight: '1.8' }}>{text}</p>;
        }
      }
      return null;
    });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        minHeight: '300px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '3rem',
        padding: '60px 20px'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          maxWidth: '800px'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 300,
            marginBottom: '1rem'
          }}>
            {post.title}
          </h1>
          <div style={{
            fontSize: '1rem',
            opacity: 0.9
          }}>
            {post.publishedAt && (
              <time>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 20px 60px' 
      }}>
        {/* Excerpt */}
        {post.excerpt && (
          <p style={{
            fontSize: '1.25rem',
            lineHeight: '1.6',
            color: '#666',
            marginBottom: '2rem',
            fontStyle: 'italic'
          }}>
            {post.excerpt}
          </p>
        )}

        {/* Body Content */}
        <div>
          {renderContent(post.body)}
        </div>

        {/* Back to Journal */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link 
            href="/journal" 
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              backgroundColor: '#9B8B7E',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            ← Back to Journal
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}