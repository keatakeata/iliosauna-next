'use client';

import React, { useEffect } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export default function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
  // Close on Escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Store original body styles
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // Capture current scroll position BEFORE making any changes
    const scrollY = window.scrollY;

    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock body scroll and maintain visual position
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);

      // Save current scroll behavior
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;

      // Disable smooth scrolling temporarily
      document.documentElement.style.scrollBehavior = 'auto';

      // Restore body styles
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = originalWidth;

      // Immediately restore scroll position (will be instant due to auto behavior)
      window.scrollTo(0, scrollY);

      // Restore original scroll behavior after a brief moment
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
      }, 10);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '2rem',
        animation: 'fadeIn 0.3s ease-out',
        overflow: 'hidden'
      }}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        style={{
          backgroundColor: '#faf8f5',
          border: '1px solid rgba(191, 88, 19, 0.2)',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out',
          boxShadow: '0 20px 60px rgba(191, 88, 19, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '2rem 2.5rem',
            borderBottom: '1px solid rgba(191, 88, 19, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f5f1eb'
          }}
        >
          <h2
            style={{
              color: '#2d2d2d',
              fontSize: '1.5rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
              margin: 0
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(0, 0, 0, 0.4)',
              fontSize: '2rem',
              cursor: 'pointer',
              padding: '0',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              borderRadius: '4px',
              lineHeight: '1'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#BF5813';
              e.currentTarget.style.backgroundColor = 'rgba(191, 88, 19, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '2.5rem',
            overflowY: 'auto',
            color: '#4a4a4a',
            fontSize: '0.95rem',
            lineHeight: '1.8',
            backgroundColor: '#faf8f5'
          }}
          onWheel={(e) => {
            // Prevent scroll propagation to background when reaching boundaries
            const element = e.currentTarget;
            const isAtTop = element.scrollTop === 0;
            const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
              e.preventDefault();
            }
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
        >
          {content}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(191, 88, 19, 0.5);
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(191, 88, 19, 0.7);
        }

        @media (max-width: 768px) {
          div[style*="padding: 2rem 2.5rem"] {
            padding: 1.5rem !important;
          }
          div[style*="padding: 2.5rem"] {
            padding: 1.5rem !important;
          }
          h2 {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
