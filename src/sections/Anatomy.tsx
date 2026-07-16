import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillPillar {
  label: string;
  title: string;
  body: string;
}

// Minimal Starfield for the Background
function MinimalStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{ x: number; y: number; size: number; opacity: number; twinkleSpeed: number }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 12000); // Very sparse
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.2,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
        
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));
        ctx.fillStyle = '#c9a84c';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

// Icons for the nodes
const getIconForIndex = (index: number) => {
  switch(index) {
    case 0: return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
    case 1: return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    );
    case 2: return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
      </svg>
    );
    case 3: return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    );
    default: return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    );
  }
};

export default function Anatomy() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  
  const isRtl = i18n.language === 'ar';
  const pillars = t('skills.pillars', { returnObjects: true }) as SkillPillar[];
  
  const numNodes = pillars.length;
  const angleStep = 360 / numNodes;
  
  // The active node should be brought to the top-right-ish or directly right.
  // 0 degrees is right (3 o'clock). Let's bring the active node to 0 degrees for LTR and 180 degrees for RTL.
  const targetFocusAngle = isRtl ? 180 : 0;
  const dialRotation = targetFocusAngle - (activeTab * angleStep);

  const activePillar = pillars[activeTab];

  return (
    <section
      id="skills"
      style={{
        backgroundColor: '#050508', // Dark premium background
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        overflow: 'hidden',
        color: '#f5f5f0'
      }}
    >
      <MinimalStars />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 lg:py-24">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <p
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#c9a84c',
              letterSpacing: isRtl ? '0' : '4px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            EXPERTISE
          </p>
          <h2
            style={{
              fontFamily: isRtl ? 'Cairo, system-ui, sans-serif' : '"Space Grotesk", system-ui, sans-serif',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 500,
              color: '#f5f5f0',
            }}
          >
            Technical Skills
          </h2>
        </div>

        {/* Layout Container */}
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Left Side: 2D Interactive Astrolabe Dial */}
          <div className="w-full lg:w-1/2 flex justify-center items-center relative h-[450px] lg:h-[600px] py-10">
            
            {/* Soft gold halo backglow */}
            <div
              className="absolute w-[80%] h-[80%] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(201, 168, 76, 0.12) 0%, transparent 65%)',
                filter: 'blur(40px)',
                zIndex: 1,
              }}
            />

            {/* The Dial Container */}
            <motion.div 
              className="relative w-[300px] h-[300px] lg:w-[480px] lg:h-[480px] rounded-full z-10 flex justify-center items-center"
              animate={{ rotate: dialRotation }}
              transition={{ type: 'spring', damping: 25, stiffness: 60 }}
            >
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[rgba(201,168,76,0.3)] shadow-[0_0_50px_rgba(201,168,76,0.1),inset_0_0_30px_rgba(201,168,76,0.05)]" />
              
              {/* Inner concentric rings & SVG details */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-[rgba(201,168,76,0.2)]" />
              <div className="absolute inset-10 rounded-full border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.03)]" />
              
              {/* Decorative Astrolabe Lines */}
              <div className="absolute inset-0 rounded-full flex justify-center items-center opacity-30">
                <div className="w-full h-[1px] bg-[#c9a84c] absolute" />
                <div className="w-[1px] h-full bg-[#c9a84c] absolute" />
                <div className="w-full h-[1px] bg-[#c9a84c] absolute rotate-45" />
                <div className="w-full h-[1px] bg-[#c9a84c] absolute -rotate-45" />
              </div>

              <div className="absolute inset-20 rounded-full border-2 border-dashed border-[rgba(201,168,76,0.15)]" />
              <div className="absolute inset-28 lg:inset-36 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.05)]" />
              
              {/* Central Pivot Hub */}
              <div className="absolute w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#121218] border border-[rgba(201,168,76,0.6)] shadow-[0_0_25px_rgba(201,168,76,0.3)] flex justify-center items-center z-20">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-[#c9a84c] shadow-[0_0_15px_#c9a84c,inset_0_0_10px_rgba(0,0,0,0.5)] flex justify-center items-center">
                  <div className="w-2 h-2 rounded-full bg-[#121218]" />
                </div>
              </div>

              {/* Dynamic Nodes around the dial */}
              
                {pillars.map((_, i) => {
                const angle = i * angleStep;
                return (
                  <div 
                    key={i}
                    className="absolute top-1/2 left-1/2 flex justify-end items-center pointer-events-none"
                    style={{
                      width: '100%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    }}
                  >
                     <motion.button
                        onClick={() => setActiveTab(i)}
                        // Counter-rotate the button so it always stays upright
                        animate={{ rotate: -dialRotation - angle }}
                        transition={{ type: 'spring', damping: 25, stiffness: 60 }}
                        className={`pointer-events-auto relative flex justify-center items-center w-14 h-14 lg:w-16 lg:h-16 rounded-full cursor-pointer transition-all duration-300 translate-x-1/2 z-30 shadow-xl
                          ${activeTab === i 
                            ? 'bg-[#c9a84c] text-[#050508] shadow-[0_0_30px_rgba(201,168,76,0.8)] scale-110 border-2 border-[#f5f5f0]' 
                            : 'bg-[#1a1a24] text-[#c9a84c] border-2 border-[rgba(201,168,76,0.5)] hover:bg-[rgba(201,168,76,0.15)] hover:scale-110'
                          }
                        `}
                      >
                        {getIconForIndex(i)}
                        {/* Optional label underneath the button could go here, but counter rotation handles the icon perfectly */}
                      </motion.button>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Side: Glassmorphism Details Card */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-20 min-h-[400px]">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-full"
                >
                  <div 
                    className="liquid-glass p-8 lg:p-14 rounded-3xl border border-[rgba(201,168,76,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(201,168,76,0.05)]"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(20,20,25,0.6) 0%, rgba(10,10,15,0.8) 100%)',
                      backdropFilter: 'blur(16px)',
                      textAlign: isRtl ? 'right' : 'left' 
                    }}
                  >
                    <span 
                      className="inline-block px-5 py-2 mb-6 rounded-full text-[11px] lg:text-xs font-bold tracking-[0.15em] bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border border-[rgba(201,168,76,0.3)] uppercase"
                      style={{ fontFamily: isRtl ? 'Cairo' : 'Inter' }}
                    >
                      {activePillar.label}
                    </span>
                    
                    <h3
                      className="text-3xl lg:text-5xl font-semibold mb-6 text-[#f5f5f0] tracking-tight"
                      style={{ fontFamily: isRtl ? 'Cairo' : '"Space Grotesk"' }}
                    >
                      {activePillar.title}
                    </h3>
                    
                    <p
                      className="text-[#8b8b9a] text-base lg:text-lg leading-relaxed font-light"
                      style={{ fontFamily: isRtl ? 'Cairo' : 'Inter' }}
                    >
                      {activePillar.body}
                    </p>

                    {/* Decorative App/Tool Badges based on Active Tab */}
                    {activeTab === 0 && (
                      <div className="mt-10 flex gap-4 opacity-80">
                         <div className="w-12 h-12 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-lg hover:scale-110 transition-transform cursor-default">Fg</div>
                         <div className="w-12 h-12 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-lg hover:scale-110 transition-transform cursor-default">Ps</div>
                         <div className="w-12 h-12 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-lg hover:scale-110 transition-transform cursor-default">Cv</div>
                      </div>
                    )}
                    {activeTab === 1 && (
                      <div className="mt-10 flex gap-4 opacity-80">
                         <div className="w-12 h-12 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-sm hover:scale-110 transition-transform cursor-default">Lv</div>
                         <div className="w-12 h-12 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-sm hover:scale-110 transition-transform cursor-default">Nx</div>
                         <div className="w-12 h-12 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-sm hover:scale-110 transition-transform cursor-default">An</div>
                      </div>
                    )}
                    {activeTab === 2 && (
                      <div className="mt-10 flex gap-4 opacity-80 flex-wrap">
                         <div className="px-4 h-10 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-xs hover:scale-110 transition-transform cursor-default">HTML/CSS</div>
                         <div className="px-4 h-10 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-xs hover:scale-110 transition-transform cursor-default">PHP / C#</div>
                         <div className="px-4 h-10 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-xs hover:scale-110 transition-transform cursor-default">JS / TS</div>
                      </div>
                    )}
                    {activeTab > 2 && (
                      <div className="mt-10 flex gap-4 opacity-80 flex-wrap">
                         <div className="px-4 h-10 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-xs hover:scale-110 transition-transform cursor-default">Sys Design</div>
                         <div className="px-4 h-10 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-xs hover:scale-110 transition-transform cursor-default">Git</div>
                         <div className="px-4 h-10 rounded-xl bg-[#1e1e24] border border-[rgba(201,168,76,0.3)] shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex justify-center items-center text-[#c9a84c] font-bold text-xs hover:scale-110 transition-transform cursor-default">PowerBI</div>
                      </div>
                    )}
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
