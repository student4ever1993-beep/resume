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

    // ── Responsive Camera Z ────────────────────────────────────
    const getCameraZ = (width: number) => {
      if (width < 480) return 8.2;
      if (width < 768) return 7.0;
      if (width < 1024) return 6.5;
      return 5.8;
    };

    // ── Scene & Camera Setup ───────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = getCameraZ(container.clientWidth);

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

    // ── Theme-Aware Palette ────────────────────────────────────
    const goldHex = isLight ? 0x9a7516 : 0xffd700;
    const accentHex = isLight ? 0xb8860b : 0xe0bd6b;
    const lineHex = isLight ? 0x855c00 : 0xd4b75a;

    // ── Lighting Setup ─────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.4 : 0.9);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(goldHex, isLight ? 3.5 : 4.5, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffae6, isLight ? 1.5 : 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    // ── 1. Enterprise Network Node Geodesic Globe ──────────────
    const sphereRadius = 1.8;
    const geo = new THREE.IcosahedronGeometry(sphereRadius, 2);
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

    // Unique vertex positions for server nodes
    const nodePositions: THREE.Vector3[] = [];
    const posMap = new Map<string, THREE.Vector3>();

    for (let i = 0; i < posAttr.count; i++) {
      const x = Math.round(posAttr.getX(i) * 100) / 100;
      const y = Math.round(posAttr.getY(i) * 100) / 100;
      const z = Math.round(posAttr.getZ(i) * 100) / 100;
      const key = `${x},${y},${z}`;

      if (!posMap.has(key)) {
        const v = new THREE.Vector3(x, y, z);
        posMap.set(key, v);
        nodePositions.push(v);
      }
    }

    // Node Mesh Instances (Server Node Spheres)
    const nodeGroup = new THREE.Group();
    const nodeSphereGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const nodeSphereMat = new THREE.MeshStandardMaterial({
      color: goldHex,
      emissive: goldHex,
      emissiveIntensity: isLight ? 0.4 : 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });

    nodePositions.forEach((pos) => {
      const nodeMesh = new THREE.Mesh(nodeSphereGeo, nodeSphereMat);
      nodeMesh.position.copy(pos);
      nodeGroup.add(nodeMesh);
    });
    mainGroup.add(nodeGroup);

    // Network Connection Lines
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({
      color: lineHex,
      transparent: true,
      opacity: isLight ? 0.35 : 0.55,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // ── 2. Inner Glowing Core Orb ─────────────────────────────
    const innerCoreGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const innerCoreMat = new THREE.MeshPhysicalMaterial({
      color: goldHex,
      emissive: goldHex,
      emissiveIntensity: isLight ? 0.2 : 0.5,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    mainGroup.add(innerCoreMesh);

    // ── 3. Pulsing Data Packets Traveling Along Nodes ──────────
    const pulseCount = 12;
    const pulseGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: isLight ? 0xffffff : 0xffffff,
    });
    const pulses: { mesh: THREE.Mesh; startNode: THREE.Vector3; endNode: THREE.Vector3; progress: number; speed: number }[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const pMesh = new THREE.Mesh(pulseGeo, pulseMat);
      const startIdx = Math.floor(Math.random() * nodePositions.length);
      let endIdx = Math.floor(Math.random() * nodePositions.length);
      while (endIdx === startIdx) endIdx = Math.floor(Math.random() * nodePositions.length);

      const startNode = nodePositions[startIdx];
      const endNode = nodePositions[endIdx];

      pMesh.position.copy(startNode);
      mainGroup.add(pMesh);

      pulses.push({
        mesh: pMesh,
        startNode,
        endNode,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
      });
    }

    // ── 4. Outer Orbital Satellites (Cloud, API, DB, AI) ──────
    const orbitRingGeo = new THREE.TorusGeometry(2.5, 0.012, 16, 100);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: accentHex,
      transparent: true,
      opacity: isLight ? 0.4 : 0.6,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 3;
    mainGroup.add(orbitRing);

    // ── Ultra-Smooth Mouse Parallax ────────────────────────────
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

    // ── Responsive Resize Handler ──────────────────────────────
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.position.z = getCameraZ(container.clientWidth);
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // ── Animation Loop ─────────────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX * 0.35 - targetX) * 0.03;
      targetY += (mouseY * 0.35 - targetY) * 0.03;

      mainGroup.rotation.y = targetX + elapsedTime * 0.15;
      mainGroup.rotation.x = targetY + Math.sin(elapsedTime * 0.2) * 0.08;

      innerCoreMesh.rotation.y = -elapsedTime * 0.3;
      innerCoreMesh.rotation.x = elapsedTime * 0.2;

      orbitRing.rotation.z = elapsedTime * 0.12;

      // Animate Data Packet Pulses
      pulses.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1.0) {
          p.progress = 0;
          const startIdx = Math.floor(Math.random() * nodePositions.length);
          let endIdx = Math.floor(Math.random() * nodePositions.length);
          while (endIdx === startIdx) endIdx = Math.floor(Math.random() * nodePositions.length);
          p.startNode = nodePositions[startIdx];
          p.endNode = nodePositions[endIdx];
        }

        p.mesh.position.lerpVectors(p.startNode, p.endNode, p.progress);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      geo.dispose();
      nodeSphereGeo.dispose();
      nodeSphereMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] relative flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300"
    />
  );
}
