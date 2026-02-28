import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { SIGNS, SIGN_SYMBOLS } from '@ctrombley/astrokit'
import { ELEMENT_COLORS } from '../../constants/colors'
import { ZODIAC_RING_RADIUS } from '../../constants/scales'

const INNER_R = ZODIAC_RING_RADIUS
const OUTER_R = ZODIAC_RING_RADIUS + 0.8
const SEGMENTS_PER_SIGN = 32

export default function ZodiacRing() {
  const arcs = useMemo(() => {
    return SIGNS.map((sign, i) => {
      const startAngle = (i * 30 * Math.PI) / 180
      const endAngle = ((i + 1) * 30 * Math.PI) / 180
      const color = ELEMENT_COLORS[sign.element] ?? '#888888'

      // Create arc geometry
      const points: THREE.Vector3[] = []
      for (let j = 0; j <= SEGMENTS_PER_SIGN; j++) {
        const t = j / SEGMENTS_PER_SIGN
        const angle = startAngle + t * (endAngle - startAngle)
        // XZ plane (ecliptic)
        points.push(new THREE.Vector3(
          Math.cos(angle) * INNER_R,
          0,
          -Math.sin(angle) * INNER_R,
        ))
      }
      for (let j = SEGMENTS_PER_SIGN; j >= 0; j--) {
        const t = j / SEGMENTS_PER_SIGN
        const angle = startAngle + t * (endAngle - startAngle)
        points.push(new THREE.Vector3(
          Math.cos(angle) * OUTER_R,
          0,
          -Math.sin(angle) * OUTER_R,
        ))
      }

      // Label position at midpoint of arc
      const midAngle = (startAngle + endAngle) / 2
      const labelR = (INNER_R + OUTER_R) / 2
      const labelPos: [number, number, number] = [
        Math.cos(midAngle) * labelR,
        0.1,
        -Math.sin(midAngle) * labelR,
      ]

      return { sign, color, points, labelPos, index: i }
    })
  }, [])

  return (
    <group>
      {arcs.map(({ sign, color, points, labelPos, index }) => {
        const shape = new THREE.Shape()
        shape.moveTo(points[0]!.x, points[0]!.z)
        for (let i = 1; i < points.length; i++) {
          shape.lineTo(points[i]!.x, points[i]!.z)
        }
        shape.closePath()

        return (
          <group key={sign.name}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <shapeGeometry args={[shape]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <Html position={labelPos} center distanceFactor={30} style={{ pointerEvents: 'none' }}>
              <div
                className="text-lg font-bold select-none"
                style={{ color, textShadow: '0 0 6px #000' }}
              >
                {SIGN_SYMBOLS[index]}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
