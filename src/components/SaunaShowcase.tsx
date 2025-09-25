'use client';

import Link from 'next/link';
import { sanityImageUrl } from '@/lib/sanity.config';

interface SaunaShowcaseProps {
  homepageData?: {
    saunaShowcaseSection?: {
      title?: string;
      subtitle?: string;
      buttonText?: string;
      cards?: Array<{
        title: string;
        description: string;
        image?: any;
      }>;
    };
  };
}

export default function SaunaShowcase({ homepageData }: SaunaShowcaseProps) {
  const showcaseData = homepageData?.saunaShowcaseSection;
  const defaultSaunas = [
    {
      name: 'Contemporary Design',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb49eefde6142a736f7c.jpeg',
      description: 'Minimalist aesthetics meet maximum comfort in our signature contemporary designs'
    },
    {
      name: 'Premium Materials',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg',
      description: 'Handpicked Western Red Cedar and premium components for lasting beauty'
    },
    {
      name: 'Wellness Focused',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6898b31fefa0f04e3e74fc35.jpeg',
      description: 'Engineered for optimal heat distribution and therapeutic benefits'
    }
  ];
  
  const saunas = showcaseData?.cards || defaultSaunas;

  return (
    <section id="saunas" className="ilio-section ilio-section-full" style={{ background: '#f8f8f8', padding: '100px 0' }}>
      <div className="ilio-container">
        <div className="text-center mb-5">
          <h2 className="section-header h2-animate reveal-on-scroll" style={{ marginBottom: '2rem' }}>
            {showcaseData?.title || 'Ilio Sauna'}
          </h2>
          <div className="section-divider reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: '#D1D5DB',
            margin: '0 auto 2rem'
          }}></div>
          <p className="section-text reveal-on-scroll reveal-delay-2" style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#5a5a5a'
          }}>
            {showcaseData?.subtitle || 'Thoughtfully designed saunas that seamlessly integrate into your lifestyle and space'}
          </p>
        </div>

        <div className="ilio-grid ilio-grid-3" style={{ 
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {saunas.map((sauna, index) => (
            <div key={index} className={`sauna-card reveal-on-scroll reveal-delay-${3 + index}`} style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                position: 'relative', 
                paddingBottom: '75%', 
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <img
                  src={sauna.imageUrl || (sauna.imageFile ? sanityImageUrl(sauna.imageFile.asset._ref, 600) : (sauna.image?.asset ? sanityImageUrl(sauna.image.asset._ref, 600) : sauna.image))}
                  alt={`${sauna.name} - Premium cedar sauna showcase featuring BC craftsmanship`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ 
                  marginBottom: '0.75rem', 
                  fontSize: '1.4rem', 
                  fontWeight: 300,
                  color: '#333',
                  letterSpacing: '0.05em'
                }}>
                  {sauna.title || sauna.name}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {sauna.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="reveal-on-scroll reveal-delay-6" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link
            href="/saunas"
            className="btn-primary"
            style={{
              display: 'inline-block',
              padding: '0.9rem 2.4rem',
              background: 'transparent',
              color: '#BF5813',
              border: '1px solid #BF5813',
              borderRadius: '4px',
              fontSize: '0.95rem',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#BF5813';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#BF5813';
            }}
          >
{showcaseData?.buttonText || 'Explore Sauna Options'}
          </Link>
        </div>
      </div>
    </section>
  );
}