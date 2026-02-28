import { useMemo } from 'react'
import { PLANETS, dailyMotion, isRetrograde, dateToJD, geocentricLongitude } from '@ctrombley/astrokit'
import {
  heliocentricPosition3D,
  moonPosition3D,
  earthPosition3D,
} from '../utils/eclipticTo3D'
import { ORBITING_PLANETS } from '../constants/scales'
import type { PlanetPosition } from '../types'

export function usePositions(date: Date): PlanetPosition[] {
  return useMemo(() => {
    const jd = dateToJD(date)
    const positions: PlanetPosition[] = []

    // Sun is at origin
    positions.push({
      key: 'sun',
      name: 'Sun',
      symbol: PLANETS['sun']!.symbol,
      position: { x: 0, y: 0, z: 0 },
      longitudeDeg: geocentricLongitude('sun', jd).degrees,
      retrograde: false,
      dailyMotionDeg: dailyMotion('sun', jd),
    })

    // Planets with orbital elements
    for (const key of ORBITING_PLANETS) {
      const planet = PLANETS[key]!
      positions.push({
        key,
        name: planet.name,
        symbol: planet.symbol,
        position: heliocentricPosition3D(key, date),
        longitudeDeg: geocentricLongitude(key, jd).degrees,
        retrograde: isRetrograde(key, jd),
        dailyMotionDeg: dailyMotion(key, jd),
      })
    }

    // Moon — special handling
    positions.push({
      key: 'moon',
      name: 'Moon',
      symbol: PLANETS['moon']!.symbol,
      position: moonPosition3D(date),
      longitudeDeg: geocentricLongitude('moon', jd).degrees,
      retrograde: false,
      dailyMotionDeg: dailyMotion('moon', jd),
    })

    return positions
  }, [date.getTime()])
}
