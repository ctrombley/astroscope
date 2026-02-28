import type { HouseSystem } from '@ctrombley/astrokit'

export type ViewMode = 'orrery' | 'sky'

export interface SelectedAspect {
  body1Key: string
  body2Key: string
  aspectName: string
}

export interface SelectedPattern {
  patternString: string   // full string used as identity key
  bodyKeys: string[]      // planet keys of all involved bodies
}

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface FlyTarget {
  position: Position3D
  /** Override viewing distance; falls back to flyDistForPlanet when absent. */
  distance?: number
}

export interface PlanetPosition {
  key: string
  name: string
  symbol: string
  position: Position3D
  longitudeDeg: number
  retrograde: boolean
  dailyMotionDeg: number
}

export interface AnimationState {
  date: Date
  playing: boolean
  speed: number // days per second
  step: (days: number) => void
  play: () => void
  pause: () => void
  toggle: () => void
  setSpeed: (s: number) => void
  setDate: (d: Date) => void
}

export interface AppSettings {
  houseSystem: HouseSystem
  sidereal: boolean
  showMinorAspects: boolean
  showHarmonics: boolean
  showAngles: boolean
  latitude: number
  longitude: number
}

export interface BirthChartData {
  name?: string
  date: Date        // UTC
  latitude: number
  longitude: number
  locationName: string
}
