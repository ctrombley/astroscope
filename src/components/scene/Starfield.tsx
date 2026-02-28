import { useMemo } from 'react'
import * as THREE from 'three'
import { bvToColor } from '../../utils/celestialCoords'

// Seeded pseudo-random so the starfield is stable across renders
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

export default function Starfield({ count = 4500 }: { count?: number }) {
  const { positions, colors, sizes } = useMemo(() => {
    const rand = mulberry32(0xdeadbeef)
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Uniform random point on sphere
      const theta = rand() * Math.PI * 2
      const phi   = Math.acos(2 * rand() - 1)
      const r     = 120 + rand() * 30
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      // Random B-V color index — mostly white/pale yellow, occasional blue or orange
      const bv = rand() * 1.4 - 0.2
      const [r8, g8, b8] = bvToColor(bv)
      colors[i * 3]     = r8 / 255
      colors[i * 3 + 1] = g8 / 255
      colors[i * 3 + 2] = b8 / 255

      // Apparent magnitude: mostly faint, a few bright
      const vmag = 2 + rand() * 4.5
      sizes[i] = Math.max(0.3, 4.5 * Math.pow(10, -vmag * 0.12))
    }

    return { positions, colors, sizes }
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position"  args={[positions, 3]} />
        <bufferAttribute attach="attributes-starColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size"      args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`
          attribute float size;
          attribute vec3 starColor;
          varying vec3 vColor;
          void main() {
            vColor = starColor;
            gl_PointSize = size * projectionMatrix[1][1] * 0.8;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.15, 0.5, d);
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  )
}
