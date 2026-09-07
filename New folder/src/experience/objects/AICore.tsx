import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface AICoreProps {
  alertProgress?: number;
}

export default function AICore({ alertProgress = 0 }: AICoreProps) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.25;
      outerRef.current.rotation.x = Math.sin(time * 0.3) * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.4;
      innerRef.current.rotation.z = Math.cos(time * 0.4) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
      ringRef.current.rotation.x = Math.sin(time * 0.2) * 0.3;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 4.0 + Math.sin(time * 3.0) * 1.2 + alertProgress * 4.0;
    }
  });

  const normalColor = new THREE.Color("#3fd5f4");
  const alertColor = new THREE.Color("#f5c56d");
  const currentColor = normalColor.clone().lerp(alertColor, alertProgress);

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={[0, 0.5, 0]}>
        {/* Core Point Light */}
        <pointLight ref={lightRef} color={currentColor} intensity={4.5} distance={14} />

        {/* Outer Polyhedral Shell */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.4, 2]} />
          <meshStandardMaterial
            color={currentColor}
            emissive={currentColor}
            emissiveIntensity={1.4 + alertProgress * 0.8}
            wireframe
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Inner Solid Geometric Node */}
        <mesh ref={innerRef} scale={0.65}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial
            color={currentColor}
            emissive={currentColor}
            emissiveIntensity={2.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Orbital Ring Data Structures */}
        <group ref={ringRef}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.2, 0.015, 16, 64]} />
            <meshBasicMaterial color={currentColor} transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[2.7, 0.012, 16, 64]} />
            <meshBasicMaterial color={currentColor} transparent opacity={0.35} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
