import { PLANETS, Angle, solveKepler, trueAnomaly } from '@ctrombley/astrokit'
import type { Position3D } from '../types'
import { scaleOrbitRadius } from '../constants/scales'

const DEG_TO_RAD = Math.PI / 180

/**
 * Generate points along a planet's full orbit ellipse for rendering as a line.
 * Returns an array of Three.js (Y-up) positions.
 */
export function generateOrbitPath(planetKey: string, numPoints = 128): Position3D[] {
  const planet = PLANETS[planetKey]
  if (!planet?.elements) return []

  const { a, e, i, omega, w } = planet.elements
  const points: Position3D[] = []

  const wRad = w * DEG_TO_RAD
  const iRad = i * DEG_TO_RAD
  const omRad = omega * DEG_TO_RAD

  const cosW = Math.cos(wRad)
  const sinW = Math.sin(wRad)
  const cosI = Math.cos(iRad)
  const sinI = Math.sin(iRad)
  const cosOm = Math.cos(omRad)
  const sinOm = Math.sin(omRad)

  for (let j = 0; j <= numPoints; j++) {
    // Sweep mean anomaly from 0 to 360
    const M = (j / numPoints) * 360
    const E = solveKepler(M, e)
    const nu = trueAnomaly(E, e)

    const E_rad = E * DEG_TO_RAD
    const r = a * (1 - e * Math.cos(E_rad))

    const nu_rad = nu * DEG_TO_RAD
    const xOrb = r * Math.cos(nu_rad)
    const yOrb = r * Math.sin(nu_rad)

    // Rotate to ecliptic
    const ex =
      (cosOm * cosW - sinOm * sinW * cosI) * xOrb +
      (-cosOm * sinW - sinOm * cosW * cosI) * yOrb
    const ey =
      (sinOm * cosW + cosOm * sinW * cosI) * xOrb +
      (-sinOm * sinW + cosOm * cosW * cosI) * yOrb
    const ez = sinI * sinW * xOrb + sinI * cosW * yOrb

    // Scale
    const rawR = Math.sqrt(ex * ex + ey * ey + ez * ez)
    const scaledR = scaleOrbitRadius(rawR)
    const scale = rawR > 0 ? scaledR / rawR : 0

    // Ecliptic to Three.js: x=x, y=z, z=-y
    points.push({
      x: ex * scale,
      y: ez * scale,
      z: -ey * scale,
    })
  }

  return points
}
