'use client';

export default function DevModeBanner() {
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#ff6b00',
        color: 'white',
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '13px',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title="Development Mode - develop/products branch"
    >
      <span style={{ fontSize: '16px' }}>🚧</span>
      <span>DEV</span>
    </div>
  );
}
