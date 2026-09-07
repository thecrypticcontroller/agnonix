import AICore from "../objects/AICore";

interface AICoreSceneProps {
  scrollProgress: number;
}

export default function AICoreScene({ scrollProgress }: AICoreSceneProps) {
  // Alert progress scales when camera approaches core center
  const alertProgress = scrollProgress > 0.28 && scrollProgress < 0.36 ? 0.3 : 0.0;

  return (
    <group position={[0, 0, 8.5]}>
      <AICore alertProgress={alertProgress} />
    </group>
  );
}
