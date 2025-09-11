'use client';

import React, { useState, useEffect } from 'react';

export default function MapComponent({ isMobile }: { isMobile: boolean }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Set a timeout to show the map even if onLoad doesn't fire
    const timeout = setTimeout(() => {
      if (!mapLoaded && !mapError) {
        setMapLoaded(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [mapLoaded, mapError]);

  return (
    <div style={{
      width: '100%',
      height: isMobile ? '350px' : '500px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.05)',
      position: 'relative',
      background: '#f8f8f8'
    }}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=British%20Columbia,%20Canada&amp;t=&amp;z=6&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        style={{
          border: 0,
          filter: 'grayscale(20%)',
          display: mapLoaded || mapError ? 'block' : 'none'
        }}
        onLoad={() => {
          setMapLoaded(true);
          setMapError(false);
        }}
        onError={() => {
          setMapError(true);
          setMapLoaded(true); // Show the iframe anyway
        }}
      />
      {!mapLoaded && !mapError && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: '#999', fontSize: '0.9rem' }}>Loading map...</div>
        </div>
      )}
    </div>
  );
}