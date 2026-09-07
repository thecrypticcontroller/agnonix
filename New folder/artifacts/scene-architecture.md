# Scene Architecture Specification

**Project:** DEVESH K R // THE SYSTEM  
**Canvas Paradigm:** Single Persistent WebGL Canvas with Modular Scene Manager

---

## 1. Directory Structure

```
src/
├── app/
│   ├── App.tsx
│   ├── BootSequence.tsx
│   ├── HUD.tsx
│   ├── SoundController.ts
│   └── CustomCursor.tsx
├── content/
│   └── profile.ts
├── experience/
│   ├── ExperienceCanvas.tsx
│   ├── SceneManager.tsx
│   ├── camera/
│   │   ├── CinematicCamera.ts
│   │   └── CameraTargets.ts
│   ├── post/
│   │   └── CinematicEffects.tsx
│   ├── scenes/
│   │   ├── BootScene.tsx
│   │   ├── ArrivalScene.tsx
│   │   ├── AICoreScene.tsx
│   │   ├── ShadowTraceScene.tsx
│   │   ├── ProjectWorldScene.tsx
│   │   ├── EngineeringScene.tsx
│   │   ├── BuildLogScene.tsx
│   │   ├── ConnectionScene.tsx
│   │   └── ShutdownScene.tsx
│   ├── objects/
│   │   ├── AICore.tsx
│   │   ├── TrajectoryRail.tsx
│   │   ├── ProjectStation.tsx
│   │   ├── NetworkNodes.tsx
│   │   └── FacilityStructure.tsx
│   ├── particles/
│   │   └── ParticleField.tsx
│   └── shaders/
│       └── Shaders.ts
└── styles/
    └── index.css
```

---

## 2. Canvas & Render Loop Responsibilities

1. **Persistent R3F Canvas:** `<Canvas dpr={[1, 2]} gl={{ antialias: true, powerPreference: "high-performance" }}>`
2. **Unified Frame Loop (`useFrame`):** Driven by `CinematicCamera.ts` which reads smooth scroll progress from Lenis and lerps camera position, target vector, and post-processing intensity parameters.
3. **Frustum Culling & Visibility Management:** Active scenes render geometry based on camera Z depth window thresholds to prevent GPU overload.
