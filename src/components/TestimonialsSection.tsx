'use client';

import { useState, useEffect, useRef } from 'react';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const testimonials = [
    {
      quote: "The Ilio sauna has transformed our backyard into a wellness retreat. The quality is exceptional.",
      author: "Sarah M.",
      location: "Vancouver Island"
    },
    {
      quote: "Beautiful design and incredible craftsmanship. It's become the centerpiece of our outdoor space.",
      author: "Michael D.",
      location: "Greater Vancouver"
    },
    {
      quote: "Daily sauna sessions have become our family's favorite ritual. Thank you, Ilio!",
      author: "Jennifer L.",
      location: "Victoria, BC"
    },
    {
      quote: "An investment in our health and happiness. The design seamlessly fits our modern home.",
      author: "Robert K.",
      location: "Squamish, BC"
    },
    {
      quote: "Five stars isn't enough. From consultation to installation, the Ilio team exceeded expectations.",
      author: "Amanda T.",
      location: "Salt Spring Island"
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - translateX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - startX;
    setTranslateX(x);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const movedBy = translateX;
    if (movedBy < -100) {
      nextSlide();
    } else if (movedBy > 100) {
      prevSlide();
    }
    setTranslateX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX - translateX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - startX;
    setTranslateX(x);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [isDragging]);

  return (
    <section id="testimonials" className="ilio-section" style={{ padding: '100px 0', background: 'white' }}>
      <div className="ilio-container">
        <div className="text-center mb-5">
          <h2 className="section-header h2-animate reveal-on-scroll" style={{ marginBottom: '2rem' }}>
            Client Experiences
          </h2>
          <div className="section-divider reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: '#D1D5DB',
            margin: '0 auto 2rem'
          }}></div>
          <p className="section-text reveal-on-scroll reveal-delay-2" style={{ 
            maxWidth: '600px', 
            margin: '0 auto 3rem',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#5a5a5a'
          }}>
            Discover what our early adopters are saying about their Ilio Sauna journey
          </p>
        </div>

        <div 
          className="testimonials-viewport reveal-on-scroll reveal-delay-3" 
          style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            overflow: 'hidden',
            position: 'relative',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            ref={trackRef}
            className="testimonials-track" 
            style={{
              display: 'flex',
              transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="testimonial-card" 
                style={{
                  minWidth: '100%',
                  padding: '2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  color: '#9B8B7E',
                  marginBottom: '1rem'
                }}>★★★★★</div>
                <p style={{ 
                  fontSize: '1.25rem', 
                  fontStyle: 'italic', 
                  marginBottom: '2rem',
                  color: '#333',
                  lineHeight: '1.6',
                  fontWeight: 300
                }}>
                  "{testimonial.quote}"
                </p>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem', fontSize: '1.1rem' }}>
                  {testimonial.author}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#888' }}>
                  {testimonial.location}
                </div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="reveal-on-scroll reveal-delay-4" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '2rem'
          }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: currentIndex === index ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentIndex === index ? '#9B8B7E' : '#ddd',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}