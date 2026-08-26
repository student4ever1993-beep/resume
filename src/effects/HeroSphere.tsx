import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroSphereProps {
  showSphere?: boolean;
}

export default function HeroSphere({ showSphere = true }: HeroSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !showSphere) return;

    // ── Scene setup ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const isLightMode = () => document.documentElement.classList.contains('light');

    // ── Constellation Nodes & Connections Network ─────────────
    const nodeCount = 75;
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const positions = new Float32Array(nodeCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    const boundsX = 6.5;
    const boundsY = 4.5;
    const boundsZ = 3.0;

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * boundsX * 2;
      const y = (Math.random() - 0.5) * boundsY * 2;
      const z = (Math.random() - 0.5) * boundsZ * 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.002,
      });
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: isLightMode() ? 0.06 : 0.07,
      color: isLightMode() ? 0x855c00 : 0xffd700,
      transparent: true,
      opacity: isLightMode() ? 0.6 : 0.8,
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    nodesGroup.add(nodePoints);

    // Dynamic Line Connections Geometry & Material
    const maxConnections = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: isLightMode() ? 0xb8860b : 0xd4af37,
      transparent: true,
      opacity: isLightMode() ? 0.18 : 0.25,
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    nodesGroup.add(lineSegments);

    // ── Mouse Interaction ─────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ── Resize Handler ───────────────────────────────────────
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // ── MutationObserver for Theme Toggle ────────────────────
    const observer = new MutationObserver(() => {
      const light = isLightMode();
      nodeMat.color.setHex(light ? 0x855c00 : 0xffd700);
      nodeMat.opacity = light ? 0.6 : 0.8;
      lineMat.color.setHex(light ? 0xb8860b : 0xd4af37);
      lineMat.opacity = light ? 0.18 : 0.25;
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // ── Animation Loop ───────────────────────────────────────
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Mouse Parallax Lerp
      targetX += (mouseX * 0.3 - targetX) * 0.04;
      targetY += (-mouseY * 0.3 - targetY) * 0.04;

      nodesGroup.rotation.y = targetX;
      nodesGroup.rotation.x = targetY;

      // Update Node Positions
      const posAttr = nodeGeo.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        posArray[i * 3] += velocities[i].x;
        posArray[i * 3 + 1] += velocities[i].y;
        posArray[i * 3 + 2] += velocities[i].z;

        // Bounce off bounds
        if (Math.abs(posArray[i * 3]) > boundsX) velocities[i].x *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > boundsY) velocities[i].y *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > boundsZ) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // Update Line Connections (Connect nearby nodes)
      let lineIndex = 0;
      const connectionDistSq = 2.2 * 2.2;

      for (let i = 0; i < nodeCount; i++) {
        const x1 = posArray[i * 3];
        const y1 = posArray[i * 3 + 1];
        const z1 = posArray[i * 3 + 2];

        for (let j = i + 1; j < nodeCount; j++) {
          const x2 = posArray[j * 3];
          const y2 = posArray[j * 3 + 1];
          const z2 = posArray[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectionDistSq) {
            linePositions[lineIndex++] = x1;
            linePositions[lineIndex++] = y1;
            linePositions[lineIndex++] = z1;

            linePositions[lineIndex++] = x2;
            linePositions[lineIndex++] = y2;
            linePositions[lineIndex++] = z2;
          }
        }
      }

      lineGeo.setDrawRange(0, lineIndex / 3);
      const linePosAttr = lineGeo.getAttribute('position') as THREE.BufferAttribute;
      linePosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [showSphere]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
