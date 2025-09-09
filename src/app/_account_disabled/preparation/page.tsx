'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Circle, AlertCircle, Zap, Home, FileText, Phone } from 'lucide-react';
import '../minimal-dashboard.css';

const checklist = [
  {
    category: 'Site Preparation',
    icon: Home,
    items: [
      { task: 'Level concrete pad or deck foundation', completed: true },
      { task: 'Clear 12" perimeter around sauna location', completed: true },
      { task: 'Ensure proper drainage away from foundation', completed: false },
      { task: 'Verify access path for delivery (min 4\' wide)', completed: false }
    ]
  },
  {
    category: 'Electrical Requirements',
    icon: Zap,
    items: [
      { task: 'Install 240V/40A dedicated circuit', completed: true },
      { task: 'GFCI breaker installed', completed: true },
      { task: 'Electrical inspection scheduled', completed: false },
      { task: 'Weatherproof disconnect within sight of sauna', completed: false }
    ]
  },
  {
    category: 'Permits & Documentation',
    icon: FileText,
    items: [
      { task: 'Building permit obtained', completed: true },
      { task: 'HOA approval (if applicable)', completed: true },
      { task: 'Electrical permit filed', completed: false },
      { task: 'Insurance company notified', completed: false }
    ]
  }
];

export default function PreparationPage() {
  const router = useRouter();

  const totalItems = checklist.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedItems = checklist.reduce((acc, cat) => 
    acc + cat.items.filter(item => item.completed).length, 0
  );
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <div className="md-dashboard">
      <div className="md-container">
        {/* Breadcrumbs */}
        <div className="md-breadcrumbs">
          <a href="/account" className="md-breadcrumb-link">Dashboard</a>
          <span className="md-breadcrumb-separator">/</span>
          <span className="md-breadcrumb-current">Preparation Guide</span>
        </div>

        {/* Page Header */}
        <div className="md-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 className="md-greeting">Preparation Guide</h1>
              <p className="md-subtitle">Get your space ready for delivery</p>
            </div>
            <button 
              onClick={() => router.push('/saunas')}
              className="md-btn-text"
              style={{ fontSize: '0.875rem' }}
            >
              Browse Saunas →
            </button>
          </div>
        </div>

        {/* Progress Overview */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--md-neutral-700)' }}>
                Preparation Progress
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--md-neutral-500)' }}>
                {completedItems} of {totalItems} tasks complete
              </span>
            </div>
            <div className="md-progress">
              <div className="md-progress-bar" style={{ width: `${progressPercentage}%` }} />
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

        {/* Checklist Categories */}
        {checklist.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <div key={categoryIndex} style={{ 
              background: 'white', 
              border: '1px solid var(--md-neutral-200)', 
              borderRadius: '0.75rem', 
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Icon size={20} style={{ color: 'var(--md-neutral-400)' }} />
                <h2 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--md-neutral-800)' }}>
                  {category.category}
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {category.items.map((item, index) => (
                  <label 
                    key={index}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: item.completed ? 'var(--md-neutral-50)' : 'white',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle size={20} style={{ color: 'var(--md-accent)', flexShrink: 0 }} />
                    ) : (
                      <Circle size={20} style={{ color: 'var(--md-neutral-300)', flexShrink: 0 }} />
                    )}
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: item.completed ? 'var(--md-neutral-600)' : 'var(--md-neutral-800)',
                      textDecoration: item.completed ? 'line-through' : 'none'
                    }}>
                      {item.task}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        {/* Contact Support */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--md-neutral-200)', 
          borderRadius: '0.75rem', 
          padding: '2rem',
          textAlign: 'center'
        }}>
          <Phone size={32} style={{ color: 'var(--md-neutral-400)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--md-neutral-800)', marginBottom: '0.5rem' }}>
            Need Help with Preparation?
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--md-neutral-600)', marginBottom: '1.5rem' }}>
            Our team is here to guide you through every step
          </p>
          <button 
            onClick={() => router.push('/account/concierge')}
            className="md-btn"
          >
            Contact Concierge
          </button>
        </div>
      </div>
    </div>
  );
}