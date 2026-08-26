import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function HeroOrbitCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene & Camera ─────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ── Colors based on Theme ──────────────────────────────────
    const goldColor = isLight ? 0x9a7516 : 0xffd700;
    const accentColor = isLight ? 0xb8860b : 0xe0bd6b;
    const wireColor = isLight ? 0x855c00 : 0xd4b75a;

    // ── Lighting ───────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.2 : 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(goldColor, isLight ? 3 : 4, 15);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffae6, isLight ? 1.5 : 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(accentColor, isLight ? 1.0 : 1.5);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // ── 1. Inner Crystalline Nucleus ───────────────────────────
    const coreGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: goldColor,
      emissiveIntensity: isLight ? 0.15 : 0.4,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Inner wireframe shell
    const innerWireGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: wireColor,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.4 : 0.6,
    });
    const innerWireMesh = new THREE.Mesh(innerWireGeo, innerWireMat);
    mainGroup.add(innerWireMesh);

    // ── 2. Astrolabe Metallic Rings ────────────────────────────
    // Ring 1 (Equatorial)
    const ring1Geo = new THREE.TorusGeometry(1.75, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: goldColor,
      metalness: 0.95,
      roughness: 0.1,
      emissive: goldColor,
      emissiveIntensity: 0.2,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    mainGroup.add(ring1Mesh);

    // Ring 2 (Polar)
    const ring2Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: accentColor,
      metalness: 0.9,
      roughness: 0.15,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    mainGroup.add(ring2Mesh);

    // Ring 3 (Diagonal)
    const ring3Geo = new THREE.TorusGeometry(2.45, 0.015, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: wireColor,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.6 : 0.8,
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Mesh.rotation.x = -Math.PI / 4;
    ring3Mesh.rotation.y = Math.PI / 6;
    mainGroup.add(ring3Mesh);

    // ── 3. Orbiting Data Node Spheres ─────────────────────────
    const nodeGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: goldColor,
      emissive: goldColor,
      emissiveIntensity: 0.8,
      metalness: 0.8,
    });

    const nodeCount = 8;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.1;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.sin(angle * 2) * 0.3));
      nodeGroup.add(node);
    }
    mainGroup.add(nodeGroup);

    // ── 4. Particle Dust Field ─────────────────────────────────
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.2 + Math.random() * 1.2;

      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = r * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: isLight ? 0.035 : 0.045,
      color: goldColor,
      transparent: true,
      opacity: isLight ? 0.5 : 0.75,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // ── Mouse Interaction (Parallax) ───────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ── Resize Handler ─────────────────────────────────────────
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // ── Animation Loop ─────────────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Mouse Parallax Lerp
      targetX += (mouseX * 0.4 - targetX) * 0.05;
      targetY += (mouseY * 0.4 - targetY) * 0.05;

      mainGroup.rotation.y = targetX + elapsedTime * 0.15;
      mainGroup.rotation.x = targetY + Math.sin(elapsedTime * 0.2) * 0.1;

      // Independent Ring Rotations
      coreMesh.rotation.y = -elapsedTime * 0.3;
      coreMesh.rotation.x = elapsedTime * 0.2;
      innerWireMesh.rotation.y = elapsedTime * 0.4;

      ring1Mesh.rotation.z = elapsedTime * 0.25;
      ring2Mesh.rotation.x = elapsedTime * 0.3;
      ring3Mesh.rotation.y = -elapsedTime * 0.35;

      nodeGroup.rotation.z = elapsedTime * 0.2;
      particles.rotation.y = -elapsedTime * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Cleanup
      coreGeo.dispose();
      coreMat.dispose();
      innerWireGeo.dispose();
      innerWireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[360px] sm:min-h-[440px] relative flex items-center justify-center cursor-grab active:cursor-grabbing"
    />
  );
}
