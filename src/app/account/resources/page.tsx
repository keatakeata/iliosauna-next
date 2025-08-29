'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Download, FileText, Video, Book, Shield, Calculator, Image, ChevronDown, ChevronUp, Play, CheckCircle, Circle, AlertCircle, Zap, Home, Phone } from 'lucide-react';
import '../minimal-dashboard.css';

const resources = [
  {
    category: 'Essential Guides',
    items: [
      { 
        name: '7-Step Sauna Ritual Guide', 
        type: 'PDF', 
        size: '2.3 MB', 
        icon: Book,
        description: 'Learn the traditional Nordic sauna rituals and how to maximize health benefits from your sessions.',
        downloadable: true
      },
      { 
        name: 'Maintenance & Care Manual', 
        type: 'PDF', 
        size: '1.8 MB', 
        icon: FileText,
        description: 'Complete guide to keeping your sauna in pristine condition for years of enjoyment.',
        downloadable: true
      },
      { 
        name: 'Warranty Documentation', 
        type: 'PDF', 
        size: '890 KB', 
        icon: Shield,
        description: 'Your comprehensive warranty coverage details and claim procedures.',
        downloadable: true
      }
    ]
  },
  {
    category: 'Technical Documents',
    items: [
      { 
        name: 'Electrical Specifications', 
        type: 'PDF', 
        size: '1.2 MB', 
        icon: FileText,
        description: 'Detailed electrical requirements and wiring diagrams for your electrician.',
        downloadable: true
      },
      { 
        name: 'Assembly Instructions', 
        type: 'PDF', 
        size: '4.5 MB', 
        icon: FileText,
        description: 'Step-by-step assembly guide with detailed illustrations.',
        downloadable: true
      },
      { 
        name: 'Foundation Requirements', 
        type: 'PDF', 
        size: '980 KB', 
        icon: FileText,
        description: 'Foundation specifications and site preparation guidelines.',
        downloadable: true
      }
    ]
  },
  {
    category: 'Video Content',
    items: [
      { 
        name: 'Installation Walkthrough', 
        type: 'Video', 
        size: '15 min', 
        icon: Video,
        description: 'Watch our team demonstrate the complete installation process from start to finish.',
        downloadable: false
      },
      { 
        name: 'First Use Tutorial', 
        type: 'Video', 
        size: '8 min', 
        icon: Video,
        description: 'Everything you need to know for your first sauna session.',
        downloadable: false
      },
      { 
        name: 'Maintenance Guide', 
        type: 'Video', 
        size: '12 min', 
        icon: Video,
        description: 'Visual guide to routine maintenance and care procedures.',
        downloadable: false
      }
    ]
  },
  {
    category: 'Business Tools',
    items: [
      { 
        name: 'ROI Calculator', 
        type: 'Excel', 
        size: '156 KB', 
        icon: Calculator,
        description: 'Calculate your return on investment for commercial or rental properties.',
        downloadable: true
      },
      { 
        name: 'Marketing Images', 
        type: 'ZIP', 
        size: '23 MB', 
        icon: Image,
        description: 'High-resolution images for your Airbnb listing or marketing materials.',
        downloadable: true
      },
      { 
        name: 'Guest Waiver Template', 
        type: 'DOCX', 
        size: '45 KB', 
        icon: FileText,
        description: 'Legal waiver template for commercial or rental use.',
        downloadable: true
      }
    ]
  }
];

