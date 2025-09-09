'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Zap, DollarSign } from 'lucide-react';
import '../minimal-dashboard.css';

export default function OrderDetailsPage() {
  const router = useRouter();

  // Mock order data - would come from Stripe integration
  const orderDetails = {
    orderNumber: 'ILIO-2024-001',
    orderDate: 'January 15, 2024',
    model: 'Cedar Cube Sauna',
    size: '6 Person (8\' x 8\' x 7\')',
    specifications: [
      { label: 'Wood Type', value: 'Premium Canadian Cedar' },
      { label: 'Heater', value: 'Harvia 8kW Electric' },
      { label: 'Door', value: 'Full Glass Bronze Tint' },
      { label: 'Lighting', value: 'LED Strip Package' },
      { label: 'Benches', value: 'Two-Tier L-Shape' },
      { label: 'Accessories', value: 'Premium Package' }
    ],
    pricing: {
      basePrice: 20000,
      delivery: 'Included',
      installation: 'Included',
      tax: 2600,
      total: 22600
    }
  };

  return (
    <div className="md-dashboard">
      <div className="md-container">
        {/* Breadcrumbs */}
        <div className="md-breadcrumbs">
          <a href="/account" className="md-breadcrumb-link">Dashboard</a>
          <span className="md-breadcrumb-separator">/</span>
          <span className="md-breadcrumb-current">Order Details</span>
        </div>

        {/* Page Header */}
        <div className="md-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 className="md-greeting">Order Details</h1>
              <p className="md-subtitle">Order #{orderDetails.orderNumber} • Placed {orderDetails.orderDate}</p>
            </div>
            <button 
              onClick={() => router.push('/saunas')}
              className="md-btn-text"
              style={{ fontSize: '0.875rem' }}
            >
              Browse More Saunas →
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Package size={20} style={{ color: 'var(--md-neutral-400)' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)' }}>
              Product Specifications
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.25rem' }}>Model</p>
              <p style={{ fontSize: '1rem', color: 'var(--md-neutral-800)', fontWeight: 500 }}>{orderDetails.model}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.25rem' }}>Size</p>
              <p style={{ fontSize: '1rem', color: 'var(--md-neutral-800)', fontWeight: 500 }}>{orderDetails.size}</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Package size={20} style={{ color: 'var(--md-neutral-400)' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)' }}>
              Included Features
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orderDetails.specifications.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: index < orderDetails.specifications.length - 1 ? '1px solid var(--md-neutral-100)' : 'none'
              }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)' }}>{item.label}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Requirements */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Zap size={20} style={{ color: 'var(--md-neutral-400)' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)' }}>
              Technical Requirements
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.25rem' }}>Electrical</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>240V / 40A Circuit</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.25rem' }}>Foundation</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>Level Concrete Pad</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.25rem' }}>Clearance</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>12" All Sides</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--md-neutral-500)', marginBottom: '0.25rem' }}>Weight</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-700)' }}>1,850 lbs</p>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <DollarSign size={20} style={{ color: 'var(--md-neutral-400)' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)' }}>
              Investment Summary
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)' }}>Starting Price</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)' }}>${orderDetails.pricing.basePrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)' }}>White Glove Delivery</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-accent)' }}>{orderDetails.pricing.delivery}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)' }}>Professional Installation</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-accent)' }}>{orderDetails.pricing.installation}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)' }}>Estimated Tax</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-800)' }}>${orderDetails.pricing.tax.toLocaleString()}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--md-neutral-200)',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '1rem', color: 'var(--md-neutral-800)', fontWeight: 500 }}>Total Investment</span>
              <span style={{ fontSize: '1rem', color: 'var(--md-neutral-800)', fontWeight: 600 }}>${orderDetails.pricing.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}