import { Float, Html, Text } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { anatomyConfig, manifestoConfig, projectsConfig, siteConfig } from '@/config'

export type TourStopId = 'about' | 'education' | 'skills' | 'projects'

export interface TourStop {
  id: TourStopId
  number: string
  title: string
  eyebrow: string
  position: [number, number, number]
  camera: [number, number, number]
  lookAt: [number, number, number]
}

interface PortfolioZonesProps {
  onProjectSelect: (projectName: string) => void
}

export const tourStops: TourStop[] = [
  {
    id: 'about',
    number: '01',
    title: 'About Me',
    eyebrow: 'Start Here',
    position: [0, 0, 0],
    camera: [0, 4.8, 8],
    lookAt: [0, 1.4, 0],
  },
  {
    id: 'education',
    number: '02',
    title: 'Education',
    eyebrow: 'Learning Path',
    position: [0, 0, -9],
    camera: [0, 4.8, -1],
    lookAt: [0, 1.4, -9],
  },
  {
    id: 'skills',
    number: '03',
    title: 'Skills',
    eyebrow: anatomyConfig.sectionLabel,
    position: [0, 0, -18],
    camera: [0, 5.2, -10],
    lookAt: [0, 1.4, -18],
  },
  {
    id: 'projects',
    number: '04',
    title: 'Projects',
    eyebrow: projectsConfig.sectionLabel,
    position: [0, 0, -28],
    camera: [0, 5.8, -19],
    lookAt: [0, 1.5, -28],
  },
]

const educationItems = [
  'Foundation in Process Engineering',
  "Master's journey in Digital Transformation",
  'AI and business analysis certifications',
  'Continuous learning, fast skill acquisition, and self-development',
]

const skillGroups = [
  { title: 'Frontend', items: ['React', 'Angular', 'Next.js', 'HTML/CSS'] },
  { title: 'Backend', items: ['ASP.NET Core', 'Laravel', 'REST APIs', 'SQL'] },
  { title: 'Analysis', items: ['Requirements', 'RFPs', 'Power BI', 'Figma'] },
]

function HtmlPanel({
  children,
  position = [0, 0, 0],
  scale = 0.42,
  className = '',
}: {
  children: React.ReactNode
  position?: [number, number, number]
  scale?: number
  className?: string
}) {
  return (
    <Html transform sprite distanceFactor={7} scale={scale} position={position} className="pointer-events-auto">
      <div className={`w-80 border border-cyan/20 bg-charcoal/92 p-5 text-platinum shadow-glow backdrop-blur-md ${className}`}>
        {children}
      </div>
    </Html>
  )
}

function GuidePerson({ position = [-2.8, 0, 1.1], accent = '#00d4ff' }: { position?: [number, number, number]; accent?: string }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.72, 20]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.12} roughness={0.38} />
      </mesh>
      <mesh castShadow position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#eafcff" roughness={0.44} />
      </mesh>
      <mesh castShadow position={[0.27, 0.56, 0.02]} rotation-z={-0.82}>
        <cylinderGeometry args={[0.035, 0.035, 0.58, 12]} />
        <meshStandardMaterial color="#eafcff" roughness={0.42} />
      </mesh>
      <mesh castShadow position={[-0.11, -0.12, 0.02]} rotation-z={0.16}>
        <cylinderGeometry args={[0.045, 0.045, 0.48, 12]} />
        <meshStandardMaterial color="#d8f6ff" roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0.12, -0.12, 0.02]} rotation-z={-0.16}>
        <cylinderGeometry args={[0.045, 0.045, 0.48, 12]} />
        <meshStandardMaterial color="#d8f6ff" roughness={0.45} />
      </mesh>
    </group>
  )
}

function TourPlatform({ stop, accent = '#00d4ff' }: { stop: TourStop; accent?: string }) {
  return (
    <group position={stop.position}>
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[7.4, 0.22, 4.5]} />
        <meshStandardMaterial color="#0d121a" roughness={0.82} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.04, 2.18]}>
        <boxGeometry args={[6.2, 0.04, 0.08]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
      <Text position={[-3.1, 0.05, -1.7]} rotation-x={-Math.PI / 2} fontSize={0.36} color="#47636b" anchorX="left">
        {stop.number}
      </Text>
      <Text position={[0, 2.55, -1.72]} fontSize={0.32} anchorX="center" color="#e0f8ff" maxWidth={6}>
        {stop.title}
      </Text>
      <Text position={[0, 2.18, -1.72]} fontSize={0.15} anchorX="center" color="#7fdff1" maxWidth={6}>
        {stop.eyebrow}
      </Text>
    </group>
  )
}

