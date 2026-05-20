'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count = 500 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = time * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#8b5cf6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingShapes() {
  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[1.5, 32, 32]} position={[-4, 2, -2]}>
          <MeshDistortMaterial
            color="#4f46e5"
            speed={2}
            distort={0.4}
            radius={1}
            transparent
            opacity={0.15}
          />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 32, 32]} position={[5, -2, -3]}>
          <MeshDistortMaterial
            color="#7c3aed"
            speed={1.5}
            distort={0.3}
            radius={1}
            transparent
            opacity={0.1}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export function Grid3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <gridHelper args={[20, 20, '#8b5cf6', '#4f46e5']} rotation={[Math.PI / 4, 0, 0]} />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}

export function Background3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ParticleField />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}
