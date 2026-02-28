import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { PlanetPosition } from '../../types'

interface HarmonicOverlayProps {
  clusters: Map<number, number[][]>
  positions: PlanetPosition[]
  visible: boolean
}

const HARMONIC_COLORS = [
  '#FFD700', '#FF4444', '#44FF44', '#4488FF',
  '#FF44FF', '#44FFFF', '#FFAA44', '#AA44FF',
  '#44FFAA', '#FF44AA', '#AAFF44', '#44AAFF',
]

export default function HarmonicOverlay({ clusters, positions, visible }: HarmonicOverlayProps) {
  const shapes = useMemo(() => {
    if (!visible) return []

    const result: { key: string; points: [number, number, number][]; color: string }[] = []

    clusters.forEach((clusterList, harmonic) => {
      const color = HARMONIC_COLORS[(harmonic - 1) % HARMONIC_COLORS.length]!
      clusterList.forEach((indices, ci) => {
        if (indices.length < 2) return
        const pts = indices
          .map(i => positions[i])
          .filter(Boolean)
          .map(p => [p!.position.x, p!.position.y, p!.position.z] as [number, number, number])

        if (pts.length >= 2) {
          // Close the shape
          pts.push(pts[0]!)
          result.push({ key: `h${harmonic}-c${ci}`, points: pts, color })
        }
      })
    })

    return result
  }, [clusters, positions, visible])

  if (!visible) return null

  return (
    <group>
      {shapes.map(({ key, points, color }) => (
        <Line
          key={key}
          points={points}
          color={color}
          transparent
          opacity={0.5}
          lineWidth={2}
        />
      ))}
    </group>
  )
}
