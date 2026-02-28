import { useMemo } from 'react'
import {
  Chart,
  calculateAscendant,
  calculateMC,
  dateToJD,
} from '@ctrombley/astrokit'
import type { HouseSystem } from '@ctrombley/astrokit'

interface ChartData {
  chart: Chart
  aspects: ReturnType<Chart['aspects']>
  balance: ReturnType<Chart['balance']>
  patterns: ReturnType<Chart['patterns']>
  lots: ReturnType<Chart['lots']>
}

export function useChart(
  date: Date,
  latitude: number,
  longitude: number,
  houseSystem: HouseSystem,
  majorOnly: boolean,
): ChartData {
  return useMemo(() => {
    const chart = Chart.compute(date, latitude, longitude, undefined, houseSystem)
    return {
      chart,
      aspects: chart.aspects(majorOnly),
      balance: chart.balance(),
      patterns: chart.patterns(),
      lots: chart.lots(),
    }
  }, [date.getTime(), latitude, longitude, houseSystem, majorOnly])
}
