import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin } from 'lucide-react';
import { contactConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ReactNode> = {
  Phone: <Phone size={20} />,
  Mail: <Mail size={20} />,
  MapPin: <MapPin size={20} />,
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (itemsRef.current) {
        const items = itemsRef.current.querySelectorAll('.contact-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (socialsRef.current) {
        gsap.fromTo(
          socialsRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: socialsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [i18n.language]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        backgroundColor: '#050508',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '120px 24px',
          textAlign: 'center',
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
            marginBottom: '24px',
          }}
        >
          {t('contact.sectionLabel')}
        </p>

        <h2
          ref={titleRef}
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 500,
            color: '#f5f5f0',
            marginBottom: '24px',
            lineHeight: 1.25,
            letterSpacing: isRtl ? '0' : '-0.01em',
          }}
        >
          {t('contact.title')}
        </h2>

        <p
          style={{
            fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#8b8b9a',
            maxWidth: '560px',
            margin: '0 auto 48px',
            lineHeight: 1.65,
          }}
        >
          {t('contact.subtitle')}
        </p>

        {/* Contact Items */}
        <div
          ref={itemsRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginBottom: '40px',
            flexWrap: 'wrap',
            flexDirection: isRtl ? 'row-reverse' : 'row',
          }}
        >
          {contactConfig.items.map((item) => (
            <div
              key={item.icon}
              className="contact-item"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ color: '#00d4ff' }}>{iconMap[item.icon] || null}</span>
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#e0e0e8',
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div
          ref={socialsRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            marginTop: '48px',
            flexDirection: isRtl ? 'row-reverse' : 'row',
          }}
        >
          {contactConfig.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#8b8b9a',
                letterSpacing: isRtl ? '0' : '1px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = '#00d4ff';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = '#8b8b9a';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
