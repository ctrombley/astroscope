/**
 * Coordinate conversion utilities for the night sky view.
 */

const DEG = Math.PI / 180

/**
 * Greenwich Mean Sidereal Time in degrees for a given Julian Day.
 */
function gmstDeg(jd: number): number {
  const D = jd - 2451545.0  // days from J2000.0
  return ((280.46061837 + 360.98564736629 * D) % 360 + 360) % 360
}

/**
 * Local Sidereal Time in degrees.
 * @param jd Julian Day Number
 * @param longitudeDeg Observer longitude (east positive, west negative)
 */
export function lstDeg(jd: number, longitudeDeg: number): number {
  return ((gmstDeg(jd) + longitudeDeg) % 360 + 360) % 360
}

/** Earth's obliquity of the ecliptic (J2000, degrees) */
export const OBLIQUITY_DEG = 23.4393

/**
 * Convert ecliptic longitude (degrees, geocentric) to equatorial RA/Dec.
 * Assumes ecliptic latitude = 0 (good approximation for planets in orrery).
 */
export function eclipticToEquatorial(
  eclipticLon: number
): { ra: number; dec: number } {
  const λ = eclipticLon * DEG
  const ε = OBLIQUITY_DEG * DEG

  const x = Math.cos(λ)
  const y = Math.cos(ε) * Math.sin(λ)
  const z = Math.sin(ε) * Math.sin(λ)

  const ra = Math.atan2(y, x) / DEG
  const dec = Math.asin(z) / DEG
  return { ra: (ra + 360) % 360, dec }
}

/**
 * Convert RA/Dec (degrees) to a 3D unit vector on the celestial sphere.
 * Convention: Y = celestial north, RA=0/Dec=0 toward +X, RA increases eastward.
 */
export function equatorialToCartesian(
  ra: number,
  dec: number,
  radius: number = 1
): [number, number, number] {
  const raDeg = ra * DEG
  const decDeg = dec * DEG
  const x = radius * Math.cos(decDeg) * Math.cos(raDeg)
  const y = radius * Math.sin(decDeg)
  const z = -radius * Math.cos(decDeg) * Math.sin(raDeg)
  return [x, y, z]
}

/**
 * Map visual magnitude to a point size for rendering.
 * Brighter stars (lower vmag) → larger points.
 */
export function magToSize(vmag: number): number {
  // vmag -1.5 → ~6px, vmag 0 → 4px, vmag 3 → 1.5px, vmag 6 → 0.6px
  return Math.max(0.4, 5.5 * Math.pow(10, -vmag * 0.12))
}

/**
 * Map B-V color index to an RGB hex color.
 * BV < -0.3: hot blue, BV ~0: white, BV ~0.6: solar yellow, BV >1.5: red
 */
export function bvToColor(bv: number): [number, number, number] {
  // Piecewise linear approximation of stellar color from B-V
  if (bv < -0.3) return [155, 176, 255]
  if (bv < 0.0) {
    const t = (bv + 0.3) / 0.3
    return [
      Math.round(155 + t * (170 - 155)),
      Math.round(176 + t * (191 - 176)),
      255,
    ]
  }
  if (bv < 0.6) {
    const t = bv / 0.6
    return [
      255,
      Math.round(255 - t * (255 - 224)),
      Math.round(255 - t * (255 - 178)),
    ]
  }
  if (bv < 1.0) {
    const t = (bv - 0.6) / 0.4
    return [
      255,
      Math.round(224 - t * (224 - 180)),
      Math.round(178 - t * 90),
    ]
  }
  if (bv < 1.5) {
    const t = (bv - 1.0) / 0.5
    return [
      255,
      Math.round(180 - t * 60),
      Math.round(88 - t * 50),
    ]
  }
  // Very red
  return [255, 120, 38]
}
