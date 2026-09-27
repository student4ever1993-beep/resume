import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import type { AvatarPose, AvatarRig } from './types';

// Adapter for custom GLB/GLTF avatars (e.g. exported from Blender). It drives the model with
// the same AvatarPose as the built-in robot using common naming conventions:
//   • Morph targets (shape keys): ARKit names (jawOpen, eyeBlinkLeft, mouthSmileLeft, …)
//     or Oculus visemes (viseme_aa, viseme_E, viseme_O, …). Missing ones are simply skipped.
//   • Bones: Head, Neck, Spine/Spine1/Spine2 (Mixamo "mixamorig:" prefixes are fine),
//     optional LeftEye/RightEye.
//   • Animation clips: a clip whose name contains "idle" loops in the background.
// Compress models with `gltfpack -cc` (meshopt), which this loader decodes.

type MorphRef = { mesh: THREE.Mesh; index: number };

const MORPHS = {
  jaw: ['jawOpen', 'mouthOpen', 'viseme_aa', 'MouthOpen', 'Mouth_Open'],
  wide: ['viseme_E', 'viseme_I', 'mouthStretchLeft', 'mouthStretchRight'],
  round: ['viseme_O', 'viseme_U', 'mouthFunnel', 'mouthPucker'],
  smile: ['mouthSmileLeft', 'mouthSmileRight', 'mouthSmile', 'Smile'],
  blinkL: ['eyeBlinkLeft', 'eyeBlink_L', 'Blink_Left', 'blinkLeft'],
  blinkR: ['eyeBlinkRight', 'eyeBlink_R', 'Blink_Right', 'blinkRight'],
  blink: ['eyesClosed', 'blink', 'Blink'],
  squintL: ['eyeSquintLeft', 'cheekSquintLeft'],
  squintR: ['eyeSquintRight', 'cheekSquintRight'],
  browUp: ['browInnerUp'],
  lookUp: ['eyeLookUpLeft', 'eyeLookUpRight'],
  lookDown: ['eyeLookDownLeft', 'eyeLookDownRight'],
  lookLeft: ['eyeLookOutLeft', 'eyeLookInRight'],
  lookRight: ['eyeLookInLeft', 'eyeLookOutRight'],
} as const;

type MorphKey = keyof typeof MORPHS;

const BONES = {
  head: /^(mixamorig\d*:?)?head$/i,
  neck: /^(mixamorig\d*:?)?neck$/i,
  spine: /^(mixamorig\d*:?)?spine2?$/i,
  eyeL: /^(mixamorig\d*:?)?(lefteye|eye_?l)$/i,
  eyeR: /^(mixamorig\d*:?)?(righteye|eye_?r)$/i,
};

type BoneKey = keyof typeof BONES;

export class GLBAvatar implements AvatarRig {
  readonly object = new THREE.Group();
  readonly framing = {
    compact: { target: new THREE.Vector3(0, 1.6, 0), distance: 1.0 },
    expanded: { target: new THREE.Vector3(0, 1.4, 0), distance: 2.2 },
  };

  private morphs = {} as Record<MorphKey, MorphRef[]>;
  private bones: Partial<Record<BoneKey, { bone: THREE.Object3D; rest: THREE.Quaternion }>> = {};
  private mixer: THREE.AnimationMixer | null = null;
  private tmpQ = new THREE.Quaternion();
  private tmpE = new THREE.Euler();
  private gltfScene: THREE.Object3D;

  static async load(url: string): Promise<GLBAvatar> {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const gltf = await loader.loadAsync(url);
    return new GLBAvatar(gltf.scene, gltf.animations);
  }

  private constructor(scene: THREE.Object3D, clips: THREE.AnimationClip[]) {
    this.gltfScene = scene;
    this.object.add(scene);

    for (const key of Object.keys(MORPHS) as MorphKey[]) this.morphs[key] = [];

    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        for (const key of Object.keys(MORPHS) as MorphKey[]) {
          for (const name of MORPHS[key]) {
            const index = mesh.morphTargetDictionary[name];
            if (index !== undefined) this.morphs[key].push({ mesh, index });
          }
        }
      }
      if (mesh.isMesh) mesh.frustumCulled = false; // skinned meshes often have stale bounds

