import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Briefcase, GraduationCap, Award, Settings } from 'lucide-react';

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

    // Floating animation for visual image
    const floatAnim = gsap.to(visualRef.current, {
      y: -15,
      rotation: 1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    // Fade-in stats elements
    if (statsGridRef.current) {
      gsap.fromTo(
        statsGridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
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
  }, [i18n.language]); // Re-run when language changes

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
      {/* Background visual glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: isRtl ? 'auto' : '10%',
          right: isRtl ? '10%' : 'auto',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(201, 168, 76, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        ref={containerRef}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '120px 24px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: '#c9a84c',
            letterSpacing: isRtl ? '0' : '3px',
            textTransform: 'uppercase',
            marginBottom: '48px',
            textAlign: 'center',
          }}
        >
          {t('manifesto.sectionLabel')}
        </p>

        {/* Split Grid Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
            flexDirection: isRtl ? 'row-reverse' : 'row',
          }}
        >
          {/* Column 1: Image / Visual Card */}
          <div
            ref={visualRef}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Glowing border card */}
            <div
              style={{
                position: 'relative',
                borderRadius: '8px',
                padding: '12px',
                background: 'rgba(201, 168, 76, 0.02)',
                border: '1px solid rgba(201, 168, 76, 0.1)',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(201, 168, 76, 0.05)',
                maxWidth: '440px',
                width: '100%',
              }}
            >
              {/* Outer decorative corners */}
              <div style={{ position: 'absolute', top: -2, left: -2, width: 12, height: 12, borderTop: '2px solid #c9a84c', borderLeft: '2px solid #c9a84c' }} />
              <div style={{ position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderTop: '2px solid #c9a84c', borderRight: '2px solid #c9a84c' }} />
              <div style={{ position: 'absolute', bottom: -2, left: -2, width: 12, height: 12, borderBottom: '2px solid #c9a84c', borderLeft: '2px solid #c9a84c' }} />
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderBottom: '2px solid #c9a84c', borderRight: '2px solid #c9a84c' }} />

              <img
                src="/images/about-visual.png"
                alt="Alya Al Siyabi Digital Transformation Visual"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '6px',
                  display: 'block',
                  opacity: 0.9,
                  transition: 'opacity 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Column 2: Info Text & Highlights */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: isRtl ? 'right' : 'left',
            }}
          >
            {/* Bold Intro Quote */}
            <h3
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                fontSize: '24px',
                fontWeight: 500,
                lineHeight: 1.35,
                color: '#f5f5f0',
                marginBottom: '24px',
                borderLeft: isRtl ? 'none' : '3px solid #c9a84c',
                borderRight: isRtl ? '3px solid #c9a84c' : 'none',
                paddingLeft: isRtl ? '0' : '16px',
                paddingRight: isRtl ? '16px' : '0',
              }}
            >
              {t('manifesto.introQuote')}
            </h3>

            {/* Split Text Paragraph */}
            <p
              key={i18n.language}
              ref={textRef}
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: 400,
                lineHeight: 1.7,
                color: '#8b8b9a',
                marginBottom: '40px',
              }}
            >
              {t('manifesto.text')}
            </p>

            {/* Stats Grid */}
            <div
              ref={statsGridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              {/* Stat 1 */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.02)',
                  border: '1px solid rgba(201, 168, 76, 0.08)',
                  borderRadius: '4px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                }}
                className="hover:border-gold-dim hover:bg-gold/[0.04]"
              >
                <Briefcase size={20} color="#c9a84c" />
                <span
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#f5f5f0',
                    lineHeight: 1.1,
                  }}
                >
                  {stats?.experience?.value}
                </span>
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#8b8b9a',
                  }}
                >
                  {stats?.experience?.label}
                </span>
              </div>

              {/* Stat 2 */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.02)',
                  border: '1px solid rgba(201, 168, 76, 0.08)',
                  borderRadius: '4px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                }}
                className="hover:border-gold-dim hover:bg-gold/[0.04]"
              >
                <GraduationCap size={20} color="#c9a84c" />
                <span
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#f5f5f0',
                    lineHeight: 1.1,
                  }}
                >
                  {stats?.masters?.value}
                </span>
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#8b8b9a',
                  }}
                >
                  {stats?.masters?.label}
                </span>
              </div>

              {/* Stat 3 */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.02)',
                  border: '1px solid rgba(201, 168, 76, 0.08)',
                  borderRadius: '4px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                }}
                className="hover:border-gold-dim hover:bg-gold/[0.04]"
              >
                <Settings size={20} color="#c9a84c" />
                <span
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#f5f5f0',
                    lineHeight: 1.1,
                  }}
                >
                  {stats?.bachelors?.value}
                </span>
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#8b8b9a',
                  }}
                >
                  {stats?.bachelors?.label}
                </span>
              </div>

              {/* Stat 4 */}
              <div
                style={{
                  background: 'rgba(201, 168, 76, 0.02)',
                  border: '1px solid rgba(201, 168, 76, 0.08)',
                  borderRadius: '4px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                }}
                className="hover:border-gold-dim hover:bg-gold/[0.04]"
              >
                <Award size={20} color="#c9a84c" />
                <span
                  style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#f5f5f0',
                    lineHeight: 1.1,
                  }}
                >
                  {stats?.projects?.value}
                </span>
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '12px',
                    color: '#8b8b9a',
                  }}
                >
                  {stats?.projects?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