export default function ResourcesPage() {
  const router = useRouter();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleAccordion = (itemName: string) => {
    setOpenItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <div className="md-dashboard">
      <div className="md-container">
        {/* Breadcrumbs */}
        <div className="md-breadcrumbs">
          <a href="/account" className="md-breadcrumb-link">Dashboard</a>
          <span className="md-breadcrumb-separator">/</span>
          <span className="md-breadcrumb-current">Resources & Preparation</span>
        </div>

        {/* Page Header */}
        <div className="md-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 className="md-greeting">Resources & Preparation</h1>
              <p className="md-subtitle">Guides, documentation, and preparation checklist</p>
            </div>
            <button 
              onClick={() => router.push('/saunas')}
              className="md-btn-text"
              style={{ fontSize: '0.875rem' }}
            >
              Browse Saunas
            </button>
          </div>
        </div>

        {/* Resource Categories */}
        {resources.map((category, categoryIndex) => (
          <div key={categoryIndex} style={{ 
            background: 'white', 
            border: '1px solid var(--md-neutral-200)', 
            borderRadius: '0.75rem', 
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 500, 
              color: 'var(--md-neutral-800)',
              marginBottom: '1.5rem'
            }}>
              {category.category}
            </h2>
            
            <div>
              {category.items.map((item, index) => {
                const Icon = item.icon;
                const isOpen = openItems.includes(`${categoryIndex}-${index}`);
                
                return (
                  <div key={index} className="md-accordion-item">
                    <button
                      className="md-accordion-header"
                      onClick={() => toggleAccordion(`${categoryIndex}-${index}`)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Icon size={20} style={{ color: 'var(--md-neutral-400)' }} />
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-800)' }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)' }}>
                            {item.type} • {item.size}
                          </p>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    
                    {isOpen && (
                      <div className="md-accordion-content">
                        <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '1rem' }}>
                          {item.description}
                        </p>
                        {item.downloadable ? (
                          <button 
                            className="md-btn"
                            style={{ 
                              padding: '0.5rem 1rem',
                              fontSize: '0.875rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <Download size={16} />
                            Download {item.type}
                          </button>
                        ) : (
                          <button 
                            className="md-btn"
                            style={{ 
                              padding: '0.5rem 1rem',
                              fontSize: '0.875rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              background: 'var(--md-accent)'
                            }}
                          >
                            <Play size={16} />
                            Watch Video
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Preparation Checklist */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '1.5rem' }}>
            Preparation Checklist
          </h2>
          
          {/* Site Preparation */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Home size={20} style={{ color: 'var(--md-neutral-400)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--md-neutral-700)' }}>
                Site Preparation
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--md-accent)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', textDecoration: 'line-through' }}>
                  Level concrete pad or deck foundation
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--md-accent)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', textDecoration: 'line-through' }}>
                  Clear 12" perimeter around sauna location
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Circle size={16} style={{ color: 'var(--md-neutral-300)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)' }}>
                  Ensure proper drainage away from foundation
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Circle size={16} style={{ color: 'var(--md-neutral-300)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)' }}>
                  Verify access path for delivery (min 4' wide)
                </span>
              </label>
            </div>
          </div>

          {/* Electrical Requirements */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Zap size={20} style={{ color: 'var(--md-neutral-400)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--md-neutral-700)' }}>
                Electrical Requirements
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--md-accent)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', textDecoration: 'line-through' }}>
                  Install 240V/40A dedicated circuit
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--md-accent)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', textDecoration: 'line-through' }}>
                  GFCI breaker installed
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Circle size={16} style={{ color: 'var(--md-neutral-300)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)' }}>
                  Electrical inspection scheduled
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Circle size={16} style={{ color: 'var(--md-neutral-300)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)' }}>
                  Weatherproof disconnect within sight of sauna
                </span>
              </label>
            </div>
          </div>

          {/* Permits & Documentation */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <FileText size={20} style={{ color: 'var(--md-neutral-400)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--md-neutral-700)' }}>
                Permits & Documentation
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--md-accent)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', textDecoration: 'line-through' }}>
                  Building permit obtained
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={16} style={{ color: 'var(--md-accent)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', textDecoration: 'line-through' }}>
                  HOA approval (if applicable)
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Circle size={16} style={{ color: 'var(--md-neutral-300)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)' }}>
                  Electrical permit filed
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Circle size={16} style={{ color: 'var(--md-neutral-300)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)' }}>
                  Insurance company notified
                </span>
              </label>
            </div>
          </div>
          
          <div style={{ 
            padding: '1rem',
            background: 'var(--md-accent-subtle)',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} style={{ color: 'var(--md-accent)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>
              Complete all preparation tasks before your scheduled delivery date to ensure a smooth installation.
            </p>
          </div>
        </div>

        {/* Support Note */}
        <div style={{ 
          background: 'var(--md-accent-subtle)', 
          border: '1px solid var(--md-accent)',
          borderRadius: '0.5rem',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--md-accent)' }}>
            Need something specific? Contact your concierge for additional resources.
          </p>
        </div>
      </div>
    </div>
  );
}