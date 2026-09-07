import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { trajectory } from "../data/profile";

function Core() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.14;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[0.95, 2]} />
        <meshStandardMaterial color="#75d8ff" emissive="#0a79b7" emissiveIntensity={0.55} metalness={0.75} roughness={0.22} wireframe />
      </mesh>
      <mesh scale={0.62}>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshBasicMaterial color="#e7f6ff" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function TrajectoryScene() {
  const points = useMemo(() => {
    let x = -3;
    return trajectory.map((item, index) => {
      if (index > 0) x += 0.65 + item.delta * 2.15;
      return new THREE.Vector3(
        x,
        (item.drift - 0.35) * 4,
        Math.sin(index * 0.9) * 0.55
      );
    });
  }, []);

  return (
    <>
      <color attach="background" args={["#05070b"]} />
      <fog attach="fog" args={["#05070b", 7, 18]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />
      <pointLight position={[1, 2, 2]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[4, -1, 1]} intensity={0.8} color="#f8c36a" />
      <Sparkles count={180} scale={[16, 9, 10]} size={1.1} speed={0.12} opacity={0.35} />

      <Float speed={0.45} rotationIntensity={0.08} floatIntensity={0.16}>
        <Core />
      </Float>

      <Line points={points} color="#4cc9f0" transparent opacity={0.55} lineWidth={1} />
      {points.map((p, i) => (
        <group key={trajectory[i].step} position={p}>
          <mesh scale={trajectory[i].flagged ? 1.25 : 0.9}>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshStandardMaterial
              color={trajectory[i].flagged ? "#f4bf62" : "#4cc9f0"}
              emissive={trajectory[i].flagged ? "#925e14" : "#0b79b5"}
              emissiveIntensity={1.6}
            />
          </mesh>
          {trajectory[i].flagged && (
            <mesh scale={1.65}>
              <ringGeometry args={[0.15, 0.19, 40]} />
              <meshBasicMaterial color="#f4bf62" transparent opacity={0.28} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

export default function Scene() {
  return (
    <div className="scene">
      <Canvas camera={{ position: [0, 0.4, 9], fov: 48 }} dpr={[1, 1.5]}>
        <TrajectoryScene />
      </Canvas>
    </div>
  );
}
