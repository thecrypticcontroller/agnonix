import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { shadowTraceData, TraceStep } from "../../content/profile";

interface TrajectoryRailProps {
  activeStepIndex: number;
  onHoverStep: (step: TraceStep | null) => void;
}

export default function TrajectoryRail({ activeStepIndex, onHoverStep }: TrajectoryRailProps) {
  const nodesRef = useRef<THREE.Group>(null);
  const anomalyLightRef = useRef<THREE.PointLight>(null);

  // Compute node 3D positions based on drift (Y height) and delta (X/Z spatial jump)
  const nodePositions = useMemo(() => {
    let currentX = -3.8;
    return shadowTraceData.map((step, i) => {
      if (i > 0) {
        // Delta scales spatial jump! Step 3 (delta 0.76) makes the largest physical jump
        currentX += 0.8 + step.delta * 2.8;
      }
      const y = -0.4 + (step.drift - 0.3) * 3.5;
      const z = -2.0 - i * 0.8 - (step.flagged ? 0.8 : 0);
      return new THREE.Vector3(currentX, y, z);
    });
  }, []);

  // Compute line path points
  const linePoints = useMemo(() => {
    const points: number[] = [];
    nodePositions.forEach((pos) => {
      points.push(pos.x, pos.y, pos.z);
    });
    return new Float32Array(points);
  }, [nodePositions]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (anomalyLightRef.current && nodePositions[2]) {
      anomalyLightRef.current.intensity = 5.0 + Math.sin(time * 6.0) * 2.5;
    }
  });

  return (
    <group ref={nodesRef}>
      {/* Dynamic 3D Trajectory Connecting Rail */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePoints, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3fd5f4" transparent opacity={0.65} linewidth={2} />
      </line>

      {/* Point light positioned directly at Step 03 Anomaly Node */}
      {nodePositions[2] && (
        <pointLight
          ref={anomalyLightRef}
          position={nodePositions[2]}
          color="#f5c56d"
          intensity={6.0}
          distance={8}
        />
      )}

      {/* Execution Step Nodes */}
      {shadowTraceData.map((step, i) => {
        const pos = nodePositions[i];
        const isFlagged = step.flagged;
        const isActive = activeStepIndex === i;

        return (
          <group
            key={step.id}
            position={pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHoverStep(step);
            }}
            onPointerOut={() => onHoverStep(null)}
          >
            {/* Outer Pulsing Halo Mesh */}
            <mesh>
              <sphereGeometry args={[isFlagged ? 0.28 : 0.18, 24, 24]} />
              <meshStandardMaterial
                color={isFlagged ? "#f5c56d" : "#3fd5f4"}
                emissive={isFlagged ? "#e07a16" : "#0b789e"}
                emissiveIntensity={isFlagged ? 3.0 : 1.8}
                transparent
                opacity={isActive ? 1.0 : 0.85}
              />
            </mesh>

            {/* Step 3 Anomaly Pulsing Warning Ring */}
            {isFlagged && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.35, 0.45, 32]} />
                <meshBasicMaterial color="#f5c56d" transparent opacity={0.7} side={THREE.DoubleSide} />
              </mesh>
            )}

            {/* Vertical Projection Drop-Line to Floor Grid */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, 0, -1.4 - pos.y, 0]), 3]}
                />
              </bufferGeometry>
              <lineDashedMaterial
                color={isFlagged ? "#f5c56d" : "#174159"}
                dashSize={0.1}
                gapSize={0.08}
                transparent
                opacity={0.5}
              />
            </line>
          </group>
        );
      })}
    </group>
  );
}
