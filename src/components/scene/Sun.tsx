import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_SIZES } from '../../constants/scales'

function makeGlowTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const c = size / 2
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c)
  grad.addColorStop(0,   'rgba(255, 240, 140, 0.9)')
  grad.addColorStop(0.2, 'rgba(255, 200,  60, 0.55)')
  grad.addColorStop(0.55,'rgba(255, 150,  20, 0.18)')
  grad.addColorStop(1,   'rgba(255, 100,   0, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

export default function Sun({ onClick }: { onClick?: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowTexture = useMemo(makeGlowTexture, [])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.03
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={2} distance={100} decay={0.5} />
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[PLANET_SIZES.sun, 32, 32]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      <sprite scale={[3.5, 3.5, 1]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} />
      </sprite>
    </group>
  )
}
