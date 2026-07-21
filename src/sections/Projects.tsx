import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

// `tags` comes from projectsConfig.projects[idx].tags (matched by index, like `image`).
// `category` is expected to come from your translation files instead
// (e.g. projects.list[].category in en.json / ar.json), since it's not
// present in the projectsConfig.projects data.
interface LocalizedProject {
  name: string;
  role: string;
  category?: string;
  contribution: string;
  tags?: string[];
  client: string;
  image?: string;
}

export default function Projects() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const isRtl = i18n.language === 'ar';
  const localizedList = t('projects.list', { returnObjects: true }) as LocalizedProject[];

  const projects: LocalizedProject[] = Array.isArray(localizedList) ? localizedList.map((project, idx) => ({
    ...project,
    image: projectsConfig.projects[idx]?.image,
    category: project.category,
    tags: projectsConfig.projects[idx]?.tags,
  })) : [];

  const handleNext = () => {
    if (activeIndex < projects.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;

    if (Math.abs(deltaX) > threshold) {
      // Swiping left moves to next slide, swiping right moves to previous,
      // mirrored when the layout is RTL.
      const swipedLeft = deltaX < 0;
      const goNext = isRtl ? !swipedLeft : swipedLeft;
      if (goNext) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sliderRef.current) {
        gsap.fromTo(
          sliderRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sliderRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [i18n.language]);

  if (projects.length === 0) return null;

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        backgroundColor: '#0a0a0f',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <style>{`
        .proj-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 24px;
        }
        .proj-viewport {
          position: relative;
          width: 100%;
          min-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .proj-stage {
          position: relative;
          width: 100%;
          max-width: 800px;
          height: 520px;
          perspective: 1000px;
        }
        .proj-card {
          --tx-percent: 110%;
          --scale-step: 0.15;
          --rot-deg: -12deg;
          --dir: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #111118;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1);
          display: flex;
          flex-direction: column;
          transform: translateX(calc(var(--offset) * var(--tx-percent) * var(--dir)))
                     scale(calc(1 - var(--abs-offset) * var(--scale-step)))
                     rotateY(calc(var(--offset) * var(--rot-deg) * var(--dir)));
        }
        .proj-card--active {
          border: 1px solid rgba(201, 168, 76, 0.35);
          box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 168, 76, 0.05);
          opacity: 1;
          z-index: 10;
          pointer-events: auto;
        }
        .proj-card--side {
          border: 1px solid rgba(255, 255, 255, 0.03);
          box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
          opacity: 0.35;
          pointer-events: none;
        }
        .proj-card-body {
          padding: 32px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }
        .proj-badges-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .proj-badge-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #c9a84c;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 14px;
          border-radius: 20px;
          white-space: nowrap;
        }
        .proj-badge-category {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #c9a84c;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 14px;
          border-radius: 20px;
          white-space: nowrap;
        }
        .proj-details-row {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }
        .proj-contribution-box {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 16px 18px;
          font-family: Inter, sans-serif;
          font-size: 13px;
          color: #9a9aaf;
          line-height: 1.6;
        }
        .proj-tags-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: center;
          border: 1px solid rgba(201, 168, 76, 0.35);
          border-radius: 10px;
          padding: 14px 16px;
          min-width: 140px;
        }
        .proj-tag-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #e0bd6b;
          white-space: nowrap;
          background: rgba(201, 168, 76, 0.16);
          padding: 8px 14px;
          border-radius: 8px;
        }
        .proj-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 48px;
          gap: 24px;
        }
        .proj-nav-row {
          display: flex;
          align-items: center;
          gap: 24px;
          width: 100%;
          max-width: 480px;
          justify-content: center;
        }
        .proj-progress-track {
          width: 200px;
          height: 2px;
          background-color: rgba(255,255,255,0.05);
          position: relative;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .proj-nav-btn {
          background: none;
          border: none;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s;
          flex-shrink: 0;
        }
        .proj-dots-row {
          display: flex;
          gap: 8px;
        }
        .proj-dot {
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .proj-stage {
            max-width: 600px;
            height: 560px;
          }
          .proj-card {
            --tx-percent: 100%;
          }
        }

        /* Mobile: single-card view, stacked details */
        @media (max-width: 640px) {
          .proj-wrap {
            padding: 80px 16px;
          }
          .proj-viewport {
            min-height: auto;
          }
          .proj-stage {
            max-width: 420px;
            height: 620px;
          }
          .proj-card--side {
            display: none;
          }
          .proj-card-body {
            padding: 24px;
          }
          .proj-details-row {
            flex-direction: column;
          }
          .proj-tags-box {
            flex-direction: row;
            flex-wrap: wrap;
          }
          .proj-nav-row {
            gap: 12px;
          }
          .proj-progress-track {
            width: 120px;
          }
          .proj-nav-btn span.proj-nav-label {
            display: none;
          }
        }
      `}</style>

      <div className="proj-wrap">
        {/* Section Header */}
        <div style={{ marginBottom: '64px', textAlign: 'center' }}>
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
            {t('projects.sectionLabel')}
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
            {t('projects.title')}
          </h2>
        </div>

        {/* Carousel Window */}
        <div ref={sliderRef} className="proj-viewport">
          <div
            className="proj-stage"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {projects.map((project, i) => {
              const offset = i - activeIndex;
              const absOffset = Math.abs(offset);
              const isActive = offset === 0;
              const isVisible = absOffset <= 1;

              if (!isVisible) return null;

              const directionMultiplier = isRtl ? -1 : 1;

              return (
                <div
                  key={project.name}
                  className={`proj-card ${isActive ? 'proj-card--active' : 'proj-card--side'}`}
                  style={{
                    ['--offset' as string]: offset,
                    ['--abs-offset' as string]: absOffset,
                    ['--dir' as string]: directionMultiplier,
                    zIndex: 10 - absOffset,
                    textAlign: isRtl ? 'right' : 'left',
                  } as React.CSSProperties}
                >
                  {/* Aspect-Ratio Box Cover */}
                  {project.image ? (
                    <div style={{ width: '100%', height: '55%', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={project.image}
                        alt={project.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #111118 100%)' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '55%', background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.05) 0%, rgba(17, 17, 24, 1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '48px', fontWeight: 600, color: 'rgba(201, 168, 76, 0.15)' }}>
                        {project.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                      </span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="proj-card-body">
                    <div>
                      <div className="proj-badges-row">
                        <span className="proj-badge-role">
                          {project.role}
                        </span>
                        {project.category && (
                          <span className="proj-badge-category">
                            {project.category}
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontFamily: isRtl ? 'Cairo, sans-serif' : '"Space Grotesk", sans-serif', fontSize: '24px', fontWeight: 500, color: '#f5f5f0', marginBottom: '16px' }}>
                        {project.name}
                      </h3>

                      <div className="proj-details-row">
                        <p className="proj-contribution-box" style={{ margin: 0 }}>
                          {project.contribution}
                        </p>
                        {project.tags && project.tags.length > 0 && (
                          <div className="proj-tags-box">
                            {project.tags.map((tag: string) => (
                              <span key={tag} className="proj-tag-item">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', opacity: 0.5 }}>📍</span>
                      <p style={{ fontFamily: isRtl ? 'Cairo, sans-serif' : 'Inter, sans-serif', fontSize: '12px', color: '#8b8b9a', fontWeight: 500, margin: 0 }}>
                        <span style={{ color: '#5a5a6e' }}>{t('projects.clientLabel')}: </span>
                        {project.client}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Controllers */}
        <div className="proj-controls">
          <div className="proj-nav-row">
            <button
              onClick={isRtl ? handleNext : handlePrev}
              disabled={isRtl ? activeIndex === projects.length - 1 : activeIndex === 0}
              className="proj-nav-btn"
              style={{
                color: (isRtl ? activeIndex === projects.length - 1 : activeIndex === 0) ? '#333344' : '#c9a84c',
                cursor: (isRtl ? activeIndex === projects.length - 1 : activeIndex === 0) ? 'not-allowed' : 'pointer',
              }}
            >
              {isRtl ? (
                <><span className="proj-nav-label">NEXT</span> →</>
              ) : (
                <>← <span className="proj-nav-label">PREV</span></>
              )}
            </button>

            {/* Slider Progress Bar */}
            <div className="proj-progress-track">
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: isRtl ? 'auto' : 0,
                  right: isRtl ? 0 : 'auto',
                  height: '100%',
                  width: `${((activeIndex + 1) / projects.length) * 100}%`,
                  backgroundColor: '#c9a84c',
                  transition: 'width 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                  borderRadius: '2px'
                }}
              />
            </div>

            <button
              onClick={isRtl ? handlePrev : handleNext}
              disabled={isRtl ? activeIndex === 0 : activeIndex === projects.length - 1}
              className="proj-nav-btn"
              style={{
                color: (isRtl ? activeIndex === 0 : activeIndex === projects.length - 1) ? '#333344' : '#c9a84c',
                cursor: (isRtl ? activeIndex === 0 : activeIndex === projects.length - 1) ? 'not-allowed' : 'pointer',
              }}
            >
              {isRtl ? (
                <>← <span className="proj-nav-label">PREV</span></>
              ) : (
                <><span className="proj-nav-label">NEXT</span> →</>
              )}
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="proj-dots-row">
            {projects.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="proj-dot"
                style={{
                  width: idx === activeIndex ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: idx === activeIndex ? '#c9a84c' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}