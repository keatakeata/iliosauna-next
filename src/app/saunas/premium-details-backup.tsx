// BACKUP OF PREMIUM DETAILS ANIMATION CODE
// Created: 2025-09-08
// This is the original working code before Framer Motion implementation

/* Current CSS animations in globals.css for reference:

.reveal-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}

*/

// Mobile/Tablet Grid View - Current Working Code
const MobileTabletGridBackup = () => (
  <div className="mobile-tablet-grid" style={{ display: 'none' }}>
    {premiumFeatures.map((feature, index) => (
      <div 
        key={`mobile-${feature.id}`}
        className={`reveal-on-scroll reveal-delay-${Math.min(index + 3, 8)}`}
        onClick={() => setActiveModal(feature.id)}
        style={{
          position: 'relative',
          height: '400px',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          cursor: 'pointer'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#f0f0f0'
        }} />
        <img 
          src={feature.image}
          alt={feature.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem',
          textAlign: 'center',
          color: 'white',
          zIndex: 2
        }}>
          <h3 style={{ 
            fontSize: '1.5rem',
            fontWeight: 400,
            marginBottom: '0.5rem',
            color: 'white'
          }}>{feature.title}</h3>
          <p style={{ 
            fontSize: '1rem',
            opacity: 0.9,
            marginBottom: '0.5rem',
            color: 'white'
          }}>{feature.description}</p>
          <span style={{ fontSize: '1rem', color: 'white' }}>Tap to explore →</span>
        </div>
      </div>
    ))}
  </div>
);

// Desktop Grid View - Current Working Code  
const DesktopGridBackup = () => (
  <div className="desktop-grid" style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
    willChange: 'transform',
    transform: 'translateZ(0)'
  }}>
    {premiumFeatures.map((feature, index) => (
      <div 
        key={feature.id} 
        className={`reveal-on-scroll reveal-delay-${Math.min(index + 3, 8)}`}
        onClick={() => setActiveModal(feature.id)}
        style={{
          position: 'relative',
          height: '250px',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={(e) => {
          const overlay = e.currentTarget.querySelector('.card-overlay') as HTMLElement;
          if (overlay) {
            overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 50%)';
          }
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          const overlay = e.currentTarget.querySelector('.card-overlay') as HTMLElement;
          if (overlay) {
            overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 50%)';
          }
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <LazyImage 
          src={feature.image}
          alt={feature.title}
        />
        <div 
          className="card-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 50%)',
            transition: 'background 0.4s ease'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.25rem',
          color: 'white',
          zIndex: 2
        }}>
          <h3 style={{ 
            fontSize: '1.25rem',
            fontWeight: 400,
            marginBottom: '0.25rem',
            color: 'white'
          }}>{feature.title}</h3>
          <p style={{ 
            fontSize: '0.875rem',
            opacity: 0.9,
            marginBottom: '0.25rem',
            color: 'white'
          }}>{feature.description}</p>
          <span style={{ fontSize: '0.875rem', color: 'white' }}>Explore →</span>
        </div>
      </div>
    ))}
  </div>
);

export { MobileTabletGridBackup, DesktopGridBackup };