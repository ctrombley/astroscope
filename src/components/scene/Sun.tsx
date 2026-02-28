import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_SIZES } from '../../constants/scales'

export default function Sun({ onClick }: { onClick?: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Gentle pulse
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
      {/* Glow sprite */}
      <sprite scale={[2, 2, 1]}>
        <spriteMaterial
          color="#FFD700"
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </sprite>
    </group>
  )
}
