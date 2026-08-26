import HeroSphere from './HeroSphere';

interface HeroBackgroundProps {
  showSphere?: boolean;
}

export default function HeroBackground({ showSphere = true }: HeroBackgroundProps) {
  return (
    <>
      <HeroSphere showSphere={showSphere} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 35%, var(--bg-primary) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.75,
          transition: 'background 0.4s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 20%, transparent 80%, var(--bg-primary) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.7,
          transition: 'background 0.4s ease',
        }}
      />
    </>
  );
}