function TourRoad() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.14, -14]}>
        <boxGeometry args={[2.2, 0.08, 34]} />
        <meshStandardMaterial color="#10131a" roughness={0.86} metalness={0.08} />
      </mesh>
      {tourStops.map((stop, index) => (
        <group key={stop.id} position={[0, 0.01, stop.position[2] + 3.4]}>
          <mesh>
            <boxGeometry args={[0.9, 0.02, 0.06]} />
            <meshStandardMaterial color={index === 0 ? '#00d4ff' : '#e0f8ff'} emissive={index === 0 ? '#00d4ff' : '#e0f8ff'} emissiveIntensity={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function AboutStop() {
  const stop = tourStops[0]

  return (
    <group>
      <TourPlatform stop={stop} />
      <GuidePerson position={[-2.7, 0.1, 0.85]} />
      <mesh castShadow position={[1.8, 1.25, -0.55]}>
        <boxGeometry args={[2.1, 2.5, 0.24]} />
        <meshStandardMaterial color="#07151b" emissive="#003542" emissiveIntensity={0.24} roughness={0.36} metalness={0.25} />
      </mesh>
      <HtmlPanel position={[3.15, 1.28, 0.35]} scale={0.36}>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">About Alya</p>
        <h3 className="mt-2 font-display text-2xl text-warm-white">Process Engineer. Systems Analyst. Developer.</h3>
        <p className="mt-3 text-sm leading-6 text-silver">{manifestoConfig.text}</p>
      </HtmlPanel>
    </group>
  )
}

function EducationStop() {
  const stop = tourStops[1]

  return (
    <group position={[0, 0, -9]}>
      <TourPlatform stop={{ ...stop, position: [0, 0, 0] }} accent="#a7f3ff" />
      <GuidePerson position={[-2.7, 0.1, 0.85]} accent="#a7f3ff" />
      <Float speed={1.1} floatIntensity={0.18} rotationIntensity={0.08}>
        <mesh castShadow position={[1.7, 1.2, -0.25]}>
          <boxGeometry args={[2.1, 1.35, 0.18]} />
          <meshStandardMaterial color="#101827" emissive="#003542" emissiveIntensity={0.18} roughness={0.32} metalness={0.28} />
        </mesh>
      </Float>
      <HtmlPanel position={[1.65, 1.28, -0.08]} scale={0.4}>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">Education</p>
        <h3 className="mt-2 font-display text-2xl text-warm-white">Engineering foundation, digital transformation direction.</h3>
        <div className="mt-4 space-y-2">
          {educationItems.map((item) => (
            <p key={item} className="border-l border-cyan/40 pl-3 text-sm leading-6 text-silver">
              {item}
            </p>
          ))}
        </div>
      </HtmlPanel>
    </group>
  )
}

function SkillsStop() {
  const stop = tourStops[2]

  return (
    <group position={[0, 0, -18]}>
      <TourPlatform stop={{ ...stop, position: [0, 0, 0] }} accent="#f5f5f0" />
      <GuidePerson position={[-2.7, 0.1, 0.85]} accent="#f5f5f0" />
      {skillGroups.map((group, index) => (
        <Float key={group.title} speed={1.1 + index * 0.1} floatIntensity={0.16} rotationIntensity={0.08}>
          <group position={[-2.05 + index * 2.05, 1.1, -0.32]}>
            <mesh castShadow>
              <boxGeometry args={[1.55, 1.55, 0.32]} />
              <meshStandardMaterial color={index === 1 ? '#00d4ff' : '#e0f8ff'} emissive="#003542" emissiveIntensity={0.16} roughness={0.32} metalness={0.2} />
            </mesh>
            <Html transform sprite distanceFactor={7} scale={0.3} position={[0, 0, 0.21]} className="pointer-events-none">
              <div className="w-48 border border-cyan/20 bg-void/90 p-3 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">{group.title}</p>
                <p className="mt-2 text-xs leading-5 text-silver">{group.items.join(' / ')}</p>
              </div>
            </Html>
          </group>
        </Float>
      ))}
    </group>
  )
}

function ProjectsStop({ onProjectSelect }: PortfolioZonesProps) {
  const stop = tourStops[3]
  const projects = projectsConfig.projects.slice(0, 6)

  const handleProjectClick = (event: ThreeEvent<MouseEvent>, projectName: string) => {
    event.stopPropagation()
    onProjectSelect(projectName)
  }

  return (
    <group position={[0, 0, -28]}>
      <TourPlatform stop={{ ...stop, position: [0, 0, 0] }} />
      <GuidePerson position={[-3.1, 0.1, 1.05]} />
      {projects.map((project, index) => {
        const column = index % 3
        const row = Math.floor(index / 3)
        return (
          <group key={project.name} position={[-2.25 + column * 2.25, 1.15, -0.35 - row * 1.35]}>
            <mesh castShadow receiveShadow onClick={(event) => handleProjectClick(event, project.name)}>
              <boxGeometry args={[1.75, 1.08, 0.14]} />
              <meshStandardMaterial color="#07151b" emissive="#003542" emissiveIntensity={0.35} roughness={0.28} metalness={0.36} />
            </mesh>
            <Html transform sprite distanceFactor={6} position={[0, 0, 0.1]} scale={0.26} className="pointer-events-none">
              <div className="w-56 overflow-hidden border border-cyan/20 bg-void/92 text-platinum">
                <img src={project.image} alt="" className="h-24 w-full object-cover" />
                <div className="p-2.5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cyan">{project.tag}</p>
                  <h3 className="mt-1 font-display text-sm leading-4 text-warm-white">{project.name}</h3>
                </div>
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

export function PortfolioZones({ onProjectSelect }: PortfolioZonesProps) {
  return (
    <group name={`${siteConfig.siteTitle} default guided tour`}>
      {/* Scale-up note: add a new ordered tour stop in tourStops, then create one
          matching stop component. Keep stations on the same Z path for clarity. */}
      <TourRoad />
      <AboutStop />
      <EducationStop />
      <SkillsStop />
      <ProjectsStop onProjectSelect={onProjectSelect} />
    </group>
  )
}
