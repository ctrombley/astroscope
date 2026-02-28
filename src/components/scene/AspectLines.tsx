import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { ASPECT_COLORS } from '../../constants/colors'
import type { PlanetPosition, SelectedAspect } from '../../types'
import type { Chart } from '@ctrombley/astrokit'

interface AspectLinesProps {
  chart: Chart
  positions: PlanetPosition[]
  selectedAspect: SelectedAspect | null
}

export default function AspectLines({ chart, positions, selectedAspect }: AspectLinesProps) {
  const aspects = chart.aspects(false)

  const lines = useMemo(() => {
    const posMap = new Map(positions.map(p => [p.key, p]))

    return aspects
      .map(a => {
        const p1 = posMap.get(a.body1.body.key)
        const p2 = posMap.get(a.body2.body.key)
        if (!p1 || !p2) return null

        const color = ASPECT_COLORS[a.aspect.name] ?? '#666666'
        const baseOpacity = Math.max(0.15, 1 - a.orb / a.aspect.defaultOrb)

        return {
          key: `${a.body1.body.key}-${a.body2.body.key}-${a.aspect.name}`,
          body1Key: a.body1.body.key,
          body2Key: a.body2.body.key,
          aspectName: a.aspect.name,
          points: [
            [p1.position.x, p1.position.y, p1.position.z] as [number, number, number],
            [p2.position.x, p2.position.y, p2.position.z] as [number, number, number],
          ],
          color,
          baseOpacity,
        }
      })
      .filter(Boolean) as {
        key: string
        body1Key: string
        body2Key: string
        aspectName: string
        points: [number, number, number][]
        color: string
        baseOpacity: number
      }[]
  }, [aspects, positions])

  const hasSelection = selectedAspect !== null

  return (
    <group>
      {lines.map(line => {
        const isSelected =
          selectedAspect !== null &&
          line.body1Key === selectedAspect.body1Key &&
          line.body2Key === selectedAspect.body2Key &&
          line.aspectName === selectedAspect.aspectName

        const opacity = hasSelection
          ? isSelected ? 1 : 0.06
          : line.baseOpacity
        const lineWidth = isSelected ? 2.5 : 1

        return (
          <Line
            key={line.key}
            points={line.points}
            color={line.color}
            transparent
            opacity={opacity}
            lineWidth={lineWidth}
          />
        )
      })}
    </group>
  )
}
