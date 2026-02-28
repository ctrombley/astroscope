import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { generateOrbitPath } from '../../utils/orbitPath'
import { PLANET_COLORS } from '../../constants/colors'

interface OrbitRingProps {
  planetKey: string
}

export default function OrbitRing({ planetKey }: OrbitRingProps) {
  const points = useMemo(() => {
    const path = generateOrbitPath(planetKey, 256)
    return path.map(p => [p.x, p.y, p.z] as [number, number, number])
  }, [planetKey])

  if (points.length === 0) return null

  return (
    <Line
      points={points}
      color={PLANET_COLORS[planetKey] ?? '#444444'}
      transparent
      opacity={0.25}
      lineWidth={1}
    />
  )
}
