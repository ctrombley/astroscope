import { useMemo, useState } from 'react'
import { Line, Html } from '@react-three/drei'
import { ASPECT_COLORS } from '../../constants/colors'
import { ASPECT_DESCRIPTIONS } from '../../constants/descriptions'
import type { PlanetPosition, SelectedAspect, SelectedPattern } from '../../types'
import type { Chart } from '@ctrombley/astrokit'

interface AspectLinesProps {
  chart: Chart
  positions: PlanetPosition[]
  selectedAspect: SelectedAspect | null
  selectedPattern: SelectedPattern | null
  onSelectAspect: (a: SelectedAspect) => void
}

interface LineData {
  key: string
  body1Key: string
  body2Key: string
  aspectName: string
  points: [[number, number, number], [number, number, number]]
  color: string
  baseOpacity: number
}

function AspectLine({
  line,
  isSelected,
  hasSelection,
  onSelect,
}: {
  line: LineData
  isSelected: boolean
  hasSelection: boolean
  onSelect: (a: SelectedAspect) => void
}) {
  const [hovered, setHovered] = useState(false)

  const info = ASPECT_DESCRIPTIONS[line.aspectName]
  const active = hovered || isSelected

  const opacity = hasSelection
    ? isSelected ? 0.95 : 0.03
    : hovered    ? 0.75 : line.baseOpacity
  const lineWidth = isSelected ? 2.5 : hovered ? 2 : 1

  const mid: [number, number, number] = [
    (line.points[0][0] + line.points[1][0]) / 2,
    (line.points[0][1] + line.points[1][1]) / 2,
    (line.points[0][2] + line.points[1][2]) / 2,
  ]

  return (
    <group>
      <Line
        points={line.points}
        color={line.color}
        transparent
        opacity={opacity}
        lineWidth={lineWidth}
        onPointerEnter={(e: { stopPropagation: () => void }) => { e.stopPropagation(); setHovered(true) }}
        onPointerLeave={() => setHovered(false)}
        onClick={(e: { stopPropagation: () => void }) => { e.stopPropagation(); onSelect({ body1Key: line.body1Key, body2Key: line.body2Key, aspectName: line.aspectName }) }}
      />
      {active && info && (
        <Html position={mid} center distanceFactor={22} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(6, 6, 14, 0.92)',
            border: `1px solid ${line.color}55`,
            borderRadius: '5px',
            padding: '6px 10px',
            maxWidth: '190px',
            textAlign: 'center',
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{
              color: line.color,
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              letterSpacing: '0.06em',
              marginBottom: '4px',
            }}>
              {line.aspectName} · {info.angle}
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '9px',
              fontFamily: 'monospace',
              lineHeight: '1.45',
            }}>
              {info.description}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function AspectLines({
  chart, positions, selectedAspect, selectedPattern, onSelectAspect,
}: AspectLinesProps) {
  const aspects = chart.aspects(false)

  const lines = useMemo<LineData[]>(() => {
    const posMap = new Map(positions.map(p => [p.key, p]))
    return aspects.flatMap(a => {
      const p1 = posMap.get(a.body1.body.key)
      const p2 = posMap.get(a.body2.body.key)
      if (!p1 || !p2) return []
      const color = ASPECT_COLORS[a.aspect.name] ?? '#666666'
      // Very low base opacity — lines barely visible until hovered/selected
      const baseOpacity = Math.max(0.03, (1 - a.orb / a.aspect.defaultOrb) * 0.09)
      return [{
        key: `${a.body1.body.key}-${a.body2.body.key}-${a.aspect.name}`,
        body1Key: a.body1.body.key,
        body2Key: a.body2.body.key,
        aspectName: a.aspect.name,
        points: [
          [p1.position.x, p1.position.y, p1.position.z],
          [p2.position.x, p2.position.y, p2.position.z],
        ],
        color,
        baseOpacity,
      }]
    })
  }, [aspects, positions])

  const hasSelection = selectedAspect !== null || selectedPattern !== null

  return (
    <group>
      {lines.map(line => {
        const isSelected =
          selectedAspect !== null &&
          line.body1Key === selectedAspect.body1Key &&
          line.body2Key === selectedAspect.body2Key &&
          line.aspectName === selectedAspect.aspectName
        return (
          <AspectLine
            key={line.key}
            line={line}
            isSelected={isSelected}
            hasSelection={hasSelection}
            onSelect={onSelectAspect}
          />
        )
      })}
    </group>
  )
}
