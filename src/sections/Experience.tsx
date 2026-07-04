import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
}

export default function Experience() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isRtl = i18n.language === 'ar';
  const entries = t('experience.entries', { returnObjects: true }) as ExperienceEntry[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      entryRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: isRtl ? 30 : -30 },
          {
            opacity: 1,
            x: 0,
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
    }, sectionRef);

    return () => ctx.revert();
  }, [i18n.language]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        backgroundColor: '#0a0a0f',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '120px 24px',
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: '64px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#00d4ff',
              letterSpacing: isRtl ? '0' : '3px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            {t('experience.sectionLabel')}
          </p>
          <h2
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 500,
              color: '#e0e0e8',
              letterSpacing: isRtl ? '0' : '-0.01em',
            }}
          >
            {t('experience.title')}
          </h2>
        </div>

        {/* Timeline */}
        <div
          style={{
            position: 'relative',
            paddingLeft: isRtl ? '0' : '40px',
            paddingRight: isRtl ? '40px' : '0',
          }}
        >
          {/* Timeline Line */}
          <div
            style={{
              position: 'absolute',
              left: isRtl ? 'auto' : '7px',
              right: isRtl ? '7px' : 'auto',
              top: '8px',
              bottom: '8px',
              width: '2px',
              background: 'linear-gradient(to bottom, #00d4ff, rgba(0, 212, 255, 0.1))',
            }}
          />

          {Array.isArray(entries) && entries.map((entry, i) => (
            <div
              key={entry.company + entry.period}
              ref={(el) => { entryRefs.current[i] = el; }}
              style={{
                position: 'relative',
                marginBottom: i < entries.length - 1 ? '48px' : '0',
              }}
            >
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: isRtl ? 'auto' : '-40px',
                  right: isRtl ? '-40px' : 'auto',
                  top: '6px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '3px solid #00d4ff',
                  backgroundColor: i === 0 ? '#00d4ff' : '#0a0a0f',
                  boxShadow: i === 0 ? '0 0 12px rgba(0, 212, 255, 0.4)' : 'none',
                }}
              />

              {/* Content */}
              <div
                style={{
                  background: 'rgba(0, 212, 255, 0.03)',
                  border: '1px solid rgba(0, 212, 255, 0.08)',
                  borderRadius: '4px',
                  padding: '28px 32px',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                  textAlign: isRtl ? 'right' : 'left',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0, 212, 255, 0.2)';
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(0, 212, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0, 212, 255, 0.08)';
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(0, 212, 255, 0.03)';
                }}
              >
                <p
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '11px',
                    fontWeight: 400,
                    color: '#00d4ff',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}
                >
                  {entry.period}
                </p>
                <h3
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                    fontSize: '20px',
                    fontWeight: 500,
                    color: '#f5f5f0',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}
                >
                  {entry.title}
                </h3>
                <p
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#8b8b9a',
                  }}
                >
                  {entry.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
