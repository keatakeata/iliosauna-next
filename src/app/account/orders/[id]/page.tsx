'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  customer_email: string;
  customer_name: string;
  created_at: string;
  stripe_payment_intent_id: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ShippingInfo {
  id: string;
  tracking_number: string;
  status: string;
  carrier?: string;
  estimated_delivery?: string;
  created_at: string;
}

interface Installation {
  id: string;
  status: string;
  scheduled_date: string;
  time_slot?: string;
  installer_name?: string;
  notes?: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: string;
}

export default function OrderDetailPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [installation, setInstallation] = useState<Installation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (user && orderId) {
        try {
          // Fetch order details
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('clerk_user_id', user.id)
            .single();
          
          if (!orderError && orderData) {
            setOrder(orderData);
            
            // Fetch order items
            const { data: itemsData } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', orderId);
            
            if (itemsData) setOrderItems(itemsData);
            
            // Fetch shipping info
            const { data: shippingData } = await supabase
              .from('shipping_tracking')
              .select('*')
              .eq('order_id', orderId)
              .single();
            
            if (shippingData) setShipping(shippingData);
            
            // Fetch installation info
            const { data: installationData } = await supabase
              .from('installations')
              .select('*')
              .eq('order_id', orderId)
              .single();
            
            if (installationData) setInstallation(installationData);
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [user, orderId]);

  const getTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];
    
    // Define the order flow stages
    const orderStatus = order?.status || 'pending';
    
    // Stage 1: Order Placed
    if (order) {
      events.push({
        date: new Date(order.created_at).toLocaleDateString(),
        title: 'Order Placed',
        description: `Order #${order.order_number} confirmed`,
        status: 'completed',
        icon: 'check'
      });
    }
    
    // Stage 2: Processing
    events.push({
      date: order ? new Date(new Date(order.created_at).getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString() : '',
      title: 'Processing',
      description: 'Verifying payment and order details',
      status: ['processing', 'manufacturing', 'shipped', 'delivered', 'completed'].includes(orderStatus) ? 'completed' : 
              orderStatus === 'pending' ? 'current' : 'upcoming',
      icon: 'processing'
    });
    
    // Stage 3: Manufacturing
    events.push({
      date: order ? new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : '',
      title: 'Manufacturing',
      description: 'Crafting your sauna in our BC workshop',
      status: ['manufacturing', 'shipped', 'delivered', 'completed'].includes(orderStatus) ? 
              (orderStatus === 'manufacturing' ? 'current' : 'completed') : 'upcoming',
      icon: 'manufacturing'
    });
    
    // Stage 4: Shipped
    if (shipping) {
      events.push({
        date: new Date(shipping.created_at).toLocaleDateString(),
        title: 'Shipped',
        description: `Tracking: ${shipping.tracking_number || 'Processing'}`,
        status: ['delivered', 'completed'].includes(orderStatus) ? 'completed' : 
                orderStatus === 'shipped' ? 'current' : 'upcoming',
        icon: 'package'
      });
    } else {
      events.push({
        date: 'Estimated 2-3 weeks',
        title: 'Shipping',
        description: 'Ready for shipment',
        status: 'upcoming',
        icon: 'package'
      });
    }
    
    // Stage 5: Delivered
    if (shipping?.status === 'delivered' || ['delivered', 'completed'].includes(orderStatus)) {
      events.push({
        date: shipping?.estimated_delivery || 'Completed',
        title: 'Delivered',
        description: 'Arrived at your property',
        status: orderStatus === 'delivered' ? 'current' : 
                orderStatus === 'completed' ? 'completed' : 'upcoming',
        icon: 'truck'
      });
    } else {
      events.push({
        date: shipping?.estimated_delivery || 'TBD',
        title: 'Delivery',
        description: 'En route to your location',
        status: 'upcoming',
        icon: 'truck'
      });
    }
    
    // Stage 6: Installation
    if (installation) {
      events.push({
        date: new Date(installation.scheduled_date).toLocaleDateString(),
        title: 'Installation',
        description: installation.installer_name ? `Team: ${installation.installer_name}` : 'Professional installation team',
        status: installation.status === 'in_progress' ? 'current' :
                installation.status === 'completed' ? 'completed' : 'upcoming',
        icon: 'tools'
      });
    } else {
      events.push({
        date: 'Schedule Required',
        title: 'Installation',
        description: 'Professional assembly on-site',
        status: 'upcoming',
        icon: 'tools'
      });
    }
    
    // Stage 7: Completed
    events.push({
      date: orderStatus === 'completed' ? 'Completed' : 'Pending',
      title: 'Order Complete',
      description: orderStatus === 'completed' ? 'Warranty activated' : 'Final sign-off pending',
      status: orderStatus === 'completed' ? 'completed' : 'upcoming',
      icon: orderStatus === 'completed' ? 'check' : 'pending'
    });
    
    return events;
  };

  const handleScheduleInstallation = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('installations')
        .upsert({
          order_id: orderId,
          customer_id: user?.id,
          scheduled_date: selectedDate,
          time_slot: selectedTime,
          status: 'scheduled'
        });
      
      if (!error) {
        setShowScheduler(false);
        // Refresh installation data
        const { data: installationData } = await supabase
          .from('installations')
          .select('*')
          .eq('order_id', orderId)
          .single();
        
        if (installationData) setInstallation(installationData);
      }
    } catch (error) {
      console.error('Error scheduling installation:', error);
    }
  };

  // Generate available dates (next 30 days, excluding Sundays)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 7; i < 37; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Exclude Sundays
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const timeSlots = [
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM'
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar animated={true} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar animated={true} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Order not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const timeline = getTimelineEvents();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar animated={true} />
      
      {/* Header */}
      <section style={{
        background: 'linear-gradient(135deg, #9B8B7E 0%, #7A6B5F 100%)',
        padding: '120px 0 40px',
        color: 'white'
      }}>
        <div className="ilio-container">
          <Link 
            href="/account/orders"
            style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}
          >
            ← Back to Orders
          </Link>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 100,
            letterSpacing: '0.05em',
            marginTop: '1rem',
            marginBottom: '0.5rem'
          }}>
            Order #{order.order_number || orderId.slice(0, 8).toUpperCase()}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </section>

      {/* Order Status Bar */}
      <section style={{
        background: '#f8f8f8',
        padding: '30px 0',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div className="ilio-container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: order.status === 'completed' ? '#4CAF50' : '#FF9800',
                  display: 'inline-block'
                }}></span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                  {order.status}
                </span>
              </div>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Total Amount</span>
              <div style={{ fontWeight: 600, fontSize: '1.3rem', marginTop: '0.25rem' }}>
                ${order.total_amount?.toFixed(2)}
              </div>
            </div>
            {shipping?.tracking_number && (
              <div>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>Tracking Number</span>
                <div style={{ fontWeight: 500, marginTop: '0.25rem' }}>
                  {shipping.tracking_number}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="ilio-container" style={{ padding: '60px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '3rem',
          '@media (max-width: 968px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Left Column - Timeline and Details */}
          <div>
            {/* Order Timeline */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '2rem',
                color: '#333'
              }}>
                Order Timeline
              </h2>
              
              <div style={{ position: 'relative' }}>
                {timeline.map((event, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    marginBottom: '2rem',
                    position: 'relative'
                  }}>
                    {/* Timeline line */}
                    {index < timeline.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '40px',
                        width: '2px',
                        height: '100%',
                        background: event.status === 'completed' ? '#9B8B7E' : '#e0e0e0'
                      }}></div>
                    )}
                    
                    {/* Timeline dot */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: event.status === 'completed' ? '#9B8B7E' : 
                                 event.status === 'current' ? '#FF9800' : '#f0f0f0',
                      color: event.status === 'upcoming' ? '#666' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      {event.icon === 'check' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {event.icon === 'payment' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {event.icon === 'manufacturing' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {event.icon === 'package' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {event.icon === 'truck' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round"/>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="5.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="18.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {event.icon === 'tools' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    
                    {/* Event details */}
                    <div style={{ marginLeft: '1.5rem', flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        marginBottom: '0.25rem',
                        color: event.status === 'upcoming' ? '#999' : '#333'
                      }}>
                        {event.title}
                      </h3>
                      <p style={{
                        color: '#666',
                        fontSize: '0.95rem',
                        marginBottom: '0.25rem'
                      }}>
                        {event.description}
                      </p>
                      <p style={{
                        color: '#999',
                        fontSize: '0.85rem'
                      }}>
                        {event.date}
                      </p>
                      
                      {/* Installation scheduler button */}
                      {event.title === 'Installation' && !installation && (
                        <button
                          onClick={() => setShowScheduler(true)}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: '#9B8B7E',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'background 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#8A7A6E'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#9B8B7E'}
                        >
                          Schedule Installation
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '1.5rem',
                color: '#333'
              }}>
                Order Items
              </h2>
              
              {orderItems.length > 0 ? (
                <div>
                  {orderItems.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1rem 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <div>
                        <h4 style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                          {item.product_name}
                        </h4>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 600 }}>
                          ${item.total_price?.toFixed(2)}
                        </p>
                        <p style={{ color: '#999', fontSize: '0.85rem' }}>
                          ${item.unit_price?.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '2px solid #f0f0f0'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total</span>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                      ${order.total_amount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#666' }}>No items found</p>
              )}
            </div>
          </div>

          {/* Right Column - Actions and Support */}
          <div>
            {/* Quick Actions */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 400,
                marginBottom: '1.5rem',
                color: '#333'
              }}>
                Quick Actions
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button style={{
                  padding: '0.75rem',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f8f8';
                  e.currentTarget.style.borderColor = '#9B8B7E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
                >
                  Download Invoice
                </button>
                
                {shipping?.tracking_number && (
                  <button style={{
                    padding: '0.75rem',
                    background: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8f8f8';
                    e.currentTarget.style.borderColor = '#9B8B7E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }}
                  >
                    Track Package
                  </button>
                )}
                
                <button style={{
                  padding: '0.75rem',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f8f8';
                  e.currentTarget.style.borderColor = '#9B8B7E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
                >
                  Contact Support
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div style={{
              background: '#f8f8f8',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 400,
                marginBottom: '1rem',
                color: '#333'
              }}>
                Customer Information
              </h3>
              
              <div style={{ fontSize: '0.95rem', color: '#666' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Name:</strong> {order.customer_name || 'Not provided'}
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>Email:</strong> {order.customer_email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Scheduler Modal */}
      {showScheduler && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 400,
              marginBottom: '1.5rem'
            }}>
              Schedule Your Installation
            </h2>
            
            <p style={{
              color: '#666',
              marginBottom: '2rem'
            }}>
              Select a convenient date and time for our professional team to install your sauna.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500
              }}>
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Choose a date</option>
                {getAvailableDates().map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 500
              }}>
                Select Time Slot
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {timeSlots.map((slot) => (
                  <label
                    key={slot}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedTime === slot ? '#f8f8f8' : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      value={slot}
                      checked={selectedTime === slot}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      style={{ marginRight: '0.75rem' }}
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={handleScheduleInstallation}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#9B8B7E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Confirm Schedule
              </button>
              <button
                onClick={() => setShowScheduler(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'white',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}