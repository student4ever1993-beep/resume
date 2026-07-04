import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { educationConfig, workshopsConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      if (badgesRef.current) {
        const badges = badgesRef.current.querySelectorAll('.workshop-badge');
        gsap.fromTo(
          badges,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: badgesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      style={{
        backgroundColor: '#050508',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '120px 24px',
        }}
      >
        {/* Education Section */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#00d4ff',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {educationConfig.sectionLabel}
            </p>
            <h2
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 500,
                color: '#e0e0e8',
                letterSpacing: '-0.01em',
              }}
            >
              {educationConfig.title}
            </h2>
          </div>

          {/* Education Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {educationConfig.entries.map((entry, i) => (
              <div
                key={entry.institution}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  background: 'rgba(0, 212, 255, 0.03)',
                  border: '1px solid rgba(0, 212, 255, 0.1)',
                  borderRadius: '4px',
                  padding: '36px 32px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0, 212, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0, 212, 255, 0.1)';
                }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #00d4ff, rgba(0, 212, 255, 0.2))',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <p
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#00d4ff',
                      letterSpacing: '1px',
                    }}
                  >
                    {entry.period}
                  </p>
                  {entry.status && (
                    <span
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#050508',
                        background: '#00d4ff',
                        padding: '3px 10px',
                        borderRadius: '100px',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {entry.status}
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#f5f5f0',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}
                >
                  {entry.degree}
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#8b8b9a',
                    lineHeight: 1.5,
                  }}
                >
                  {entry.institution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Workshops & Training */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#00d4ff',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {workshopsConfig.sectionLabel}
            </p>
            <h2
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 500,
                color: '#e0e0e8',
                letterSpacing: '-0.01em',
              }}
            >
              {workshopsConfig.title}
            </h2>
          </div>

          {/* Workshop Badges */}
          <div
            ref={badgesRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {workshopsConfig.items.map((item) => (
              <span
                key={item}
                className="workshop-badge"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#e0e0e8',
                  background: 'rgba(0, 212, 255, 0.06)',
                  border: '1px solid rgba(0, 212, 255, 0.12)',
                  padding: '10px 18px',
                  borderRadius: '100px',
                  transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.background = 'rgba(0, 212, 255, 0.12)';
                  el.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                  el.style.color = '#00d4ff';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.background = 'rgba(0, 212, 255, 0.06)';
                  el.style.borderColor = 'rgba(0, 212, 255, 0.12)';
                  el.style.color = '#e0e0e8';
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
