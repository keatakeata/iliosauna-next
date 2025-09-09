export default function DebugPage() {
  return (
    <div style={{
      padding: '50px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'green', fontSize: '2em' }}>
        🚀 DEBUG PAGE - Server Working!
      </h1>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <p style={{ fontSize: '18px', color: '#333' }}>
          <strong>✅ SUCCESS:</strong> This page proves your Next.js server is working perfectly!
        </p>

        <div style={{ marginTop: '20px' }}>
          <p><strong>Time:</strong> {new Date().toISOString()}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
          <p><strong>Rendered at:</strong> {typeof window !== 'undefined' ? 'Browser' : 'Server'}</p>
        </div>

        <div style={{
          background: 'lightgreen',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 10px 0', color: 'darkgreen' }}>
            🎯 NEXT STEPS:
          </h2>
          <p style={{ margin: 0 }}>
            If you see this, the homepage issue is likely in your component hierarchy, not the server.
          </p>
        </div>
      </div>
    </div>
  );
}
