import { useMemo } from 'react'
import * as THREE from 'three'
import { SIGNS } from '@ctrombley/astrokit'
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

      const points: THREE.Vector3[] = []
      for (let j = 0; j <= SEGMENTS_PER_SIGN; j++) {
        const t = j / SEGMENTS_PER_SIGN
        const angle = startAngle + t * (endAngle - startAngle)
        points.push(new THREE.Vector3(
          Math.cos(angle) * INNER_R, 0, -Math.sin(angle) * INNER_R,
        ))
      }
      for (let j = SEGMENTS_PER_SIGN; j >= 0; j--) {
        const t = j / SEGMENTS_PER_SIGN
        const angle = startAngle + t * (endAngle - startAngle)
        points.push(new THREE.Vector3(
          Math.cos(angle) * OUTER_R, 0, -Math.sin(angle) * OUTER_R,
        ))
      }

      return { sign, color, points, index: i }
    })
  }, [])

  return (
    <group>
      {arcs.map(({ sign, color, points }) => {
        const shape = new THREE.Shape()
        shape.moveTo(points[0]!.x, points[0]!.z)
        for (let i = 1; i < points.length; i++) {
          shape.lineTo(points[i]!.x, points[i]!.z)
        }
        shape.closePath()

        return (
          <mesh key={sign.name} rotation={[-Math.PI / 2, 0, 0]}>
            <shapeGeometry args={[shape]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}
