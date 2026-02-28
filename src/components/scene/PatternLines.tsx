import { useMemo } from 'react'
import { Line, Html } from '@react-three/drei'
import { PATTERN_DESCRIPTIONS, patternTypeName } from '../../constants/descriptions'
import type { PlanetPosition, SelectedPattern } from '../../types'

interface PatternLinesProps {
  positions: PlanetPosition[]
  selectedPattern: SelectedPattern | null
}

export default function PatternLines({ positions, selectedPattern }: PatternLinesProps) {
  const { lines, centroid } = useMemo(() => {
    if (!selectedPattern || selectedPattern.bodyKeys.length < 2) {
      return { lines: [], centroid: null }
    }

    const posMap = new Map(positions.map(p => [p.key, p]))
    const pts = selectedPattern.bodyKeys
      .map(k => posMap.get(k)?.position)
      .filter((p): p is { x: number; y: number; z: number } => p !== undefined)

    if (pts.length < 2) return { lines: [], centroid: null }

    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length
    const cz = pts.reduce((s, p) => s + p.z, 0) / pts.length

    const result: [[number, number, number], [number, number, number]][] = []
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        result.push([
          [pts[i]!.x, pts[i]!.y, pts[i]!.z],
          [pts[j]!.x, pts[j]!.y, pts[j]!.z],
        ])
      }
    }

    return { lines: result, centroid: [cx, cy, cz] as [number, number, number] }
  }, [positions, selectedPattern])

  if (lines.length === 0 || !centroid || !selectedPattern) return null

  const typeName = patternTypeName(selectedPattern.patternString)
  const description = PATTERN_DESCRIPTIONS[typeName]

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#C9A84C"
          lineWidth={1.8}
          transparent
          opacity={0.7}
          dashed
          dashSize={0.25}
          gapSize={0.12}
        />
      ))}

      {description && (
        <Html position={centroid} center distanceFactor={22} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(6, 6, 14, 0.92)',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '5px',
            padding: '6px 10px',
            maxWidth: '200px',
            textAlign: 'center',
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{
              color: '#C9A84C',
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              letterSpacing: '0.06em',
              marginBottom: '4px',
            }}>
              {typeName}
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '9px',
              fontFamily: 'monospace',
              lineHeight: '1.45',
            }}>
              {description}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
