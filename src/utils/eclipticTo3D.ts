import {
  PLANETS,
  solveKepler,
  trueAnomaly,
  dateToJD,
  daysFromJ2000,
  Angle,
} from '@ctrombley/astrokit'
import type { Position3D } from '../types'
import { scaleOrbitRadius, MOON_ORBIT_OFFSET } from '../constants/scales'

const DEG_TO_RAD = Math.PI / 180

/**
 * Convert ecliptic coordinates (X=vernal equinox, Z=north pole)
 * to Three.js coordinates (Y-up).
 * Mapping: three.x = ecl.x, three.y = ecl.z, three.z = -ecl.y
 */
function eclipticToThreeJS(ex: number, ey: number, ez: number): Position3D {
  return { x: ex, y: ez, z: -ey }
}

/**
 * Compute the heliocentric 3D position of a planet at a given date.
 * Uses Kepler's equation from astrokit.
 */
export function heliocentricPosition3D(planetKey: string, date: Date): Position3D {
  const planet = PLANETS[planetKey]
  if (!planet?.elements) return { x: 0, y: 0, z: 0 }

  const { a, e, i, omega, w, M0, period } = planet.elements
  const jd = dateToJD(date)
  const d = daysFromJ2000(jd)

  // Mean anomaly at date
  const n = 360 / (period * 365.25) // mean motion deg/day
  const M = Angle.normalize(M0 + n * d)

  // Solve Kepler's equation
  const E = solveKepler(M, e)
  const nu = trueAnomaly(E, e) // true anomaly in degrees

  // Radius vector
  const E_rad = E * DEG_TO_RAD
  const r = a * (1 - e * Math.cos(E_rad))

  // Position in orbital plane
  const nu_rad = nu * DEG_TO_RAD
  const xOrb = r * Math.cos(nu_rad)
  const yOrb = r * Math.sin(nu_rad)

  // Rotate by argument of perihelion (w), then inclination (i), then longitude of ascending node (omega)
  const wRad = w * DEG_TO_RAD
  const iRad = i * DEG_TO_RAD
  const omRad = omega * DEG_TO_RAD

  const cosW = Math.cos(wRad)
  const sinW = Math.sin(wRad)
  const cosI = Math.cos(iRad)
  const sinI = Math.sin(iRad)
  const cosOm = Math.cos(omRad)
  const sinOm = Math.sin(omRad)

  // Ecliptic coordinates
  const ex =
    (cosOm * cosW - sinOm * sinW * cosI) * xOrb +
    (-cosOm * sinW - sinOm * cosW * cosI) * yOrb
  const ey =
    (sinOm * cosW + cosOm * sinW * cosI) * xOrb +
    (-sinOm * sinW + cosOm * cosW * cosI) * yOrb
  const ez = sinI * sinW * xOrb + sinI * cosW * yOrb

  // Scale and convert to Three.js coordinates
  const scaledR = scaleOrbitRadius(Math.sqrt(ex * ex + ey * ey + ez * ez))
  const rawR = Math.sqrt(ex * ex + ey * ey + ez * ez)
  const scale = rawR > 0 ? scaledR / rawR : 0

  return eclipticToThreeJS(ex * scale, ey * scale, ez * scale)
}

/**
 * Get Earth's heliocentric position (Sun's orbital elements = Earth's orbit).
 */
export function earthPosition3D(date: Date): Position3D {
  return heliocentricPosition3D('sun', date)
}

/**
 * Get Moon's display position: Earth position + inflated offset.
 * Moon orbits Earth at 0.0026 AU (invisible at solar system scale),
 * so we inflate it for visibility.
 */
export function moonPosition3D(date: Date): Position3D {
  const earthPos = earthPosition3D(date)
  const moon = PLANETS['moon']
  if (!moon?.elements) return earthPos

  const { e, M0, period, omega, w } = moon.elements
  const jd = dateToJD(date)
  const d = daysFromJ2000(jd)

  const n = 360 / (period * 365.25)
  const M = Angle.normalize(M0 + n * d)
  const E = solveKepler(M, e)
  const nu = trueAnomaly(E, e)

  // Place Moon at inflated offset from Earth
  const angle = (omega + w + nu) * DEG_TO_RAD
  return {
    x: earthPos.x + MOON_ORBIT_OFFSET * Math.cos(angle),
    y: earthPos.y,
    z: earthPos.z + MOON_ORBIT_OFFSET * Math.sin(angle),
  }
}
