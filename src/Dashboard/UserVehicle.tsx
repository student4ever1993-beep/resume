import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Trail, useKeyboardControls } from '@react-three/drei'
import type { Group } from 'three'
import { MathUtils, Vector3 } from 'three'

type VehicleControls = 'forward' | 'backward' | 'left' | 'right' | 'boost'

interface UserVehicleProps {
  enabled: boolean
}

const CAMERA_OFFSET = new Vector3(0, 4.8, 8.2)
const CAMERA_LOOK_AHEAD = new Vector3(0, 0.8, -2.2)
const BASE_SPEED = 5.2
const BOOST_SPEED = 8.4
const TURN_SPEED = 2.7
const WORLD_LIMIT = 17
const START_POSITION = new Vector3(0, 0.45, 8.5)
const START_ROTATION = 0

export function UserVehicle({ enabled }: UserVehicleProps) {
  const vehicleRef = useRef<Group>(null)
  const [, getControls] = useKeyboardControls<VehicleControls>()
  const { camera } = useThree()

  const tempPosition = useMemo(() => new Vector3(), [])
  const tempTarget = useMemo(() => new Vector3(), [])
  const tempLookAt = useMemo(() => new Vector3(), [])

  useEffect(() => {
    if (!enabled || !vehicleRef.current) {
      return
    }

    vehicleRef.current.position.copy(START_POSITION)
    vehicleRef.current.rotation.y = START_ROTATION
    camera.position.set(0, 6, 16)
    camera.lookAt(0, 1.4, 0)
  }, [camera, enabled])

  useFrame((_, delta) => {
    const vehicle = vehicleRef.current

    if (!vehicle || !enabled) {
      return
    }

    const controls = getControls()
    const turnDirection = Number(controls.left) - Number(controls.right)
    const driveDirection = Number(controls.forward) - Number(controls.backward)
    const speed = controls.boost ? BOOST_SPEED : BASE_SPEED

    vehicle.rotation.y += turnDirection * TURN_SPEED * delta

    if (driveDirection !== 0) {
      vehicle.position.x -= Math.sin(vehicle.rotation.y) * driveDirection * speed * delta
      vehicle.position.z -= Math.cos(vehicle.rotation.y) * driveDirection * speed * delta
    }

    vehicle.position.x = MathUtils.clamp(vehicle.position.x, -WORLD_LIMIT, WORLD_LIMIT)
    vehicle.position.z = MathUtils.clamp(vehicle.position.z, -WORLD_LIMIT, WORLD_LIMIT)
    vehicle.position.y = 0.45 + Math.sin(performance.now() * 0.004) * 0.035

    tempPosition.copy(vehicle.position)
    tempTarget.copy(CAMERA_OFFSET).applyAxisAngle(new Vector3(0, 1, 0), vehicle.rotation.y).add(tempPosition)
    tempLookAt.copy(CAMERA_LOOK_AHEAD).applyAxisAngle(new Vector3(0, 1, 0), vehicle.rotation.y).add(tempPosition)

    camera.position.lerp(tempTarget, 1 - Math.exp(-delta * 4.5))
    camera.lookAt(tempLookAt)
  })

  return (
    <group ref={vehicleRef} name="User controlled portfolio vehicle" position={START_POSITION.toArray()} rotation-y={START_ROTATION}>
      <Trail width={0.8} length={5} color="#00d4ff" attenuation={(trailWidth) => trailWidth * trailWidth}>
        <mesh castShadow position={[0, 0.15, 0]}>
          <boxGeometry args={[1.2, 0.32, 1.8]} />
          <meshStandardMaterial color="#06151b" metalness={0.55} roughness={0.28} emissive="#003847" emissiveIntensity={0.45} />
        </mesh>
      </Trail>
      <mesh castShadow position={[0, 0.45, -0.22]}>
        <boxGeometry args={[0.72, 0.36, 0.72]} />
        <meshStandardMaterial color="#dff9ff" metalness={0.35} roughness={0.22} emissive="#00d4ff" emissiveIntensity={0.18} />
      </mesh>
      <mesh castShadow position={[0, 0.3, -1.08]}>
        <coneGeometry args={[0.28, 0.55, 4]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}
