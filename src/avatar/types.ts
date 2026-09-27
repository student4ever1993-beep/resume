import type * as THREE from 'three';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';
export type AvatarGesture = 'wave' | 'nod';

export interface MouthSample {
  /** 0 = closed, 1 = fully open */
  open: number;
  /** 0 = rounded (o/u), 1 = wide (e/i) */
  wide: number;
}

/**
 * Mutable object shared between React and the render loop. React writes to it;
 * the render loop reads it every frame. Nothing here triggers a React re-render.
 */
export interface AvatarDriver {
  state: AvatarState;
  /** 0 = small floating launcher, 1 = expanded assistant */
  expanded: boolean;
  reducedMotion: boolean;
  /** Pointer position in viewport pixels, or null when unknown. */
  pointer: { x: number; y: number } | null;
  pointerMovedAt: number;
  /** Called every frame while speaking to drive the lip sync. */
  sampleMouth: () => MouthSample;
  gestureQueue: AvatarGesture[];
}

export interface ArmPose {
  shoulderX: number;
  shoulderZ: number;
  elbowX: number;
  elbowZ: number;
}

/** Everything a rig needs to render one frame. Produced by AvatarBrain. */
export interface AvatarPose {
  headYaw: number;
  headPitch: number;
  headRoll: number;
  bodyLean: number;
  bodyTurn: number;
  breath: number;
  eyeX: number;
  eyeY: number;
  blink: number;
  eyeScale: number;
  squint: number;
  mouthOpen: number;
  mouthWide: number;
  smile: number;
  /** Horizontal mouth offset, used for a thoughtful sideways "hmm". */
  mouthShift: number;
  /** Colour + strength of the state lights (ears, antenna, chest). */
  glowColor: THREE.Color;
  glow: number;
  thinking: number;
  listening: number;
  speaking: number;
  armLeft: ArmPose;
  armRight: ArmPose;
  time: number;
}

export interface CameraFraming {
  target: THREE.Vector3;
  distance: number;
}

/** A renderable avatar. The built-in robot and GLB models both implement this. */
export interface AvatarRig {
  object: THREE.Object3D;
  framing: { compact: CameraFraming; expanded: CameraFraming };
  apply(pose: AvatarPose, dt: number): void;
  dispose(): void;
}
