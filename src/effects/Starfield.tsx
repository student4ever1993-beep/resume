import { useRef, useEffect } from 'react';

// Minimal twinkling starfield used as a background across sections
export default function Starfield() {
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
      const isLightMode = document.documentElement.classList.contains('light');

      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, isLightMode ? star.opacity * 0.8 : star.opacity));
        ctx.fillStyle = isLightMode ? '#b8860b' : '#c9a84c';
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
