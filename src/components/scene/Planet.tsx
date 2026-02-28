import { useRef } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PLANET_COLORS } from '../../constants/colors'
import { PLANET_SIZES } from '../../constants/scales'
import type { PlanetPosition } from '../../types'

interface PlanetProps {
  planet: PlanetPosition
  selected: boolean
  onClick: (key: string) => void
}

export default function Planet({ planet, selected, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { key, name, symbol, position, retrograde } = planet
  const color = PLANET_COLORS[key] ?? '#AAAAAA'
  const size = PLANET_SIZES[key] ?? 0.1

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick(key)
        }}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 0.8 : 0.3}
        />
      </mesh>
      {selected && (
        <mesh>
          <ringGeometry args={[size + 0.06, size + 0.08, 32]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}
      <Html
        position={[0, size + 0.15, 0]}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center whitespace-nowrap select-none">
          <div className="text-sm font-bold" style={{ color, textShadow: '0 0 4px #000' }}>
            {symbol} {name}
          </div>
          {retrograde && (
            <div className="text-xs text-red-400" style={{ textShadow: '0 0 4px #000' }}>
              Rx
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
