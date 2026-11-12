'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UNIVERSES } from '@/lib/universes';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshTransmissionMaterial, Edges } from '@react-three/drei';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { useTransition } from '@/components/transitions/transition-context';

// --- Universe Objects ---

function MinimalUniverse({ position, onClick, onHover }: { position: [number, number, number]; onClick: () => void; onHover: (h: boolean, n: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2} position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); onHover(true, 'Minimal'); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(false); onHover(false, ''); document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color={hovered ? "#ffffff" : "#e0e0e0"} roughness={0.1} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function GlassUniverse({ position, onClick, onHover }: { position: [number, number, number]; onClick: () => void; onHover: (h: boolean, n: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); onHover(true, 'Glass'); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(false); onHover(false, ''); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={1}
          anisotropy={0.1}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color={hovered ? "#a8c0ff" : "#ffffff"}
        />
      </mesh>
    </Float>
  );
}

function NeonUniverse({ position, onClick, onHover }: { position: [number, number, number]; onClick: () => void; onHover: (h: boolean, n: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); onHover(true, 'Neon'); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(false); onHover(false, ''); document.body.style.cursor = 'auto'; }}
      >
        <torusKnotGeometry args={[0.8, 0.2, 128, 32]} />
        <meshBasicMaterial color={hovered ? "#00ffff" : "#ff3dd8"} wireframe />
        {hovered && (
          <pointLight color="#00ffff" intensity={5} distance={5} />
        )}
      </mesh>
    </Float>
  );
}

function BrutalistUniverse({ position, onClick, onHover }: { position: [number, number, number]; onClick: () => void; onHover: (h: boolean, n: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1} position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); onHover(true, 'Brutalist'); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(false); onHover(false, ''); document.body.style.cursor = 'auto'; }}
      >
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={hovered ? "#ff3300" : "#222222"} roughness={0.9} metalness={0.1} />
        <Edges scale={1.05} threshold={15} color={hovered ? "black" : "white"} />
      </mesh>
    </Float>
  );
}

// --- Camera Controller for Entry Animation ---

function CameraController({ targetPosition, isEntering }: { targetPosition: THREE.Vector3 | null, isEntering: boolean }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (isEntering && targetPosition) {
      camera.position.lerp(new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z + 1), 0.05);
      const currentLookAt = new THREE.Vector3(0, 0, 0);
      camera.lookAt(currentLookAt.lerp(targetPosition, 0.05));
    }
  });

  return null;
}

// --- Main Scene ---

export default function PortalContent() {
  const [hoveredUniverse, setHoveredUniverse] = useState<string>('');
  const [entering, setEntering] = useState(false);
  const [targetPos, setTargetPos] = useState<THREE.Vector3 | null>(null);
  const router = useRouter();
  const { setTransitionType } = useTransition();

  const handleEnter = (name: string, position: [number, number, number]) => {
    if (entering) return;
    setEntering(true);
    setTargetPos(new THREE.Vector3(...position));
    
    setTimeout(() => {
      setTransitionType('gradient');
      router.push(`/universes/${name.toLowerCase()}`);
    }, 1500);
  };

  const POSITIONS: Record<string, [number, number, number]> = { Minimal: [-3, 2, 0], Glass: [3, 2, 0], Neon: [-3, -2, 0], Brutalist: [3, -2, 0] };

  // Keyboard shortcuts 1–4 mirror the 3D objects.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      const u = UNIVERSES[Number(e.key) - 1];
      if (u) handleEnter(u.name, POSITIONS[u.name]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="w-full h-[calc(100vh-6rem)] bg-black relative overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-24 left-0 w-full text-center z-10 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white tracking-tight drop-shadow-lg"
        >
          {hoveredUniverse || 'Choose a universe'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: hoveredUniverse ? 1 : 0.5 }}
          className="text-white/75 mt-4 text-base"
        >
          {hoveredUniverse ? 'Click to open its showcase' : 'Drag to orbit. Click an object, or press 1–4.'}
        </motion.p>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff3dd8" />
        <pointLight position={[10, -10, -5]} intensity={0.5} color="#00ffff" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <MinimalUniverse 
          position={[-3, 2, 0]} 
          onHover={(h: boolean, n: string) => setHoveredUniverse(n)} 
          onClick={() => handleEnter('Minimal', [-3, 2, 0])} 
        />
        
        <GlassUniverse 
          position={[3, 2, 0]} 
          onHover={(h: boolean, n: string) => setHoveredUniverse(n)} 
          onClick={() => handleEnter('Glass', [3, 2, 0])} 
        />
        
        <NeonUniverse 
          position={[-3, -2, 0]} 
          onHover={(h: boolean, n: string) => setHoveredUniverse(n)} 
          onClick={() => handleEnter('Neon', [-3, -2, 0])} 
        />
        
        <BrutalistUniverse 
          position={[3, -2, 0]} 
          onHover={(h: boolean, n: string) => setHoveredUniverse(n)} 
          onClick={() => handleEnter('Brutalist', [3, -2, 0])} 
        />

        {!entering && <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />}
        <CameraController targetPosition={targetPos} isEntering={entering} />
      </Canvas>

      {/* Accessible controls — the same actions as the 3D objects */}
      <nav aria-label="Universes" className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-2xl border border-white/15 bg-black/60 p-2 backdrop-blur-md">
        {UNIVERSES.map((u, i) => (
          <button
            key={u.id}
            type="button"
            onClick={() => handleEnter(u.name, POSITIONS[u.name])}
            onMouseEnter={() => setHoveredUniverse(u.name)}
            onMouseLeave={() => setHoveredUniverse('')}
            onFocus={() => setHoveredUniverse(u.name)}
            onBlur={() => setHoveredUniverse('')}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-left text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <kbd className="flex h-6 w-6 items-center justify-center rounded-md border border-white/25 font-mono text-[11px]">{i + 1}</kbd>
            <span>
              <span className="block text-sm font-semibold">{u.name}</span>
              <span className="block text-xs text-white/65">{u.tagline}</span>
            </span>
          </button>
        ))}
      </nav>

      {/* Entry Flash Overlay */}
      {entering && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeIn" }}
          className="absolute inset-0 bg-white z-50 pointer-events-none"
        />
      )}
    </div>
  );
}
