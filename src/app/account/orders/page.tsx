'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  customer_email: string;
  created_at: string;
}

export default function OrdersListPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          let query = supabase
            .from('orders')
            .select('*')
            .eq('clerk_user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (filter !== 'all') {
            query = query.eq('status', filter);
          }
          
          const { data, error } = await query;
          
          if (!error && data) {
            setOrders(data);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
      case 'manufacturing':
        return 'text-orange-600';
      case 'shipped':
        return 'text-blue-600';
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        );
      case 'processing':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
          </svg>
        );
      case 'manufacturing':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
          </svg>
        );
      case 'shipped':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13"/>
            <path d="M16 8h5l3 5v5h-8V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
          </svg>
        );
      case 'delivered':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 7l-8 5-8-5M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M12 12v7"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
        );
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar animated={true} />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500">Loading orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar animated={true} />
      
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 pt-32 pb-16">
        <div className="ilio-container">
          <Link 
            href="/account"
            className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2 mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl lg:text-5xl font-thin tracking-wide text-white mb-2">
            My Orders
          </h1>
          <p className="text-lg text-gray-300 font-light">
            Track and manage all your Ilio sauna purchases
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b sticky top-0 z-50">
        <div className="ilio-container py-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="h-auto p-0 bg-transparent rounded-none">
              {['all', 'processing', 'manufacturing', 'shipped', 'delivered', 'completed'].map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  onClick={() => setFilter(status)}
                  className="rounded-none px-6 py-2 text-sm font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-none capitalize"
                >
                  {status === 'all' ? 'All Orders' : status}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-12 bg-gray-50 flex-1">
        <div className="ilio-container">
          {orders.length === 0 ? (
            <Card className="border-0 shadow-sm text-center py-16">
              <CardContent>
                <div className="mb-6 flex justify-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="0"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-light text-gray-800 mb-2">
                  No orders found
                </h2>
                <p className="text-gray-500 mb-8">
                  {filter === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `No orders with status "${filter}".`}
                </p>
                <Button 
                  onClick={() => router.push('/saunas')}
                  className="rounded-none bg-gray-900 hover:bg-gray-800"
                >
                  Explore Saunas
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => router.push(`/account/orders/${order.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Status Icon */}
                      <div className={`${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                      
                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            Order #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={`rounded-none text-xs uppercase ${getStatusColor(order.status)} bg-transparent border ${
                              order.status === 'completed' ? 'border-green-200' :
                              order.status === 'processing' || order.status === 'manufacturing' ? 'border-orange-200' :
                              order.status === 'shipped' ? 'border-blue-200' :
                              order.status === 'delivered' ? 'border-green-200' :
                              'border-gray-200'
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      {/* Price and Action */}
                      <div className="text-right">
                        <div className="text-2xl font-light text-gray-900 mb-1">
                          ${order.total_amount?.toFixed(2)}
                        </div>
                        <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors inline-flex items-center gap-1">
                          View Details
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}