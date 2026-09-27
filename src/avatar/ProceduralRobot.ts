import * as THREE from 'three';
import type { ArmPose, AvatarPose, AvatarRig } from './types';

// Built-in avatar: a friendly humanoid robot built from primitives (no download, ~0 KB of
// assets). The face is a curved glass visor whose eyes and mouth are drawn by a shader, so
// blinking, expressions and lip sync are smooth at any resolution.

const faceVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPos;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const faceFragment = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uLook;
  uniform float uBlink;
  uniform float uEyeScale;
  uniform float uSquint;
  uniform float uOpen;
  uniform float uWide;
  uniform float uSmile;
  uniform float uShift;
  uniform float uThinking;
  uniform vec3 uColor;
  uniform vec3 uBase;
  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPos;

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  // Cheap ellipse distance approximation (good enough for glowing strokes).
  float sdEllipse(vec2 p, vec2 r) {
    float k0 = length(p / r);
    float k1 = length(p / (r * r));
    return k0 * (k0 - 1.0) / max(k1, 1e-4);
  }

  float eye(vec2 p, vec2 center) {
    vec2 q = p - center - uLook * vec2(0.05, 0.035);
    float w = 0.068 * uEyeScale;
    float h = 0.1 * uEyeScale * max(1.0 - uBlink, 0.07);
    float d = sdRoundBox(q, vec2(w, h), min(w, h) * 0.98);
    // Happy squint: carve the lower part away to leave a friendly arc.
    float carve = length(q - vec2(0.0, -0.26 + 0.15 * uSquint)) - 0.14;
    return max(d, -carve);
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    p.y -= 0.03;

    float dEyes = min(eye(p, vec2(-0.19, 0.07)), eye(p, vec2(0.19, 0.07)));

    // Mouth: a bent ellipse. Closed = thin smiling stroke, open = rounded shape.
    vec2 m = p - vec2(uShift, -0.17);
    m.y -= uSmile * 5.5 * m.x * m.x;
    float halfW = mix(0.095, 0.055 + 0.06 * uWide, clamp(uOpen * 1.5, 0.0, 1.0));
    halfW *= mix(1.0, 0.6, uThinking);
    float halfH = max(0.011, uOpen * 0.075);
    float dMouth = sdEllipse(m, vec2(halfW, halfH));
    float dInner = sdEllipse(m, vec2(max(halfW - 0.016, 0.001), max(halfH - 0.016, 0.001)));

    float aa = fwidth(p.y) * 1.5;
    float eyes = smoothstep(aa, -aa, dEyes);
    float mouth = smoothstep(aa, -aa, dMouth);
    float inner = smoothstep(aa, -aa, dInner) * smoothstep(0.02, 0.05, halfH);

    float glow = exp(-max(dEyes, 0.0) * 45.0) * 0.45 + exp(-max(dMouth, 0.0) * 55.0) * 0.35;

    // Thinking indicator: three dots that pulse above the mouth.
    float dots = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      vec2 c = vec2(-0.05 + fi * 0.05, -0.075);
      float s = 0.011 * (0.6 + 0.4 * sin(uTime * 6.0 - fi * 1.2));
      dots += smoothstep(aa, -aa, length(p - c) - s);
    }
    dots *= uThinking;

    // Glass visor: dark base, fresnel rim, a soft reflection streak and faint scanlines.
    vec3 n = normalize(vViewNormal);
    vec3 v = normalize(-vViewPos);
    float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);
    float streak = smoothstep(0.08, 0.0, abs(vUv.x - 0.28 - vUv.y * 0.25)) * smoothstep(0.35, 0.9, vUv.y) * 0.18;
    float scan = 0.03 * sin(vUv.y * 420.0 + uTime * 2.0);

    vec3 color = uBase + fres * vec3(0.35, 0.3, 0.22) + streak;
    vec3 featureColor = uColor * (1.0 + scan);
    color += featureColor * (eyes + mouth * (1.0 - inner * 0.75) + glow + dots) * 1.25;

    // Tiny highlight inside each eye makes it feel alive.
    vec2 hl = uLook * vec2(0.05, 0.035);
    float spark = smoothstep(0.02, 0.0, length(p - vec2(-0.165, 0.11) - hl)) + smoothstep(0.02, 0.0, length(p - vec2(0.215, 0.11) - hl));
    color += vec3(1.0) * spark * eyes * 0.6;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

