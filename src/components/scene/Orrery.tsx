import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Starfield from './Starfield'
import Sun from './Sun'
import OrbitRing from './OrbitRing'
import Planet from './Planet'
import ZodiacRing from './ZodiacRing'
import AspectLines from './AspectLines'
import HarmonicOverlay from './HarmonicOverlay'
import { ORBITING_PLANETS } from '../../constants/scales'
import type { PlanetPosition } from '../../types'
import type { Chart } from '@ctrombley/astrokit'

interface OrreryProps {
  positions: PlanetPosition[]
  chart: Chart
  selectedPlanet: string | null
  onSelectPlanet: (key: string | null) => void
  harmonicClusters: Map<number, number[][]>
  showHarmonics: boolean
}

export default function Orrery({
  positions,
  chart,
  selectedPlanet,
  onSelectPlanet,
  harmonicClusters,
  showHarmonics,
}: OrreryProps) {
  return (
    <Canvas
      camera={{ position: [0, 20, 25], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => onSelectPlanet(null)}
    >
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
          onClick={onSelectPlanet}
        />
      ))}

      <ZodiacRing />
      <AspectLines chart={chart} positions={positions} />
      <HarmonicOverlay
        clusters={harmonicClusters}
        positions={positions}
        visible={showHarmonics}
      />

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxDistance={60}
        minDistance={3}
      />
    </Canvas>
  )
}
