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
    camera.position.set(0, 0, 4.2);

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

    // ── 2. Phoenix 3D Group Construction ─────────────────────────
    const phoenixGroup = new THREE.Group();
    scene.add(phoenixGroup);

    // Dynamic Fiery Glowing Material
    const fireMaterial = new THREE.MeshPhongMaterial({
      color: 0xff3300,
      emissive: 0xff4500,
      emissiveIntensity: 0.8,
      specular: 0xffd700,
      shininess: 90,
      side: THREE.DoubleSide,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0xffaa00,
      emissiveIntensity: 0.5,
    });

    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0xff2200,
      emissive: 0xff6600,
      emissiveIntensity: 0.9,
      specular: 0xffff00,
      shininess: 100,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });

    // ── Body & Neck ──
    const torsoGeo = new THREE.ConeGeometry(0.35, 1.1, 8);
    torsoGeo.rotateX(Math.PI);
    const torso = new THREE.Mesh(torsoGeo, fireMaterial);
    torso.position.y = -0.1;
    phoenixGroup.add(torso);

    const chestGeo = new THREE.SphereGeometry(0.38, 12, 12);
    const chest = new THREE.Mesh(chestGeo, goldMaterial);
    chest.position.set(0, 0.15, 0.08);
    chest.scale.set(1, 1.2, 0.9);
    phoenixGroup.add(chest);

    // ── Head, Beak & Crest ──
    const headGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const head = new THREE.Mesh(headGeo, goldMaterial);
    head.position.set(0, 0.65, 0.1);
    phoenixGroup.add(head);

    // Beak
    const beakGeo = new THREE.ConeGeometry(0.09, 0.35, 6);
    beakGeo.rotateX(Math.PI / 2);
    const beak = new THREE.Mesh(beakGeo, goldMaterial);
    beak.position.set(0, 0.63, 0.32);
    phoenixGroup.add(beak);

    // Glowing Phoenix Eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.12, 0.68, 0.22);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.12, 0.68, 0.22);
    phoenixGroup.add(leftEye, rightEye);

    // Fiery Crown Crest Feathers
    const crestGroup = new THREE.Group();
    for (let i = -2; i <= 2; i++) {
      const featherGeo = new THREE.ConeGeometry(0.04, 0.45, 5);
      const feather = new THREE.Mesh(featherGeo, fireMaterial);
      feather.position.set(i * 0.06, 0.85, -0.05 + Math.abs(i) * 0.02);
      feather.rotation.z = i * -0.15;
      feather.rotation.x = -0.3;
      crestGroup.add(feather);
    }
    phoenixGroup.add(crestGroup);

    // ── Wings (Left & Right) ──
    const leftWingGroup = new THREE.Group();
    leftWingGroup.position.set(0.25, 0.2, 0);
    const rightWingGroup = new THREE.Group();
    rightWingGroup.position.set(-0.25, 0.2, 0);

    // Build multi-blade wing geometry
    const featherCount = 5;
    for (let i = 0; i < featherCount; i++) {
      const wingShape = new THREE.Shape();
      const length = 0.9 - i * 0.12;
      const width = 0.22 - i * 0.03;

      wingShape.moveTo(0, 0);
      wingShape.quadraticCurveTo(width, length * 0.5, 0.05, length);
      wingShape.quadraticCurveTo(-width * 0.5, length * 0.6, 0, 0);

      const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 };
      const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);

      // Left wing feather
      const leftFeather = new THREE.Mesh(wingGeo, wingMaterial);
      leftFeather.rotation.z = -Math.PI / 2.8 - i * 0.18;
      leftFeather.rotation.y = 0.2;
      leftFeather.position.set(i * 0.12, -i * 0.05, -i * 0.04);
      leftWingGroup.add(leftFeather);

      // Right wing feather (mirrored)
      const rightFeather = new THREE.Mesh(wingGeo, wingMaterial);
      rightFeather.rotation.z = Math.PI / 2.8 + i * 0.18;
      rightFeather.rotation.y = -0.2;
      rightFeather.position.set(-i * 0.12, -i * 0.05, -i * 0.04);
      rightWingGroup.add(rightFeather);
    }

    phoenixGroup.add(leftWingGroup);
    phoenixGroup.add(rightWingGroup);

    // ── Fiery Tail Feathers ──
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, -0.55, -0.1);
    for (let i = -2; i <= 2; i++) {
      const tailGeo = new THREE.ConeGeometry(0.06, 1.2 - Math.abs(i) * 0.15, 6);
      const tailFeather = new THREE.Mesh(tailGeo, fireMaterial);
      tailFeather.position.set(i * 0.08, -0.4, -Math.abs(i) * 0.05);
      tailFeather.rotation.z = i * 0.18;
      tailFeather.rotation.x = 0.3 + Math.abs(i) * 0.05;
      tailGroup.add(tailFeather);
    }
    phoenixGroup.add(tailGroup);

    // ── 3. Flame & Ember Particle System ─────────────────────────
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);
    const pSpeeds: { x: number; y: number; z: number; resetY: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 1.2;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5 - 0.2;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

      pSizes[i] = Math.random() * 0.08 + 0.04;

      pSpeeds.push({
        x: (Math.random() - 0.5) * 0.015,
        y: Math.random() * 0.025 + 0.015, // Rise up like flame
        z: (Math.random() - 0.5) * 0.015,
        resetY: -0.8 - Math.random() * 0.4,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 4. Lights ────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xff4500, 1.2);
    scene.add(ambientLight);

    const flameLight = new THREE.PointLight(0xffa500, 3, 10);
    flameLight.position.set(0, 0.2, 1);
    scene.add(flameLight);

    const topGoldLight = new THREE.DirectionalLight(0xffd700, 2);
    topGoldLight.position.set(1, 3, 2);
    scene.add(topGoldLight);

    // ── 5. Mouse Interactivity Handlers ──────────────────────────
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

      // Phoenix Floating / Bobbing Motion
      phoenixGroup.position.y = Math.sin(time * 3) * 0.12;
      phoenixGroup.rotation.y = time * 0.8 + mouseRef.current.x;
      phoenixGroup.rotation.x = Math.sin(time * 2) * 0.08 - mouseRef.current.y;
      phoenixGroup.rotation.z = Math.sin(time * 2.5) * 0.05;

      // Dynamic 3D Wing Flapping Animation
      const wingFlap = Math.sin(time * 6) * 0.35;
      leftWingGroup.rotation.z = wingFlap;
      rightWingGroup.rotation.z = -wingFlap;
      leftWingGroup.rotation.y = Math.cos(time * 4) * 0.15;
      rightWingGroup.rotation.y = -Math.cos(time * 4) * 0.15;

      // Tail Feather Swaying
      tailGroup.rotation.z = Math.sin(time * 4) * 0.15;
      tailGroup.rotation.x = Math.cos(time * 3) * 0.1 + 0.1;

      // Flame Light Flickering
      flameLight.intensity = 2.5 + Math.sin(time * 15) * 0.8;

      // Animate Flame Particles (Rising upward)
      const pPosAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
      const posArray = pPosAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += pSpeeds[i].y;
        posArray[i * 3] += Math.sin(time * 5 + i) * 0.005;
        posArray[i * 3 + 2] += Math.cos(time * 4 + i) * 0.005;

        // Reset particle if it rises above threshold
        if (posArray[i * 3 + 1] > 1.2) {
          posArray[i * 3] = (Math.random() - 0.5) * 0.8;
          posArray[i * 3 + 1] = pSpeeds[i].resetY;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
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
      headGeo.dispose();
      beakGeo.dispose();
      eyeGeo.dispose();
      fireMaterial.dispose();
      goldMaterial.dispose();
      wingMaterial.dispose();
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
