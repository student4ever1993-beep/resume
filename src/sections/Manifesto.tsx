import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const splitRef = useRef<SplitType | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const textEl = textRef.current;
    const containerEl = containerRef.current;
    if (!textEl || !containerEl) return;

    function initAnimation() {
      // Clean up previous
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === containerEl) st.kill();
      });

      // Split text into words
      splitRef.current = new SplitType(textEl as HTMLElement, { types: 'words' });
      const words = (textEl as HTMLElement).querySelectorAll('.word');

      if (words.length === 0) return;

      // GSAP ScrollTrigger pipeline
      tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 82%',
          end: 'center 60%',
          scrub: true,
        },
      });

      tlRef.current.fromTo(
        words,
        {
          opacity: 0,
          filter: 'blur(12px) brightness(30%)',
          willChange: 'filter, opacity',
        },
        {
          opacity: 1,
          filter: 'blur(0px) brightness(100%)',
          stagger: 0.04,
          ease: 'sine.out',
        }
      );
    }

    // Wait for fonts before splitting
    document.fonts.ready.then(() => {
      initAnimation();
    });

    // ResizeObserver with 150ms debounce
    const ro = new ResizeObserver(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        initAnimation();
      }, 150);
    });
    ro.observe(containerEl);

    return () => {
      ro.disconnect();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (tlRef.current) tlRef.current.kill();
      if (splitRef.current) splitRef.current.revert();
    };
  }, [i18n.language]); // Re-run when language changes

  return (
    <section
      id="manifesto"
      style={{
        backgroundColor: '#050508',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        ref={containerRef}
        className="manifesto-container"
        style={{
          maxWidth: '80vw',
          margin: '0 auto',
          padding: '140px 0',
        }}
      >
        <p
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: '#00d4ff',
            letterSpacing: isRtl ? '0' : '3px',
            textTransform: 'uppercase',
            marginBottom: '48px',
            textAlign: 'center',
          }}
        >
          {t('manifesto.sectionLabel')}
        </p>

        <p
          key={i18n.language}
          ref={textRef}
          className="manifesto-text"
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
            fontSize: isRtl ? 'clamp(1.2rem, 3.2vw, 2.3rem)' : 'clamp(1.4rem, 3.5vw, 2.6rem)',
            fontWeight: isRtl ? 400 : 400,
            lineHeight: isRtl ? 1.6 : 1.25,
            color: '#e0e0e8',
            textAlign: 'center',
            textWrap: 'balance',
          }}
        >
          {t('manifesto.text')}
        </p>
      </div>
    </section>
  );
}
