import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
}

// Sub-component for a performance-optimized HTML5 Canvas starfield
function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.15 + 0.05,
          opacity: Math.random() * 0.7 + 0.3,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#c9a84c';

      stars.forEach((star) => {
        ctx.save();
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        // Golden color for stars
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Move stars downward slowly
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.65,
      }}
    />
  );
}

export default function Experience() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const isRtl = i18n.language === 'ar';
  const entries = t('experience.entries', { returnObjects: true }) as ExperienceEntry[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.experience-fade-in',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [i18n.language]);

  // Positions of year badges relative to the center robot image (on desktop)
  // Perfectly balanced layout around the central female cyborg
  const desktopPositions = [
    { top: '15%', left: '74%' },  // 2021 - Present (Top-Right)
    { top: '45%', left: '80%' },  // 2018 - 2019 (Mid-Right)
    { top: '80%', left: '55%' },  // 2017 - 2018 (Bottom-Right/Center)
    { top: '65%', left: '20%' },  // 2016 (Bottom-Left)
  ];

  const activeEntry = entries[activeIdx] || entries[0] || { title: '', company: '', period: '' };

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        backgroundColor: '#050508',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      {/* Moving Stars Background */}
      <StarsBackground />

      {/* Background gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.05) 0%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '120px 24px 140px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }} className="experience-fade-in">
          <p
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#c9a84c',
              letterSpacing: isRtl ? '0' : '3px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            {t('experience.sectionLabel')}
          </p>
          <h2
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
              fontSize: 'clamp(34px, 4.5vw, 52px)',
              fontWeight: 500,
              color: '#f5f5f0',
              letterSpacing: isRtl ? '0' : '-0.01em',
            }}
          >
            {t('experience.title')}
          </h2>
        </div>

        {/* Interactive Layout Container */}
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Detail Display Card */}
          <div
            className="experience-fade-in"
            style={{
              width: '100%',
              maxWidth: '720px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div
              className="liquid-glass"
              style={{
                borderRadius: '8px',
                padding: '28px 36px',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 0 25px rgba(201, 168, 76, 0.08)',
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {/* Glowing Golden Top Accent Dot */}
              <div
                style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#c9a84c',
                  boxShadow: '0 0 12px #c9a84c, 0 0 24px #c9a84c',
                }}
              />

              {/* Date display inside card */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: isRtl ? 'flex-start' : 'flex-end',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"JetBrains Mono", monospace',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#c9a84c',
                    backgroundColor: 'rgba(201, 168, 76, 0.08)',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(201, 168, 76, 0.25)',
                  }}
                >
                  {activeEntry.period}
                </span>
              </div>

              {/* Title & Company */}
              <h3
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 'clamp(20px, 3.2vw, 26px)',
                  fontWeight: 500,
                  color: '#f5f5f0',
                  marginBottom: '12px',
                  lineHeight: 1.4,
                }}
              >
                {activeEntry.title}
              </h3>
              <p
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                  fontSize: 'clamp(14px, 2.2vw, 16px)',
                  fontWeight: 400,
                  color: '#8b8b9a',
                  lineHeight: 1.6,
                }}
              >
                {activeEntry.company}
              </p>
            </div>
          </div>

          {/* Interactive Graphic & Years Area */}
          <div
            className="experience-fade-in"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '850px',
              height: '560px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Desktop View Layout (Absolute positioning of years around robot) */}
            <div className="hidden md:block" style={{ position: 'absolute', inset: 0 }}>
              {/* SVG 3D Spiral path winding behind/around robot */}
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
                viewBox="0 0 850 560"
                fill="none"
              >
                <defs>
                  <linearGradient id="spiral-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(201, 168, 76, 0.05)" />
                    <stop offset="50%" stopColor="rgba(201, 168, 76, 0.55)" />
                    <stop offset="100%" stopColor="rgba(201, 168, 76, 0.1)" />
                  </linearGradient>
                  <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                {/* Spiral path */}
                <path
                  d="M 180 380 C 240 480, 600 510, 680 430 C 760 350, 700 260, 580 280 C 420 300, 260 220, 380 130 C 450 80, 600 110, 620 180"
                  stroke="url(#spiral-grad)"
                  strokeWidth="3.5"
                  strokeDasharray="9 7"
                  filter="url(#glow-filter)"
                  opacity="0.85"
                />
              </svg>

              {/* Absolute positioned year badges */}
              {entries.map((entry, idx) => {
                const pos = desktopPositions[idx] || { top: '50%', left: '50%' };
                const isActive = idx === activeIdx;

                return (
                  <button
                    key={`desktop-year-${idx}`}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      position: 'absolute',
                      top: pos.top,
                      left: pos.left,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 12,
                      fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"JetBrains Mono", monospace',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isActive ? '#f5f5f0' : '#8b8b9a',
                      backgroundColor: isActive ? '#c9a84c' : 'rgba(10, 10, 15, 0.85)',
                      border: isActive ? '1px solid #f5f5f0' : '1px solid rgba(201, 168, 76, 0.35)',
                      padding: '10px 24px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      boxShadow: isActive
                        ? '0 0 24px rgba(201, 168, 76, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.25)'
                        : '0 6px 16px rgba(0,0,0,0.4)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = '#c9a84c';
                        e.currentTarget.style.color = '#c9a84c';
                        e.currentTarget.style.boxShadow = '0 0 18px rgba(201, 168, 76, 0.25)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.35)';
                        e.currentTarget.style.color = '#8b8b9a';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                      }
                    }}
                  >
                    {entry.period}
                  </button>
                );
              })}
            </div>

            {/* Central Robot Illustration - Larger & Scaled */}
            <div
              style={{
                position: 'relative',
                zIndex: 5,
                width: '450px',
                height: '450px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Soft gold halo backglow */}
              <div
                style={{
                  position: 'absolute',
                  width: '380px',
                  height: '380px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(201, 168, 76, 0.22) 0%, transparent 70%)',
                  filter: 'blur(28px)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
              <img
                src="/images/experience_robot_female.png"
                alt="Digital Transformation Concept"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  zIndex: 2,
                  animation: 'float 6s ease-in-out infinite',
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          </div>

          {/* Mobile View Layout (Simple horizontal timeline for switching) */}
          <div
            className="block md:hidden"
            style={{
              width: '100%',
              zIndex: 10,
              padding: '8px 0',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                gap: '12px',
                padding: '0 8px',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {entries.map((entry, idx) => {
                const isActive = idx === activeIdx;

                return (
                  <button
                    key={`mobile-year-${idx}`}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"JetBrains Mono", monospace',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isActive ? '#f5f5f0' : '#8b8b9a',
                      backgroundColor: isActive ? '#c9a84c' : 'rgba(10, 10, 15, 0.85)',
                      border: isActive ? '1px solid #f5f5f0' : '1px solid rgba(201, 168, 76, 0.3)',
                      padding: '8px 18px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 0 15px rgba(201, 168, 76, 0.3)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {entry.period}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
