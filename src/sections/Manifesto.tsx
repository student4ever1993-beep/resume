import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Briefcase, GraduationCap, Award, Settings } from 'lucide-react';
import HeroBackground from '../effects/HeroBackground';

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  value: string;
  label: string;
}

interface ManifestoStats {
  experience: StatItem;
  masters: StatItem;
  bachelors: StatItem;
  projects: StatItem;
}

export default function Manifesto() {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);

  const isRtl = i18n.language === 'ar';
  const stats = t('manifesto.stats', { returnObjects: true }) as ManifestoStats;

  useEffect(() => {
    const textEl = textRef.current;
    const containerEl = containerRef.current;
    if (!textEl || !containerEl) return;

    function initAnimation() {
      // Clean up previous
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === containerEl) st.kill();
      });

      // Split text into words
      splitRef.current = new SplitType(textEl as HTMLElement, { types: 'words' });
      const words = (textEl as HTMLElement).querySelectorAll('.word');

      if (words.length === 0) return;

      // GSAP ScrollTrigger timeline
      tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 82%',
          end: 'center 65%',
          scrub: true,
        },
      });

      tlRef.current.fromTo(
        words,
        {
          opacity: 0.15,
          filter: 'blur(4px) brightness(60%)',
          willChange: 'filter, opacity',
        },
        {
          opacity: 1,
          filter: 'blur(0px) brightness(100%)',
          stagger: 0.04,
          ease: 'sine.out',
        }
      );
    }

    // Wait for fonts before splitting
    document.fonts.ready.then(() => {
      initAnimation();
    });

    // ResizeObserver with 150ms debounce
    const ro = new ResizeObserver(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        initAnimation();
      }, 150);
    });
    ro.observe(containerEl);

    // Floating animation for laptop visual
    const floatAnim = gsap.to(visualRef.current, {
      y: -12,
      rotation: 0.5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    // Fade-in stats elements
    if (statsGridRef.current) {
      gsap.fromTo(
        statsGridRef.current.children,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsGridRef.current,
            start: 'top 85%',
          },
        }
      );
    }

    return () => {
      ro.disconnect();
      floatAnim.kill();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (tlRef.current) tlRef.current.kill();
      if (splitRef.current) splitRef.current.revert();
    };
  }, [i18n.language]);

  return (
    <section
      id="manifesto"
      style={{
        backgroundColor: '#050508',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <HeroBackground showSphere={false} />

      <div
        ref={containerRef}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '120px 24px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Layout Grid: Text on left (or right if RTL), Graphic on opposite */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Column 1: Info Content (Text + Cards) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: isRtl ? 'right' : 'left',
              order: isRtl ? 1 : 1, // Let standard flow handle layout or override
            }}
          >
            {/* Eyebrow Label */}
            <p
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#c9a84c',
                letterSpacing: isRtl ? '0' : '3px',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {t('manifesto.sectionLabel')}
            </p>

            {/* Bold Intro Quote */}
            <h3
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                fontSize: 'clamp(22px, 3vw, 30px)',
                fontWeight: 500,
                lineHeight: 1.4,
                color: '#f5f5f0',
                marginBottom: '24px',
                borderLeft: isRtl ? 'none' : '3px solid #c9a84c',
                borderRight: isRtl ? '3px solid #c9a84c' : 'none',
                paddingLeft: isRtl ? '0' : '20px',
                paddingRight: isRtl ? '20px' : '0',
              }}
            >
              {t('manifesto.introQuote')}
            </h3>

            {/* Paragraph Text */}
            <p
              key={i18n.language}
              ref={textRef}
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                fontSize: 'clamp(14px, 2vw, 15px)',
                fontWeight: 400,
                lineHeight: 1.75,
                color: '#8b8b9a',
                marginBottom: '40px',
              }}
            >
              {t('manifesto.text')}
            </p>

            {/* 4 Stats Cards Grid */}
            <div
              ref={statsGridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              {/* Stat 1: Experience */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.02)',
                  border: '1px solid rgba(201, 168, 76, 0.12)',
                  borderRadius: '6px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  textAlign: isRtl ? 'right' : 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.35)';
                  e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.12)';
                  e.currentTarget.style.background = 'rgba(201, 168, 76, 0.02)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <span
                    style={{
                      fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 'clamp(18px, 2.5vw, 22px)',
                      fontWeight: 600,
                      color: '#f5f5f0',
                    }}
                  >
                    {stats?.experience?.value}
                  </span>
                  <Briefcase size={18} color="#c9a84c" />
                </div>
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#8b8b9a',
                    lineHeight: 1.4,
                  }}
                >
                  {stats?.experience?.label}
                </span>
              </div>

              {/* Stat 2: Masters */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.02)',
                  border: '1px solid rgba(201, 168, 76, 0.12)',
                  borderRadius: '6px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  textAlign: isRtl ? 'right' : 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.35)';
                  e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.12)';
                  e.currentTarget.style.background = 'rgba(201, 168, 76, 0.02)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <span
                    style={{
                      fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 'clamp(18px, 2.5vw, 22px)',
                      fontWeight: 600,
                      color: '#f5f5f0',
                    }}
                  >
                    {stats?.masters?.value}
                  </span>
                  <GraduationCap size={18} color="#c9a84c" />
                </div>
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#8b8b9a',
                    lineHeight: 1.4,
                  }}
                >
                  {stats?.masters?.label}
                </span>
              </div>

              {/* Stat 3: Bachelors */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.02)',
                  border: '1px solid rgba(201, 168, 76, 0.12)',
                  borderRadius: '6px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  textAlign: isRtl ? 'right' : 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.35)';
                  e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.12)';
                  e.currentTarget.style.background = 'rgba(201, 168, 76, 0.02)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <span
                    style={{
                      fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 'clamp(18px, 2.5vw, 22px)',
                      fontWeight: 600,
                      color: '#f5f5f0',
                    }}
                  >
                    {stats?.bachelors?.value}
                  </span>
                  <Settings size={18} color="#c9a84c" />
                </div>
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#8b8b9a',
                    lineHeight: 1.4,
                  }}
                >
                  {stats?.bachelors?.label}
                </span>
              </div>

              {/* Stat 4: Projects */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.02)',
                  border: '1px solid rgba(201, 168, 76, 0.12)',
                  borderRadius: '6px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  textAlign: isRtl ? 'right' : 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.35)';
                  e.currentTarget.style.background = 'rgba(201, 168, 76, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.12)';
                  e.currentTarget.style.background = 'rgba(201, 168, 76, 0.02)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <span
                    style={{
                      fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                      fontSize: 'clamp(18px, 2.5vw, 22px)',
                      fontWeight: 600,
                      color: '#f5f5f0',
                    }}
                  >
                    {stats?.projects?.value}
                  </span>
                  <Award size={18} color="#c9a84c" />
                </div>
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#8b8b9a',
                    lineHeight: 1.4,
                  }}
                >
                  {stats?.projects?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Laptop face Visual Graphic */}
          <div
            ref={visualRef}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              order: isRtl ? 2 : 2,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Soft glow behind image */}
              <div
                style={{
                  position: 'absolute',
                  width: '380px',
                  height: '380px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(201, 168, 76, 0.18) 0%, transparent 70%)',
                  filter: 'blur(28px)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
              <img
                src="/images/about_laptop_face.png"
                alt="Alya Al Siyabi Digital Transformation Concept"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '6px',
                  display: 'block',
                  zIndex: 2,
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
