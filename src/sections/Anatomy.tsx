import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeritageHelix from '../effects/HeritageHelix';

gsap.registerPlugin(ScrollTrigger);

interface SkillPillar {
  label: string;
  title: string;
  body: string;
}

export default function Anatomy() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isRtl = i18n.language === 'ar';
  const pillars = t('skills.pillars', { returnObjects: true }) as SkillPillar[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      pillarRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              end: 'top 40%',
              scrub: false,
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
      id="skills"
      ref={sectionRef}
      style={{
        backgroundColor: '#f0f0f5',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Section Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '100px 24px 50px',
        }}
      >
        <p
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: '#00a8cc',
            letterSpacing: isRtl ? '0' : '3px',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          {t('skills.sectionLabel')}
        </p>
        <h2
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: '#050508',
            letterSpacing: isRtl ? '0' : '-0.01em',
          }}
        >
          {t('skills.title')}
        </h2>
      </div>

      {/* Split Layout */}
      <div
        style={{
          display: 'flex',
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: '100vh',
          flexDirection: isRtl ? 'row-reverse' : 'row',
        }}
      >
        {/* Left: Sticky HeritageHelix */}
        <div
          style={{
            width: '50%',
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hidden md:flex"
        >
          <div style={{ width: '100%', height: '80vh' }}>
            <HeritageHelix />
          </div>
        </div>

        {/* Right: Scrolling Content */}
        <div
          style={{
            width: '50%',
            padding: '0 48px',
            textAlign: isRtl ? 'right' : 'left',
          }}
          className="w-full md:w-1/2"
        >
          {Array.isArray(pillars) && pillars.map((pillar, i) => (
            <div
              key={pillar.label}
              ref={(el) => { pillarRefs.current[i] = el; }}
              style={{
                padding: '15vh 0',
                borderBottom: i < pillars.length - 1 ? '1px solid rgba(5, 5, 8, 0.08)' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#00a8cc',
                  letterSpacing: isRtl ? '0' : '3px',
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                }}
              >
                {pillar.label}
              </p>
              <h3
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                  fontSize: '26px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: '#050508',
                  marginBottom: '20px',
                }}
              >
                {pillar.title}
              </h3>
              <p
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: '#4a4a5a',
                  maxWidth: '480px',
                  margin: isRtl ? '0 0 0 auto' : '0 auto 0 0',
                }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
