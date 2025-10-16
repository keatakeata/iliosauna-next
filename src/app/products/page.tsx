'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, Filter, Award, Truck, Shield, Sparkles } from 'lucide-react';

// Force dynamic rendering to prevent DataCloneError
export const dynamic = 'force-dynamic';

type Category = 'all' | 'saunas' | 'infrared' | 'cold-therapy' | 'wellness';
type SortOption = 'featured' | 'price-low' | 'price-high' | 'newest';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  features: string[];
  badge?: 'Featured' | 'New' | 'Best Seller' | 'Limited';
  inStock: boolean;
  stockCount?: number;
  releaseDate: string;
}

// Mock product data - will be replaced with GHL/Sanity integration
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ilio Sauna',
    slug: 'saunas', // Route to /saunas page
    price: 20000,
    image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg', // First homepage hero image
    category: 'saunas',
    features: ['2×4 Frame with R-14 Insulation', 'HUUM DROP 9kW Heater', 'Tempered Glass Doors', 'Smart Control & App'],
    inStock: true,
    stockCount: 3,
    releaseDate: '2025-01-15'
  },
  {
    id: '2',
    name: 'Infrared Therapy Pod',
    slug: 'infrared-therapy-pod',
    price: 8999,
    image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6deefde6fa237370e2.jpeg',
    category: 'infrared',
    features: ['Full Spectrum IR', 'Chromotherapy', 'Bluetooth Audio', 'Touch Controls'],
    inStock: true,
    releaseDate: '2025-10-01'
  },
  {
    id: '3',
    name: 'Cold Plunge Tub Pro',
    slug: 'cold-plunge-tub-pro',
    price: 6499,
    image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/688e6fd14f59c85a9f60aa2d.jpeg',
    category: 'cold-therapy',
    features: ['Temperature Control', 'Filtration System', 'Insulated Design', 'Easy Drain'],
    inStock: true,
    stockCount: 5,
    releaseDate: '2024-08-20'
  },
  {
    id: '4',
    name: 'Meditation Float Pod',
    slug: 'meditation-float-pod',
    price: 15999,
    image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb49eefde6142a736f7c.jpeg',
    category: 'wellness',
    features: ['Sensory Deprivation', 'Salt Water System', 'Sound Isolation', 'Air Purification'],
    inStock: true,
    stockCount: 2,
    releaseDate: '2025-03-10'
  },
  {
    id: '5',
    name: 'Infrared Sauna Blanket',
    slug: 'infrared-sauna-blanket',
    price: 599,
    image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6898b31fefa0f04e3e74fc35.jpeg',
    category: 'infrared',
    features: ['Portable Design', 'Low EMF Technology', 'Easy Storage', 'Digital Controller'],
    inStock: true,
    releaseDate: '2024-11-05'
  },
  {
    id: '6',
    name: 'Red Light Therapy Panel',
    slug: 'red-light-therapy-panel',
    price: 799,
    image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg',
    category: 'wellness',
    features: ['660nm & 850nm Wavelengths', 'Wall Mountable', 'Timer Function', 'Full Body Coverage'],
    inStock: true,
    releaseDate: '2025-02-28'
  }
];

const CATEGORIES = [
  { id: 'all' as Category, label: 'All Products' },
  { id: 'saunas' as Category, label: 'Saunas' },
  { id: 'infrared' as Category, label: 'Infrared' },
  { id: 'cold-therapy' as Category, label: 'Cold Therapy' },
  { id: 'wellness' as Category, label: 'Wellness' }
];

