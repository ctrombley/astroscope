import { useMemo, useEffect, useState, useRef, useCallback } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { dateToJD } from '@ctrombley/astrokit'
import { CATALOG_STARS, generateBackgroundStars } from '../../data/stars'
import { CONSTELLATIONS, NAMED_BRIGHT_STARS } from '../../data/constellations'
import {
  eclipticToEquatorial,
  equatorialToCartesian,
  bvToColor,
  lstDeg,
  OBLIQUITY_DEG,
} from '../../utils/celestialCoords'
import { PLANET_COLORS } from '../../constants/colors'
import type { PlanetPosition } from '../../types'

const SKY_RADIUS = 900
const DEG = Math.PI / 180

const ZODIAC_SIGNS = [
  { name: 'Aries',       lon: 15 },
  { name: 'Taurus',      lon: 45 },
  { name: 'Gemini',      lon: 75 },
  { name: 'Cancer',      lon: 105 },
  { name: 'Leo',         lon: 135 },
  { name: 'Virgo',       lon: 165 },
  { name: 'Libra',       lon: 195 },
  { name: 'Scorpio',     lon: 225 },
  { name: 'Sagittarius', lon: 255 },
  { name: 'Capricorn',   lon: 285 },
  { name: 'Aquarius',    lon: 315 },
  { name: 'Pisces',      lon: 345 },
]

function Stars() {
  const { positions, colors, sizes } = useMemo(() => {
    const bgStars = generateBackgroundStars(3500)
    const all: { ra: number; dec: number; vmag: number; bv: number }[] = []

    for (const [ra, dec, vmag, bv] of CATALOG_STARS) {
      all.push({ ra, dec, vmag, bv })
    }
    for (const [ra, dec, vmag] of bgStars) {
      all.push({ ra, dec, vmag, bv: 0.5 + (vmag - 4) * 0.15 })
    }

    const positions = new Float32Array(all.length * 3)
    const colors    = new Float32Array(all.length * 3)
    const sizes     = new Float32Array(all.length)

    for (let i = 0; i < all.length; i++) {
      const star = all[i]
      if (!star) continue
      const { ra, dec, vmag, bv } = star
      const [x, y, z] = equatorialToCartesian(ra, dec, SKY_RADIUS)
      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const [r, g, b] = bvToColor(bv)
      colors[i * 3]     = r / 255
      colors[i * 3 + 1] = g / 255
      colors[i * 3 + 2] = b / 255

      sizes[i] = Math.max(0.3, 5.5 * Math.pow(10, -vmag * 0.12))
    }

    return { positions, colors, sizes }
  }, [])

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
            float alpha = 1.0 - smoothstep(0.2, 0.5, d);
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  )
}

function EclipticCircle() {
  const points = useMemo(() => {
    const pts: number[] = []
    const ε = OBLIQUITY_DEG * DEG
    for (let i = 0; i <= 256; i++) {
      const λ = (i / 256) * Math.PI * 2
      const x = SKY_RADIUS * Math.cos(λ)
      const yEcl = SKY_RADIUS * Math.sin(λ)
      pts.push(x, yEcl * Math.sin(ε), -yEcl * Math.cos(ε))
    }
    return new Float32Array(pts)
  }, [])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#3a5a90" transparent opacity={0.4} depthWrite={false} />
    </line>
  )
}

function CelestialEquator() {
  const points = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i <= 256; i++) {
      const ra = (i / 256) * Math.PI * 2
      pts.push(SKY_RADIUS * Math.cos(ra), 0, -SKY_RADIUS * Math.sin(ra))
    }
    return new Float32Array(pts)
  }, [])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#304530" transparent opacity={0.25} depthWrite={false} />
    </line>
  )
}

