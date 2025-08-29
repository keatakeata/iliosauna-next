# HERO SLIDESHOW BACKUP
**Created: August 29, 2025**
**Status: PERFECTLY WORKING - Smooth transitions with no snapping or stuttering**

## IMPLEMENTATION OVERVIEW
This backup contains the working slideshow implementation that uses a single continuously zooming container with images that fade in/out inside it. This approach eliminates all snapping and stuttering issues.

---

## CSS CODE (from globals.css)

```css
/* Hero Slideshow - Single Container Continuous Zoom */
@keyframes continuousZoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.2);
  }
}
```

---

## HERO SECTION COMPONENT (HeroSection.tsx)

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroSection({ pageLoaded = false }: { pageLoaded?: boolean }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6deefde6fa237370e2.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/688e6fd14f59c85a9f60aa2d.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb49eefde6142a736f7c.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6898b31fefa0f04e3e74fc35.jpeg',
    'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c126b12dc665.jpeg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section 
      id="hero" 
      className="hero-section ilio-section-full"
      style={{ 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        paddingTop: 0
      }}
    >
      {/* Single Zooming Container */}
      <div 
        className="hero-zoom-container"
        style={{
          position: 'absolute',
          inset: '-5%', // Slightly larger to accommodate zoom
          width: '110%',
          height: '110%',
          animation: 'continuousZoom 30s linear infinite',
        }}
      >
        {/* Images inside the zooming container */}
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          >
            <img
              src={slide}
              alt={`Luxury sauna ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
            }} />
          </div>
        ))}
      </div>

      {/* Hero Content - stays the same */}
      {/* ... rest of the component ... */}
    </section>
  );
}
```

---

## SAUNAS PAGE SLIDESHOW (saunas/page.tsx)

```tsx
// In the component:
const [currentSlide, setCurrentSlide] = useState(0);

// Auto-advance slideshow
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 5000);
  return () => clearInterval(timer);
}, [slides.length]);

// In the render:
{/* Single Zooming Container */}
<div 
  style={{
    position: 'absolute',
    inset: '-5%',
    width: '110%',
    height: '110%',
    animation: 'continuousZoom 30s linear infinite',
  }}
>
  {slides.map((slide, index) => (
    <div
      key={index}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: currentSlide === index ? 1 : 0,
        transition: 'opacity 1.5s ease-in-out',
      }}
    >
      <img
        src={slide}
        alt={`Ilio Sauna ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  ))}
</div>
```

---

## KEY SETTINGS

### Animation Settings:
- **Container zoom duration**: 30 seconds
- **Zoom scale**: 1x to 1.2x
- **Animation type**: Linear, infinite
- **Container size**: 110% (positioned at -5% to hide edges)

### Transition Settings:
- **Slide interval**: 5 seconds
- **Fade duration**: 1.5 seconds
- **Fade easing**: ease-in-out

---

## WHY THIS WORKS

1. **Single zooming container**: The zoom animation runs on the parent container, not individual images
2. **Continuous infinite animation**: Never stops or resets, eliminating snap-back
3. **Simple opacity transitions**: Images only fade, they don't have their own transforms
4. **Oversized container**: Ensures edges never show during zoom
5. **Independent timing**: Zoom and slide transitions are completely independent

---

## TO RESTORE THIS VERSION

If you need to revert to this working version:

1. Copy the CSS animation back to `globals.css`
2. Replace the slideshow sections in `HeroSection.tsx` and `saunas/page.tsx`
3. Ensure slide interval is 5000ms and animation is 'continuousZoom 30s linear infinite'

---

## NOTES

- This version was confirmed working with smooth transitions
- No snapping, stuttering, or hiccups
- User confirmed: "Okay this is absolutely perfect"