import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="footer" className="ilio-section-full" style={{
      background: 'var(--color-footer-bg)',
      padding: '3rem 0 2rem'
    }}>
      <div className="ilio-container">
        <div className="d-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 200, letterSpacing: '0.1em', marginBottom: '1rem' }}>
              ILIO SAUNA
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Contemporary luxury saunas crafted with Scandinavian design principles.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
              QUICK LINKS
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/our-story" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Our Story
              </Link>
              <Link href="/saunas" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Saunas
              </Link>
              <Link href="/contact" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
              CONNECT
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="mailto:hello@iliosauna.com" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                hello@iliosauna.com
              </a>
              <a href="tel:+12505971244" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem' }}>
                (250) 597-1244
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
              LOCATION
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              404 – 2471 Sidney Ave<br />
              Sidney, BC V8L3A6
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} ilio Sauna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
