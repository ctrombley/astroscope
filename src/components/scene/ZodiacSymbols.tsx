import { useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { SIGNS, SIGN_SYMBOLS } from '@ctrombley/astrokit'
import { ELEMENT_COLORS } from '../../constants/colors'
import { ZODIAC_RING_RADIUS } from '../../constants/scales'

// \uFE0E is Variation Selector-15: forces text (non-emoji) rendering
const TEXT_VS = '\uFE0E'
const SYMBOL_RADIUS = ZODIAC_RING_RADIUS + 6

function makeSymbolTexture(symbol: string, color: string): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const font = `300px 'Segoe UI Symbol', 'Apple Symbols', 'Noto Sans Symbols', sans-serif`
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.shadowColor = color
  ctx.shadowBlur = 60
  ctx.fillStyle = color
  ctx.globalAlpha = 0.35
  ctx.fillText(symbol + TEXT_VS, size / 2, size / 2)

  ctx.shadowBlur = 20
  ctx.globalAlpha = 0.55
  ctx.fillText(symbol + TEXT_VS, size / 2, size / 2)

  ctx.shadowBlur = 0
  ctx.globalAlpha = 0.75
  ctx.fillText(symbol + TEXT_VS, size / 2, size / 2)

  return new THREE.CanvasTexture(canvas)
}

function ZodiacSprite({
  name, symbol, color, position,
}: {
  name: string
  symbol: string
  color: string
  position: [number, number, number]
}) {
  const [hovered, setHovered] = useState(false)
  const texture = useMemo(() => makeSymbolTexture(symbol, color), [symbol, color])

  return (
    <sprite
      position={position}
      scale={[5, 5, 1]}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerLeave={() => setHovered(false)}
    >
      <spriteMaterial
        map={texture}
        transparent
        opacity={hovered ? 0.6 : 0.28}
        depthWrite={false}
      />
      {hovered && (
        <Html
          position={[0, 3.5, 0]}
          center
          distanceFactor={35}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            color,
            fontSize: '11px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
            textShadow: '0 0 6px #000, 0 0 14px #000',
          }}>
            {name}
          </div>
        </Html>
      )}
    </sprite>
  )
}

export default function ZodiacSymbols() {
  return (
    <group>
      {SIGNS.map((sign, i) => {
        const midAngleRad = ((i * 30 + 15) * Math.PI) / 180
        const color = ELEMENT_COLORS[sign.element] ?? '#888888'
        const position: [number, number, number] = [
          Math.cos(midAngleRad) * SYMBOL_RADIUS,
          0,
          -Math.sin(midAngleRad) * SYMBOL_RADIUS,
        ]
        return (
          <ZodiacSprite
            key={sign.name}
            name={sign.name}
            symbol={SIGN_SYMBOLS[i]!}
            color={color}
            position={position}
          />
        )
      })}
    </group>
  )
}
