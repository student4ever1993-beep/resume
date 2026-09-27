import { useEffect, useRef, type RefObject } from 'react';
import { AvatarScene } from './AvatarScene';
import type { AvatarDriver } from './types';

// Lazy-loaded (see ChatWidget) so Three.js avatar code stays out of the initial page load.
export default function AvatarCanvas({ driverRef, onError }: { driverRef: RefObject<AvatarDriver>; onError?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let scene: AvatarScene | null = null;
    try {
      scene = new AvatarScene({ container, driver: driverRef.current });
    } catch (error) {
      console.error('WebGL avatar unavailable:', error);
      onError?.();
    }
    return () => scene?.dispose();
    // The driver is a stable mutable object; the scene reads it every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
