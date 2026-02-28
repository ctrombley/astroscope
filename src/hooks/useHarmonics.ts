import { useMemo } from 'react'
import {
  harmonicSpectrum,
  findHarmonicClusters,
  Angle,
} from '@ctrombley/astrokit'
import type { Chart } from '@ctrombley/astrokit'

export interface HarmonicData {
  spectrum: { harmonic: number; strength: number; clusterCount: number }[]
  clusters: Map<number, number[][]> // harmonic → array of planet-index clusters
}

export function useHarmonics(chart: Chart, maxHarmonic = 12): HarmonicData {
  return useMemo(() => {
    const longitudes = chart.positions.map(p => p.longitude)
    const spectrum = harmonicSpectrum(longitudes, maxHarmonic)

    const clusters = new Map<number, number[][]>()
    for (let h = 1; h <= maxHarmonic; h++) {
      const c = findHarmonicClusters(longitudes, h)
      if (c.length > 0) clusters.set(h, c)
    }

    return { spectrum, clusters }
  }, [chart, maxHarmonic])
}
