'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, X, ZoomIn, ZoomOut, Move, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';

interface SpecSection {
  title: string;
  category: string;
  description: string;
  image: string;
  details: string[];
}

interface RenderedView {
  title: string;
  description: string;
  image: string;
}

const specSections: SpecSection[] = [
  {
    title: "Overall Dimensions",
    category: "Technical Drawing",
    description: "Complete dimensional overview of the ilio sauna exterior and interior footprint.",
    image: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6966ca504d18c5c1672142e2.png",
    details: [
      "Exterior: 6'-3\" W × 8' D × 8'-5\" H",
      "Interior: 5'-6\" × 6'-3\"",
      "Door Height: 6'-2\"",
      "Overhang Depth: 18\" front porch",
      "Capacity: 4-6 persons"
    ]
  },
  {
    title: "Foundation Layout",
    category: "Installation Plan",
    description: "Precise foot positioning for concrete pad placement and leveling system.",
    image: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6966ca5041565260d62867d2.png",
    details: [
      "Adjustable Steel Legs: 1\"-4\" range",
      "4 leveling points for stability",
      "Concrete pads: 10\"×10\" minimum",
      "Ground clearance prevents moisture",
      "Ground to be packed and level"
    ]
  },
  {
    title: "Interior Configuration",
    category: "Bench & Heater Layout",
    description: "Top-down view showing bench seating arrangement and HUUM heater placement.",
    image: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6966ca50b9e85c02cb08cc9e.png",
    details: [
      "Floating bench configuration",
      "Upper bench: 24\" depth, ideal heat zone",
      "Lower bench: 24\" depth, slightly recessed",
      "HUUM DROP 9kW heater placement",
      "122 lbs olivine diabase stones included"
    ]
  }
];

const renderedViews: RenderedView[] = [
  {
    title: "Rear Exterior View",
    description: "Back three-quarter view showcasing construction quality and cedar detailing.",
    image: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/69667e66b9e85c52b1f2a064.png"
  },
  {
    title: "Front Exterior View",
    description: "Front three-quarter view highlighting glass door and window configuration.",
    image: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6965d8a702f1bed41202b82f.png"
  },
  {
    title: "Front Elevation",
    description: "Straightforward front view with precise door and window measurements.",
    image: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6965d8a7c7683b0bb8fb477f.png"
  }
];

