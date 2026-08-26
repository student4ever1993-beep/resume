import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { Download, Github, Linkedin, Mail, ChevronDown, Zap, Award, MapPin } from 'lucide-react';
import HeroBackground from '../effects/HeroBackground';
import HeroOrbitCore from '../effects/HeroOrbitCore';
import { contactConfig } from '../config';
import { useTheme } from '../context/ThemeContext';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const emphasisRef = useRef<HTMLDivElement>(null);
  const locationBadgeRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const downloadCvRef = useRef<HTMLAnchorElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  
  const brainGraphicRef = useRef<HTMLDivElement>(null);
  const floatCard1Ref = useRef<HTMLDivElement>(null);
  const floatCard2Ref = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: -20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
    )
      .fromTo(
        nameRef.current,
        { opacity: 0, y: 35, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        emphasisRef.current,
        { opacity: 0, y: 25, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        locationBadgeRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        [downloadCvRef.current, ctaRef.current],
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1 },
        '-=0.3'
      )
      .fromTo(
        socialsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      )
      .fromTo(
        brainGraphicRef.current,
        { opacity: 0, scale: 0.85, filter: 'blur(15px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
        '-=1.2'
      )
      .fromTo(
        [floatCard1Ref.current, floatCard2Ref.current],
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)', stagger: 0.15 },
        '-=0.4'
      )
      .fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      );

    // Smooth floating loops for badge cards
    if (floatCard1Ref.current) {
      gsap.to(floatCard1Ref.current, {
        y: -10,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
    if (floatCard2Ref.current) {
      gsap.to(floatCard2Ref.current, {
        y: 10,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.4,
      });
    }

    return () => {
      tl.kill();
    };
  }, [i18n.language]);

  const socialLinks = [
    { icon: <Github size={15} />, label: 'GitHub', href: contactConfig.socialLinks.find(l => l.label === 'GitHub')?.href || '#' },
    { icon: <Linkedin size={15} />, label: 'LinkedIn', href: contactConfig.socialLinks.find(l => l.label === 'LinkedIn')?.href || '#' },
    { icon: <Mail size={15} />, label: 'Email', href: `mailto:${contactConfig.items.find(i => i.icon === 'Mail')?.value || ''}` },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[90vh] lg:min-h-screen overflow-hidden flex flex-col justify-center bg-transparent pt-24 pb-16"
    >
      <HeroBackground />

      <div className="relative z-10 max-w-[1320px] w-full mx-auto px-6 lg:px-12">
        <div
          className={`flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 ${
            isRtl ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Left Column: Typography, Subtitle & Action Hub */}
          <div
            className={`w-full lg:w-7/12 flex flex-col items-center lg:items-start text-center ${
              isRtl ? 'lg:text-right lg:items-end' : 'lg:text-left lg:items-start'
            }`}
          >
            {/* Live Status Eyebrow Badge */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--border-highlight)] bg-[var(--glass-bg)] shadow-md backdrop-blur-md mb-6"
              style={{ opacity: 0 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-gold)',
                  letterSpacing: isRtl ? '0' : '2px',
                  textTransform: 'uppercase',
                }}
              >
                {t('hero.eyebrow')}
              </span>
            </div>

            {/* Name Title */}
            <h1
              ref={nameRef}
              className="hero-name select-none font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.05] mb-2"
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                opacity: 0,
                color: isLight ? '#111118' : '#ffffff',
                textShadow: isLight
                  ? '0 2px 10px rgba(0, 0, 0, 0.08)'
                  : '0 0 30px rgba(201, 168, 76, 0.4), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {t('hero.titleLine')}
            </h1>

            {/* Sub-Heading Emphasis */}
            <div
              ref={emphasisRef}
              className={`hero-emphasis select-none font-extrabold text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 ${
                isRtl ? '' : 'italic'
              }`}
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", Georgia, serif',
                opacity: 0,
                color: isLight ? '#9a7516' : '#c9a84c',
                textShadow: isLight
                  ? '0 2px 8px rgba(154, 117, 22, 0.25)'
                  : '0 0 35px rgba(201, 168, 76, 0.5), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {t('hero.titleEmphasis')}
            </div>

            {/* Role & Location Glass Badge */}
            <div
              ref={locationBadgeRef}
              className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5 px-4 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] backdrop-blur-md mb-6 text-xs sm:text-sm font-medium text-[var(--text-heading)] shadow-sm"
              style={{ opacity: 0 }}
            >
              <MapPin size={15} className="text-[var(--accent-gold)] shrink-0" />
              <span>{t('hero.subtitleLine1')}</span>
              <span className="text-[var(--accent-gold)] font-bold">•</span>
              <span>{t('hero.subtitleLine2')}</span>
            </div>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="hero-tagline text-base sm:text-xl lg:text-2xl font-normal text-[var(--text-primary)] mb-8 leading-snug max-w-xl"
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
                opacity: 0,
              }}
            >
              {t('hero.tagline')}
            </p>

            {/* Action Buttons */}
            <div
              className={`flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 ${
                isRtl ? 'flex-row-reverse' : ''
              }`}
            >
              <a
                ref={downloadCvRef}
                href="/Alya-Al-Siyabi-CV.pdf"
                download="Alya-Al-Siyabi-CV.pdf"
                className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105"
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                  color: isLight ? '#ffffff' : '#050508',
                  background: isLight
                    ? 'linear-gradient(135deg, #b8860b 0%, #9a7516 100%)'
                    : 'linear-gradient(135deg, #e0bd6b 0%, #c9a84c 50%, #b8860b 100%)',
                  boxShadow: isLight
                    ? '0 10px 25px rgba(184, 134, 11, 0.35)'
                    : '0 10px 30px rgba(201, 168, 76, 0.4)',
                  opacity: 0,
                }}
              >
                <Download size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>{t('hero.downloadCv')}</span>
              </a>

              <a
                ref={ctaRef}
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector('#contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase border border-[var(--border-highlight)] bg-[var(--glass-bg)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[var(--accent-gold)]"
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                  color: 'var(--accent-gold)',
                  opacity: 0,
                }}
              >
                <span>{t('hero.contactCta')}</span>
              </a>
            </div>

            {/* Social Links Chips */}
            <div
              ref={socialsRef}
              className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}
              style={{ opacity: 0 }}
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-primary)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs font-medium text-[var(--text-muted)] transition-all duration-300 hover:border-[var(--border-highlight)] hover:text-[var(--accent-gold)] hover:scale-105"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive 3D Orbit Core WebGL Canvas & Badges Hub */}
          <div className="w-full lg:w-5/12 flex items-center justify-center relative min-h-[380px] lg:min-h-[500px]">
            {/* Soft Glow Radial Halo Behind Canvas */}
            <div className="absolute w-[85%] h-[85%] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.22)_0%,transparent_70%)] blur-3xl pointer-events-none" />

            {/* Interactive 3D Three.js WebGL Orbit Canvas */}
            <div
              ref={brainGraphicRef}
              className="relative w-full max-w-[420px] lg:max-w-[480px] aspect-square flex items-center justify-center z-10"
              style={{ opacity: 0 }}
            >
              <HeroOrbitCore />
            </div>

            {/* Floating Glass Highlight Badge 1 (Top Left) */}
            <div
              ref={floatCard1Ref}
              className="absolute top-2 left-2 sm:-left-2 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-[var(--border-highlight)] bg-[var(--glass-bg)] backdrop-blur-md shadow-xl"
              style={{ opacity: 0 }}
            >
              <div className="w-7 h-7 rounded-xl bg-[rgba(201,168,76,0.15)] flex items-center justify-center text-[var(--accent-gold)] shrink-0">
                <Zap size={14} />
              </div>
              <span className="text-xs font-semibold tracking-wide text-[var(--text-heading)] whitespace-nowrap">
                {isRtl ? 'قيادة التحول الرقمي' : 'IT Leadership & Strategy'}
              </span>
            </div>

            {/* Floating Glass Highlight Badge 2 (Bottom Right) */}
            <div
              ref={floatCard2Ref}
              className="absolute bottom-2 right-2 sm:-right-2 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-[var(--border-highlight)] bg-[var(--glass-bg)] backdrop-blur-md shadow-xl"
              style={{ opacity: 0 }}
            >
              <div className="w-7 h-7 rounded-xl bg-[rgba(201,168,76,0.15)] flex items-center justify-center text-[var(--accent-gold)] shrink-0">
                <Award size={14} />
              </div>
              <span className="text-xs font-semibold tracking-wide text-[var(--text-heading)] whitespace-nowrap">
                {isRtl ? 'خبرة +8 سنوات' : '8+ Years Experience'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer opacity-75 hover:opacity-100 transition-opacity"
        style={{ opacity: 0 }}
        onClick={() => {
          const el = document.querySelector('#manifesto') || document.querySelector('#experience');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] uppercase tracking-[3px] font-semibold text-[var(--text-muted)]">
          {isRtl ? 'استكشف المزيد' : 'Explore'}
        </span>
        <ChevronDown size={16} className="text-[var(--accent-gold)] animate-bounce" />
      </div>
    </section>
  );
}
