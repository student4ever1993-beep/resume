import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

interface LocalizedProject {
  name: string;
  role: string;
  contribution: string;
  client: string;
  image?: string;
}

export default function Projects() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isRtl = i18n.language === 'ar';
  const localizedList = t('projects.list', { returnObjects: true }) as LocalizedProject[];

  // Merge the image properties from configuration
  const projects = Array.isArray(localizedList) ? localizedList.map((project, idx) => ({
    ...project,
    image: projectsConfig.projects[idx]?.image
  })) : [];

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
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
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
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
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

        {/* Project Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '20px',
          }}
        >
          {projects.map((project, i) => (
            <div
              key={project.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                background: 'rgba(0, 212, 255, 0.02)',
                border: '1px solid rgba(0, 212, 255, 0.08)',
                borderRadius: '4px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
                textAlign: isRtl ? 'right' : 'left',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-4px)';
                el.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                el.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.06)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = 'rgba(0, 212, 255, 0.08)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Image or Placeholder */}
              {project.image ? (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLImageElement).style.transform = 'scale(1)';
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 80, 120, 0.12) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontSize: '36px',
                      fontWeight: 600,
                      color: 'rgba(0, 212, 255, 0.2)',
                      letterSpacing: '2px',
                    }}
                  >
                    {project.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                  </span>
                </div>
              )}

              {/* Content */}
              <div style={{ padding: '24px' }}>
                {/* Role Badge */}
                <span
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"JetBrains Mono", monospace',
                    fontSize: '10px',
                    fontWeight: 500,
                    color: '#00d4ff',
                    background: 'rgba(0, 212, 255, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '100px',
                    letterSpacing: isRtl ? '0' : '0.5px',
                    display: 'inline-block',
                    marginBottom: '12px',
                  }}
                >
                  {project.role}
                </span>

                <h3
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#f5f5f0',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}
                >
                  {project.name}
                </h3>

                <p
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#8b8b9a',
                    lineHeight: 1.55,
                    marginBottom: '14px',
                  }}
                >
                  {project.contribution}
                </p>

                {/* Client */}
                <div
                  style={{
                    borderTop: '1px solid rgba(0, 212, 255, 0.06)',
                    paddingTop: '12px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#8b8b9a',
                      letterSpacing: isRtl ? '0' : '0.5px',
                    }}
                  >
                    <span style={{ color: '#4a4a5a' }}>{t('projects.clientLabel')}: </span>
                    {project.client}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
