import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AvatarBrain } from './AvatarBrain';
import { ProceduralRobot } from './ProceduralRobot';
import { avatarConfig } from './config';
import type { GLBAvatar } from './GLBAvatar';
import type { AvatarDriver, AvatarRig } from './types';

// Owns the WebGL renderer and the render loop. Rendering is throttled:
//   • stops entirely when the tab is hidden or the canvas is off-screen
//   • 30 fps while the avatar is the small launcher, 60 fps when expanded
//   • pixel ratio capped (lower on small/touch screens)

export interface AvatarSceneOptions {
  container: HTMLElement;
  driver: AvatarDriver;
}

export class AvatarScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
  private brain = new AvatarBrain();
  private rig: AvatarRig;
  private timer = new THREE.Timer();
  private frame = 0;
  private lastRender = 0;
  private visible = true;
  private expandT = 0;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private envTexture: THREE.Texture;
  private disposed = false;
  private camTarget = new THREE.Vector3();
  private options: AvatarSceneOptions;

  constructor(options: AvatarSceneOptions) {
    this.options = options;
    const { container } = options;
    const isSmallScreen = window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(this.renderer.domElement);

    // Soft studio reflections without downloading an HDR.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envTexture;
    this.scene.environmentIntensity = 0.55;

    const key = new THREE.DirectionalLight('#fff4dd', 2.2);
    key.position.set(1.5, 2.5, 3);
    const rim = new THREE.DirectionalLight('#d4af37', 2.4);
    rim.position.set(-2, 1.8, -2.5);
    const fill = new THREE.HemisphereLight('#fff8e6', '#20150a', 0.7);
    this.scene.add(key, rim, fill);

    this.rig = new ProceduralRobot({ lowDetail: isSmallScreen });
    this.scene.add(this.rig.object);
    // Checked against the literal env var so that, when no custom model is configured, the
    // build drops the GLB loader (and the three.js classes it needs) entirely.
    if (import.meta.env.VITE_AVATAR_MODEL_URL) {
      void import('./GLBAvatar').then(({ GLBAvatar }) => this.loadModel(GLBAvatar, avatarConfig.modelUrl));
    }

    this.expandT = options.driver.expanded ? 1 : 0;
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });
    this.intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', this.schedule);

    this.schedule();
  }

  private async loadModel(Loader: typeof GLBAvatar, url: string) {
    try {
      const glb = await Loader.load(url);
      if (this.disposed) return glb.dispose();
      this.scene.remove(this.rig.object);
      this.rig.dispose();
      this.rig = glb;
      this.scene.add(glb.object);
    } catch (error) {
      // Keep the built-in robot if the custom model fails to load.
      console.error('Avatar model failed to load, using the built-in robot:', error);
    }
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.options.container;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderOnce();
  }

  private schedule = () => {
    cancelAnimationFrame(this.frame);
    if (this.disposed || !this.visible || document.hidden) return;
    this.frame = requestAnimationFrame(this.tick);
  };

  private tick = (now: number) => {
    this.frame = requestAnimationFrame(this.tick);
    const fps = this.options.driver.expanded ? 60 : 30;
    if (now - this.lastRender < 1000 / fps - 2) return;
    this.lastRender = now;
    this.renderOnce();
  };

  private renderOnce() {
    const driver = this.options.driver;
    this.timer.update();
    // Clamped so resuming after a pause doesn't jump the animation.
    const dt = Math.min(this.timer.getDelta(), 0.1);

    const rect = this.options.container.getBoundingClientRect();
    const anchor = { x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.35 };
    this.brain.update(driver, dt, anchor);
    this.rig.apply(this.brain.pose, dt);

    // Smoothly move the camera between the "head only" and "upper body" framings.
    this.expandT = THREE.MathUtils.damp(this.expandT, driver.expanded ? 1 : 0, 5, dt);
    const { compact, expanded } = this.rig.framing;
    this.camTarget.lerpVectors(compact.target, expanded.target, this.expandT);
    // Narrow (portrait) stages need a little more distance so the arms stay in frame.
    const aspectBoost = Math.max(1, 1 / this.camera.aspect) ** 0.7;
    const distance = THREE.MathUtils.lerp(compact.distance, expanded.distance * aspectBoost, this.expandT);
    this.camera.position.set(this.camTarget.x, this.camTarget.y + 0.05, this.camTarget.z + distance);
    this.camera.lookAt(this.camTarget);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', this.schedule);
    this.rig.dispose();
    this.timer.dispose();
    this.envTexture.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
