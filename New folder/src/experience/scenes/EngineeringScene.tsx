import { useMemo } from "react";
import { engineeringNetwork } from "../../content/profile";

export default function EngineeringScene() {
  const nodes = useMemo(() => {
    return engineeringNetwork.techNodes.map((tech, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = (col - 1.5) * 2.6;
      const z = -22.0 - row * 2.2;
      const y = Math.sin(i) * 0.4;
      return { tech, x, y, z };
    });
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {nodes.map(({ tech, x, y, z }) => (
        <mesh key={tech.id} position={[x, y, z]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color="#3fd5f4"
            emissive="#0b789e"
            emissiveIntensity={1.8}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
