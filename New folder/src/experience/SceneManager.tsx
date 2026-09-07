import ArrivalScene from "./scenes/ArrivalScene";
import AICoreScene from "./scenes/AICoreScene";
import ShadowTraceScene from "./scenes/ShadowTraceScene";
import ProjectWorldScene from "./scenes/ProjectWorldScene";
import EngineeringScene from "./scenes/EngineeringScene";
import BuildLogScene from "./scenes/BuildLogScene";
import ShutdownScene from "./scenes/ShutdownScene";
import FacilityStructure from "./objects/FacilityStructure";
import { TraceStep } from "../content/profile";

interface SceneManagerProps {
  scrollProgress: number;
  activeStepIndex: number;
  onHoverStep: (step: TraceStep | null) => void;
  activeProjectIndex: number;
  onSelectProject: (index: number) => void;
}

export default function SceneManager({
  scrollProgress,
  activeStepIndex,
  onHoverStep,
  activeProjectIndex,
  onSelectProject
}: SceneManagerProps) {
  return (
    <group>
      {/* Universal Architectural Facility Background */}
      <FacilityStructure />

      {/* Chapter 01: ARRIVAL */}
      <ArrivalScene />

      {/* Chapter 02: AI CORE */}
      <AICoreScene scrollProgress={scrollProgress} />

      {/* Chapter 03: SHADOWTRACE SIGNATURE SCENE */}
      <ShadowTraceScene
        scrollProgress={scrollProgress}
        activeStepIndex={activeStepIndex}
        onHoverStep={onHoverStep}
      />

      {/* Chapter 04: PROJECT WORLDS */}
      <ProjectWorldScene
        activeProjectIndex={activeProjectIndex}
        onSelectProject={onSelectProject}
      />

      {/* Chapter 05: ENGINEERING NETWORK */}
      <EngineeringScene />

      {/* Chapter 06: BUILD LOG */}
      <BuildLogScene />

      {/* Chapter 07 & 08: CONNECTION & SHUTDOWN */}
      <ShutdownScene />
    </group>
  );
}
