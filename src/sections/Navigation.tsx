import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLenis } from '../hooks/useLenis';
//import { navigationConfig } from '../config';

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      const navHeight = navRef.current?.offsetHeight ?? 0;
      const probeY = navHeight > 0 ? navHeight * 0.6 : 60;
      const lightSectionIds = ['skills'];
      const isInLightSection = lightSectionIds.some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom >= probeY;
      });

      setIsLightSection(isInLightSection);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const baseTextColor = isLightSection && !menuOpen ? '#050508' : '#e0e0e8';
  const hoverTextColor = '#c9a84c';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(targetId);
    } else {
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  // Nav links localized mapping
  const links = [
    { label: t('nav.about'), target: '#manifesto' },
    { label: t('nav.experience'), target: '#experience' },
    { label: t('nav.skills'), target: '#skills' },
    { label: t('nav.projects'), target: '#projects' },
    { label: t('nav.contact'), target: '#contact' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 100,
          padding: scrolled ? '10px 0' : '16px 0',
          transition: 'padding 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="liquid-glass"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '14px 24px',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: isRtl ? 'row-reverse' : 'row',
          }}
        >
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              zIndex: 102,
            }}
          >
            <img
              src="/images/logo.png"
              alt="Alya Al Siyabi Logo"
              style={{
                height: scrolled ? '40px' : '55px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </a>

          {/* Desktop Links & Language Switcher */}
          <div
            className="nav-desktop-links"
            style={{
              display: 'flex',
              gap: '30px',
              alignItems: 'center',
              flexDirection: isRtl ? 'row-reverse' : 'row',
            }}
          >
            {links.map((item) => (
              <a
                key={`${item.label}-${item.target}`}
                href={item.target}
                onClick={(e) => handleNavClick(e, item.target)}
                className="nav-link"
                style={{
                  fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: baseTextColor,
                  letterSpacing: isRtl ? '0' : '1.3px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  transition: 'color 0.4s ease, opacity 0.4s ease',
                  opacity: 0.85,
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = hoverTextColor;
                  (e.target as HTMLAnchorElement).style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color = baseTextColor;
                  (e.target as HTMLAnchorElement).style.opacity = '0.85';
                }}
              >
                {item.label}
              </a>
            ))}

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              style={{
                fontFamily: isRtl ? 'Inter, system-ui, sans-serif' : 'Cairo, system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#c9a84c',
                backgroundColor: 'rgba(201, 168, 76, 0.08)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'background 0.3s ease, color 0.3s ease',
                marginLeft: isRtl ? '0' : '10px',
                marginRight: isRtl ? '10px' : '0',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = 'rgba(201, 168, 76, 0.16)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = 'rgba(201, 168, 76, 0.08)';
              }}
            >
              {i18n.language === 'en' ? 'عربي' : 'EN'}
            </button>
          </div>

          {/* Mobile Hamburger & Lang Switcher */}
          <div style={{ display: 'none', alignItems: 'center', gap: '10px', flexDirection: isRtl ? 'row-reverse' : 'row' }} className="nav-mobile-toggle">
            <button
              onClick={toggleLanguage}
              style={{
                fontFamily: isRtl ? 'Inter, system-ui, sans-serif' : 'Cairo, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                color: '#c9a84c',
                backgroundColor: 'rgba(201, 168, 76, 0.08)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                borderRadius: '4px',
                padding: '4px 10px',
                cursor: 'pointer',
                zIndex: 102,
              }}
            >
              {i18n.language === 'en' ? 'عربي' : 'EN'}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                zIndex: 102,
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '24px',
                  height: '2px',
                  background: baseTextColor,
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: '24px',
                  height: '2px',
                  background: baseTextColor,
                  transition: 'opacity 0.3s ease',
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: 'block',
                  width: '24px',
                  height: '2px',
                  background: baseTextColor,
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className="nav-mobile-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(5, 5, 8, 0.97)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      >
        {links.map((item) => (
          <a
            key={`mobile-${item.label}-${item.target}`}
            href={item.target}
            onClick={(e) => handleNavClick(e, item.target)}
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
              fontSize: '24px',
              fontWeight: 500,
              color: '#e0e0e8',
              letterSpacing: isRtl ? '0' : '3px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.color = '#c9a84c';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.color = '#e0e0e8';
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}
