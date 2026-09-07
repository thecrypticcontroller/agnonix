import { Float } from "@react-three/drei";

export default function ArrivalScene() {
  return (
    <group position={[0, 0, 12]}>
      {/* Entrance Arch Lights */}
      <spotLight position={[-4, 5, 2]} color="#3fd5f4" intensity={2.5} angle={0.6} penumbra={0.5} />
      <spotLight position={[4, 5, 2]} color="#3fd5f4" intensity={2.5} angle={0.6} penumbra={0.5} />

      {/* Floating Spatial Geometric Entrance Marker */}
      <Float speed={0.8} floatIntensity={0.3}>
        <mesh position={[0, 3.2, -2]}>
          <boxGeometry args={[6.0, 0.04, 0.04]} />
          <meshBasicMaterial color="#3fd5f4" transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  );
}
