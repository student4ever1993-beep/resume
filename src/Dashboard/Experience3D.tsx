import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, KeyboardControls, OrbitControls, Stars } from '@react-three/drei'
import type { KeyboardControlsEntry } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import { PortfolioZones, tourStops, type TourStopId } from './PortfolioZones'
import { UserVehicle } from './UserVehicle'
import { Vector3 } from 'three'

type ControlName = 'forward' | 'backward' | 'left' | 'right' | 'boost'

interface Experience3DProps {
  interactive: boolean
  activeTourStopId: TourStopId
  onProjectSelect: (projectName: string) => void
}

const keyboardMap: KeyboardControlsEntry<ControlName>[] = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'boost', keys: ['ShiftLeft', 'ShiftRight'] },
]

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.34} />
      <directionalLight castShadow position={[7, 9, 4]} intensity={2.1} shadow-mapSize={[2048, 2048]} shadow-camera-far={40} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} />
      <pointLight position={[-8, 3, 1]} intensity={22} color="#00d4ff" distance={8} />
      <pointLight position={[8, 3, 2]} intensity={28} color="#a7f3ff" distance={9} />
      <pointLight position={[1, 2.4, -6]} intensity={15} color="#f5f5f0" distance={7} />
    </>
  )
}

function WorldFloor() {
  return (
    <>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.24, 0]}>
        <planeGeometry args={[44, 44, 24, 24]} />
        <meshStandardMaterial color="#04070b" roughness={0.92} metalness={0.08} />
      </mesh>
      <gridHelper args={[36, 36, '#00d4ff', '#132731']} position={[0, -0.22, 0]} />
    </>
  )
}

function ZoneFallback() {
  return (
    <group>
      {[
        [-8, 0.2, 1],
        [1, 0.2, -6],
        [8, 0.2, 2],
      ].map((position, index) => (
        <mesh key={position.join(':')} castShadow receiveShadow position={position as [number, number, number]}>
          <boxGeometry args={[2.8, 0.4, 2.8]} />
          <meshStandardMaterial color={index === 1 ? '#11131c' : '#07151b'} emissive="#003542" emissiveIntensity={0.22} />
        </mesh>
      ))}
    </group>
  )
}

function GuidedTourCamera({ activeTourStopId, enabled }: { activeTourStopId: TourStopId; enabled: boolean }) {
  const cameraTarget = new Vector3()
  const lookAtTarget = new Vector3()

  useFrame(({ camera }, delta) => {
    if (!enabled) {
      return
    }

    const activeStop = tourStops.find((stop) => stop.id === activeTourStopId) ?? tourStops[0]
    cameraTarget.set(...activeStop.camera)
    lookAtTarget.set(...activeStop.lookAt)
    camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 3.2))
    camera.lookAt(lookAtTarget)
  })

  return null
}

export default function Experience3D({ interactive, activeTourStopId, onProjectSelect }: Experience3DProps) {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        shadows
        className="h-full w-full"
        dpr={[1, 1.8]}
        camera={{ position: [-11.5, 7.2, 10.5], fov: 50, near: 0.1, far: 90 }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ camera }) => {
          camera.lookAt(-2.4, 1.7, 0.2)
        }}
      >
        <color attach="background" args={['#030408']} />
        <fog attach="fog" args={['#030408', 14, 34]} />
        <SceneLights />
        <WorldFloor />
        <Physics gravity={[0, -9.81, 0]}>
          <Suspense fallback={<ZoneFallback />}>
            <PortfolioZones onProjectSelect={onProjectSelect} />
          </Suspense>
          <UserVehicle enabled={false} />
        </Physics>
        <GuidedTourCamera activeTourStopId={activeTourStopId} enabled={interactive} />
        <Suspense fallback={null}>
          <Stars radius={80} depth={30} count={1800} factor={4} saturation={0} fade speed={0.6} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enabled={!interactive} makeDefault enableDamping dampingFactor={0.08} minDistance={6} maxDistance={23} maxPolarAngle={Math.PI / 2.15} target={[0, 0.7, -14]} />
      </Canvas>
    </KeyboardControls>
  )
}
