export default function StudioTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎉 Studio Test Page - Working!</h1>
      <h2>This page loads successfully!</h2>
      <p>If you can see this, the studio access is working perfectly.</p>
      <p>Your URL: <strong>http://localhost:4448/studio-test</strong></p>
      <hr />
      <h3>Next Steps:</h3>
      <ol>
        <li>Go back to <a href="http://localhost:4448/studio">http://localhost:4448/studio</a></li>
        <li>The main studio should work now too!</li>
        <li>Your real analytics from Mixpanel should load</li>
      </ol>
    </div>
  );
}
