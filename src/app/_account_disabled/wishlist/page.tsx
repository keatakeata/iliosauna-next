'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ROUTES } from '@/lib/routes';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  addedDate: Date;
  inStock: boolean;
}

export default function WishlistPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [priceAlerts, setPriceAlerts] = useState<Set<string>>(new Set());

  // Mock wishlist data - in production this would come from Supabase
  const mockWishlistItems: WishlistItem[] = [
    {
      id: '1',
      name: 'ILIO Outdoor Sauna - Cedar',
      price: 12999,
      image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=400',
      description: 'Premium outdoor cedar sauna with panoramic window',
      addedDate: new Date('2024-01-15'),
      inStock: true,
    },
    {
      id: '2',
      name: 'Sauna Heater - 8kW Electric',
      price: 899,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
      description: 'Professional grade electric sauna heater',
      addedDate: new Date('2024-01-20'),
      inStock: true,
    },
    {
      id: '3',
      name: 'Cedar Sauna Bench Set',
      price: 599,
      image: 'https://images.unsplash.com/photo-1571902555951-8f57e13f2de7?w=400',
      description: 'Handcrafted cedar bench set for 4-6 people',
      addedDate: new Date('2024-02-01'),
      inStock: false,
    },
  ];

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push(ROUTES.SIGN_IN);
      return;
    }

    // Load wishlist items (mock data for now)
    setWishlistItems(mockWishlistItems);
    setIsLoading(false);
  }, [user, isLoaded, isSignedIn, router]);

  const handleRemoveItem = (itemId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (item: WishlistItem) => {
    alert(`${item.name} added to cart!`);
    handleRemoveItem(item.id);
  };

  const handleShareItem = (item: WishlistItem) => {
    setSelectedItem(item);
    setShareModalOpen(true);
  };

  const handleTogglePriceAlert = (itemId: string) => {
    const newAlerts = new Set(priceAlerts);
    if (newAlerts.has(itemId)) {
      newAlerts.delete(itemId);
    } else {
      newAlerts.add(itemId);
    }
    setPriceAlerts(newAlerts);
  };

  const copyShareLink = () => {
    const shareUrl = `https://iliosauna.com/products/${selectedItem?.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
    setShareModalOpen(false);
  };

  if (isLoading) {
    return (
      <>
        <Navbar forceScrolled={true} />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar forceScrolled={true} />
      
      <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <a href={ROUTES.ACCOUNT.DASHBOARD} style={{ color: '#666', textDecoration: 'none' }}>
              Account
            </a>
            <span style={{ margin: '0 8px', color: '#999' }}>/</span>
            <span style={{ color: '#1a1a1a' }}>Wishlist</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '600', color: '#1a1a1a' }}>
              My Wishlist
            </h1>
            <span style={{ color: '#666' }}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {wishlistItems.length === 0 ? (
            <div style={{ 
              background: '#fff', 
              padding: '80px 20px', 
              borderRadius: '8px', 
              border: '1px solid #e5e5e5',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤍</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '12px', color: '#1a1a1a' }}>
                Your wishlist is empty
              </h2>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Save items you love to your wishlist and share them with friends
              </p>
              <button
                onClick={() => router.push(ROUTES.PRODUCTS)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {wishlistItems.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    background: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #e5e5e5',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Image */}
                  <div style={{ 
                    height: '200px', 
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}>
                    {!item.inStock && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: '#ff4444',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                      }}>
                        Out of Stock
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e5e5e5',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1rem',
                      }}
                      title="Remove from wishlist"
                    >
                      ×
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '12px' }}>
                      {item.description}
                    </p>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                      ${item.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '16px' }}>
                      Added {item.addedDate.toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        style={{
                          flex: '1',
                          padding: '10px',
                          backgroundColor: item.inStock ? '#1a1a1a' : '#ccc',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: item.inStock ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <button
                        onClick={() => handleShareItem(item)}
                        style={{
                          padding: '10px',
                          background: '#fff',
                          border: '1px solid #e5e5e5',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        title="Share"
                      >
                        📤
                      </button>
                    </div>

                    {/* Price Alert */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={priceAlerts.has(item.id)}
                        onChange={() => handleTogglePriceAlert(item.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>
                        Notify me of price changes
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Share Features */}
          <div style={{ 
            marginTop: '48px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #e5e5e5',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '16px', color: '#1a1a1a' }}>
              Share Your Wishlist
            </h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Share your wishlist with friends and family for special occasions
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const url = `https://iliosauna.com/wishlist/${user?.id}`;
                  navigator.clipboard.writeText(url);
                  alert('Wishlist link copied!');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  border: '1px solid #e5e5e5',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Copy Link
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  border: '1px solid #e5e5e5',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Email Wishlist
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  border: '1px solid #e5e5e5',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            padding: '32px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '16px', color: '#1a1a1a' }}>
              Share {selectedItem?.name}
            </h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Share this product with friends
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={copyShareLink}
                style={{
                  flex: '1',
                  padding: '10px',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Copy Link
              </button>
              <button
                onClick={() => setShareModalOpen(false)}
                style={{
                  flex: '1',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  color: '#1a1a1a',
                  border: '1px solid #e5e5e5',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}