      for (const key of Object.keys(BONES) as BoneKey[]) {
        if (!this.bones[key] && BONES[key].test(node.name)) {
          this.bones[key] = { bone: node, rest: node.quaternion.clone() };
        }
      }
    });

    const idle = clips.find((c) => /idle/i.test(c.name));
    if (idle) {
      this.mixer = new THREE.AnimationMixer(scene);
      // Head/neck are driven procedurally, so strip their tracks from the idle clip.
      const headNames = [this.bones.head?.bone.name, this.bones.neck?.bone.name].filter(Boolean);
      idle.tracks = idle.tracks.filter((track) => !headNames.some((n) => track.name.startsWith(`${n}.quaternion`)));
      this.mixer.clipAction(idle).play();
    }

    this.computeFraming();
  }

  // Frame the camera on the head (compact) and upper body (expanded) automatically.
  private computeFraming() {
    this.gltfScene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(this.gltfScene);
    const size = box.getSize(new THREE.Vector3());
    const headPos = new THREE.Vector3();
    if (this.bones.head) this.bones.head.bone.getWorldPosition(headPos);
    else headPos.set((box.min.x + box.max.x) / 2, box.max.y - size.y * 0.1, (box.min.z + box.max.z) / 2);

    const headSize = Math.max(size.y * 0.13, 0.15);
    this.framing.compact.target.copy(headPos).add(new THREE.Vector3(0, headSize * 0.25, 0));
    this.framing.compact.distance = headSize * 4.2;
    this.framing.expanded.target.copy(headPos).add(new THREE.Vector3(0, -headSize * 1.6, 0));
    this.framing.expanded.distance = headSize * 10;
  }

  private setMorph(key: MorphKey, value: number) {
    for (const { mesh, index } of this.morphs[key]) mesh.morphTargetInfluences![index] = value;
  }

  private rotateBone(key: BoneKey, x: number, y: number, z: number) {
    const entry = this.bones[key];
    if (!entry) return;
    this.tmpQ.setFromEuler(this.tmpE.set(x, y, z, 'YXZ'));
    entry.bone.quaternion.copy(entry.rest).multiply(this.tmpQ);
  }

  apply(pose: AvatarPose, dt: number) {
    this.mixer?.update(dt);

    const open = pose.mouthOpen;
    this.setMorph('jaw', open * 0.8);
    this.setMorph('wide', open * pose.mouthWide * 0.6);
    this.setMorph('round', open * (1 - pose.mouthWide) * 0.6);
    this.setMorph('smile', THREE.MathUtils.clamp(pose.smile, 0, 1) * 0.55);
    const blink = Math.max(pose.blink, pose.squint * 0.4);
    this.setMorph('blinkL', blink);
    this.setMorph('blinkR', blink);
    this.setMorph('blink', blink);
    this.setMorph('squintL', pose.squint * 0.6);
    this.setMorph('squintR', pose.squint * 0.6);
    this.setMorph('browUp', pose.thinking * 0.5 + pose.listening * 0.3);
    this.setMorph('lookUp', Math.max(0, pose.eyeY));
    this.setMorph('lookDown', Math.max(0, -pose.eyeY));
    this.setMorph('lookLeft', Math.max(0, -pose.eyeX));
    this.setMorph('lookRight', Math.max(0, pose.eyeX));

    // Bones: without an idle clip we add breathing on the spine ourselves.
    if (!this.mixer) this.rotateBone('spine', pose.bodyLean + pose.breath * 0.01, pose.bodyTurn, 0);
    this.rotateBone('neck', pose.headPitch * 0.4, pose.headYaw * 0.4, pose.headRoll * 0.4);
    this.rotateBone('head', pose.headPitch * 0.6, pose.headYaw * 0.6, pose.headRoll * 0.6);
    this.rotateBone('eyeL', -pose.eyeY * 0.25, pose.eyeX * 0.35, 0);
    this.rotateBone('eyeR', -pose.eyeY * 0.25, pose.eyeX * 0.35, 0);
  }

  dispose() {
    this.mixer?.stopAllAction();
    this.gltfScene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of materials) {
        for (const value of Object.values(m)) if (value instanceof THREE.Texture) value.dispose();
        m.dispose();
      }
    });
  }
}
