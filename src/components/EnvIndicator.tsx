'use client';

export default function EnvIndicator() {
  const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  const ecomVisible = process.env.NEXT_PUBLIC_ECOM_UI_VISIBLE === 'true';
  const clerkEnabled = process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true';

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '70px',
        right: '20px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '11px',
        zIndex: 9998,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        fontFamily: 'monospace',
        maxWidth: '220px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ff6b00' }}>
        Environment Status
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Dev Mode:</span>
          <span style={{ color: devMode ? '#22c55e' : '#ef4444' }}>
            {devMode ? '✓ ON' : '✗ OFF'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>E-commerce:</span>
          <span style={{ color: ecomVisible ? '#22c55e' : '#ef4444' }}>
            {ecomVisible ? '✓ Visible' : '✗ Hidden'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Clerk Auth:</span>
          <span style={{ color: clerkEnabled ? '#22c55e' : '#ef4444' }}>
            {clerkEnabled ? '✓ ON' : '✗ OFF'}
          </span>
        </div>
      </div>
    </div>
  );
}
