import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Spheres() {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.2;
      outerRef.current.rotation.x = t * 0.1;
      outerRef.current.position.y = Math.sin(t) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.1;
      innerRef.current.rotation.x = -t * 0.2;
      innerRef.current.position.y = Math.sin(t) * 0.2;
    }
  });

  return (
    <group>
      {/* Outer floating sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2, 4]} />
        <meshStandardMaterial color="#2D6A2D" wireframe />
      </mesh>

      {/* Inner solid sphere */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <meshStandardMaterial color="#8B1A1A" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef();
  
  const particles = Array.from({ length: 30 }).map(() => ({
    position: [
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8
    ],
    color: Math.random() > 0.5 ? '#2D6A2D' : '#8B1A1A',
    speed: Math.random() * 0.02
  }));

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </group>
  );
}

function Particle({ position, color, speed }) {
  const ref = useRef();
  const randomOffset = Math.random() * Math.PI * 2;
  
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + randomOffset;
    if (ref.current) {
      ref.current.position.y += Math.sin(t) * 0.01;
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight color="#f5d49a" position={[5, 5, 5]} intensity={1} />
        <Spheres />
        <FloatingParticles />
        <OrbitControls enableZoom={false} autoRotate={false} />
        <Stars count={200} depth={50} fade />
      </Canvas>
    </div>
  );
}
