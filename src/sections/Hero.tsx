import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { heroConfig } from '../config';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const hasHeroContent =
    heroConfig.videoPath ||
    heroConfig.eyebrow ||
    heroConfig.titleLine ||
    heroConfig.titleEmphasis ||
    heroConfig.subtitleLine1 ||
    heroConfig.subtitleLine2 ||
    heroConfig.ctaText;

  useEffect(() => {
    if (!hasHeroContent) return;

    const tl = gsap.timeline({ delay: 0.4 });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power2.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.85, y: 0, duration: 1.0, ease: 'power2.out' },
        '-=0.6'
      );

    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      );
    }

    return () => {
      tl.kill();
    };
  }, [hasHeroContent]);

  if (!hasHeroContent) {
    return null;
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Video Background */}
      {heroConfig.videoPath && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src={heroConfig.videoPath} type="video/mp4" />
        </video>
      )}

      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,8,0.3) 0%, rgba(5,5,8,0.6) 60%, rgba(5,5,8,0.9) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content Panel */}
      <div
        className="liquid-glass"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '680px',
          width: '90%',
          padding: '56px 48px 48px',
          borderRadius: '2px',
          textAlign: 'center',
        }}
      >
        {heroConfig.eyebrow && (
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
            {heroConfig.eyebrow}
          </p>
        )}

        {(heroConfig.titleLine || heroConfig.titleEmphasis) && (
          <h1
            ref={titleRef}
            style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 'clamp(42px, 6vw, 72px)',
              fontWeight: 500,
              color: '#f5f5f0',
              lineHeight: 1.1,
              marginBottom: '20px',
              opacity: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {heroConfig.titleLine}
            {heroConfig.titleEmphasis && (
              <>
                <br />
                <em style={{ fontStyle: 'italic', color: '#00d4ff' }}>{heroConfig.titleEmphasis}</em>
              </>
            )}
          </h1>
        )}

        {(heroConfig.subtitleLine1 || heroConfig.subtitleLine2) && (
          <p
            ref={subtitleRef}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#8b8b9a',
              lineHeight: 1.7,
              marginBottom: '32px',
              opacity: 0,
              maxWidth: '520px',
              margin: '0 auto 32px',
            }}
          >
            {heroConfig.subtitleLine1}
            {heroConfig.subtitleLine1 && heroConfig.subtitleLine2 && <br />}
            {heroConfig.subtitleLine2}
          </p>
        )}

        {heroConfig.ctaText && (
          <a
            ref={ctaRef}
            href={heroConfig.ctaTargetId || '#'}
            onClick={(e) => {
              e.preventDefault();
              if (!heroConfig.ctaTargetId) return;
              const el = document.querySelector(heroConfig.ctaTargetId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#f5f5f0',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
              paddingBottom: '4px',
              opacity: 0,
              display: 'inline-block',
              transition: 'border-color 0.4s ease, color 0.4s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.borderBottomColor = '#00d4ff';
              (e.target as HTMLAnchorElement).style.color = '#00d4ff';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.borderBottomColor = 'rgba(0, 212, 255, 0.3)';
              (e.target as HTMLAnchorElement).style.color = '#f5f5f0';
            }}
          >
            {heroConfig.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
