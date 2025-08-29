'use client';

export default function AboutSection() {
  return (
    <section id="story" className="ilio-section" style={{ padding: '100px 0' }}>
      <div className="ilio-container">
        <div className="text-center mb-5">
          <h2 className="section-header h2-animate reveal-on-scroll" style={{ marginBottom: '2rem' }}>
            Make it stand out
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
              At Ilio, we believe wellness should be accessible, beautiful, and transformative.
              Our contemporary saunas combine Scandinavian craftsmanship with modern design principles.
            </p>
            <p className="reveal-on-scroll reveal-delay-3" style={{ 
              maxWidth: '800px', 
              margin: '1.5rem auto 3rem',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#5a5a5a'
            }}>
              Each sauna is precision-engineered from sustainably sourced Western Red Cedar and fitted 
              with advanced heating systems for an experience that lasts.
            </p>
            {/* Video Section */}
            <div className="reveal-on-scroll reveal-delay-4" style={{ 
              maxWidth: '900px', 
              margin: '0 auto',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <video 
                controls
                width="100%"
                height="auto"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48d9c1c168812dc664.jpeg"
              >
                <source 
                  src="https://res.cloudinary.com/dnqa04ovh/video/upload/q_auto:low,w_1280/v1755735418/render_01_1_g8xfvf.mp4" 
                  type="video/mp4" 
                />
                <p>Your browser does not support HTML5 video. Here is a <a href="https://res.cloudinary.com/dnqa04ovh/video/upload/q_auto:low,w_1280/v1755735418/render_01_1_g8xfvf.mp4">link to the video</a> instead.</p>
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}