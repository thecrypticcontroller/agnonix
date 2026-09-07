export default function ShutdownScene() {
  return (
    <group position={[0, 0, -48.0]}>
      {/* Central Terminal Spotlight */}
      <spotLight position={[0, 6, 0]} color="#3fd5f4" intensity={3.5} angle={0.5} penumbra={0.8} />

      {/* Terminal Podium Mesh */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[1.2, 1.6, 0.4, 32]} />
        <meshStandardMaterial color="#081420" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}
