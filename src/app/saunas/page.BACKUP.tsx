'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';
import Link from 'next/link';
import { modalContent } from './modalContent';
import { useCart } from '@/context/CartContext';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

// Lazy Loading Image Component for Performance
function LazyImage({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && src) {
      setImageSrc(src);
    }
  }, [src]);

  useEffect(() => {
    if (!containerRef) return;
    
    const observer = new IntersectionObserver(onIntersection, {
      threshold: 0,
      rootMargin: '100px'
    });
    
    observer.observe(containerRef);
    
    return () => {
      observer.disconnect();
    };
  }, [containerRef, onIntersection]);

  return (
    <>
      <div
        ref={setContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
          transition: 'filter 0.3s ease-out',
          ...style
        }}
      />
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            ...style
          }}
        />
      )}
    </>
  );
}

export default function SaunasPage() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);
  const { addItem } = useCart();

  // Hero slideshow images - exact from live website
  const heroSlides = [
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e7797e0fe546e46493d4b.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e916f40ac13c4545.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a5af45ea7a26.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb487377cf367b8827bf.jpeg'
  ];

  // Premium features data with exact images from live website
  const premiumFeatures = [
    {
      id: 'structural',
      title: 'Building',
      description: '2×4 frame, Rockwool R-14, dual barriers',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e787c914f6a78afadce42.jpeg'
    },
    {
      id: 'doors',
      title: 'Doors and Windows',
      description: 'Tempered glass, cedar frame, premium hardware',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6dd9c1c1203c2dc791.jpeg'
    },
    {
      id: 'flooring',
      title: 'Flooring',
      description: 'Waterproof, coved, zero-maintenance',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6de916f4ccf63c46c1.jpeg'
    },
    {
      id: 'lighting',
      title: 'Lighting',
      description: '3000K under-bench ambient glow',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6da6e2ac105564b218.jpeg'
    },
    {
      id: 'heater',
      title: 'Heater',
      description: '9 kW HUUM DROP, Red Dot Award winner',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a5af45ea7a26.jpeg'
    },
    {
      id: 'control',
      title: 'Smart Control / App',
      description: 'Start from anywhere, ready when you are',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68aafb46622ad160dd29c5ca.png'
    },
    {
      id: 'gauge',
      title: 'Instruments',
      description: 'Fischer 194.01 precision gauge',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e9d6715de23bf29a.jpeg'
    },
    {
      id: 'timer',
      title: 'Sand Timer',
      description: '15-minute traditional hourglass',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a59ba2ea7a25.jpeg'
    },
    {
      id: 'hooks',
      title: 'Steel Hardware',
      description: 'Matte black corrosion-resistant',
      image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48a6e2ac5b4164b058.jpeg'
    }
  ];