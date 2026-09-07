import { useMemo } from "react";
import { Sparkles, Stars } from "@react-three/drei";

export default function FacilityStructure() {
  const pillars = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const z = 18 - i * 3.2;
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (4.5 + (i % 3) * 0.8);
      const h = 4.0 + (i % 4) * 1.5;
      const isAccent = i % 4 === 0;
      return { id: i, x, z, h, isAccent };
    });
  }, []);

  return (
    <group>
      {/* Reflective Dark Floor Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, -20]}>
        <planeGeometry args={[120, 120, 1, 1]} />
        <meshStandardMaterial color="#03070d" metalness={0.92} roughness={0.42} />
      </mesh>
      <gridHelper args={[100, 80, "#174159", "#081521"]} position={[0, -1.78, -20]} />

      {/* Architectural Pylon Array */}
      {pillars.map((p) => (
        <mesh key={p.id} position={[p.x, p.h / 2 - 1.8, p.z]}>
          <boxGeometry args={[0.16, p.h, 0.16]} />
          <meshStandardMaterial
            color={p.isAccent ? "#3fd5f4" : "#0d1b26"}
            emissive={p.isAccent ? "#0b5e7b" : "#02070c"}
            emissiveIntensity={p.isAccent ? 1.6 : 0.2}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Atmospheric Particles & Distant Stars */}
      <Sparkles count={350} scale={[25, 12, 50]} size={1.2} speed={0.15} opacity={0.4} color="#3fd5f4" />
      <Stars radius={45} depth={30} count={1200} factor={1.4} saturation={0} fade />
    </group>
  );
}