export default function SpecsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [detailModalIndex, setDetailModalIndex] = useState<number | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<{ image: string; title: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [isHoveringViews, setIsHoveringViews] = useState(false);
  const [modalViewIndex, setModalViewIndex] = useState(0);
  const [viewsFullscreen, setViewsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, isMobile]);

  // Reset zoom and pan when fullscreen closes
  useEffect(() => {
    if (!fullscreenImage && !viewsFullscreen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [fullscreenImage, viewsFullscreen]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = detailModalIndex !== null || fullscreenImage !== null || viewsFullscreen;

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [detailModalIndex, fullscreenImage, viewsFullscreen]);

  // Navigation for detail modal
  const nextDetailModal = () => {
    setDetailModalIndex(prev => prev !== null ? (prev + 1) % specSections.length : null);
  };

  const prevDetailModal = () => {
    setDetailModalIndex(prev => prev !== null ? (prev - 1 + specSections.length) % specSections.length : null);
  };

  const detailModal = detailModalIndex !== null ? specSections[detailModalIndex] : null;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = (index: number) => {
    if (isMobile) return;
    setHoveredIndex(index);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setHoveredIndex(null);
    setIsVisible(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPan({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPanStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handlePanMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning || zoom <= 1) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const maxPan = (zoom - 1) * 200;
    const newX = Math.max(-maxPan, Math.min(maxPan, clientX - panStart.x));
    const newY = Math.max(-maxPan, Math.min(maxPan, clientY - panStart.y));

    setPan({ x: newX, y: newY });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const nextView = () => {
    setCurrentViewIndex(prev => (prev + 1) % renderedViews.length);
  };

  const prevView = () => {
    setCurrentViewIndex(prev => (prev - 1 + renderedViews.length) % renderedViews.length);
  };

  const nextModalView = () => {
    setModalViewIndex(prev => (prev + 1) % renderedViews.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const prevModalView = () => {
    setModalViewIndex(prev => (prev - 1 + renderedViews.length) % renderedViews.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const openViewsFullscreen = (index: number) => {
    setModalViewIndex(index);
    setViewsFullscreen(true);
  };

  // Touch handling for carousel swipe
  const touchStartX = useRef(0);
  const detailTouchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextView();
      } else {
        prevView();
      }
    }
  };

  // Touch handling for detail modal swipe
  const handleDetailTouchStart = (e: React.TouchEvent) => {
    detailTouchStartX.current = e.touches[0].clientX;
  };

  const handleDetailTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = detailTouchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextDetailModal();
      } else {
        prevDetailModal();
      }
    }
  };

  // Touch handling for fullscreen views swipe
  const viewsTouchStartX = useRef(0);
  const handleViewsTouchStart = (e: React.TouchEvent) => {
    viewsTouchStartX.current = e.touches[0].clientX;
  };

  const handleViewsTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = viewsTouchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextModalView();
      } else {
        prevModalView();
      }
    }
  };

  const currentView = renderedViews[currentViewIndex];
  const modalView = renderedViews[modalViewIndex];

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <StructuredData pageType="product" />
      <Navbar forceScrolled={true} />

      <div style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        paddingTop: 'calc(var(--navbar-height) + 60px)',
        overflowX: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 1.5rem',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.25rem',
            background: 'rgba(191, 88, 19, 0.1)',
            color: '#BF5813',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            marginBottom: '1.5rem'
          }}>
            TECHNICAL DOCUMENTATION
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 100,
            letterSpacing: '0.05em',
            color: '#1D140B',
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            ilio Sauna Specifications
          </h1>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: '#8B7D6B',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Technical drawings and rendered views. Click any item to view details.
          </p>
        </div>

        {/* Specs Showcase */}
        <section
          ref={containerRef}
          onMouseMove={handleMouseMove}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 1.5rem 4rem 1.5rem'
          }}
        >
          {/* Floating Image Preview - Desktop Only */}
          {!isMobile && (
            <div
              style={{
                pointerEvents: 'none',
                position: 'fixed',
                zIndex: 50,
                overflow: 'hidden',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                left: containerRef.current?.getBoundingClientRect().left ?? 0,
                top: containerRef.current?.getBoundingClientRect().top ?? 0,
                transform: `translate3d(${smoothPosition.x + 20}px, ${smoothPosition.y - 150}px, 0)`,
                opacity: isVisible && !isHoveringViews ? 1 : 0,
                scale: isVisible && !isHoveringViews ? 1 : 0.8,
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                background: '#F8F4EB',
                borderRadius: '1rem',
                overflow: 'hidden'
              }}>
                {specSections.map((section, index) => (
                  <img
                    key={section.title}
                    src={section.image}
                    alt={section.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: '#F8F4EB',
                      transition: 'all 0.5s ease-out',
                      opacity: hoveredIndex === index ? 1 : 0,
                      transform: hoveredIndex === index ? 'scale(1)' : 'scale(1.1)',
                      filter: hoveredIndex === index ? 'none' : 'blur(10px)',
                    }}
                  />
                ))}
                {/* Click prompt overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1rem',
                  background: 'linear-gradient(to top, rgba(29, 20, 11, 0.8), transparent)',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'white',
                    fontWeight: 500,
                    letterSpacing: '0.05em'
                  }}>
                    Click to learn more
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Spec List - Technical Drawings */}
          <div style={{
            borderTop: '1px solid rgba(139, 125, 107, 0.2)'
          }}>
            {specSections.map((section, index) => (
              <div
                key={section.title}
                onClick={() => setDetailModalIndex(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                style={{
                  position: 'relative',
                  padding: '1.5rem 0',
                  borderBottom: '1px solid rgba(139, 125, 107, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-out'
                }}
              >
                {/* Background highlight on hover */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    margin: '0 -1rem',
                    padding: '0 1rem',
                    background: 'rgba(191, 88, 19, 0.05)',
                    borderRadius: '0.75rem',
                    transition: 'all 0.3s ease-out',
                    opacity: hoveredIndex === index ? 1 : 0,
                    transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.95)',
                  }}
                />

                {/* Mobile: Show thumbnail */}
                {isMobile && (
                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    marginBottom: '1rem',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    background: '#F8F4EB'
                  }}>
                    <img
                      src={section.image}
                      alt={section.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                )}

                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Category Badge */}
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      color: '#BF5813',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem',
                      opacity: 0.8
                    }}>
                      {section.category}
                    </div>

                    {/* Title */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{
                        fontSize: isMobile ? '1.25rem' : '1.5rem',
                        fontWeight: 400,
                        letterSpacing: '0.02em',
                        color: '#1D140B',
                        position: 'relative'
                      }}>
                        <span style={{ position: 'relative' }}>
                          {section.title}
                          {!isMobile && (
                            <span
                              style={{
                                position: 'absolute',
                                left: 0,
                                bottom: '-2px',
                                height: '1px',
                                background: '#1D140B',
                                transition: 'all 0.3s ease-out',
                                width: hoveredIndex === index ? '100%' : '0%'
                              }}
                            />
                          )}
                        </span>
                      </h3>

                      <ArrowUpRight
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          color: '#8B7D6B',
                          transition: 'all 0.3s ease-out',
                          opacity: isMobile ? 0.7 : (hoveredIndex === index ? 1 : 0),
                          transform: isMobile ? 'none' : (hoveredIndex === index
                            ? 'translate(0, 0)'
                            : 'translate(-0.5rem, 0.5rem)')
                        }}
                      />
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: '#8B7D6B',
                      marginTop: '0.5rem'
                    }}>
                      {section.description}
                    </p>

                    {/* Click prompt */}
                    <div style={{
                      marginTop: '0.75rem',
                      fontSize: '0.75rem',
                      color: '#BF5813',
                      fontWeight: 500,
                      opacity: isMobile ? 1 : (hoveredIndex === index ? 1 : 0),
                      transform: isMobile ? 'none' : (hoveredIndex === index ? 'translateY(0)' : 'translateY(5px)'),
                      transition: 'all 0.3s ease-out'
                    }}>
                      {isMobile ? 'Tap to view details →' : 'Click to learn more →'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rendered Views Carousel */}
          <div
            onMouseEnter={() => setIsHoveringViews(true)}
            onMouseLeave={() => setIsHoveringViews(false)}
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#FAF8F5',
              borderRadius: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Section Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  color: '#BF5813',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem'
                }}>
                  Rendered Views
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: '#1D140B'
                }}>
                  {currentView.title}
                </h3>
              </div>

              {/* Navigation Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <button
                  onClick={prevView}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(191, 88, 19, 0.1)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ChevronLeft style={{ width: '20px', height: '20px', color: '#BF5813' }} />
                </button>

                {/* Dots indicator */}
                <div style={{
                  display: 'flex',
                  gap: '0.375rem',
                  padding: '0 0.5rem'
                }}>
                  {renderedViews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentViewIndex(idx)}
                      style={{
                        width: idx === currentViewIndex ? '20px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: idx === currentViewIndex ? '#BF5813' : 'rgba(139, 125, 107, 0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={nextView}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(191, 88, 19, 0.1)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ChevronRight style={{ width: '20px', height: '20px', color: '#BF5813' }} />
                </button>
              </div>
            </div>

            {/* Carousel */}
            <div
              onClick={() => openViewsFullscreen(currentViewIndex)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: '1rem',
                overflow: 'hidden',
                background: '#FCFCFC',
                cursor: 'pointer'
              }}
            >
              {renderedViews.map((view, idx) => (
                <img
                  key={view.title}
                  src={view.image}
                  alt={view.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'all 0.5s ease-out',
                    opacity: idx === currentViewIndex ? 1 : 0,
                    transform: idx === currentViewIndex ? 'scale(1)' : 'scale(0.95)'
                  }}
                />
              ))}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: '#8B7D6B',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              {currentView.description}
            </p>

            {/* Tap prompt */}
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.75rem',
              color: '#BF5813',
              fontWeight: 500,
              textAlign: 'center'
            }}>
              {isMobile ? 'Swipe to browse • Tap to zoom' : 'Click to view full size with zoom'}
            </div>
          </div>
        </section>
      </div>

      {/* Detail Modal - Shows technical info + image */}
      {detailModal && !fullscreenImage && (
        <div
          onClick={() => setDetailModalIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(29, 20, 11, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          {/* Left Navigation Arrow - Desktop only */}
          {!isMobile && (
            <button
              onClick={(e) => { e.stopPropagation(); prevDetailModal(); }}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <ChevronLeft style={{ width: '24px', height: '24px', color: 'white' }} />
            </button>
          )}

          {/* Right Navigation Arrow - Desktop only */}
          {!isMobile && (
            <button
              onClick={(e) => { e.stopPropagation(); nextDetailModal(); }}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <ChevronRight style={{ width: '24px', height: '24px', color: 'white' }} />
            </button>
          )}

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '2rem',
                zIndex: 10
              }}
            >
              <button
                onClick={prevDetailModal}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft style={{ width: '20px', height: '20px', color: 'white' }} />
              </button>

              {/* Stacked Swipe + Dots in center */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Swipe
                </span>
                <div style={{
                  display: 'flex',
                  gap: '0.25rem'
                }}>
                  {specSections.map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: idx === detailModalIndex ? '16px' : '6px',
                        height: '6px',
                        borderRadius: '3px',
                        background: idx === detailModalIndex ? '#BF5813' : 'rgba(255, 255, 255, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={nextDetailModal}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight style={{ width: '20px', height: '20px', color: 'white' }} />
              </button>
            </div>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleDetailTouchStart}
            onTouchEnd={handleDetailTouchEnd}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              maxWidth: '800px',
              width: '100%',
              maxHeight: isMobile ? '80vh' : '90vh',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: isMobile ? '5rem' : 0
            }}
          >
          <div
            className="thin-scrollbar"
            style={{
              maxHeight: isMobile ? '80vh' : '90vh',
              overflow: 'auto',
              paddingTop: '1.5rem',
              paddingBottom: '1.5rem'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setDetailModalIndex(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(29, 20, 11, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
            >
              <X style={{ width: '20px', height: '20px', color: '#1D140B' }} />
            </button>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
              {/* Category */}
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: '#BF5813',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>
                {detailModal.category}
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 300,
                letterSpacing: '0.02em',
                color: '#1D140B',
                marginBottom: '0.75rem'
              }}>
                {detailModal.title}
              </h2>

              {/* Description */}
              <p style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#8B7D6B',
                marginBottom: '1.5rem'
              }}>
                {detailModal.description}
              </p>

              {/* Image - Clickable for fullscreen */}
              <div
                onClick={() => setFullscreenImage({ image: detailModal.image, title: detailModal.title })}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  background: '#F8F4EB',
                  cursor: 'pointer',
                  marginBottom: '1.5rem'
                }}
              >
                <img
                  src={detailModal.image}
                  alt={detailModal.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
                {/* Fullscreen hint overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(29, 20, 11, 0.8)',
                  borderRadius: '2rem',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  <Maximize2 style={{ width: '14px', height: '14px' }} />
                  {isMobile ? 'Tap to enlarge' : 'Click to enlarge'}
                </div>
              </div>

              {/* Technical Details */}
              <div style={{
                background: 'rgba(191, 88, 19, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(191, 88, 19, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  color: '#1D140B',
                  marginBottom: '1rem',
                  textTransform: 'uppercase'
                }}>
                  Specifications
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gap: '0.75rem'
                }}>
                  {detailModal.details.map((detail, idx) => (
                    <li key={idx} style={{
                      fontSize: '0.95rem',
                      color: '#1D140B',
                      padding: '0.5rem 0 0.5rem 1.25rem',
                      position: 'relative',
                      lineHeight: 1.5,
                      borderBottom: idx < detailModal.details.length - 1 ? '1px solid rgba(139, 125, 107, 0.1)' : 'none'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: '0.875rem',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#BF5813'
                      }} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal - For technical drawings */}
      {fullscreenImage && (
        <div
          onClick={() => {
            setFullscreenImage(null);
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(29, 20, 11, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          {/* Header */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              background: 'linear-gradient(to bottom, rgba(29, 20, 11, 0.8), transparent)',
              zIndex: 10
            }}
          >
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 400,
              color: 'white'
            }}>
              {fullscreenImage.title}
            </h2>

            <button
              onClick={() => {
                setFullscreenImage(null);
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X style={{ width: '24px', height: '24px', color: 'white' }} />
            </button>
          </div>

          {/* Zoom controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2rem',
              backdropFilter: 'blur(10px)',
              zIndex: 10
            }}
          >
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: zoom <= 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: zoom <= 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ZoomOut style={{ width: '20px', height: '20px', color: zoom <= 1 ? 'rgba(255,255,255,0.3)' : 'white' }} />
            </button>

            <div style={{
              padding: '0.5rem 1rem',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {Math.round(zoom * 100)}%
            </div>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: zoom >= 4 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: zoom >= 4 ? 'not-allowed' : 'pointer'
              }}
            >
              <ZoomIn style={{ width: '20px', height: '20px', color: zoom >= 4 ? 'rgba(255,255,255,0.3)' : 'white' }} />
            </button>

            {zoom > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginLeft: '0.5rem',
                paddingLeft: '0.5rem',
                borderLeft: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Move style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.6)' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                  Drag to pan
                </span>
              </div>
            )}
          </div>

          {/* Image container */}
          <div
            onClick={() => {
              if (zoom === 1) {
                setFullscreenImage(null);
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }
            }}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            onTouchStart={handlePanStart}
            onTouchMove={handlePanMove}
            onTouchEnd={handlePanEnd}
            style={{
              width: '100%',
              maxWidth: 'min(90vw, 90vh)',
              aspectRatio: '1',
              overflow: 'hidden',
              borderRadius: '1rem',
              background: '#F8F4EB',
              cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'pointer',
              touchAction: zoom > 1 ? 'none' : 'auto'
            }}
          >
            <img
              src={fullscreenImage.image}
              alt={fullscreenImage.title}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                userSelect: 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Fullscreen Modal for Rendered Views */}
      {viewsFullscreen && (
        <div
          onClick={() => {
            setViewsFullscreen(false);
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(29, 20, 11, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          {/* Header with controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              background: 'linear-gradient(to bottom, rgba(29, 20, 11, 0.8), transparent)',
              zIndex: 10
            }}
          >
            <div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: '#BF5813',
                textTransform: 'uppercase',
                marginBottom: '0.25rem'
              }}>
                Rendered Views
              </div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 400,
                color: 'white'
              }}>
                {modalView.title}
              </h2>
            </div>

            <button
              onClick={() => {
                setViewsFullscreen(false);
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X style={{ width: '24px', height: '24px', color: 'white' }} />
            </button>
          </div>

          {/* Navigation arrows - Desktop only */}
          {!isMobile && (
            <button
              onClick={(e) => { e.stopPropagation(); prevModalView(); }}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <ChevronLeft style={{ width: '24px', height: '24px', color: 'white' }} />
            </button>
          )}

          {!isMobile && (
            <button
              onClick={(e) => { e.stopPropagation(); nextModalView(); }}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <ChevronRight style={{ width: '24px', height: '24px', color: 'white' }} />
            </button>
          )}

          {/* Swipe Navigation - Bottom bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '2rem',
              zIndex: 10
            }}
          >
            <button
              onClick={prevModalView}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft style={{ width: '20px', height: '20px', color: 'white' }} />
            </button>

            {/* Stacked Swipe + Dots in center */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <span style={{
                color: 'white',
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Swipe
              </span>
              <div style={{
                display: 'flex',
                gap: '0.25rem'
              }}>
                {renderedViews.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setModalViewIndex(idx);
                    }}
                    style={{
                      width: idx === modalViewIndex ? '16px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: idx === modalViewIndex ? '#BF5813' : 'rgba(255, 255, 255, 0.4)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextModalView}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight style={{ width: '20px', height: '20px', color: 'white' }} />
            </button>
          </div>

          {/* Image container */}
          <div
            onClick={() => {
              setViewsFullscreen(false);
            }}
            onTouchStart={handleViewsTouchStart}
            onTouchEnd={handleViewsTouchEnd}
            style={{
              width: '100%',
              maxWidth: 'min(90vw, 90vh)',
              aspectRatio: '1',
              overflow: 'hidden',
              borderRadius: '1rem',
              background: '#FCFCFC',
              cursor: 'pointer'
            }}
          >
            <img
              src={modalView.image}
              alt={modalView.title}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                userSelect: 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Thin scrollbar styles */}
      <style jsx global>{`
        .thin-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: rgba(191, 88, 19, 0.1);
          border-radius: 100px;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background: #BF5813;
          border-radius: 100px;
          border: 2px solid white;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A04810;
        }
        .thin-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #BF5813 rgba(191, 88, 19, 0.1);
        }
      `}</style>

      <Footer />
    </div>
  );
}
