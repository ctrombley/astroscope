import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { ASPECT_COLORS } from '../../constants/colors'
import type { PlanetPosition } from '../../types'
import type { Chart } from '@ctrombley/astrokit'

interface AspectLinesProps {
  chart: Chart
  positions: PlanetPosition[]
}

export default function AspectLines({ chart, positions }: AspectLinesProps) {
  const aspects = chart.aspects(false)

  const lines = useMemo(() => {
    const posMap = new Map(positions.map(p => [p.key, p]))

    return aspects
      .map(a => {
        const p1 = posMap.get(a.body1.body.key)
        const p2 = posMap.get(a.body2.body.key)
        if (!p1 || !p2) return null

        const color = ASPECT_COLORS[a.aspect.name] ?? '#666666'
        const opacity = Math.max(0.15, 1 - a.orb / a.aspect.defaultOrb)

        return {
          key: `${a.body1.body.key}-${a.body2.body.key}-${a.aspect.name}`,
          points: [
            [p1.position.x, p1.position.y, p1.position.z] as [number, number, number],
            [p2.position.x, p2.position.y, p2.position.z] as [number, number, number],
          ],
          color,
          opacity,
        }
      })
      .filter(Boolean) as {
        key: string
        points: [number, number, number][]
        color: string
        opacity: number
      }[]
  }, [aspects, positions])

  return (
    <group>
      {lines.map(line => (
        <Line
          key={line.key}
          points={line.points}
          color={line.color}
          transparent
          opacity={line.opacity}
          lineWidth={1}
        />
      ))}
    </group>
  )
}
