import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import HeroBackground from '../effects/HeroBackground';
import { contactConfig } from '../config';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const emphasisRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const downloadCvRef = useRef<HTMLAnchorElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
      .fromTo(
        nameRef.current,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        emphasisRef.current,
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.8, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        [ctaRef.current, downloadCvRef.current],
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)', stagger: 0.1 },
        '-=0.3'
      )
      .fromTo(
        socialsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      );

    // Sparkle float animation
    if (sparkleRef.current) {
      gsap.to(sparkleRef.current, {
        y: -8,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    return () => {
      tl.kill();
    };
  }, [i18n.language]);

  const socialLinks = [
    { icon: <Github size={16} />, label: 'GitHub', href: contactConfig.socialLinks.find(l => l.label === 'GitHub')?.href || '#' },
    { icon: <Linkedin size={16} />, label: 'LinkedIn', href: contactConfig.socialLinks.find(l => l.label === 'LinkedIn')?.href || '#' },
    { icon: <Mail size={16} />, label: 'Email', href: `mailto:${contactConfig.items.find(i => i.icon === 'Mail')?.value || ''}` },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '700px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#050508',
      }}
    >
      <HeroBackground />

      {/* Decorative sparkle — bottom right */}
      <div
        ref={sparkleRef}
        className="hero-sparkle"
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          zIndex: 3,
          color: 'rgba(224, 224, 232, 0.6)',
          fontSize: '28px',
          fontWeight: 300,
          pointerEvents: 'none',
        }}
      >
        ✦
      </div>

      {/* Content */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
          width: '90%',
          maxWidth: '800px',
          direction: isRtl ? 'rtl' : 'ltr',
        }}
      >
        {/* Brain Image Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            width: '120%',
            maxWidth: '650px',
            aspectRatio: '1',
            zIndex: -1,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            opacity: 0.9,
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)',
          }}
        >
          <img
            src="/images/glowing_gold_brain.png"
            alt="Digital Brain"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Eyebrow Badge */}
        <div
          ref={eyebrowRef}
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: '#c9a84c',
            letterSpacing: isRtl ? '0' : '3px',
            textTransform: 'uppercase',
            border: '1px solid rgba(201, 168, 76, 0.4)',
            padding: '6px 20px',
            borderRadius: '2px',
            marginBottom: '32px',
            opacity: 0,
            background: 'rgba(201, 168, 76, 0.06)',
          }}
        >
          {t('hero.eyebrow')}
        </div>

        {/* Name */}
        <h1
          ref={nameRef}
          className="hero-name"
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
            fontSize: 'clamp(48px, 7vw, 90px)',
            fontWeight: 800,
            color: '#fff9dc',
            textShadow: '0 1px 0 #d4b75a, 0 2px 0 #b38728, 0 3px 0 #aa771c, 0 4px 0 #8c5d0a, 0 5px 0 #6e4604, 0 10px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201, 168, 76, 0.7)',
            lineHeight: 1.1,
            marginBottom: '0',
            opacity: 0,
            letterSpacing: isRtl ? '0' : '-0.02em',
          }}
        >
          {t('hero.titleLine')}
        </h1>

        {/* Emphasis — Digital Transformation */}
        <div
          ref={emphasisRef}
          className="hero-emphasis"
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", Georgia, serif',
            fontSize: 'clamp(40px, 6vw, 76px)',
            fontWeight: 800,
            color: '#fff9dc',
            textShadow: '0 1px 0 #d4b75a, 0 2px 0 #b38728, 0 3px 0 #aa771c, 0 4px 0 #8c5d0a, 0 5px 0 #6e4604, 0 10px 20px rgba(0,0,0,0.9), 0 0 30px rgba(201, 168, 76, 0.7)',
            lineHeight: 1.2,
            marginBottom: '30px',
            opacity: 0,
            fontStyle: isRtl ? 'normal' : 'italic',
          }}
        >
          {t('hero.titleEmphasis')}
        </div>

        {/* Subtitle — Role & Location */}
        <p
          ref={subtitleRef}
          className="hero-subtitle"
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
            fontSize: 'clamp(12px, 1.5vw, 14px)',
            fontWeight: 400,
            color: '#8b8b9a',
            lineHeight: 1.6,
            marginBottom: '24px',
            opacity: 0,
          }}
        >
          {t('hero.subtitleLine1')}
          <br />
          {t('hero.subtitleLine2')}
        </p>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="hero-tagline"
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
            fontSize: 'clamp(20px, 3.5vw, 36px)',
            fontWeight: 400,
            color: '#e0e0e8',
            lineHeight: 1.3,
            marginBottom: '32px',
            opacity: 0,
            letterSpacing: isRtl ? '0' : '-0.01em',
          }}
        >
          {t('hero.tagline')}
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: isRtl ? 'row-reverse' : 'row',
          }}
        >
          <a
            ref={ctaRef}
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector('#contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hero-cta"
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#c9a84c',
              letterSpacing: isRtl ? '0' : '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid rgba(201, 168, 76, 0.5)',
              borderRadius: '2px',
              padding: '14px 36px',
              display: 'inline-block',
              opacity: 0,
              transition: 'background 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
              background: 'rgba(201, 168, 76, 0.04)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = 'rgba(201, 168, 76, 0.12)';
              el.style.borderColor = '#c9a84c';
              el.style.boxShadow = '0 0 30px rgba(201, 168, 76, 0.15)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = 'rgba(201, 168, 76, 0.04)';
              el.style.borderColor = 'rgba(201, 168, 76, 0.5)';
              el.style.boxShadow = 'none';
            }}
          >
            {t('hero.contactCta')}
          </a>

          <a
            ref={downloadCvRef}
            href="/Alya-Al-Siyabi-CV.pdf"
            download="Alya-Al-Siyabi-CV.pdf"
            className="hero-cta hero-cta-download"
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#050508',
              letterSpacing: isRtl ? '0' : '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1px solid #c9a84c',
              borderRadius: '2px',
              padding: '14px 32px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              opacity: 0,
              transition: 'background 0.4s ease, box-shadow 0.4s ease',
              background: '#c9a84c',
              flexDirection: isRtl ? 'row-reverse' : 'row',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = '#e0bd5a';
              el.style.boxShadow = '0 0 30px rgba(201, 168, 76, 0.35)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = '#c9a84c';
              el.style.boxShadow = 'none';
            }}
          >
            <Download size={14} />
            {t('hero.downloadCv')}
          </a>
        </div>

        {/* Social Links */}
        <div
          ref={socialsRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            marginTop: '40px',
            opacity: 0,
            flexDirection: isRtl ? 'row-reverse' : 'row',
          }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                color: '#8b8b9a',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#c9a84c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8b8b9a';
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
