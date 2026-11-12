'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import type * as THREE from 'three';

function seeded(i: number, seed: number) {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function Swarm({ count, size, speed, color, spread }: { count: number; size: number; speed: number; color: string; spread: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seeded(i, 1) - 0.5) * spread;
      pos[i * 3 + 1] = (seeded(i, 2) - 0.5) * spread;
      pos[i * 3 + 2] = (seeded(i, 3) - 0.5) * spread;
    }
    return pos;
  }, [count, spread]);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= (delta / 10) * speed;
    ref.current.rotation.y -= (delta / 15) * speed;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={size} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

export default function ParticleField(props: { count: number; size: number; speed: number; color: string; spread: number; background: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.75]} style={{ background: props.background }} aria-label="Particle field">
      <Swarm {...props} />
    </Canvas>
  );
}
