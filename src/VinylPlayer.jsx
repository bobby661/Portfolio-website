import React, { Suspense, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useSpring } from '@react-spring/three';

const VinylModel = forwardRef((props, ref) => {
  const { scene } = useGLTF('/models/vinyl.glb');
  const modelRef = useRef();
  const lidRef = useRef();

  const initialAngle = Math.PI / 3; // 60 degrees closed position
  const [springs, api] = useSpring(() => ({
    rotationX: 0, // Start at 0 and we'll add initialAngle
    immediate: true,
    config: { mass: 1, tension: 120, friction: 14 },
  }));

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name) {
        console.log('Child Name:', child.name, '| Type:', child.type);
        if (child.name === 'dust_cover') {
          lidRef.current = child;
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.003; // slow spin
    }
    if (lidRef.current) {
      lidRef.current.rotation.z = initialAngle - springs.rotationX.get(); // ✅ offset from initial closed
    }
  });

  useImperativeHandle(ref, () => ({
    setLidRotation: (angle) => {
      api.start({ rotationX: angle }); // Rotate towards open
    },
  }));

  return (
    <group ref={modelRef} scale={1.2}>
      <primitive object={scene} />
    </group>
  );
});

export default function VinylPlayer({ vinylRef }) {
  return (
    <Canvas
      camera={{ position: [0, 3.5, 8], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent', height: '100vh', width: '100%' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <VinylModel ref={vinylRef} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
