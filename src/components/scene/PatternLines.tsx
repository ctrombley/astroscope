import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { PlanetPosition, SelectedPattern } from '../../types'

interface PatternLinesProps {
  positions: PlanetPosition[]
  selectedPattern: SelectedPattern | null
}

export default function PatternLines({ positions, selectedPattern }: PatternLinesProps) {
  const lines = useMemo(() => {
    if (!selectedPattern || selectedPattern.bodyKeys.length < 2) return []

    const posMap = new Map(positions.map(p => [p.key, p]))
    const pts = selectedPattern.bodyKeys
      .map(k => posMap.get(k)?.position)
      .filter((p): p is { x: number; y: number; z: number } => p !== undefined)

    if (pts.length < 2) return []

    // Connect every pair — naturally produces the correct geometry:
    // 3 bodies → triangle (Grand Trine, T-Square, Yod)
    // 4 bodies → quadrilateral with diagonals (Grand Cross, Kite)
    const result: [[number, number, number], [number, number, number]][] = []
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        result.push([
          [pts[i]!.x, pts[i]!.y, pts[i]!.z],
          [pts[j]!.x, pts[j]!.y, pts[j]!.z],
        ])
      }
    }
    return result
  }, [positions, selectedPattern])

  if (lines.length === 0) return null

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#C9A84C"
          lineWidth={1.8}
          transparent
          opacity={0.8}
          dashed
          dashSize={0.25}
          gapSize={0.12}
        />
      ))}
    </group>
  )
}
