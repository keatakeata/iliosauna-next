'use client';

import React from 'react';

interface TimelineStage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface OrderTimelineProps {
  currentStatus: string;
  orderDate: string;
  estimatedDates?: {
    processing?: string;
    manufacturing?: string;
    shipped?: string;
    delivered?: string;
    installation?: string;
    completed?: string;
  };
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ 
  currentStatus, 
  orderDate,
  estimatedDates = {}
}) => {
  const getStageStatus = (stageId: string): 'completed' | 'current' | 'upcoming' => {
    const stageOrder = [
      'order_placed',
      'processing',
      'manufacturing',
      'shipped',
      'delivered',
      'installation',
      'completed'
    ];
    
    const currentIndex = stageOrder.indexOf(currentStatus);
    const stageIndex = stageOrder.indexOf(stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const stages: TimelineStage[] = [
    {
      id: 'order_placed',
      title: 'Order Placed',
      description: 'Your order has been received and payment confirmed',
      date: orderDate,
      status: getStageStatus('order_placed'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'Reviewing order details and preparing for manufacturing',
      date: estimatedDates.processing,
      status: getStageStatus('processing'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      description: 'Your sauna is being handcrafted by our artisans',
      date: estimatedDates.manufacturing,
      status: getStageStatus('manufacturing'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: 'Your sauna is on its way to you',
      date: estimatedDates.shipped,
      status: getStageStatus('shipped'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 8h5l3 5v5h-8V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Your sauna has arrived at your property',
      date: estimatedDates.delivered,
      status: getStageStatus('delivered'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 7l-8 5-8-5M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M12 12v7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'installation',
      title: 'Installation',
      description: 'Professional installation team setting up your sauna',
      date: estimatedDates.installation,
      status: getStageStatus('installation'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'completed',
      title: 'Completed',
      description: 'Your sauna is ready for use. Enjoy!',
      date: estimatedDates.completed,
      status: getStageStatus('completed'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const getStageColor = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'current':
        return '#9B8B7E';
      case 'upcoming':
        return '#e0e0e0';
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Desktop Timeline */}
      <div className="desktop-timeline" style={{
        display: 'none',
        '@media (min-width: 768px)': { display: 'block' }
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4rem'
        }}>
          {/* Progress Bar Background */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '30px',
            right: '30px',
            height: '2px',
            background: '#e0e0e0',
            zIndex: 0
          }} />
          
          {/* Progress Bar Fill */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '30px',
            width: `${(stages.findIndex(s => s.status === 'current') + 1) / stages.length * 100}%`,
            height: '2px',
            background: 'linear-gradient(90deg, #4CAF50 0%, #9B8B7E 100%)',
            zIndex: 1,
            transition: 'width 0.5s ease'
          }} />

          {/* Stage Nodes */}
          {stages.map((stage, index) => (
            <div key={stage.id} style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2
            }}>
              {/* Node Circle */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: stage.status === 'upcoming' ? 'white' : getStageColor(stage.status),
                border: `2px solid ${getStageColor(stage.status)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                transition: 'all 0.3s ease',
                ...(stage.status === 'current' && {
                  animation: 'pulse 2s infinite',
                  boxShadow: `0 0 0 4px ${getStageColor(stage.status)}20`
                })
              }}>
                <div style={{
                  color: stage.status === 'upcoming' ? '#e0e0e0' : 'white'
                }}>
                  {stage.icon}
                </div>
              </div>

              {/* Stage Info */}
              <div style={{
                textAlign: 'center',
                maxWidth: '120px'
              }}>
                <h4 style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: stage.status === 'upcoming' ? '#999' : '#333',
                  marginBottom: '0.25rem'
                }}>
                  {stage.title}
                </h4>
                {stage.date && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    margin: 0
                  }}>
                    {stage.date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="mobile-timeline" style={{
        display: 'block',
        '@media (min-width: 768px)': { display: 'none' }
      }}>
        <div style={{
          position: 'relative',
          paddingLeft: '3rem'
        }}>
          {/* Vertical Line */}
          <div style={{
            position: 'absolute',
            left: '24px',
            top: '24px',
            bottom: '24px',
            width: '2px',
            background: '#e0e0e0'
          }} />

          {stages.map((stage, index) => (
            <div key={stage.id} style={{
              position: 'relative',
              marginBottom: '2.5rem'
            }}>
              {/* Node Circle */}
              <div style={{
                position: 'absolute',
                left: '-27px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: stage.status === 'upcoming' ? 'white' : getStageColor(stage.status),
                border: `2px solid ${getStageColor(stage.status)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(stage.status === 'current' && {
                  animation: 'pulse 2s infinite',
                  boxShadow: `0 0 0 4px ${getStageColor(stage.status)}20`
                })
              }}>
                <div style={{
                  color: stage.status === 'upcoming' ? '#e0e0e0' : 'white'
                }}>
                  {stage.icon}
                </div>
              </div>

              {/* Content */}
              <div style={{
                marginLeft: '1.5rem',
                paddingTop: '0.5rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: stage.status === 'upcoming' ? '#999' : '#333',
                  marginBottom: '0.25rem'
                }}>
                  {stage.title}
                </h4>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#666',
                  marginBottom: '0.5rem'
                }}>
                  {stage.description}
                </p>
                {stage.date && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9B8B7E',
                    fontWeight: 500
                  }}>
                    {stage.date}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(155, 139, 126, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(155, 139, 126, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(155, 139, 126, 0);
          }
        }

        @media (min-width: 768px) {
          .desktop-timeline {
            display: block !important;
          }
          .mobile-timeline {
            display: none !important;
          }
        }

        @media (max-width: 767px) {
          .desktop-timeline {
            display: none !important;
          }
          .mobile-timeline {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderTimeline;