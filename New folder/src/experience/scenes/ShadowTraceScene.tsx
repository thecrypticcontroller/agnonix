import TrajectoryRail from "../objects/TrajectoryRail";
import { TraceStep } from "../../content/profile";

interface ShadowTraceSceneProps {
  scrollProgress: number;
  activeStepIndex: number;
  onHoverStep: (step: TraceStep | null) => void;
}

export default function ShadowTraceScene({ activeStepIndex, onHoverStep }: ShadowTraceSceneProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 3D Agent Safety Trajectory Rail & Step Nodes */}
      <TrajectoryRail activeStepIndex={activeStepIndex} onHoverStep={onHoverStep} />
    </group>
  );
}
