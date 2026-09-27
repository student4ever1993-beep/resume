import * as THREE from 'three';
import type { ArmPose, AvatarDriver, AvatarGesture, AvatarPose, AvatarState } from './types';

// Turns the assistant state (idle / listening / thinking / speaking) plus audio levels into
// a smooth, lifelike pose: blinking, saccades, breathing, head motion, gestures and
// expressions. It knows nothing about meshes, so any rig can consume its output.

const STATE_COLORS: Record<AvatarState, THREE.Color> = {
  idle: new THREE.Color('#f5c451'),
  listening: new THREE.Color('#4fd1c5'),
  thinking: new THREE.Color('#a78bfa'),
  speaking: new THREE.Color('#ffd76a'),
};

const REST_ARM: ArmPose = { shoulderX: 0.08, shoulderZ: 0.14, elbowX: -0.18, elbowZ: 0 };

// Critically-damped approach toward a target, frame-rate independent.
const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function dampArm(arm: ArmPose, target: ArmPose, lambda: number, dt: number) {
  arm.shoulderX = damp(arm.shoulderX, target.shoulderX, lambda, dt);
  arm.shoulderZ = damp(arm.shoulderZ, target.shoulderZ, lambda, dt);
  arm.elbowX = damp(arm.elbowX, target.elbowX, lambda, dt);
  arm.elbowZ = damp(arm.elbowZ, target.elbowZ, lambda, dt);
}

export class AvatarBrain {
  readonly pose: AvatarPose = {
    headYaw: 0,
    headPitch: 0,
    headRoll: 0,
    bodyLean: 0,
    bodyTurn: 0,
    breath: 0,
    eyeX: 0,
    eyeY: 0,
    blink: 0,
    eyeScale: 1,
    squint: 0,
    mouthOpen: 0,
    mouthWide: 0.5,
    smile: 0.55,
    mouthShift: 0,
    glowColor: STATE_COLORS.idle.clone(),
    glow: 0.6,
    thinking: 0,
    listening: 0,
    speaking: 0,
    armLeft: { ...REST_ARM },
    armRight: { ...REST_ARM },
    time: 0,
  };

  private nextBlinkAt = rand(1.5, 4);
  private blinkStart = -1;
  private doubleBlink = false;
  private nextSaccadeAt = 0;
  private saccade = new THREE.Vector2();
  private gesture: { type: AvatarGesture; start: number } | null = null;
  private lastState: AvatarState = 'idle';
  private mouthOpenRaw = 0;
  private mouthWideRaw = 0.5;
  private talkEnergy = 0;

