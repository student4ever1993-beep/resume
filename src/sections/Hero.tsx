import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { heroConfig } from '../config';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
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
  }, [i18n.language]); // Re-run animation if language changes so ref elements align nicely

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
        backgroundColor: '#050508',
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
            opacity: 0.35,
            mixBlendMode: 'luminosity',
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
          background: 'radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.03) 0%, transparent 70%), linear-gradient(to bottom, rgba(5,5,8,0.3) 0%, rgba(5,5,8,0.6) 60%, rgba(5,5,8,0.95) 100%)',
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
          {t('hero.eyebrow')}
        </p>

        <h1
          ref={titleRef}
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
            fontSize: isRtl ? 'clamp(36px, 5.5vw, 64px)' : 'clamp(42px, 6vw, 72px)',
            fontWeight: 600,
            color: '#f5f5f0',
            lineHeight: 1.25,
            marginBottom: '20px',
            opacity: 0,
            letterSpacing: isRtl ? '0' : '-0.02em',
          }}
        >
          {t('hero.titleLine')}
          <br />
          <em style={{ fontStyle: 'normal', color: '#c9a84c' }}>{t('hero.titleEmphasis')}</em>
        </h1>

        <p
          ref={subtitleRef}
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
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
          {t('hero.subtitleLine1')}
          <br />
          {t('hero.subtitleLine2')}
        </p>

        <a
          ref={ctaRef}
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector('#projects');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: '#f5f5f0',
            letterSpacing: isRtl ? '0' : '2px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
            paddingBottom: '4px',
            opacity: 0,
            display: 'inline-block',
            transition: 'border-color 0.4s ease, color 0.4s ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLAnchorElement).style.borderBottomColor = '#c9a84c';
            (e.target as HTMLAnchorElement).style.color = '#c9a84c';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLAnchorElement).style.borderBottomColor = 'rgba(201, 168, 76, 0.3)';
            (e.target as HTMLAnchorElement).style.color = '#f5f5f0';
          }}
        >
          {t('hero.ctaText')}
        </a>
      </div>
    </section>
  );
}