const SORT_OPTIONS = [
  { id: 'featured' as SortOption, label: 'Featured' },
  { id: 'price-low' as SortOption, label: 'Price: Low to High' },
  { id: 'price-high' as SortOption, label: 'Price: High to Low' },
  { id: 'newest' as SortOption, label: 'Newest' }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'featured':
        default:
          // Ilio Sauna always first when sorting by featured
          if (a.name === 'Ilio Sauna') return -1;
          if (b.name === 'Ilio Sauna') return 1;
          return a.badge ? -1 : 1;
      }
    });

    return sorted;
  }, [selectedCategory, sortBy]);

  return (
    <>
      <Navbar animated={true} />
      <main style={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          minHeight: '60vh',
          overflow: 'hidden'
        }}>
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }}>
            <img
              src="https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68e45f310a6dc2173a0d8867.jpeg"
              alt="Wellness products background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
            {/* Dark overlay for text contrast */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)'
            }} />
          </div>

          {/* Content - Bottom Left */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            padding: '4rem 0 3rem'
          }}>
            <div className="ilio-container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  maxWidth: '600px',
                  textAlign: 'left'
                }}
              >
                <h1 style={{
                  fontSize: 'clamp(2.4rem, 3.6vw, 3.6rem)',
                  fontWeight: '100',
                  marginBottom: '0.6rem',
                  lineHeight: '1.1',
                  letterSpacing: '0.08em',
                  color: '#fff',
                  fontFamily: 'var(--font-primary)'
                }}>
                  Premium Wellness Products
                </h1>
                <p style={{
                  fontSize: '1.08rem',
                  color: 'rgba(255,255,255,0.8)',
                  margin: 0,
                  lineHeight: '1.6',
                  fontWeight: '200',
                  letterSpacing: '0.06em'
                }}>
                  Transform your space into a sanctuary of health and relaxation
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sticky Filter Bar */}
        <div style={{
          position: 'sticky',
          top: '70px',
          zIndex: 40,
          background: '#fff',
          borderBottom: '1px solid #e5e5e5'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '8px 20px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '8px',
            alignItems: 'stretch'
          }}>
            {/* Mobile: Category Dropdown, Desktop: Category Buttons */}
            {isMobile ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #e5e5e5',
                    background: '#fff',
                    color: '#333',
                    fontWeight: '400',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span>{CATEGORIES.find(cat => cat.id === selectedCategory)?.label || 'All Products'}</span>
                  <ChevronDown size={14} style={{
                    transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }} />
                </button>

                {isCategoryOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    background: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 50
                  }}>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 20px',
                          textAlign: 'left',
                          border: 'none',
                          background: selectedCategory === cat.id ? '#f5f5f5' : 'transparent',
                          color: selectedCategory === cat.id ? '#1a1a1a' : '#666',
                          fontWeight: selectedCategory === cat.id ? '500' : '400',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          letterSpacing: '0.05em'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== cat.id) {
                            e.currentTarget.style.background = '#f9f9f9';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== cat.id) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                flex: '1'
              }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: selectedCategory === cat.id
                        ? '1px solid #1a1a1a'
                        : '1px solid #e5e5e5',
                      background: selectedCategory === cat.id
                        ? '#1a1a1a'
                        : 'transparent',
                      color: selectedCategory === cat.id ? '#fff' : '#666',
                      fontWeight: '400',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.05em'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== cat.id) {
                        e.currentTarget.style.borderColor = '#999';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== cat.id) {
                        e.currentTarget.style.borderColor = '#e5e5e5';
                      }
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Sort Dropdown */}
            <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                style={{
                  width: isMobile ? '100%' : 'auto',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #e5e5e5',
                  background: '#fff',
                  color: '#333',
                  fontWeight: '400',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minWidth: isMobile ? '100%' : '180px',
                  justifyContent: 'space-between',
                  letterSpacing: '0.05em'
                }}
              >
                <span>{SORT_OPTIONS.find(opt => opt.id === sortBy)?.label}</span>
                <ChevronDown size={14} style={{
                  transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} />
              </button>

              {isSortOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minWidth: isMobile ? '100%' : '200px',
                  zIndex: 50
                }}>
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        textAlign: 'left',
                        border: 'none',
                        background: sortBy === opt.id ? '#f5f5f5' : 'transparent',
                        color: '#333',
                        fontWeight: sortBy === opt.id ? '500' : '400',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        letterSpacing: '0.05em'
                      }}
                      onMouseEnter={(e) => {
                        if (sortBy !== opt.id) {
                          e.currentTarget.style.background = '#f9f9f9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (sortBy !== opt.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <section style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '32px'
          }}>
            {filteredAndSortedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                {...product}
                index={index}
              />
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#666'
            }}>
              <Filter size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No products found</h3>
              <p>Try adjusting your filters or check back soon for new arrivals</p>
            </div>
          )}
        </section>

        {/* Trust Signals Section */}
        <section style={{
          background: '#f9f9f9',
          padding: '60px 20px'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            {[
              { icon: Award, title: 'Made in BC', desc: 'Expertly crafted on Vancouver Island' },
              { icon: Shield, title: 'Warranty Included', desc: 'Comprehensive coverage with every purchase' },
              { icon: Truck, title: 'Free Delivery', desc: 'Across BC and select regions' },
              { icon: Sparkles, title: 'White-Glove Service', desc: 'Professional installation available' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  textAlign: 'center',
                  padding: '32px 20px'
                }}
              >
                <item.icon size={48} style={{
                  margin: '0 auto 16px',
                  color: '#666'
                }} />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '400',
                  marginBottom: '8px',
                  color: '#1a1a1a'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#666'
                }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          background: '#1a1a1a',
          padding: '80px 20px',
          textAlign: 'center',
          color: '#fff'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '100',
              marginBottom: '20px',
              lineHeight: '1.2',
              letterSpacing: '0.06em',
              color: '#fff'
            }}>
              Not Sure Which Product Is Right for You?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '32px',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: '200'
            }}>
              Book a free consultation with our wellness experts
            </p>
            <a
              href="/contact"
              style={{
                display: 'inline-block',
                padding: '0.72rem 1.8rem',
                background: 'transparent',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: '400',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fff';
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
              }}
            >
              Schedule Free Consultation <span style={{ marginLeft: '0.6rem' }}>→</span>
            </a>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}