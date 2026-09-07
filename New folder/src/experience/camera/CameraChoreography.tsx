import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface CameraChoreographyProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  onSectionChange?: (section: string) => void;
}

export default function CameraChoreography({ scrollProgress, mousePos }: CameraChoreographyProps) {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0.5, 0));
  const targetPos = useRef(new THREE.Vector3(0, 0.5, 24));
  const targetLook = useRef(new THREE.Vector3(0, 0.5, 0));

  useFrame((_, delta) => {
    const p = scrollProgress; // 0.0 to 1.0

    // Compute Camera Path & Target based on Journey Timeline
    if (p < 0.12) {
      // BOOT & ARRIVAL
      const localP = p / 0.12;
      targetPos.current.set(
        Math.sin(localP * Math.PI) * 0.8 + mousePos.x * 0.4,
        1.0 - localP * 0.3 + mousePos.y * 0.3,
        22.0 - localP * 7.5
      );
      targetLook.current.set(0, 0.4, 0);
    } else if (p < 0.32) {
      // AI CORE APPROACH & ORBIT
      const localP = (p - 0.12) / 0.20;
      targetPos.current.set(
        Math.sin(localP * Math.PI * 1.5) * 2.2 + mousePos.x * 0.5,
        0.7 + Math.cos(localP * Math.PI) * 0.3 + mousePos.y * 0.3,
        14.5 - localP * 6.0
      );
      targetLook.current.set(0, 0.5, 0);
    } else if (p < 0.55) {
      // SHADOWTRACE CAMERA DIVE & LATERAL TRACKING
      const localP = (p - 0.32) / 0.23;
      // Step 3 Anomaly spike at localP around 0.4 - 0.6
      const isAnomalyZone = localP > 0.35 && localP < 0.65;
      const cameraX = -3.8 + localP * 7.5 + (isAnomalyZone ? 0.6 : 0);
      const cameraY = 1.2 + (isAnomalyZone ? 0.8 : 0) + mousePos.y * 0.2;
      const cameraZ = 3.8 - localP * 4.5;
      
      targetPos.current.set(cameraX, cameraY, cameraZ);
      targetLook.current.set(cameraX + 1.2, 0.4 + (isAnomalyZone ? 0.6 : 0), cameraZ - 2.0);
    } else if (p < 0.72) {
      // PROJECT WORLDS CHAMBER
      const localP = (p - 0.55) / 0.17;
      targetPos.current.set(
        Math.sin(localP * Math.PI * 0.8) * 3.0,
        1.8,
        -5.0 - localP * 8.0
      );
      targetLook.current.set(0, 0.5, -8.0 - localP * 8.0);
    } else if (p < 0.86) {
      // ENGINEERING NETWORK OVERHEAD TILT
      const localP = (p - 0.72) / 0.14;
      targetPos.current.set(0, 6.5 + localP * 1.5, -18.0 - localP * 6.0);
      targetLook.current.set(0, 0.0, -22.0 - localP * 6.0);
    } else if (p < 0.95) {
      // BUILD LOG CORRIDOR & CONNECTION
      const localP = (p - 0.86) / 0.09;
      targetPos.current.set(0, 0.8, -32.0 - localP * 12.0);
      targetLook.current.set(0, 0.5, -38.0 - localP * 12.0);
    } else {
      // SHUTDOWN RETREAT
      const localP = (p - 0.95) / 0.05;
      targetPos.current.set(0, 2.5 + localP * 3.0, -48.0 - localP * 12.0);
      targetLook.current.set(0, 0.0, -48.0);
    }

    // Smooth Exponential Lerp
    const ease = 1 - Math.exp(-3.2 * delta);
    camera.position.lerp(targetPos.current, ease);
    currentTarget.current.lerp(targetLook.current, ease);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