interface Arm {
  shoulder: THREE.Group;
  elbow: THREE.Group;
  side: 1 | -1;
}

export class ProceduralRobot implements AvatarRig {
  readonly object = new THREE.Group();
  readonly framing = {
    compact: { target: new THREE.Vector3(0, 1.1, 0), distance: 2.05 },
    expanded: { target: new THREE.Vector3(0, 0.62, 0), distance: 4.6 },
  };

  private body = new THREE.Group();
  private neck = new THREE.Group();
  private head = new THREE.Group();
  private faceUniforms: Record<string, THREE.IUniform>;
  private glowMaterials: THREE.MeshStandardMaterial[] = [];
  private chestCore: THREE.MeshStandardMaterial;
  private arms: { left: Arm; right: Arm };
  private disposables: { dispose(): void }[] = [];

  constructor(options: { lowDetail?: boolean } = {}) {
    const seg = options.lowDetail ? 32 : 48;

    const shell = new THREE.MeshPhysicalMaterial({
      color: '#f1ede4',
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
    });
    const dark = new THREE.MeshStandardMaterial({ color: '#1b1c22', roughness: 0.45, metalness: 0.7 });
    const gold = new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.28, metalness: 1 });
    const glowMat = () => {
      const m = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#f5c451', emissiveIntensity: 1.5, roughness: 0.4 });
      this.glowMaterials.push(m);
      return m;
    };
    this.chestCore = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#f5c451', emissiveIntensity: 1.2 });
    this.disposables.push(shell, dark, gold, this.chestCore);

    const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, pos?: [number, number, number], scale?: [number, number, number]) => {
      const mesh = new THREE.Mesh(geo, mat);
      if (pos) mesh.position.set(...pos);
      if (scale) mesh.scale.set(...scale);
      parent.add(mesh);
      this.disposables.push(geo);
      return mesh;
    };

    // ── Body ──
    this.object.add(this.body);
    add(this.body, new THREE.SphereGeometry(0.5, seg, seg / 2), shell, [0, 0.05, 0], [1.12, 0.92, 0.72]);
    add(this.body, new THREE.TorusGeometry(0.2, 0.018, 12, seg), gold, [0, 0.52, 0], [1, 1, 1]).rotation.x = Math.PI / 2;
    add(this.body, new THREE.CylinderGeometry(0.075, 0.075, 0.02, seg), this.chestCore, [0, 0.2, 0.355]).rotation.x = Math.PI / 2;
    add(this.body, new THREE.TorusGeometry(0.095, 0.014, 12, seg), gold, [0, 0.2, 0.352]);
    // Waist band so the bottom of the torso reads as "robot" rather than a blob.
    add(this.body, new THREE.TorusGeometry(0.49, 0.025, 12, seg), dark, [0, -0.2, 0], [1.12, 0.72, 1]).rotation.x = Math.PI / 2;

    // ── Arms ──
    const makeArm = (side: 1 | -1): Arm => {
      const shoulder = new THREE.Group();
      shoulder.position.set(0.56 * side, 0.36, 0);
      this.body.add(shoulder);
      add(shoulder, new THREE.SphereGeometry(0.1, seg / 2, seg / 4), gold);
      add(shoulder, new THREE.CapsuleGeometry(0.075, 0.26, 6, seg / 2), shell, [0, -0.2, 0]);
      const elbow = new THREE.Group();
      elbow.position.set(0, -0.4, 0);
      shoulder.add(elbow);
      add(elbow, new THREE.SphereGeometry(0.07, seg / 2, seg / 4), dark);
      add(elbow, new THREE.CapsuleGeometry(0.065, 0.22, 6, seg / 2), shell, [0, -0.18, 0]);
      add(elbow, new THREE.SphereGeometry(0.085, seg / 2, seg / 4), dark, [0, -0.38, 0], [1, 1.1, 0.8]);
      return { shoulder, elbow, side };
    };
    this.arms = { left: makeArm(-1), right: makeArm(1) };

    // ── Neck + head ──
    this.neck.position.set(0, 0.56, 0);
    this.body.add(this.neck);
    add(this.neck, new THREE.CylinderGeometry(0.1, 0.13, 0.2, seg), dark, [0, 0.07, 0]);
    this.head.position.set(0, 0.16, 0);
    this.neck.add(this.head);

    const headScale: [number, number, number] = [1.12, 0.94, 1];
    add(this.head, new THREE.SphereGeometry(0.4, seg * 1.5, seg), shell, [0, 0.34, 0], headScale);

    // Visor: a front segment of a slightly larger sphere, drawn by the face shader.
    const phiLen = 2.0;
    const thetaLen = 1.3;
    const visorGeo = new THREE.SphereGeometry(0.405, seg * 1.5, seg, Math.PI / 2 - phiLen / 2, phiLen, Math.PI / 2 - thetaLen / 2 + 0.03, thetaLen);
    this.faceUniforms = {
      uTime: { value: 0 },
      uAspect: { value: (phiLen * 1.12) / (thetaLen * 0.94) },
      uLook: { value: new THREE.Vector2() },
      uBlink: { value: 0 },
      uEyeScale: { value: 1 },
      uSquint: { value: 0 },
      uOpen: { value: 0 },
      uWide: { value: 0.5 },
      uSmile: { value: 0.5 },
      uShift: { value: 0 },
      uThinking: { value: 0 },
      uColor: { value: new THREE.Color('#ffc94d') },
      uBase: { value: new THREE.Color('#05060a') },
    };
    const faceMat = new THREE.ShaderMaterial({
      uniforms: this.faceUniforms,
      vertexShader: faceVertex,
      fragmentShader: faceFragment,
    });
    this.disposables.push(faceMat);
    add(this.head, visorGeo, faceMat, [0, 0.34, 0.012], headScale);

    // Ears with state lights.
    for (const side of [-1, 1]) {
      const ear = add(this.head, new THREE.CylinderGeometry(0.09, 0.09, 0.07, seg), dark, [0.445 * side, 0.34, 0]);
      ear.rotation.z = Math.PI / 2;
      const ring = add(this.head, new THREE.TorusGeometry(0.062, 0.016, 10, seg), glowMat(), [0.482 * side, 0.34, 0]);
      ring.rotation.y = Math.PI / 2;
    }

    // Antenna.
    add(this.head, new THREE.CylinderGeometry(0.012, 0.018, 0.16, 12), dark, [0, 0.76, 0]);
    add(this.head, new THREE.SphereGeometry(0.04, 20, 12), glowMat(), [0, 0.86, 0]);
  }

  apply(pose: AvatarPose) {
    const u = this.faceUniforms;
    u.uTime.value = pose.time;
    (u.uLook.value as THREE.Vector2).set(pose.eyeX, pose.eyeY);
    u.uBlink.value = pose.blink;
    u.uEyeScale.value = pose.eyeScale;
    u.uSquint.value = pose.squint;
    u.uOpen.value = pose.mouthOpen;
    u.uWide.value = pose.mouthWide;
    u.uSmile.value = pose.smile;
    u.uShift.value = pose.mouthShift;
    u.uThinking.value = pose.thinking;
    (u.uColor.value as THREE.Color).set('#ffc94d').lerp(pose.glowColor, 0.35);

    for (const m of this.glowMaterials) {
      m.emissive.copy(pose.glowColor);
      m.emissiveIntensity = 0.6 + pose.glow * 1.6;
    }
    this.chestCore.emissive.copy(pose.glowColor);
    this.chestCore.emissiveIntensity = 0.5 + pose.glow * 1.2;

    const breath = pose.breath;
    this.body.position.y = breath * 0.006;
    this.body.scale.set(1 + breath * 0.004, 1 + breath * 0.008, 1 + breath * 0.006);
    this.body.rotation.set(pose.bodyLean, pose.bodyTurn, 0);

    this.neck.rotation.set(pose.headPitch * 0.35, pose.headYaw * 0.3, pose.headRoll * 0.3);
    this.head.rotation.set(pose.headPitch * 0.65, pose.headYaw * 0.7, pose.headRoll * 0.7, 'YXZ');

    this.applyArm(this.arms.right, pose.armRight);
    this.applyArm(this.arms.left, pose.armLeft);
  }

  private applyArm(arm: Arm, p: ArmPose) {
    // Poses are authored for the right arm; mirror Z rotations for the left.
    arm.shoulder.rotation.set(p.shoulderX, 0, p.shoulderZ * arm.side);
    arm.elbow.rotation.set(p.elbowX, 0, p.elbowZ * arm.side);
  }

  dispose() {
    for (const d of this.disposables) d.dispose();
    for (const m of this.glowMaterials) m.dispose();
  }
}
