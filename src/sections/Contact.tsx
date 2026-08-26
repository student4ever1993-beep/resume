import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Linkedin, Copy, Check, Send, Sparkles, ExternalLink } from 'lucide-react';
import { contactConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

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

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.contact-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [i18n.language]);

  const copyEmail = () => {
    const email = contactConfig.items.find((i) => i.icon === 'Mail')?.value || 'Alya_alsiyabi93@outlook.com';
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  const emailValue = contactConfig.items.find((i) => i.icon === 'Mail')?.value || 'Alya_alsiyabi93@outlook.com';
  const locationValue = contactConfig.items.find((i) => i.icon === 'MapPin')?.value || 'Al-Seeb, Muscat, Oman';
  const linkedInUrl = contactConfig.socialLinks.find((s) => s.label === 'LinkedIn')?.href || 'https://om.linkedin.com/in/alya-al-siyabi-904861206';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 py-24 sm:py-32 px-4 overflow-hidden bg-transparent"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--accent-gold)]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-highlight)] bg-[var(--glass-bg)] backdrop-blur-md mb-6 shadow-sm">
          <Sparkles size={14} className="text-[var(--accent-gold)]" />
          <span
            className="text-xs font-bold tracking-widest text-[var(--accent-gold)] uppercase"
            style={{ fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif' }}
          >
            {t('contact.sectionLabel')}
          </span>
        </div>

        {/* Section Heading */}
        <h2
          ref={titleRef}
          className="text-3xl sm:text-5xl font-extrabold text-[var(--text-heading)] mb-6 tracking-tight leading-tight"
          style={{ fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif' }}
        >
          {t('contact.title')}
        </h2>

        <p
          className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto mb-14 leading-relaxed"
          style={{ fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif' }}
        >
          {t('contact.subtitle')}
        </p>

        {/* Interactive Cyber Cards Grid */}
        <div
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 ${isRtl ? 'direction-rtl' : 'direction-ltr'}`}
        >
          {/* Card 1: Direct Email */}
          <div className="contact-card group relative p-6 rounded-3xl border border-[var(--border-primary)] bg-[var(--glass-bg)] backdrop-blur-xl hover:border-[var(--accent-gold)] transition-all duration-500 shadow-xl flex flex-col justify-between text-left hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)] flex items-center justify-center text-[var(--accent-gold)] group-hover:scale-110 transition-transform">
                <Mail size={22} />
              </div>
              <button
                onClick={copyEmail}
                title="Copy Email Address"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-primary)] bg-[rgba(255,255,255,0.04)] text-xs text-[var(--text-primary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider mb-1">
                {isRtl ? 'البريد الإلكتروني' : 'Direct Email'}
              </h3>
              <a
                href={`mailto:${emailValue}`}
                className="text-sm font-semibold text-[var(--text-heading)] hover:text-[var(--accent-gold)] transition-colors break-all"
              >
                {emailValue}
              </a>
            </div>
          </div>

          {/* Card 2: Location */}
          <div className="contact-card group relative p-6 rounded-3xl border border-[var(--border-primary)] bg-[var(--glass-bg)] backdrop-blur-xl hover:border-[var(--accent-gold)] transition-all duration-500 shadow-xl flex flex-col justify-between text-left hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)] flex items-center justify-center text-[var(--accent-gold)] group-hover:scale-110 transition-transform">
                <MapPin size={22} />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {isRtl ? 'مسقط، عمان' : 'Muscat, Oman'}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider mb-1">
                {isRtl ? 'الموقع والمقر' : 'Location'}
              </h3>
              <p className="text-sm font-semibold text-[var(--text-heading)]">{locationValue}</p>
            </div>
          </div>

          {/* Card 3: LinkedIn Profile */}
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card group relative p-6 rounded-3xl border border-[var(--border-primary)] bg-[var(--glass-bg)] backdrop-blur-xl hover:border-[var(--accent-gold)] transition-all duration-500 shadow-xl flex flex-col justify-between text-left hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)] flex items-center justify-center text-[var(--accent-gold)] group-hover:scale-110 transition-transform">
                <Linkedin size={22} />
              </div>
              <div className="w-8 h-8 rounded-full border border-[var(--border-primary)] flex items-center justify-center text-[var(--accent-gold)] group-hover:bg-[var(--accent-gold)] group-hover:text-[#050508] transition-colors">
                <ExternalLink size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider mb-1">
                {isRtl ? 'الملف المهني' : 'LinkedIn Network'}
              </h3>
              <p className="text-sm font-semibold text-[var(--text-heading)] group-hover:text-[var(--accent-gold)] transition-colors">
                Alya Al-Siyabi
              </p>
            </div>
          </a>
        </div>

        {/* Quick Message Form */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-[var(--border-highlight)] bg-[var(--glass-bg)] backdrop-blur-2xl shadow-2xl">
          <h3
            className="text-lg font-bold text-[var(--text-heading)] mb-2"
            style={{ fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif' }}
          >
            {isRtl ? 'إرسال رسالة مباشرة' : 'Send a Direct Message'}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-6">
            {isRtl ? 'يسعدنا استلام استفساراتك ومناقشة الفرص والمشاريع القادمة.' : 'Leave a quick note below to start a technical discussion.'}
          </p>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in">
              <Check size={18} />
              <span>{isRtl ? 'شكراً لك! تم إرسال رسالتك بنجاح.' : 'Thank you! Your message has been sent successfully.'}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isRtl ? 'الاسم' : 'Your Name'}
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-[rgba(0,0,0,0.2)] text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={isRtl ? 'البريد الإلكتروني' : 'Your Email'}
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-[rgba(0,0,0,0.2)] text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                  />
                </div>
              </div>
              <div>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isRtl ? 'اكتب رسالتك هنا...' : 'Write your message...'}
                  className="w-full px-4 py-3 rounded-2xl border border-[var(--border-primary)] bg-[rgba(0,0,0,0.2)] text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[var(--accent-gold)] to-[#b5560b] text-[#050508] font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-lg flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>{isRtl ? 'إرسال الرسالة' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
