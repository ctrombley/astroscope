import { useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Starfield from './Starfield'
import Sun from './Sun'
import OrbitRing from './OrbitRing'
import Planet from './Planet'
import ZodiacRing from './ZodiacRing'
import AspectLines from './AspectLines'
import HarmonicOverlay from './HarmonicOverlay'
import { PLANET_SIZES, ORBITING_PLANETS } from '../../constants/scales'
import type { PlanetPosition, Position3D, SelectedAspect } from '../../types'
import type { Chart } from '@ctrombley/astrokit'

interface OrreryProps {
  positions: PlanetPosition[]
  chart: Chart
  selectedPlanet: string | null
  onSelectPlanet: (key: string | null) => void
  selectedAspect: SelectedAspect | null
  harmonicClusters: Map<number, number[][]>
  showHarmonics: boolean
  flyTarget: Position3D | null
  onFlyComplete: () => void
}

const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

function flyDistForPlanet(key: string): number {
  const size = PLANET_SIZES[key] ?? 0.1
  if (key === 'sun') return 4
  if (key === 'saturn') return 5    // room for rings
  return Math.max(1.8, size * 15 + 1.5)
}

interface AnimState {
  startCam: THREE.Vector3
  startTarget: THREE.Vector3
  endCam: THREE.Vector3
  endTarget: THREE.Vector3
  t: number
}

function CameraAnimator({
  flyTarget,
  flyPlanetKey,
  controlsRef,
  onFlyComplete,
}: {
  flyTarget: Position3D | null
  flyPlanetKey: string | null
  controlsRef: React.RefObject<any>
  onFlyComplete: () => void
}) {
  const { camera } = useThree()
  const anim = useRef<AnimState | null>(null)
  const prevTarget = useRef<Position3D | null>(null)

  useEffect(() => {
    if (!flyTarget || !controlsRef.current) return
    // Skip if same target as before
    if (
      prevTarget.current &&
      Math.abs(prevTarget.current.x - flyTarget.x) < 0.001 &&
      Math.abs(prevTarget.current.y - flyTarget.y) < 0.001 &&
      Math.abs(prevTarget.current.z - flyTarget.z) < 0.001
    ) return

    prevTarget.current = flyTarget
    const controls = controlsRef.current
    const endTarget = new THREE.Vector3(flyTarget.x, flyTarget.y, flyTarget.z)

    // Maintain current view direction, just change distance and target
    const currentDir = camera.position.clone().sub(controls.target)
    const currentDist = currentDir.length()
    if (currentDist > 0) currentDir.divideScalar(currentDist)

    const flyDist = flyDistForPlanet(flyPlanetKey ?? '')
    const endCam = endTarget.clone().addScaledVector(currentDir, flyDist)

    anim.current = {
      startCam: camera.position.clone(),
      startTarget: controls.target.clone(),
      endCam,
      endTarget,
      t: 0,
    }
  }, [flyTarget, flyPlanetKey, controlsRef, camera])

  useFrame((_, delta) => {
    if (!anim.current || !controlsRef.current) return
    const a = anim.current
    a.t = Math.min(1, a.t + delta / 0.85)  // 0.85s duration
    const t = easeInOut(a.t)

    camera.position.lerpVectors(a.startCam, a.endCam, t)
    controlsRef.current.target.lerpVectors(a.startTarget, a.endTarget, t)
    controlsRef.current.update()

    if (a.t >= 1) {
      anim.current = null
      onFlyComplete()
    }
  })

  return null
}

function OrreryScene({
  positions,
  chart,
  selectedPlanet,
  onSelectPlanet,
  selectedAspect,
  harmonicClusters,
  showHarmonics,
  flyTarget,
  onFlyComplete,
}: OrreryProps) {
  const controlsRef = useRef<any>(null)

  const highlightedBodies = selectedAspect
    ? new Set([selectedAspect.body1Key, selectedAspect.body2Key])
    : null

  return (
    <>
      <ambientLight intensity={0.15} />
      <Starfield />
      <Sun onClick={() => onSelectPlanet('sun')} />

      {ORBITING_PLANETS.map(key => (
        <OrbitRing key={`orbit-${key}`} planetKey={key} />
      ))}

      {positions.map(p => (
        <Planet
          key={p.key}
          planet={p}
          selected={selectedPlanet === p.key}
          highlighted={highlightedBodies?.has(p.key) ?? false}
          onClick={onSelectPlanet}
        />
      ))}

      <ZodiacRing />
      <AspectLines chart={chart} positions={positions} selectedAspect={selectedAspect} />
      <HarmonicOverlay
        clusters={harmonicClusters}
        positions={positions}
        visible={showHarmonics}
      />

      <CameraAnimator
        flyTarget={flyTarget}
        flyPlanetKey={selectedPlanet}
        controlsRef={controlsRef}
        onFlyComplete={onFlyComplete}
      />

      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableRotate
        maxDistance={60}
        minDistance={0.5}
      />
    </>
  )
}

export default function Orrery(props: OrreryProps) {
  return (
    <Canvas
      camera={{ position: [0, 20, 25], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => props.onSelectPlanet(null)}
    >
      <OrreryScene {...props} />
    </Canvas>
  )
}
