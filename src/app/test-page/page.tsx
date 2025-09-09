import React from 'react';

export default function TestPage() {
  return (
    <html lang="en">
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: 'blue' }}>Test Page - Server Working!</h1>
          <p>If you see this, your Next.js server is working properly.</p>
          <p>URL: {typeof window !== 'undefined' ? window.location.href : 'Server Side'}</p>
          <p>Time: {new Date().toISOString()}</p>
          <div style={{ background: 'lightgreen', padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
            <strong>✅ SUCCESS: Server is responding!</strong>
          </div>
        </div>
      </body>
    </html>
  );
}
