# Architecture Audit & Refactoring Strategy

**Project:** DEVESH K R // THE SYSTEM  
**Workspace:** `d:\Agnonix\New folder`

---

## 1. Existing Source Tree Assessment

```
d:\Agnonix\New folder\
├── index.html
├── package.json
├── src/
│   ├── App.tsx             (Basic layout + static section list + simplistic timer boot)
│   ├── main.tsx            (React root mounting)
│   ├── styles.css          (Generic dark CSS styles + flat layout rules)
│   ├── data.ts             (Partial content data, missing credentials, tech networks, profile specs)
│   └── components/
│       └── World.tsx       (Simplistic static 3D canvas with simple lerp camera & basic floor)
├── tsconfig.json
└── vite.config.ts
```

---

## 2. Refactoring Analysis

### What Should Stay
- Core dependencies: React 18, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`, `gsap`, `lenis`, `framer-motion`.
- Vite + TypeScript setup.

### What Should Change & Be Refactored
1. **Content & Data Model:** `src/data.ts` should be refactored into a canonical multi-domain content repository (`src/content/profile.ts`) matching all specification requirements: identity, contact, education, experience, credentials, 6 project worlds, engineering network graph, and verified ShadowTrace step metrics.
2. **3D Architecture:** `World.tsx` currently renders a generic static floor, simple pillars, and a single sphere. It must be refactored into a modular scene architecture:
   - `src/experience/scenes/Arrival.tsx` (Facility entrance, spatial typography, distance lights)
   - `src/experience/scenes/AICore.tsx` (Multi-layer procedural core with wireframes, energy nodes, particle flow)
   - `src/experience/scenes/ShadowTrace.tsx` (3D agent safety execution path, step nodes dynamic height from drift, delta-triggered anomaly pulse)
   - `src/experience/scenes/ProjectWorlds.tsx` (6 3D project stations with modular primitive motifs)
   - `src/experience/scenes/EngineeringNetwork.tsx` (Interactive 3D graph of skills/technologies with dependency lines)
   - `src/experience/scenes/BuildLog.tsx` (Illuminated experience stations corridor)
   - `src/experience/scenes/Shutdown.tsx` (Atmospheric decay, single light focus, final connection prompt)
3. **Camera & Scene Management:** Replace basic lerp with a dedicated `CameraManager` supporting scroll progress, scene-to-scene transitions, event triggers (ShadowTrace anomaly jump), and smooth spring damping.
4. **Post-Processing & Shaders:** Replace hardcoded static bloom with dynamic quality-aware `PostProcessing` supporting Bloom, Vignette, Depth of Field, Chromatic Aberration burst, and scanline shaders.
5. **UI & Audio:** Implement a cinematic WebGL preloader boot sequence (`BootSequence.tsx`), interactive HUD, spatial overlay labels, custom semantic cursor, and Web Audio API synthesizer for non-intrusive sound cues.

---

## 3. Structural Reorganization Target

```
src/
├── app/
│   ├── App.tsx
│   ├── BootSequence.tsx
│   ├── HUD.tsx
│   ├── SoundController.tsx
│   └── CustomCursor.tsx
├── content/
│   └── profile.ts
├── experience/
│   ├── ExperienceCanvas.tsx
│   ├── camera/
│   │   └── CameraChoreography.tsx
│   ├── postprocessing/
│   │   └── PostEffects.tsx
│   ├── scenes/
│   │   ├── ArrivalScene.tsx
│   │   ├── AICoreScene.tsx
│   │   ├── ShadowTraceScene.tsx
│   │   ├── ProjectWorldsScene.tsx
│   │   ├── EngineeringNetworkScene.tsx
│   │   ├── BuildLogScene.tsx
│   │   └── ShutdownScene.tsx
│   ├── objects/
│   │   ├── ProceduralAICore.tsx
│   │   ├── TrajectoryRail.tsx
│   │   └── ProjectStationPrimitives.tsx
│   └── materials/
│       └── Shaders.ts
└── styles/
    └── index.css
```
