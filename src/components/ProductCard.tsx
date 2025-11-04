'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  category?: string;
  features: string[];
  badge?: 'Featured' | 'New' | 'Best Seller' | 'Limited';
  inStock: boolean;
  stockCount?: number;
  index: number;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  salePrice,
  image,
  category,
  features,
  badge,
  inStock,
  stockCount,
  index
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const displayPrice = salePrice || price;
  const monthlyPayment = (displayPrice / 24).toFixed(0);
  const savings = salePrice ? price - salePrice : 0;

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price: displayPrice,
      quantity: 1,
      image,
      slug
    });

    // Log to dev indicator
    if (typeof window !== 'undefined' && (window as any).addDevLog) {
      (window as any).addDevLog(`Added "${name}" to cart`, 'success');
    }
  };

  const badgeColors = {
    'Featured': 'linear-gradient(135deg, #BF5813 0%, #D87440 100%)',
    'New': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    'Best Seller': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'Limited': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 25,
          delay: Math.min(index * 0.1, 0.3),
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0 12px 32px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Image Container */}
      <Link href={`/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '75%', // 4:3 aspect ratio
          background: '#f3f4f6',
          overflow: 'hidden',
        }}>
          {/* Badge */}
          {badge && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: badgeColors[badge],
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              zIndex: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              {badge}
            </div>
          )}

          {/* Stock Badge */}
          {inStock && stockCount && stockCount <= 3 && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: '#ef4444',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              zIndex: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              Only {stockCount} left
            </div>
          )}

          {/* Image */}
          <img
            src={image}
            alt={name}
            loading="eager"
            fetchPriority="high"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'all 0.4s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Loading State */}
          {!imageLoaded && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              border: '3px solid #f3f4f6',
              borderTop: '3px solid #BF5813',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          )}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Category */}
        {category && (
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#BF5813',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}>
            {category}
          </div>
        )}

        {/* Product Name */}
        <Link href={`/${slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '400',
            color: '#1a1a1a',
            marginBottom: '12px',
            lineHeight: '1.3',
            transition: 'color 0.2s',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#BF5813'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#1a1a1a'}
          >
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div style={{ marginBottom: '16px' }}>
          {salePrice ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ef4444',
              }}>
                ${salePrice.toLocaleString()}
              </span>
              <span style={{
                fontSize: '16px',
                color: '#9ca3af',
                textDecoration: 'line-through',
              }}>
                ${price.toLocaleString()}
              </span>
              {savings > 0 && (
                <span style={{
                  fontSize: '12px',
                  color: '#16a34a',
                  fontWeight: '600',
                  background: '#dcfce7',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}>
                  Save ${savings.toLocaleString()}
                </span>
              )}
            </div>
          ) : (
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1a1a1a',
            }}>
              ${price.toLocaleString()}
            </span>
          )}

          {/* Financing */}
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
            marginTop: '4px',
          }}>
            or ${monthlyPayment}/month
          </div>
        </div>

        {/* Features */}
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 20px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {features.slice(0, 3).map((feature, idx) => (
            <li key={idx} style={{
              fontSize: '13px',
              color: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="8" fill="#dcfce7"/>
                <path d="M5 8l2 2 4-4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {/* Stock Status */}
        {!inStock && (
          <div style={{
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#991b1b',
            fontWeight: '500',
            textAlign: 'center',
          }}>
            Out of Stock - Contact for Availability
          </div>
        )}

        {/* CTAs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <Link href={`/${slug}`} style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: '1px solid #1a1a1a',
              color: '#1a1a1a',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.05em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#1a1a1a';
            }}
            >
              View Details
            </button>
          </Link>

          {FEATURE_FLAGS.SHOW_ADD_TO_CART && inStock && (
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '12px',
                background: '#BF5813',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D87440';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#BF5813';
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
