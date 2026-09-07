import { experienceLog } from "../../content/profile";

export default function BuildLogScene() {
  return (
    <group position={[0, 0, 0]}>
      {experienceLog.map((exp, i) => {
        const z = -34.0 - i * 3.5;
        const side = i % 2 === 0 ? -1.8 : 1.8;
        return (
          <group key={exp.year} position={[side, 0.4, z]}>
            <mesh>
              <boxGeometry args={[0.3, 1.4, 0.3]} />
              <meshStandardMaterial
                color="#3fd5f4"
                emissive="#0b5e7b"
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
