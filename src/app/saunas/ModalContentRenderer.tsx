'use client';

import React from 'react';

// Grid Section Renderer
function GridSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      {section.gridTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          {section.gridTitle}
        </h3>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        {section.gridItems?.map((item: any) => (
          <div key={item._key}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              {item.title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {item.list?.map((point: string, i: number) => (
                <li key={i} style={{
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  marginBottom: '0.75rem',
                  color: '#4b5563',
                  lineHeight: '1.6'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#059669',
                    fontWeight: 'bold'
                  }}>✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// Engineering Details Section Renderer
function EngineeringSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '3rem' }}>
      {section.engineeringTitle && (
        <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          {section.engineeringTitle}
        </h3>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {section.engineeringItems?.map((item: any, index: number) => (
          <div key={item._key} style={{
            display: 'flex',
            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
            gap: '2rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1 1 300px' }}>
              <img
                src={item.imageUrl || item.image}
                alt={item.subtitle}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                {item.subtitle}
              </h4>
              <p style={{ color: '#4b5563', lineHeight: '1.7' }}>
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Specs Grid Section Renderer
function SpecsGridSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {section.specsGridColumns?.map((column: any) => (
          <div key={column._key} style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              {column.title}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {column.items?.map((item: string, i: number) => (
                <li key={i} style={{
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  marginBottom: '0.75rem',
                  color: '#4b5563',
                  fontSize: '0.95rem',
                  lineHeight: '1.6'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#059669'
                  }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// Feature Cards Section Renderer
function FeatureCardsSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        {section.featureCardsItems?.map((card: any) => (
          <div key={card._key} style={{
            padding: '1.5rem',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={card.title}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}
              />
            )}
            {card.icon && (
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {/* Icon placeholder - you can add icon library here */}
                {card.icon === 'sun' && '☀️'}
                {card.icon === 'lightning' && '⚡'}
                {card.icon === 'shield' && '🛡️'}
                {card.icon === 'clock' && '⏱️'}
                {card.icon === 'smartphone' && '📱'}
                {card.icon === 'calendar' && '📅'}
                {card.icon === 'chart' && '📊'}
                {card.icon === 'thermometer' && '🌡️'}
                {card.icon === 'users' && '👥'}
              </div>
            )}
            <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
              {card.title}
            </h5>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Image Showcase Section Renderer
function ImageShowcaseSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      {section.showcaseTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          {section.showcaseTitle}
        </h3>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {section.showcaseImages?.map((img: any) => (
          <div key={img._key}>
            <img
              src={img.imageUrl || img.image}
              alt={img.caption}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                marginBottom: '0.5rem'
              }}
            />
            {img.caption && (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Diagram Section Renderer
function DiagramSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem', background: '#f9fafb', padding: '2rem', borderRadius: '8px' }}>
      {section.diagramTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          {section.diagramTitle}
        </h3>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {section.diagramPoints?.map((point: string, i: number) => (
          <li key={i} style={{
            paddingLeft: '2rem',
            position: 'relative',
            marginBottom: '1rem',
            color: '#1f2937',
            fontSize: '1.05rem',
            lineHeight: '1.6'
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              color: '#059669',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>→</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Solution Section Renderer
function SolutionSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {section.solutionItems?.map((item: any) => (
          <div key={item._key} style={{
            background: '#ecfdf5',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #059669'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
              {item.title}
            </h4>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Specs Section Renderer
function SpecsSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      {section.specsTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          {section.specsTitle}
        </h3>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {section.specsItems?.map((spec: string, i: number) => (
          <li key={i} style={{
            paddingLeft: '1.5rem',
            position: 'relative',
            marginBottom: '0.75rem',
            color: '#4b5563',
            lineHeight: '1.6'
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              color: '#059669',
              fontWeight: 'bold'
            }}>✓</span>
            {spec}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Detail Section Renderer
function DetailSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      {section.detailTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          {section.detailTitle}
        </h3>
      )}
      <p style={{ color: '#4b5563', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
        {section.detailContent}
      </p>
    </div>
  );
}

// Quote Section Renderer
function QuoteSection({ section }: { section: any }) {
  return (
    <div style={{
      marginTop: '2rem',
      background: '#f9fafb',
      padding: '2rem',
      borderRadius: '8px',
      borderLeft: '4px solid #3b82f6'
    }}>
      <p style={{
        fontSize: '1.125rem',
        fontStyle: 'italic',
        color: '#1f2937',
        marginBottom: '1rem',
        lineHeight: '1.6'
      }}>
        "{section.quote}"
      </p>
      {section.author && (
        <p style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: '500' }}>
          — {section.author}
        </p>
      )}
    </div>
  );
}

// Philosophy Section Renderer
function PhilosophySection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem', background: '#fef3c7', padding: '2rem', borderRadius: '8px' }}>
      {section.philosophyTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#92400e' }}>
          {section.philosophyTitle}
        </h3>
      )}
      <p style={{ color: '#78350f', lineHeight: '1.7' }}>
        {section.philosophyText}
      </p>
    </div>
  );
}

// Commercial Specs Section Renderer
function CommercialSpecsSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      {section.commercialSpecsTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          {section.commercialSpecsTitle}
        </h3>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {section.commercialSpecsItems?.map((item: any) => (
          <div key={item._key} style={{
            background: '#ffffff',
            border: '2px solid #e5e7eb',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
              {item.spec}
            </h4>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// App Download Section Renderer
function AppDownloadSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem', textAlign: 'center', background: '#f3f4f6', padding: '2rem', borderRadius: '8px' }}>
      {section.downloadTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {section.downloadTitle}
        </h3>
      )}
      {section.downloadSubtitle && (
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          {section.downloadSubtitle}
        </p>
      )}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {section.appStoreUrl && (
          <a
            href={section.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#000',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            📱 App Store
          </a>
        )}
        {section.googlePlayUrl && (
          <a
            href={section.googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#000',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            🤖 Google Play
          </a>
        )}
      </div>
    </div>
  );
}

// How It Works Section Renderer
function HowItWorksSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      {section.worksTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          {section.worksTitle}
        </h3>
      )}
      <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
        {section.worksSteps?.map((step: string, i: number) => (
          <li key={i} style={{
            marginBottom: '1rem',
            color: '#4b5563',
            lineHeight: '1.6',
            fontSize: '1.05rem'
          }}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

// Testimonials Section Renderer
function TestimonialsSection({ section }: { section: any }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      {section.testimonialsTitle && (
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          {section.testimonialsTitle}
        </h3>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {section.testimonialsItems?.map((testimonial: any) => (
          <div key={testimonial._key} style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #8b5cf6'
          }}>
            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: '#1f2937', marginBottom: '0.75rem', lineHeight: '1.6' }}>
              "{testimonial.quote}"
            </p>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>
              — {testimonial.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Content Renderer
export default function ModalContentRenderer({ sections }: { sections: any[] }) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div>
      {sections.map((section) => {
        switch (section._type) {
          case 'gridSection':
            return <GridSection key={section._key} section={section} />;
          case 'engineeringSection':
            return <EngineeringSection key={section._key} section={section} />;
          case 'specsGridSection':
            return <SpecsGridSection key={section._key} section={section} />;
          case 'featureCardsSection':
            return <FeatureCardsSection key={section._key} section={section} />;
          case 'imageShowcaseSection':
            return <ImageShowcaseSection key={section._key} section={section} />;
          case 'diagramSection':
            return <DiagramSection key={section._key} section={section} />;
          case 'solutionSection':
            return <SolutionSection key={section._key} section={section} />;
          case 'specsSection':
            return <SpecsSection key={section._key} section={section} />;
          case 'detailSection':
            return <DetailSection key={section._key} section={section} />;
          case 'quoteSection':
            return <QuoteSection key={section._key} section={section} />;
          case 'philosophySection':
            return <PhilosophySection key={section._key} section={section} />;
          case 'commercialSpecsSection':
            return <CommercialSpecsSection key={section._key} section={section} />;
          case 'appDownloadSection':
            return <AppDownloadSection key={section._key} section={section} />;
          case 'howItWorksSection':
            return <HowItWorksSection key={section._key} section={section} />;
          case 'testimonialsSection':
            return <TestimonialsSection key={section._key} section={section} />;
          default:
            console.warn('Unknown section type:', section._type);
            return null;
        }
      })}
    </div>
  );
}
