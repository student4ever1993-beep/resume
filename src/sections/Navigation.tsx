import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLenis } from '../hooks/useLenis';
import ThemeToggle from '../components/ThemeToggle';
import { Globe } from 'lucide-react';

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Track active section for indicator
      const sections = ['hero', 'manifesto', 'experience', 'skills', 'projects', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const cleanId = targetId.replace('#', '');
    setActiveSection(cleanId);
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

  const links = [
    { label: t('nav.about'), target: '#manifesto', id: 'manifesto' },
    { label: t('nav.experience'), target: '#experience', id: 'experience' },
    { label: t('nav.skills'), target: '#skills', id: 'skills' },
    { label: t('nav.projects'), target: '#projects', id: 'projects' },
    { label: t('nav.contact'), target: '#contact', id: 'contact' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[100] transition-all duration-500 py-3 sm:py-5 flex justify-center px-4"
      >
        {/* Floating Cyber Glass Island Header */}
        <div
          className={`header-island w-full max-w-6xl px-5 sm:px-7 py-2.5 rounded-2xl sm:rounded-full transition-all duration-500 flex items-center justify-between border backdrop-blur-2xl ${
            scrolled
              ? 'bg-[var(--glass-bg)] border-[var(--border-highlight)] shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:py-2.5'
              : 'bg-[rgba(10,10,15,0.65)] border-[var(--border-primary)] shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
          } ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {/* Logo with Glow Effect */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="group flex items-center gap-3 text-decoration-none z-[102]"
          >
            <div className="relative flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Alya Al Siyabi Logo"
                className={`transition-all duration-500 object-contain group-hover:scale-105 ${
                  scrolled ? 'h-9 sm:h-11' : 'h-11 sm:h-13'
                }`}
              />
              <div className="absolute inset-0 bg-[var(--accent-gold)] opacity-0 group-hover:opacity-20 blur-lg transition-opacity rounded-full"></div>
            </div>
          </a>

          {/* Desktop Links Container */}
          <div
            className={`nav-links-container hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.12)] ${
              isRtl ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {links.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={`${item.label}-${item.target}`}
                  href={item.target}
                  onClick={(e) => handleNavClick(e, item.target)}
                  className={`nav-link-item ${isActive ? 'nav-link-active' : ''} relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-[var(--text-heading)] bg-[rgba(201,168,76,0.18)] shadow-[0_2px_12px_rgba(201,168,76,0.25)] border border-[rgba(201,168,76,0.3)]'
                      : 'text-[var(--text-primary)] opacity-80 hover:opacity-100 hover:text-[var(--accent-gold)] hover:bg-[rgba(201,168,76,0.08)]'
                  }`}
                  style={{
                    fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full bg-[var(--accent-gold)] shadow-[0_0_8px_var(--accent-gold)]" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop Right Controls (Language & Theme) */}
          <div className={`hidden md:flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Glass Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="lang-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(201,168,76,0.35)] bg-[rgba(201,168,76,0.08)] text-[var(--accent-gold)] text-xs font-bold hover:bg-[rgba(201,168,76,0.18)] hover:scale-105 transition-all duration-300 shadow-sm"
              style={{
                fontFamily: isRtl ? 'Inter, system-ui, sans-serif' : 'Cairo, system-ui, sans-serif',
              }}
            >
              <Globe size={13} className="animate-spin-slow" />
              <span>{i18n.language === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Theme Toggle Button */}
            <div className="p-0.5 rounded-full border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.05)]">
              <ThemeToggle size="sm" />
            </div>
          </div>

          {/* Mobile Hamburger & Controls */}
          <div className={`flex md:hidden items-center gap-2 z-[102] ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full border border-[rgba(201,168,76,0.35)] bg-[rgba(201,168,76,0.08)] text-[var(--accent-gold)] text-[11px] font-bold"
              style={{
                fontFamily: isRtl ? 'Inter, system-ui, sans-serif' : 'Cairo, system-ui, sans-serif',
              }}
            >
              {i18n.language === 'en' ? 'عربي' : 'EN'}
            </button>

            <ThemeToggle size="sm" />

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] text-[var(--text-primary)] flex flex-col justify-center gap-1.5"
            >
              <span
                className={`block w-5 h-0.5 bg-[var(--accent-gold)] transition-transform duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[var(--accent-gold)] transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[var(--accent-gold)] transition-transform duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Glass Menu Overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-[var(--bg-primary)]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-7 transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map((item) => (
          <a
            key={`mobile-${item.label}-${item.target}`}
            href={item.target}
            onClick={(e) => handleNavClick(e, item.target)}
            className="text-2xl font-bold tracking-widest uppercase text-[var(--text-heading)] hover:text-[var(--accent-gold)] transition-colors"
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
            }}
          >
            {item.label}
          </a>
        ))}

        <div className="mt-4">
          <ThemeToggle size="lg" />
        </div>
      </div>
    </>
  );
}