function ZodiacLabels() {
  return (
    <>
      {ZODIAC_SIGNS.map(({ name, lon }) => {
        const { ra, dec } = eclipticToEquatorial(lon)
        const [x, y, z] = equatorialToCartesian(ra, dec, SKY_RADIUS * 0.91)
        return (
          <Html
            key={name}
            position={[x, y, z]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <div style={{
              color: 'rgba(100,140,210,0.65)',
              fontSize: '9px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              textShadow: '0 0 8px #000',
            }}>
              {name}
            </div>
          </Html>
        )
      })}
    </>
  )
}

// ─── Constellation Lines ─────────────────────────────────────────────────────

function ConstellationLines({ visible }: { visible: boolean }) {
  const geometry = useMemo(() => {
    const verts: number[] = []
    for (const con of CONSTELLATIONS) {
      for (const path of con.paths) {
        for (let i = 0; i < path.length - 1; i++) {
          const [ra0, dec0] = path[i]!
          const [ra1, dec1] = path[i + 1]!
          const [x0, y0, z0] = equatorialToCartesian(ra0, dec0, SKY_RADIUS * 0.999)
          const [x1, y1, z1] = equatorialToCartesian(ra1, dec1, SKY_RADIUS * 0.999)
          verts.push(x0, y0, z0, x1, y1, z1)
        }
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return geo
  }, [])

  if (!visible) return null

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#4060b8"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </lineSegments>
  )
}

function ConstellationNames({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <>
      {CONSTELLATIONS.map(({ name, labelRa, labelDec }) => {
        const [x, y, z] = equatorialToCartesian(labelRa, labelDec, SKY_RADIUS * 0.94)
        return (
          <Html
            key={name}
            position={[x, y, z]}
            center
            style={{ pointerEvents: 'none' }}
          >
            <div style={{
              color: 'rgba(80, 110, 190, 0.75)',
              fontSize: '8px',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: '0 0 10px #000',
            }}>
              {name}
            </div>
          </Html>
        )
      })}
    </>
  )
}

// ─── Star Name Labels ─────────────────────────────────────────────────────────

function StarNameLabel({
  ra, dec, name, showAlways,
}: {
  ra: number
  dec: number
  name: string
  showAlways: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [x, y, z] = useMemo(() => equatorialToCartesian(ra, dec, SKY_RADIUS * 0.97), [ra, dec])

  return (
    <group position={[x, y, z]}>
      {/* Invisible hit sphere — big enough to hover */}
      <mesh
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[18, 6, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {(showAlways || hovered) && (
        <Html
          position={[0, 16, 0]}
          center
          distanceFactor={SKY_RADIUS}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            color: hovered ? 'rgba(255,255,220,1)' : 'rgba(200,195,160,0.55)',
            fontSize: hovered ? '11px' : '8px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            textShadow: '0 0 8px #000',
            transition: 'color 0.15s, font-size 0.15s',
          }}>
            {name}
          </div>
        </Html>
      )}
    </group>
  )
}

function BrightStarLabels({ showAlways }: { showAlways: boolean }) {
  return (
    <>
      {NAMED_BRIGHT_STARS.map(([ra, dec, name]) => (
        <StarNameLabel
          key={name}
          ra={ra}
          dec={dec}
          name={name}
          showAlways={showAlways}
        />
      ))}
    </>
  )
}

// ─── Planets ──────────────────────────────────────────────────────────────────

interface SkyPlanetProps {
  planet: PlanetPosition
  selected: boolean
  onSelect: (key: string) => void
}

function SkyPlanet({ planet, selected, onSelect }: SkyPlanetProps) {
  const visible = ['sun', 'moon', 'mercury', 'venus', 'mars',
                   'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  if (!visible.includes(planet.key)) return null

  const { ra, dec } = eclipticToEquatorial(planet.longitudeDeg)
  const [x, y, z] = equatorialToCartesian(ra, dec, SKY_RADIUS * 0.97)
  const color = PLANET_COLORS[planet.key] ?? '#aaaaaa'
  const r = selected ? 6 : 4.5

  return (
    <group position={[x, y, z]}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(planet.key) }}>
        <sphereGeometry args={[r, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[r * 2.2, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <Html position={[0, r + 10, 0]} center distanceFactor={SKY_RADIUS} style={{ pointerEvents: 'none' }}>
        <div style={{
          color,
          fontSize: '10px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          textShadow: '0 0 8px #000',
        }}>
          {planet.symbol} {planet.name}
          {planet.retrograde && <span style={{ color: '#ff6060' }}> Rx</span>}
        </div>
      </Html>
    </group>
  )
}

// ─── FOV zoom ─────────────────────────────────────────────────────────────────

function FovController() {
  const { camera, gl } = useThree()
  const fovRef = useRef(75)

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const cam = camera as THREE.PerspectiveCamera
    fovRef.current = Math.max(10, Math.min(90, fovRef.current + e.deltaY * 0.04))
    cam.fov = fovRef.current
    cam.updateProjectionMatrix()
  }, [camera])

  useEffect(() => {
    const el = gl.domElement
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [gl.domElement, onWheel])

  return null
}

// ─── Scene ────────────────────────────────────────────────────────────────────

interface NightSkyProps {
  positions: PlanetPosition[]
  selectedPlanet: string | null
  onSelectPlanet: (key: string | null) => void
  showConstellations: boolean
  showStarNames: boolean
  date: Date
  longitude: number
}

function SkyScene({
  positions,
  selectedPlanet,
  onSelectPlanet,
  showConstellations,
  showStarNames,
  date,
  longitude,
}: NightSkyProps) {
  // Rotate the celestial sphere so the sky tracks Earth's rotation.
  // Y-rotation = π − LST_rad puts the meridian (RA = LST) facing the camera.
  const rotationY = useMemo(() => {
    const lst = lstDeg(dateToJD(date), longitude)
    return Math.PI - lst * (Math.PI / 180)
  }, [date, longitude])

  return (
    <>
      <FovController />
      <group rotation={[0, rotationY, 0]}>
        <Stars />
        <EclipticCircle />
        <CelestialEquator />
        <ZodiacLabels />
        <ConstellationLines visible={showConstellations} />
        <ConstellationNames visible={showConstellations} />
        <BrightStarLabels showAlways={showStarNames} />
        {positions.map(p => (
          <SkyPlanet
            key={p.key}
            planet={p}
            selected={selectedPlanet === p.key}
            onSelect={onSelectPlanet}
          />
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        minDistance={0.001}
        maxDistance={0.001}
        rotateSpeed={-0.5}
      />
    </>
  )
}

export default function NightSky(props: NightSkyProps) {
  return (
    <Canvas
      camera={{ position: [0.001, 0, 0], fov: 75, near: 0.0001, far: 2000 }}
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => props.onSelectPlanet(null)}
    >
      <SkyScene {...props} />
    </Canvas>
  )
}
