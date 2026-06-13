import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projects = projectsConfig.projects;

  useEffect(() => {
    const ctx = gsap.context(() => {
      rowRefs.current.forEach((el) => {
        if (!el) return;
        const img = el.querySelector('.project-image');
        const content = el.querySelector('.project-content');

        if (img) {
          gsap.fromTo(
            img,
            { opacity: 0, x: -40 },
            {
              opacity: 1,
              x: 0,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, x: 40 },
            {
              opacity: 1,
              x: 0,
              duration: 1.2,
              delay: 0.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!projectsConfig.sectionLabel && !projectsConfig.title && projects.length === 0) {
    return null;
  }

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
        <div style={{ marginBottom: '64px' }}>
          {projectsConfig.sectionLabel && (
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
              {projectsConfig.sectionLabel}
            </p>
          )}
          {projectsConfig.title && (
            <h2
              style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 500,
                color: '#e0e0e8',
                letterSpacing: '-0.01em',
              }}
            >
              {projectsConfig.title}
            </h2>
          )}
        </div>

        {/* Project Rows */}
        {projects.map((project, i) => (
          <div
            key={project.name}
            ref={(el) => { rowRefs.current[i] = el; }}
            style={{
              display: 'flex',
              flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              marginBottom: i < projects.length - 1 ? '80px' : '0',
              gap: '0',
              flexWrap: 'wrap',
            }}
          >
            {/* Image */}
            <div
              className="project-image"
              style={{
                width: '50%',
                minWidth: '300px',
                flex: '1 1 50%',
              }}
            >
              <img
                src={project.image}
                alt={project.name}
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  borderRadius: '2px',
                }}
              />
            </div>

            {/* Content */}
            <div
              className="project-content"
              style={{
                width: '50%',
                minWidth: '300px',
                flex: '1 1 50%',
                padding: '48px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#00d4ff',
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                {project.tag}
              </p>
              <h3
                style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 'clamp(22px, 2.5vw, 30px)',
                  fontWeight: 500,
                  color: '#f5f5f0',
                  marginBottom: '16px',
                  lineHeight: 1.2,
                }}
              >
                {project.name}
              </h3>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#8b8b9a',
                  lineHeight: 1.65,
                  marginBottom: '28px',
                }}
              >
                {project.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#00d4ff',
                      background: 'rgba(0, 212, 255, 0.08)',
                      padding: '6px 14px',
                      borderRadius: '100px',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
