import { useRef, useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PLANET_COLORS } from '../../constants/colors'
import { PLANET_SIZES } from '../../constants/scales'
import { getPlanetTexture } from '../../utils/planetTextures'
import type { PlanetPosition } from '../../types'

interface PlanetProps {
  planet: PlanetPosition
  selected: boolean
  highlighted: boolean  // part of a selected aspect relationship
  onClick: (key: string) => void
}

function SaturnRings({ size }: { size: number }) {
  const ringTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 1
    const ctx = canvas.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, 256, 0)
    g.addColorStop(0.00, 'rgba(0,0,0,0)')
    g.addColorStop(0.05, 'rgba(180,160,100,0.1)')
    g.addColorStop(0.15, 'rgba(200,180,110,0.6)')
    g.addColorStop(0.25, 'rgba(210,190,120,0.8)')
    g.addColorStop(0.35, 'rgba(190,170,100,0.5)')
    g.addColorStop(0.45, 'rgba(220,200,130,0.9)')
    g.addColorStop(0.55, 'rgba(200,180,110,0.7)')
    g.addColorStop(0.65, 'rgba(170,150,90,0.4)')
    g.addColorStop(0.75, 'rgba(190,170,100,0.6)')
    g.addColorStop(0.85, 'rgba(160,140,80,0.3)')
    g.addColorStop(0.95, 'rgba(140,120,70,0.1)')
    g.addColorStop(1.00, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 1)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0.3]}>
      <ringGeometry args={[size * 1.3, size * 2.3, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function AtmosphereGlow({ size, color }: { size: number; color: string }) {
  return (
    <mesh>
      <sphereGeometry args={[size * 1.18, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function Planet({ planet, selected, highlighted, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { key, name, symbol, position, retrograde } = planet
  const color = PLANET_COLORS[key] ?? '#AAAAAA'
  const size = PLANET_SIZES[key] ?? 0.1
  const texture = useMemo(() => getPlanetTexture(key), [key])

  const hasAtmosphere = ['earth', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(key)
  const hasSaturnRings = key === 'saturn'

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick(key)
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={key === 'earth' || key === 'mars' ? 0.8 : 0.4}
            metalness={0.0}
            emissiveMap={texture}
            emissiveIntensity={selected ? 0.15 : 0.05}
            emissive={new THREE.Color(color)}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? 0.4 : 0.1}
          />
        )}
      </mesh>

      {hasAtmosphere && <AtmosphereGlow size={size} color={color} />}
      {hasSaturnRings && <SaturnRings size={size} />}

      {/* Selection ring */}
      {selected && (
        <mesh>
          <ringGeometry args={[size + 0.06, size + 0.08, 32]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}
      {/* Aspect highlight — pulsing colored halo around involved bodies */}
      {highlighted && !selected && (
        <mesh>
          <sphereGeometry args={[size * 1.55, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
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
