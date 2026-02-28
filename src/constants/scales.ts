/**
 * Logarithmic scaling for orbit radii.
 * Real AU values span 100x (Mercury 0.39 → Pluto 39.5).
 * This compresses the range to something visually workable.
 */
export function scaleOrbitRadius(au: number): number {
  return 2 + Math.log2(au + 0.5) * 3
}

/** Non-physical planet display sizes (scene units) */
export const PLANET_SIZES: Record<string, number> = {
  sun: 0.5,
  earth: 0.11,
  moon: 0.08,
  mercury: 0.08,
  venus: 0.1,
  mars: 0.09,
  jupiter: 0.2,
  saturn: 0.18,
  uranus: 0.14,
  neptune: 0.14,
  pluto: 0.06,
  northNode: 0.05,
  southNode: 0.05,
}

/** Zodiac ring radius — just outside Pluto's orbit */
export const ZODIAC_RING_RADIUS = 22

/** Moon orbit display offset from Earth (inflated for visibility) */
export const MOON_ORBIT_OFFSET = 0.4

/** Planets that have orbital elements (for orbit ring + position calc) */
export const ORBITING_PLANETS = [
  'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
] as const
