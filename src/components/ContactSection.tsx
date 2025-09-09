import Link from 'next/link';

interface ContactSectionProps {
  homepageData?: {
    contactSection?: {
      title?: string;
      subtitle?: string;
      buttonText?: string;
      buttonLink?: string;
    };
  };
}

export default function ContactSection({ homepageData }: ContactSectionProps) {
  const contactData = homepageData?.contactSection;
  return (
    <section id="contact" className="ilio-section">
      <div className="ilio-container">
        <div className="text-center mb-5">
          <h2 className="section-header h2-animate reveal-on-scroll" style={{ marginBottom: '2rem' }}>{contactData?.title || 'Contact'}</h2>
          <div className="section-divider reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: '#D1D5DB',
            margin: '0 auto 2rem'
          }}></div>
          <p className="section-text reveal-on-scroll reveal-delay-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {contactData?.subtitle || 'Transform your space with a luxury sauna today.'}
          </p>
        </div>

        <div className="text-center reveal-on-scroll reveal-delay-3" style={{ marginTop: '3rem' }}>
          <Link href={contactData?.buttonLink || '/contact'} className="btn-primary" style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'var(--transition-base)',
            fontSize: '1rem',
            letterSpacing: '0.05em',
          }}>
{contactData?.buttonText || 'Get Started'}
          </Link>
        </div>
      </div>
    </section>
  );
}