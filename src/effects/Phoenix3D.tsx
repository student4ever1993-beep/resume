import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Phoenix3DProps {
  size?: number; // Size in pixels (e.g. 48, 64, 120)
  interactive?: boolean;
  className?: string;
}

export default function Phoenix3D({ size = 48, interactive = true, className = '' }: Phoenix3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── 1. Scene & Camera Setup ──────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 2.7); // Crisp close-up view

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── 2. Cyber Mecha Robotic Phoenix Group ─────────────────────
    const phoenixGroup = new THREE.Group();
    scene.add(phoenixGroup);

    // High-Tech Cyber Mecha Materials
    const armorWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.92,
      emissive: 0xffffff,
      emissiveIntensity: 0.1,
    });

    const goldMechaMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.05,
      metalness: 1.0,
      emissive: 0xb8860b,
      emissiveIntensity: 0.25,
    });

    const darkJointMat = new THREE.MeshStandardMaterial({
      color: 0x15151e,
      roughness: 0.2,
      metalness: 0.95,
    });

    // Glowing Neon Cyber Core & Visor
    const cyanLaserMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    // ── Mecha Body / Torso ──
    const torsoGeo = new THREE.OctahedronGeometry(0.38, 0);
    torsoGeo.scale(0.9, 1.4, 0.7);
    const torso = new THREE.Mesh(torsoGeo, armorWhiteMat);
    torso.position.y = -0.1;
    phoenixGroup.add(torso);

    // Gold Chest Plate Armor
    const chestGeo = new THREE.OctahedronGeometry(0.32, 0);
    chestGeo.scale(1.1, 1.1, 0.8);
    const chest = new THREE.Mesh(chestGeo, goldMechaMat);
    chest.position.set(0, 0.12, 0.12);
    phoenixGroup.add(chest);

    // Glowing Cyber Arc Reactor / Chest Core
    const coreGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const core = new THREE.Mesh(coreGeo, cyanLaserMat);
    core.position.set(0, 0.15, 0.28);
    core.scale.set(1, 1, 0.5);
    phoenixGroup.add(core);

    // ── Mecha Head & Helmet ──
    const helmetGeo = new THREE.OctahedronGeometry(0.24, 1);
    helmetGeo.scale(0.9, 1.1, 1.0);
    const helmet = new THREE.Mesh(helmetGeo, armorWhiteMat);
    helmet.position.set(0, 0.62, 0.1);
    phoenixGroup.add(helmet);

    // Sharp Stealth Jet Beak
    const beakGeo = new THREE.ConeGeometry(0.08, 0.42, 4); // 4-faceted sharp stealth beak
    beakGeo.rotateX(Math.PI / 2);
    beakGeo.rotateY(Math.PI / 4);
    const beak = new THREE.Mesh(beakGeo, goldMechaMat);
    beak.position.set(0, 0.6, 0.32);
    phoenixGroup.add(beak);

    // Cyber Visor / Laser Eyes
    const visorGeo = new THREE.BoxGeometry(0.28, 0.05, 0.1);
    const visor = new THREE.Mesh(visorGeo, cyanLaserMat);
    visor.position.set(0, 0.66, 0.22);
    phoenixGroup.add(visor);

    // Robotic Crown Crest Blades
    const crestGroup = new THREE.Group();
    for (let i = -2; i <= 2; i++) {
      const bladeGeo = new THREE.BoxGeometry(0.035, 0.45, 0.02);
      const blade = new THREE.Mesh(bladeGeo, i === 0 ? goldMechaMat : armorWhiteMat);
      blade.position.set(i * 0.07, 0.88, -0.05 + Math.abs(i) * 0.02);
      blade.rotation.z = i * -0.18;
      blade.rotation.x = -0.3;
      crestGroup.add(blade);
    }
    phoenixGroup.add(crestGroup);

    // ── Mecha Wings (Blade Feathers) ──
    const leftWingGroup = new THREE.Group();
    leftWingGroup.position.set(0.22, 0.2, 0);
    const rightWingGroup = new THREE.Group();
    rightWingGroup.position.set(-0.22, 0.2, 0);

    // Mechanical wing joints
    const jointGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const leftJoint = new THREE.Mesh(jointGeo, darkJointMat);
    const rightJoint = new THREE.Mesh(jointGeo, darkJointMat);
    leftWingGroup.add(leftJoint);
    rightWingGroup.add(rightJoint);

    const bladeCount = 5;
    for (let i = 0; i < bladeCount; i++) {
      const wingShape = new THREE.Shape();
      const length = 0.95 - i * 0.12;
      const width = 0.18 - i * 0.02;

      wingShape.moveTo(0, 0);
      wingShape.lineTo(width, length * 0.4);
      wingShape.lineTo(0.04, length);
      wingShape.lineTo(-width * 0.3, length * 0.7);
      wingShape.lineTo(0, 0);

      const extrudeSettings = { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008 };
      const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);

      const leftBlade = new THREE.Mesh(wingGeo, i % 2 === 0 ? armorWhiteMat : goldMechaMat);
      leftBlade.rotation.z = -Math.PI / 2.7 - i * 0.17;
      leftBlade.rotation.y = 0.15;
      leftBlade.position.set(i * 0.12, -i * 0.04, -i * 0.04);
      leftWingGroup.add(leftBlade);

      const rightBlade = new THREE.Mesh(wingGeo, i % 2 === 0 ? armorWhiteMat : goldMechaMat);
      rightBlade.rotation.z = Math.PI / 2.7 + i * 0.17;
      rightBlade.rotation.y = -0.15;
      rightBlade.position.set(-i * 0.12, -i * 0.04, -i * 0.04);
      rightWingGroup.add(rightBlade);
    }

    phoenixGroup.add(leftWingGroup);
    phoenixGroup.add(rightWingGroup);

    // ── Robotic Jet Tail Stream ──
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, -0.5, -0.1);
    for (let i = -2; i <= 2; i++) {
      const tailBladeGeo = new THREE.BoxGeometry(0.04, 1.1 - Math.abs(i) * 0.15, 0.02);
      const tailBlade = new THREE.Mesh(tailBladeGeo, i === 0 ? goldMechaMat : armorWhiteMat);
      tailBlade.position.set(i * 0.08, -0.4, -Math.abs(i) * 0.04);
      tailBlade.rotation.z = i * 0.16;
      tailBlade.rotation.x = 0.25;
      tailGroup.add(tailBlade);
    }
    phoenixGroup.add(tailGroup);

    // ── 3. Cyber Energy Particle System ───────────────────────────
    const particleCount = 35;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pSpeeds: { x: number; y: number; z: number; resetY: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 1.0;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.4 - 0.2;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;

      pSpeeds.push({
        x: (Math.random() - 0.5) * 0.01,
        y: Math.random() * 0.02 + 0.015,
        z: (Math.random() - 0.5) * 0.01,
        resetY: -0.8 - Math.random() * 0.4,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 4. Studio Key Lighting ───────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Strong key light for metallic reflections & sharp facets
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    // Gold rim light for crisp contour separation
    const rimLight = new THREE.DirectionalLight(0xffd700, 4.0);
    rimLight.position.set(-2, 1, -2);
    scene.add(rimLight);

    // Blue fill light for futuristic mecha mood
    const blueFill = new THREE.DirectionalLight(0x00f0ff, 1.5);
    blueFill.position.set(0, -2, 2);
    scene.add(blueFill);

    // ── 5. Mouse Interactivity ───────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = x * 0.6;
      mouseRef.current.targetY = y * 0.4;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // ── 6. Animation Loop ────────────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth Mouse Lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Robotic Floating Motion
      phoenixGroup.position.y = Math.sin(time * 3) * 0.1;
      phoenixGroup.rotation.y = time * 0.7 + mouseRef.current.x;
      phoenixGroup.rotation.x = Math.sin(time * 2) * 0.06 - mouseRef.current.y;
      phoenixGroup.rotation.z = Math.sin(time * 2.5) * 0.04;

      // Mecha Wing Flapping Animation
      const wingFlap = Math.sin(time * 5.5) * 0.32;
      leftWingGroup.rotation.z = wingFlap;
      rightWingGroup.rotation.z = -wingFlap;

      // Core Arc Reactor Pulse
      core.scale.set(1 + Math.sin(time * 6) * 0.15, 1 + Math.sin(time * 6) * 0.15, 0.5);

      // Animate Cyber Energy Particles
      const pPosAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
      const posArray = pPosAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += pSpeeds[i].y;
        posArray[i * 3] += Math.sin(time * 4 + i) * 0.004;

        if (posArray[i * 3 + 1] > 1.2) {
          posArray[i * 3] = (Math.random() - 0.5) * 0.8;
          posArray[i * 3 + 1] = pSpeeds[i].resetY;
        }
      }
      pPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }

      // Dispose Geometries & Materials
      torsoGeo.dispose();
      chestGeo.dispose();
      coreGeo.dispose();
      helmetGeo.dispose();
      beakGeo.dispose();
      visorGeo.dispose();
      jointGeo.dispose();
      armorWhiteMat.dispose();
      goldMechaMat.dispose();
      darkJointMat.dispose();
      cyanLaserMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [size, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center pointer-events-auto ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
