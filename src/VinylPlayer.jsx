import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';

function Vinyl() {
  const vinylRef = useRef();
  useFrame(() => {
    if (vinylRef.current) vinylRef.current.rotation.y += 0.01;
  });

  return (
    <group scale={0.9}>
      {/* Rounded Base */}
      <RoundedBox
        args={[6, 0.3, 6]}
        radius={0.15}
        smoothness={6}
        position={[0, -0.15, 0]}
      >
        <meshStandardMaterial color="#d1d1d1" />
      </RoundedBox>

      {/* Spinning Vinyl */}
      <group ref={vinylRef} position={[0, 0.05, 0]}>
        <mesh>
          <cylinderGeometry args={[2, 2, 0.1, 64]} />
          <meshStandardMaterial color="black" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.051, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
          <meshStandardMaterial color="#cfc6b4" />
        </mesh>
      </group>

      {/* Top-left detail (flush) */}
      <group position={[-2.5, 0.01, 2.5]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
          <meshStandardMaterial color="#d0d0d0" />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          <meshStandardMaterial color="#999" />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Tonearm */}
      <group position={[2, 0.05, -2]}>
        {/* Vertical post */}
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#bbb" />
        </mesh>
        {/* Horizontal arm */}
        <mesh
          position={[0.6, 0.15, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.05, 0.05, 1.2, 16]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
        {/* Needle head + notch */}
        <group position={[1.2, 0.15, 0]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 32]} />
            <meshStandardMaterial color="#777" />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <coneGeometry args={[0.03, 0.05, 12]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function VinylPlayer() {
  return (
    <Canvas
      camera={{ position: [0, 3.5, 8], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[0, 5, 5]} intensity={1.2} />
      <pointLight position={[0, 5, 0]} intensity={0.8} />

      <Vinyl />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
