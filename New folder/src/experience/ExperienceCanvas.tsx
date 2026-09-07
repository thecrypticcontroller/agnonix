import { Canvas } from "@react-three/fiber";
import CameraChoreography from "./camera/CameraChoreography";
import SceneManager from "./SceneManager";
import CinematicEffects from "./post/CinematicEffects";
import { TraceStep } from "../content/profile";

interface ExperienceCanvasProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  activeStepIndex: number;
  onHoverStep: (step: TraceStep | null) => void;
  activeProjectIndex: number;
  onSelectProject: (index: number) => void;
}

export default function ExperienceCanvas({
  scrollProgress,
  mousePos,
  activeStepIndex,
  onHoverStep,
  activeProjectIndex,
  onSelectProject
}: ExperienceCanvasProps) {
  // Step 3 (index 2) triggers chromatic aberration burst
  const aberrationProgress = scrollProgress > 0.40 && scrollProgress < 0.52 ? 0.8 : 0.0;

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0.5, 24], fov: 46 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <CameraChoreography scrollProgress={scrollProgress} mousePos={mousePos} />
        
        <ambientLight intensity={0.22} />
        <directionalLight position={[4, 8, 6]} intensity={1.2} color="#f0f7fb" />
        <pointLight position={[-6, 2, -10]} color="#0b5e7b" intensity={2.5} />

        <SceneManager
          scrollProgress={scrollProgress}
          activeStepIndex={activeStepIndex}
          onHoverStep={onHoverStep}
          activeProjectIndex={activeProjectIndex}
          onSelectProject={onSelectProject}
        />

        <CinematicEffects aberrationProgress={aberrationProgress} />
      </Canvas>
    </div>
  );
}
