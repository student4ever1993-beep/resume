import { useEffect, useRef } from 'react';

export default function ParchmentUnroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function updateSize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = 2 * dpr;
      canvas!.style.width = window.innerWidth + 'px';
      canvas!.style.height = '2px';
      ctx!.scale(dpr, dpr);
    }

    updateSize();

    const handleResize = () => {
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      updateSize();
    };
    window.addEventListener('resize', handleResize);

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = docHeight > 0 ? scrollTop / docHeight : 0;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    function draw() {
      const w = window.innerWidth;
      ctx!.clearRect(0, 0, w, 2);

      if (progressRef.current > 0) {
        ctx!.beginPath();
        ctx!.moveTo(0, 1);
        ctx!.lineTo(w * progressRef.current, 1);
        ctx!.strokeStyle = 'rgba(0, 212, 255, 0.6)';
        ctx!.lineWidth = 2;
        ctx!.stroke();

        // Glow effect at the tip
        const tipX = w * progressRef.current;
        const gradient = ctx!.createRadialGradient(tipX, 1, 0, tipX, 1, 20);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx!.beginPath();
        ctx!.arc(tipX, 1, 20, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    />
  );
}
