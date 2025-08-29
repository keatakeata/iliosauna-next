'use client';

import React, { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems
  } = useCart();
  
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeCart]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="cart-overlay"
        onClick={closeCart}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
      />
      
      {/* Cart Drawer */}
      <div 
        ref={drawerRef}
        className="cart-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '0.05em',
            color: '#1a1a1a',
            margin: 0
          }}>
            Shopping Cart ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px'
        }}>
          {items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <p style={{
                fontSize: '18px',
                color: '#666',
                marginBottom: '24px'
              }}>
                Your cart is empty
              </p>
              <Link 
                href="/saunas"
                onClick={closeCart}
                style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  backgroundColor: '#BF5813',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '16px',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#a64a11';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#BF5813';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    width: '100px',
                    height: '100px',
                    flexShrink: 0,
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 400,
                      marginBottom: '8px',
                      color: '#1a1a1a'
                    }}>
                      {item.name}
                    </h3>
                    {item.description && (
                      <p style={{
                        fontSize: '14px',
                        color: '#666',
                        marginBottom: '12px'
                      }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        {/* Quantity Controls */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px'
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              color: '#666'
                            }}
                          >
                            −
                          </button>
                          <span style={{
                            padding: '0 16px',
                            fontSize: '14px'
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              color: '#666'
                            }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#999',
                            cursor: 'pointer',
                            fontSize: '14px',
                            textDecoration: 'underline'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#1a1a1a'
                      }}>
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '2px solid #e0e0e0',
            backgroundColor: '#fafafa'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}>
                Subtotal
              </span>
              <span style={{
                fontSize: '20px',
                fontWeight: 500,
                color: '#1a1a1a'
              }}>
                ${totalPrice.toLocaleString()}
              </span>
            </div>
            <p style={{
              fontSize: '13px',
              color: '#666',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Shipping & taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                backgroundColor: '#BF5813',
                color: '#ffffff',
                border: 'none',
                fontSize: '16px',
                fontWeight: 400,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#a64a11';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#BF5813';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </>
  );
}