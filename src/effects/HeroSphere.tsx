import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene setup ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Geodesic sphere (icosahedron) ────────────────────────
    const detail = 3;
    const geometry = new THREE.IcosahedronGeometry(1.6, detail);

    // Displace vertices for organic look
    const posAttr = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);
      const offset = 0.92 + Math.random() * 0.16;
      vertex.normalize().multiplyScalar(1.6 * offset);
      posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geometry.computeVertexNormals();

    // Dark faces with gold metallic tint
    const faceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1408,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      envMapIntensity: 1.0,
      emissive: 0x1a1005,
      emissiveIntensity: 0.3,
    });
    const faceMesh = new THREE.Mesh(geometry, faceMaterial);
    scene.add(faceMesh);

    // Gold wireframe overlay
    const wireGeometry = new THREE.IcosahedronGeometry(1.6, detail);
    // Copy displaced positions
    const wirePos = wireGeometry.getAttribute('position');
    for (let i = 0; i < wirePos.count; i++) {
      wirePos.setXYZ(i, posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    }
    wireGeometry.computeVertexNormals();

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4b75a,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireMesh);

    // ── Glowing nodes at vertices ────────────────────────────
    const nodePositions: number[] = [];
    const usedIndices = new Set<string>();
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const key = `${x.toFixed(3)}_${y.toFixed(3)}_${z.toFixed(3)}`;
      if (!usedIndices.has(key)) {
        usedIndices.add(key);
        // Sample ~40% of unique vertices for nodes
        if (Math.random() < 0.4) {
          nodePositions.push(x, y, z);
        }
      }
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0xf0d06a,
      size: 0.06,
      transparent: true,
      opacity: 1.0,
      sizeAttenuation: true,
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodes);

    // ── Floating particles around sphere ─────────────────────
    const particleCount = 300;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 3.0;
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
      particleSpeeds[i] = 0.001 + Math.random() * 0.003;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe0c060,
      size: 0.025,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ── Lighting ─────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xc9a84c, 0.4);
    scene.add(ambientLight);

    const goldLight1 = new THREE.PointLight(0xd4b75a, 4.0, 12);
    goldLight1.position.set(2, 2, 3);
    scene.add(goldLight1);

    const goldLight2 = new THREE.PointLight(0xc9a84c, 3.0, 12);
    goldLight2.position.set(-2, -1, 2);
    scene.add(goldLight2);

    const goldLight3 = new THREE.PointLight(0xe0c060, 2.0, 10);
    goldLight3.position.set(0, -2, 3);
    scene.add(goldLight3);

    const rimLight = new THREE.PointLight(0xd4b75a, 1.5, 10);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // ── Horizontal light streak (lens flare effect) ──────────
    const streakGeometry = new THREE.PlaneGeometry(8, 0.008);
    const streakMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4b75a,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const streak = new THREE.Mesh(streakGeometry, streakMaterial);
    streak.position.y = 0;
    streak.position.z = 0.5;
    scene.add(streak);

    // ── Animation loop ───────────────────────────────────────
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow rotation
      faceMesh.rotation.y = elapsed * 0.12;
      faceMesh.rotation.x = elapsed * 0.05;
      wireMesh.rotation.y = elapsed * 0.12;
      wireMesh.rotation.x = elapsed * 0.05;
      nodes.rotation.y = elapsed * 0.12;
      nodes.rotation.x = elapsed * 0.05;

      // Particles drift
      const pPos = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        pPos.array[iy] += particleSpeeds[i] * Math.sin(elapsed + i);
        pPos.array[ix] += particleSpeeds[i] * 0.3 * Math.cos(elapsed * 0.5 + i);
      }
      pPos.needsUpdate = true;

      // Subtle pulsing on wireframe
      wireMaterial.opacity = 0.5 + Math.sin(elapsed * 0.8) * 0.1;

      // Light streak shimmer
      streakMaterial.opacity = 0.2 + Math.sin(elapsed * 1.2) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize handler ───────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // ── Cleanup ──────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      geometry.dispose();
      faceMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      streakGeometry.dispose();
      streakMaterial.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
