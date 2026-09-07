import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";

interface CinematicEffectsProps {
  aberrationProgress?: number;
}

export default function CinematicEffects({ aberrationProgress = 0 }: CinematicEffectsProps) {
  const offsetVector = new THREE.Vector2(
    0.001 + aberrationProgress * 0.007,
    0.001 + aberrationProgress * 0.007
  );

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={1.2 + aberrationProgress * 1.5}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.7}
        mipmapBlur
      />
      <DepthOfField focusDistance={0.015} focalLength={0.06} bokehScale={2.4} />
      <Vignette darkness={0.76} eskil={false} />
      {aberrationProgress > 0.05 ? (
        <ChromaticAberration offset={offsetVector} radialModulation={false} modulationOffset={0} />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
