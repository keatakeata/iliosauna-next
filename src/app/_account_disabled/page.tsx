'use client';

import './minimal-dashboard.css';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { syncUserWithSupabase } from '@/lib/supabase';
import { 
  Package, 
  FileText,
  MessageCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function MinimalDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    async function syncUser() {
      if (user) {
        try {
          const syncedUser = await syncUserWithSupabase(user);
          setUserData(syncedUser);
        } catch (error) {
          console.error('Error syncing user:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    if (user) {
      syncUser();
    }
  }, [user]);

  if (!isLoaded || loading) {
    return (
      <div className="md-dashboard">
        <div className="md-container">
          <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--md-neutral-400)' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock order data - would come from database
  const currentOrder = {
    status: 'production',
    stage: 2, // Current stage index
    totalStages: 5,
    estimatedDate: 'March 15, 2024',
    orderNumber: 'ILIO-2024-001'
  };

  const progressPercentage = ((currentOrder.stage) / (currentOrder.totalStages - 1)) * 100;

  return (
    <div className="md-dashboard">
      <div className="md-container">
        {/* Minimal Header */}
        <header className="md-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h1 className="md-greeting">Welcome back, {user.firstName}</h1>
              <p className="md-subtitle">Your sauna journey dashboard</p>
            </div>
            <button 
              onClick={() => router.push('/saunas')}
              className="md-btn-text"
              style={{ fontSize: '0.875rem' }}
            >
              Browse Saunas →
            </button>
          </div>
        </header>

        {/* Quick Order Status */}
        {currentOrder && (
          <div className="md-status">
            <div className="md-status-header">
              <h2 className="md-status-title">Order #{currentOrder.orderNumber}</h2>
              <span className="md-status-badge">In Production</span>
            </div>
            <div className="md-progress">
              <div className="md-progress-track">
                <div className="md-progress-line" />
                <div className="md-progress-line-fill" style={{ width: `calc(${progressPercentage}% - 32px)` }} />
                {[...Array(currentOrder.totalStages)].map((_, index) => (
                  <div 
                    key={index}
                    className={`md-progress-stage ${
                      index < currentOrder.stage ? 'completed' : 
                      index === currentOrder.stage ? 'active' : ''
                    }`}
                  >
                    <div className="md-progress-circle">
                      {index < currentOrder.stage ? (
                        <CheckCircle size={16} />
                      ) : index === currentOrder.stage ? (
                        <Clock size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="md-progress-label">
                      {['Confirmed', 'Production', 'Quality', 'Shipping', 'Delivery'][index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md-status-info">
              <span>Stage {currentOrder.stage + 1} of {currentOrder.totalStages}</span>
              <span>Est. Delivery: {currentOrder.estimatedDate}</span>
            </div>
          </div>
        )}

        {/* Navigation Cards - Consolidated */}
        <div className="md-nav-grid">
          <div 
            className="md-nav-card"
            onClick={() => router.push('/account/journey')}
          >
            <Package className="md-nav-icon" />
            <h3 className="md-nav-title">Journey & Order</h3>
            <p className="md-nav-description">
              Track production progress, view specifications, and monitor delivery status
            </p>
          </div>

          <div 
            className="md-nav-card"
            onClick={() => router.push('/account/resources')}
          >
            <FileText className="md-nav-icon" />
            <h3 className="md-nav-title">Resources & Preparation</h3>
            <p className="md-nav-description">
              Installation guides, site preparation, warranties, and exclusive content
            </p>
          </div>

          <div 
            className="md-nav-card"
            onClick={() => router.push('/account/support')}
          >
            <MessageCircle className="md-nav-icon" />
            <h3 className="md-nav-title">Support & Settings</h3>
            <p className="md-nav-description">
              Contact your concierge, manage account, and adjust preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}