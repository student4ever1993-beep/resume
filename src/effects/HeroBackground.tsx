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
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 35%, rgba(5,5,8,0.7) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,8,0.4) 0%, transparent 20%, transparent 80%, rgba(5,5,8,0.95) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
