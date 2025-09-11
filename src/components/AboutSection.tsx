'use client';

interface AboutSectionProps {
  homepageData?: {
    aboutSection?: {
      title?: string;
      paragraph1?: string;
      paragraph2?: string;
      videoUrl?: string;
    };
  };
}

export default function AboutSection({ homepageData }: AboutSectionProps) {
  const aboutData = homepageData?.aboutSection;
  
  return (
    <section id="story" className="ilio-section" style={{ padding: '80px 0' }}>
      <div className="ilio-container">
        <div className="text-center mb-5">
          <h2 className="section-header h2-animate reveal-on-scroll" style={{ marginBottom: '2rem' }}>
            {aboutData?.title || 'Bring beauty and wellness home with Ilio'}
          </h2>
          <div className="section-divider reveal-on-scroll reveal-delay-1" style={{
            width: '75%',
            height: '1px',
            background: '#D1D5DB',
            margin: '0 auto 2rem'
          }}></div>
          <div className="section-text">
            <p className="reveal-on-scroll reveal-delay-2" style={{ 
              maxWidth: '800px', 
              margin: '0 auto',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#5a5a5a'
            }}>
              {aboutData?.paragraph1 || 'At Ilio, we believe wellness should be accessible, beautiful, and transformative. Ilio delivers an affordable, high-quality sauna experience unlike any other. Our saunas unite Scandinavian craftsmanship with modern design, blending contemporary aesthetics with premium British Columbia–sourced materials. Precision-engineered and fitted with advanced heating systems, each sauna provides enduring quality and an experience that lasts.'}
            </p>
            
            {/* Video Section */}
            <div className="video-container reveal-on-scroll reveal-delay-3" style={{
              maxWidth: '900px',
              margin: '3rem auto 0',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <video 
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                poster="https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48eefde667db736f79.jpeg"
              >
                <source src={aboutData?.videoUrl || 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68b240d0b776b0fbe591e36c.mp4'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}