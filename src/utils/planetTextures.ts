import * as THREE from 'three'

const W = 256
const H = 128

function makeTexture(draw: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  draw(ctx)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function drawSun(ctx: CanvasRenderingContext2D) {
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H / 2)
  g.addColorStop(0, '#fff7cc')
  g.addColorStop(0.3, '#FFD700')
  g.addColorStop(0.7, '#e8a000')
  g.addColorStop(1, '#c06000')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  // Granulation streaks
  ctx.globalAlpha = 0.15
  for (let i = 0; i < 40; i++) {
    const x = (i / 40) * W
    const w = 4 + (i % 3) * 2
    ctx.fillStyle = i % 2 === 0 ? '#ffee80' : '#d08000'
    ctx.fillRect(x, 0, w, H)
  }
  ctx.globalAlpha = 1
}

function drawMercury(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#7a7878'
  ctx.fillRect(0, 0, W, H)
  // Subtle variation
  const craters: [number, number, number][] = [
    [0.2, 0.3, 0.05], [0.5, 0.6, 0.04], [0.7, 0.2, 0.06],
    [0.35, 0.7, 0.03], [0.8, 0.5, 0.05], [0.1, 0.7, 0.04],
    [0.6, 0.4, 0.03], [0.45, 0.15, 0.04], [0.9, 0.7, 0.05],
  ]
  for (const [cx, cy, r] of craters) {
    ctx.fillStyle = '#606060'
    ctx.beginPath()
    ctx.arc(cx * W, cy * H, r * W, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#909090'
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

function drawVenus(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#e8d8a0')
  g.addColorStop(0.5, '#f0e0b0')
  g.addColorStop(1, '#d8c880')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  // Swirling cloud bands
  ctx.globalAlpha = 0.3
  const bands = [0.1, 0.22, 0.38, 0.55, 0.70, 0.85]
  for (const y of bands) {
    ctx.fillStyle = '#fff8e0'
    ctx.fillRect(0, y * H, W, 0.06 * H)
  }
  ctx.globalAlpha = 1
}

function drawEarth(ctx: CanvasRenderingContext2D) {
  // Ocean
  const ocean = ctx.createLinearGradient(0, 0, 0, H)
  ocean.addColorStop(0, '#1a3a7a')
  ocean.addColorStop(0.45, '#1a5faa')
  ocean.addColorStop(1, '#1a3a7a')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, W, H)

  // Continents
  ctx.fillStyle = '#2d6a27'
  const continents: [number, number, number, number, number][] = [
    [0.23, 0.34, 0.10, 0.13, -0.2],  // N America
    [0.29, 0.60, 0.06, 0.13, 0.1],   // S America
    [0.53, 0.33, 0.09, 0.10, 0.1],   // Europe
    [0.57, 0.57, 0.08, 0.15, 0.0],   // Africa
    [0.73, 0.30, 0.14, 0.10, -0.1],  // Asia
    [0.79, 0.45, 0.04, 0.06, 0.0],   // SE Asia/India
    [0.83, 0.61, 0.06, 0.05, 0.2],   // Australia
  ]
  for (const [cx, cy, rx, ry, rot] of continents) {
    ctx.save()
    ctx.translate(cx * W, cy * H)
    ctx.rotate(rot)
    ctx.beginPath()
    ctx.ellipse(0, 0, rx * W, ry * H, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Greenland
  ctx.beginPath()
  ctx.ellipse(0.33 * W, 0.12 * H, 0.04 * W, 0.06 * H, 0.2, 0, Math.PI * 2)
  ctx.fill()

  // Polar caps
  ctx.fillStyle = '#d8eeff'
  ctx.fillRect(0, 0, W, H * 0.07)          // Arctic
  ctx.fillRect(0, H * 0.85, W, H * 0.15)  // Antarctica

  // Cloud wisps (deterministic)
  ctx.globalAlpha = 0.35
  ctx.fillStyle = '#ffffff'
  const clouds: [number, number, number, number][] = [
    [0.08, 0.25, 0.10, 0.035], [0.40, 0.18, 0.12, 0.030],
    [0.65, 0.40, 0.09, 0.025], [0.20, 0.55, 0.11, 0.028],
    [0.80, 0.25, 0.08, 0.030], [0.50, 0.70, 0.10, 0.025],
  ]
  for (const [cx, cy, rx, ry] of clouds) {
    ctx.beginPath()
    ctx.ellipse(cx * W, cy * H, rx * W, ry * H, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawMoon(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#888880'
  ctx.fillRect(0, 0, W, H)
  // Maria (darker regions)
  ctx.fillStyle = '#606058'
  const maria: [number, number, number, number][] = [
    [0.35, 0.40, 0.18, 0.15], // Mare Imbrium area
    [0.55, 0.55, 0.12, 0.10], // Mare Tranquillitatis
    [0.20, 0.55, 0.10, 0.08], // Oceanus Procellarum
    [0.70, 0.35, 0.09, 0.08], // Mare Serenitatis
  ]
  for (const [cx, cy, rx, ry] of maria) {
    ctx.beginPath()
    ctx.ellipse(cx * W, cy * H, rx * W, ry * H, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  // Craters
  const craters: [number, number, number][] = [
    [0.65, 0.70, 0.04], [0.80, 0.30, 0.03], [0.15, 0.35, 0.03],
    [0.45, 0.75, 0.025], [0.70, 0.55, 0.02], [0.30, 0.20, 0.03],
  ]
  for (const [cx, cy, r] of craters) {
    ctx.fillStyle = '#aaa898'
    ctx.beginPath()
    ctx.arc(cx * W, cy * H, r * W, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#555550'
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
}

function drawMars(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#b83010')
  g.addColorStop(0.5, '#cc4420')
  g.addColorStop(1, '#b03010')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // Highland regions (lighter)
  ctx.fillStyle = '#d4693b'
  const highlands: [number, number, number, number][] = [
    [0.30, 0.40, 0.25, 0.15],
    [0.70, 0.55, 0.18, 0.12],
  ]
  for (const [cx, cy, rx, ry] of highlands) {
    ctx.beginPath()
    ctx.ellipse(cx * W, cy * H, rx * W, ry * H, 0.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Hellas basin (dark depression)
  ctx.fillStyle = '#8c2808'
  ctx.beginPath()
  ctx.ellipse(0.65 * W, 0.67 * H, 0.11 * W, 0.08 * H, 0.1, 0, Math.PI * 2)
  ctx.fill()

  // Polar ice caps
  ctx.fillStyle = '#f0f0ee'
  ctx.fillRect(0, 0, W, H * 0.05)
  ctx.fillRect(0, H * 0.90, W, H * 0.10)
}

function drawJupiter(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#c4a055'
  ctx.fillRect(0, 0, W, H)

  const bands: [number, number, string][] = [
    [0.00, 0.08, '#d4b870'],
    [0.08, 0.16, '#a07838'],
    [0.16, 0.28, '#d8bc78'],
    [0.28, 0.36, '#b08040'],
    [0.36, 0.50, '#e0c880'],  // equatorial zone (brightest)
    [0.50, 0.60, '#b08848'],
    [0.60, 0.70, '#d0b868'],
    [0.70, 0.80, '#a07838'],
    [0.80, 0.88, '#ccb060'],
    [0.88, 1.00, '#d4b870'],
  ]
  for (const [y0, y1, color] of bands) {
    ctx.fillStyle = color
    ctx.fillRect(0, y0 * H, W, (y1 - y0) * H)
  }

  // Great Red Spot (at ~23°S → y≈0.63 in texture)
  ctx.fillStyle = '#b04030'
  ctx.beginPath()
  ctx.ellipse(0.65 * W, 0.63 * H, 0.065 * W, 0.038 * H, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#c06048'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Festoons / turbulence in equatorial region
  ctx.globalAlpha = 0.2
  for (let i = 0; i < 6; i++) {
    const x = (i / 6) * W
    ctx.fillStyle = '#806030'
    ctx.fillRect(x, 0.38 * H, 8, 0.14 * H)
  }
  ctx.globalAlpha = 1
}

function drawSaturn(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#c8b878'
  ctx.fillRect(0, 0, W, H)

  const bands: [number, number, string][] = [
    [0.00, 0.10, '#d8c888'],
    [0.10, 0.20, '#b8a860'],
    [0.20, 0.35, '#e0d090'],
    [0.35, 0.50, '#c8b878'],
    [0.50, 0.65, '#d8c888'],
    [0.65, 0.78, '#b8a860'],
    [0.78, 0.90, '#d4c480'],
    [0.90, 1.00, '#c0b070'],
  ]
  for (const [y0, y1, color] of bands) {
    ctx.fillStyle = color
    ctx.fillRect(0, y0 * H, W, (y1 - y0) * H)
  }
}

function drawUranus(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#5ab8b0')
  g.addColorStop(0.5, '#72d0c8')
  g.addColorStop(1, '#5ab8b0')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  // Subtle polar darkening
  ctx.globalAlpha = 0.2
  ctx.fillStyle = '#2a7870'
  ctx.fillRect(0, 0, W, H * 0.12)
  ctx.fillRect(0, H * 0.88, W, H * 0.12)
  ctx.globalAlpha = 1
}

function drawNeptune(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#1a2888')
  g.addColorStop(0.5, '#2848c0')
  g.addColorStop(1, '#1a2888')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  // Dark spot
  ctx.fillStyle = '#102060'
  ctx.beginPath()
  ctx.ellipse(0.4 * W, 0.45 * H, 0.08 * W, 0.05 * H, 0.3, 0, Math.PI * 2)
  ctx.fill()
  // Bright cloud band
  ctx.fillStyle = '#6888e8'
  ctx.globalAlpha = 0.4
  ctx.fillRect(0, 0.38 * H, W, 0.06 * H)
  ctx.globalAlpha = 1
}

function drawPluto(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#7a5865')
  g.addColorStop(0.5, '#906878')
  g.addColorStop(1, '#7a5865')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  // Tombaugh region (heart-shaped bright area)
  ctx.fillStyle = '#e8d0b0'
  ctx.beginPath()
  ctx.ellipse(0.50 * W, 0.55 * H, 0.14 * W, 0.12 * H, 0, 0, Math.PI * 2)
  ctx.fill()
}

const DRAW_FNS: Record<string, (ctx: CanvasRenderingContext2D) => void> = {
  sun: drawSun,
  earth: drawEarth,
  moon: drawMoon,
  mercury: drawMercury,
  venus: drawVenus,
  mars: drawMars,
  jupiter: drawJupiter,
  saturn: drawSaturn,
  uranus: drawUranus,
  neptune: drawNeptune,
  pluto: drawPluto,
}

const _cache: Record<string, THREE.CanvasTexture> = {}

export function getPlanetTexture(key: string): THREE.CanvasTexture | null {
  const fn = DRAW_FNS[key]
  if (!fn) return null
  if (!_cache[key]) {
    _cache[key] = makeTexture(fn)
  }
  return _cache[key]
}
