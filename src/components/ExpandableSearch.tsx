'use client';
import React, { useRef, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import useClickOutside from '@/hooks/useClickOutside';
import { ArrowLeft, Search } from 'lucide-react';

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.25,
};

interface ExpandableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ExpandableSearch({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search articles",
  className = ""
}: ExpandableSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    if (isOpen && !searchTerm) {
      setIsOpen(false);
    }
  });

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    if (!searchTerm) {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <MotionConfig transition={transition}>
      <div className={`relative ${className}`} ref={containerRef}>
        <motion.div
          animate={{
            width: isOpen ? '320px' : '44px',
          }}
          initial={false}
          style={{
            background: 'white',
            borderRadius: '4px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            height: '44px'
          }}
        >
          {!isOpen ? (
            <button
              onClick={handleOpen}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9f9f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              aria-label='Search articles'
            >
              <Search style={{ width: '18px', height: '18px', color: '#9B8B7E' }} />
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              padding: '0 12px',
              gap: '10px'
            }}>
              <button
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  minWidth: '24px'
                }}
                aria-label='Close search'
              >
                <ArrowLeft style={{ width: '18px', height: '18px', color: '#999' }} />
              </button>
              <input
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  color: '#333'
                }}
                autoFocus
                placeholder="Search articles"
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
          )}
        </motion.div>
      </div>
    </MotionConfig>
  );
}