import { useMemo } from 'react'
import { Line, Html } from '@react-three/drei'
import type { Chart } from '@ctrombley/astrokit'
import { ZODIAC_RING_RADIUS } from '../../constants/scales'

const ANGULAR_LABELS: Record<number, string> = { 1: 'ASC', 4: 'IC', 7: 'DSC', 10: 'MC' }
const INNER_R = 0.8
const OUTER_R = ZODIAC_RING_RADIUS - 0.5

export default function HouseCusps({ chart, showAngles }: { chart: Chart; showAngles: boolean }) {
  const cusps = chart.houseCusps

  const lines = useMemo(() => {
    if (!cusps || cusps.length === 0) return []
    return cusps.map((cusp, i) => {
      const houseNum = i + 1
      const angleRad = (cusp.degrees * Math.PI) / 180
      const isAngular = houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10
      const cos = Math.cos(angleRad)
      const sin = Math.sin(angleRad)

      const start: [number, number, number] = [cos * INNER_R, 0, -sin * INNER_R]
      const end: [number, number, number]   = [cos * OUTER_R, 0, -sin * OUTER_R]

      const labelR = OUTER_R + 0.7
      const labelPos: [number, number, number] = [cos * labelR, 0.15, -sin * labelR]

      return { houseNum, start, end, labelPos, isAngular }
    })
  }, [cusps])

  if (lines.length === 0) return null

  return (
    <group>
      {lines.map(({ houseNum, start, end, labelPos, isAngular }) => {
        const highlighted = isAngular && showAngles
        return (
          <group key={houseNum}>
            <Line
              points={[start, end]}
              color={highlighted ? '#C9A84C' : '#8080b0'}
              transparent
              opacity={highlighted ? 0.4 : 0.18}
              lineWidth={highlighted ? 1.2 : 0.7}
            />
            {highlighted && (
              <Html position={labelPos} center distanceFactor={30} style={{ pointerEvents: 'none' }}>
                <div style={{
                  color: '#C9A84C',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  letterSpacing: '0.06em',
                  opacity: 0.7,
                  textShadow: '0 0 4px #000',
                }}>
                  {ANGULAR_LABELS[houseNum]}
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}