  update(driver: AvatarDriver, dt: number, anchor: { x: number; y: number } | null) {
    const p = this.pose;
    const t = (p.time += dt);
    const calm = driver.reducedMotion ? 0.35 : 1;
    const state = driver.state;

    if (state !== this.lastState) {
      // A blink on every state change reads as a natural "attention shift".
      this.startBlink(t);
      this.lastState = state;
    }
    if (!this.gesture && driver.gestureQueue.length) {
      const next = driver.gestureQueue.shift()!;
      if (!(driver.reducedMotion && next === 'wave')) this.gesture = { type: next, start: t };
    }

    p.listening = damp(p.listening, state === 'listening' ? 1 : 0, 6, dt);
    p.thinking = damp(p.thinking, state === 'thinking' ? 1 : 0, 5, dt);
    p.speaking = damp(p.speaking, state === 'speaking' ? 1 : 0, 8, dt);

    // ── Look target: follow the user's pointer, relative to where the avatar sits ──
    let lookX = 0;
    let lookY = 0;
    if (driver.pointer && anchor && performance.now() - driver.pointerMovedAt < 4000) {
      lookX = THREE.MathUtils.clamp((driver.pointer.x - anchor.x) / (window.innerWidth * 0.5), -1, 1);
      lookY = THREE.MathUtils.clamp((anchor.y - driver.pointer.y) / (window.innerHeight * 0.5), -1, 1);
    } else {
      // Idle wander: small saccades every few seconds.
      if (t > this.nextSaccadeAt) {
        this.saccade.set(rand(-0.45, 0.45), rand(-0.25, 0.3));
        this.nextSaccadeAt = t + rand(1.2, 3.5);
      }
      lookX = this.saccade.x;
      lookY = this.saccade.y;
    }

    // While speaking or listening the avatar mostly looks at the user (the camera).
    const attention = Math.max(p.speaking, p.listening) * 0.7;
    lookX *= 1 - attention;
    lookY *= 1 - attention;

    // Thinking: glance up and to the side.
    lookX = THREE.MathUtils.lerp(lookX, 0.55, p.thinking);
    lookY = THREE.MathUtils.lerp(lookY, 0.65, p.thinking);

    // Eyes move fast (saccade), head follows slowly.
    p.eyeX = damp(p.eyeX, lookX, 18, dt);
    p.eyeY = damp(p.eyeY, lookY, 18, dt);

    // ── Mouth / lip sync ──
    const mouth = state === 'speaking' ? driver.sampleMouth() : { open: 0, wide: 0.5 };
    // Fast attack, slower release keeps the mouth from chattering.
    const openLambda = mouth.open > this.mouthOpenRaw ? 30 : 14;
    this.mouthOpenRaw = damp(this.mouthOpenRaw, mouth.open, openLambda, dt);
    this.mouthWideRaw = damp(this.mouthWideRaw, mouth.wide, 12, dt);
    p.mouthOpen = this.mouthOpenRaw;
    p.mouthWide = this.mouthWideRaw;
    this.talkEnergy = damp(this.talkEnergy, p.mouthOpen, 3, dt);

    // ── Head ──
    const sway = Math.sin(t * 0.6) * 0.04 + Math.sin(t * 1.37) * 0.02;
    const speechNod = (Math.sin(t * 5.3) * 0.5 + Math.sin(t * 3.1) * 0.5) * this.talkEnergy * 0.07;
    const speechTurn = Math.sin(t * 1.25) * 0.08 * p.speaking;

    const yaw = lookX * 0.42 + sway * 0.6 + speechTurn;
    let pitch = -lookY * 0.22 + Math.sin(t * 0.8) * 0.015 + speechNod - p.mouthOpen * 0.03;
    let roll = Math.sin(t * 0.45) * 0.025 - p.listening * 0.14 + p.thinking * 0.12;

    // Listening: lean in slightly, attentive tilt.
    pitch += p.listening * 0.06;

    // Gestures layered on top.
    let armRightTarget: ArmPose = { ...REST_ARM };
    let armLeftTarget: ArmPose = { ...REST_ARM };

    if (this.gesture) {
      const g = t - this.gesture.start;
      if (this.gesture.type === 'nod') {
        const dur = 0.9;
        if (g < dur) pitch += Math.sin((g / dur) * Math.PI * 2) * 0.14 * Math.sin((g / dur) * Math.PI);
        else this.gesture = null;
      } else if (this.gesture.type === 'wave') {
        const dur = 2.4;
        if (g < dur) {
          const env = Math.min(1, g / 0.35) * Math.min(1, (dur - g) / 0.45);
          armRightTarget = {
            shoulderX: -0.25 * env,
            shoulderZ: THREE.MathUtils.lerp(REST_ARM.shoulderZ, 2.55, env),
            elbowX: -0.2 * env,
            elbowZ: (0.35 + Math.sin(g * 11) * 0.45) * env,
          };
          roll += 0.08 * env;
        } else {
          this.gesture = null;
        }
      }
    }

    if (!this.gesture || this.gesture.type === 'nod') {
      if (p.speaking > 0.05) {
        // Explaining: forearms raise and move with the rhythm of speech.
        const beat = Math.sin(t * 2.2);
        const beat2 = Math.sin(t * 1.7 + 1.3);
        const e = this.talkEnergy;
        armRightTarget = {
          shoulderX: -0.35 - 0.25 * e + beat * 0.08,
          shoulderZ: 0.3 + beat2 * 0.06,
          elbowX: -1.1 - 0.35 * e - beat * 0.15,
          elbowZ: -0.3,
        };
        armLeftTarget = {
          shoulderX: -0.2 - 0.15 * e + beat2 * 0.06,
          shoulderZ: 0.22,
          elbowX: -0.8 - 0.3 * e + beat2 * 0.12,
          elbowZ: -0.2,
        };
      } else if (p.thinking > 0.05) {
        // Hand to chin.
        armRightTarget = { shoulderX: -1.0, shoulderZ: -0.3, elbowX: -2.2, elbowZ: -0.95 };
      } else if (p.listening > 0.05) {
        armLeftTarget = { shoulderX: -0.12, shoulderZ: 0.2, elbowX: -0.45, elbowZ: 0 };
        armRightTarget = { shoulderX: -0.12, shoulderZ: 0.2, elbowX: -0.45, elbowZ: 0 };
      }
    }

    p.headYaw = damp(p.headYaw, yaw * calm, 4, dt);
    p.headPitch = damp(p.headPitch, pitch * calm, 5, dt);
    p.headRoll = damp(p.headRoll, roll * calm, 3, dt);
    p.bodyTurn = damp(p.bodyTurn, yaw * 0.25 * calm, 2, dt);
    p.bodyLean = damp(p.bodyLean, (p.listening * 0.05 + p.speaking * 0.02) * calm, 3, dt);
    p.breath = Math.sin(t * 1.55) * calm;

    const armLambda = this.gesture?.type === 'wave' ? 12 : 5;
    dampArm(p.armRight, armRightTarget, armLambda, dt);
    dampArm(p.armLeft, armLeftTarget, 5, dt);

    // ── Eyes: blink, size, expression ──
    if (t > this.nextBlinkAt && this.blinkStart < 0) this.startBlink(t);
    p.blink = this.blinkValue(t);

    const targetEyeScale = 1 + p.listening * 0.12 - p.thinking * 0.08 + Math.sin(t * 0.9) * 0.01;
    p.eyeScale = damp(p.eyeScale, targetEyeScale, 6, dt);

    // Friendly by default; a happy squint while speaking or waving.
    const waving = this.gesture?.type === 'wave' ? 1 : 0;
    const targetSquint = Math.max(waving * 0.85, p.speaking * 0.18 * (1 - p.mouthOpen));
    p.squint = damp(p.squint, targetSquint, 6, dt);

    const targetSmile = THREE.MathUtils.clamp(0.55 + p.listening * 0.2 + waving * 0.4 - p.thinking * 0.75, -0.3, 1);
    p.smile = damp(p.smile, targetSmile, 4, dt);
    p.mouthShift = damp(p.mouthShift, p.thinking * 0.035, 4, dt);

    // ── State lights ──
    p.glowColor.lerp(STATE_COLORS[state], 1 - Math.exp(-6 * dt));
    const pulse =
      state === 'thinking'
        ? 0.55 + 0.45 * Math.sin(t * 6)
        : state === 'listening'
          ? 0.7 + 0.3 * Math.sin(t * 3.5)
          : state === 'speaking'
            ? 0.65 + p.mouthOpen * 0.6
            : 0.55 + 0.1 * Math.sin(t * 1.55);
    p.glow = damp(p.glow, pulse, 10, dt);
  }

  private startBlink(t: number) {
    this.blinkStart = t;
    this.doubleBlink = Math.random() < 0.18;
  }

  private blinkValue(t: number) {
    if (this.blinkStart < 0) return 0;
    const dur = 0.16;
    const g = t - this.blinkStart;
    const total = this.doubleBlink ? dur * 2.3 : dur;
    if (g > total) {
      this.blinkStart = -1;
      this.nextBlinkAt = t + rand(2, 5.5);
      return 0;
    }
    const local = g % (dur * 1.3);
    return local < dur ? Math.sin((local / dur) * Math.PI) : 0;
  }
}
