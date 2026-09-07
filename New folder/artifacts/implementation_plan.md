# Implementation Plan: DEVESH K R // THE SYSTEM

Transform the portfolio into an original, cinematic interactive WebGL experience ("THE SYSTEM") simulating a futuristic AI research facility. The experience features smooth scroll choreography, a procedural AI core, a signature interactive 3D ShadowTrace trajectory divergence simulation, 6 spatial project worlds, an interactive engineering network graph, illuminated build log corridor, and a final shutdown sequence.

## User Review Required

> [!IMPORTANT]
> **Honest Research Presentation:** ShadowTrace presents real experimental metrics (Cumulative drift = 0.36 -> 0.37 vs Step delta spiking to 0.76 at Step 3 `authenticate_twitter`). The negative result (cumulative drift alone failed to separate classes) is highlighted as authentic research insight ("DRIFT ≠ DELTA").

> [!NOTE]
> **Sound & Accessibility:** Audio uses a custom Web Audio API synthesizer for zero-asset fast loading. Muted by default with an interactive HUD toggle. Full `prefers-reduced-motion` and keyboard accessibility support included.

## Proposed Changes

### Content & Data Layer

#### [NEW] [profile.ts](file:///d:/Agnonix/New%20folder/src/content/profile.ts)
- Comprehensive source of truth containing identity, verified education (Karunya 2023-2027), experience (TheDot Tech, Nano Nino, ShadowTrace), verified credentials (MongoDB, PrepInsta, IBM), 6 projects, engineering network nodes, and exact ShadowTrace trajectory metrics.

---

### WebGL Experience & Scenes

#### [NEW] [ExperienceCanvas.tsx](file:///d:/Agnonix/New%20folder/src/experience/ExperienceCanvas.tsx)
- R3F Canvas container with responsive DPR scale (`dpr={[1, 2]}` desktop, `dpr={[1, 1.25]}` mobile), antialiasing, dark environment lighting, and post-processing integration.

#### [NEW] [CameraChoreography.tsx](file:///d:/Agnonix/New%20folder/src/experience/camera/CameraChoreography.tsx)
- Unified camera controller using Lenis smooth scroll progress and GSAP easing vectors to drive continuous camera translation through all 9 journey phases (`BOOT → ARRIVAL → AI CORE → SHADOWTRACE → PROJECT WORLDS → ENGINEERING → BUILD LOG → CONNECTION → SHUTDOWN`).

#### [NEW] [PostEffects.tsx](file:///d:/Agnonix/New%20folder/src/experience/postprocessing/PostEffects.tsx)
- Post-processing pipeline with Bloom, Depth of Field, Vignette, and Chromatic Aberration burst triggered during ShadowTrace trajectory divergence.

#### [NEW] [ArrivalScene.tsx](file:///d:/Agnonix/New%20folder/src/experience/scenes/ArrivalScene.tsx)
- Facility entrance scene with atmospheric pillars, distant vertical structures, spatial title lockup, and subtle mouse parallax.

#### [NEW] [AICoreScene.tsx](file:///d:/Agnonix/New%20folder/src/experience/scenes/AICoreScene.tsx)
- Multi-layer procedural core with concentric wireframe icosahedrons, internal glowing nodes, orbital data rings, cyan light sweeps, and scroll-through camera transition.

#### [NEW] [ShadowTraceScene.tsx](file:///d:/Agnonix/New%20folder/src/experience/scenes/ShadowTraceScene.tsx)
- Signature interactive 3D scene. 5 execution step nodes (`grep`, `diff`, `authenticate_twitter`, `respond`, `post_tweet`).
- Dynamic geometry: Node Y-height driven by drift (0.36, 0.31, 0.40, 0.41, 0.37). Node X/Z spacing driven by delta (0.00, 0.29, **0.76**, 0.58, 0.55).
- Step 3 triggers **Amber Warning Anomaly Event**: warning light burst, camera acceleration, aberration spike, and telemetry UI reveal.

#### [NEW] [ProjectWorldsScene.tsx](file:///d:/Agnonix/New%20folder/src/experience/scenes/ProjectWorldsScene.tsx)
- Spatial project chamber containing 6 distinct 3D project stations with visual primitive motifs (ShadowTrace, Fake News, Question Summarizer, GenomeVault, Bus Tracker, Dynamic Web Nav).

#### [NEW] [EngineeringNetworkScene.tsx](file:///d:/Agnonix/New%20folder/src/experience/scenes/EngineeringNetworkScene.tsx)
- 3D spatial node graph connecting 6 primary domains and 14 secondary technology stacks with interactive illuminated links to proven projects.

#### [NEW] [BuildLogScene.tsx](file:///d:/Agnonix/New%20folder/src/experience/scenes/BuildLogScene.tsx)
- Illuminated architectural experience pylons spanning 2024 through 2026.

#### [NEW] [ShutdownScene.tsx](file:///d:/Agnonix/New%20folder/src/experience/scenes/ShutdownScene.tsx)
- Facility illumination decay into dark space, single spotlight, connection channels, and session complete termination sequence.

---

### UI & Overlay System

#### [NEW] [BootSequence.tsx](file:///d:/Agnonix/New%20folder/src/app/BootSequence.tsx)
- Cinematic black screen preloader with scanline effect, system diagnostic readout (`NEURAL`, `DATA`, `SECURITY`, `BUILD`), progress meter, and camera reveal transition.

#### [NEW] [HUD.tsx](file:///d:/Agnonix/New%20folder/src/app/HUD.tsx)
- Tactical overlay HUD with real-time frame indicator, scroll progress bar, chapter readouts, sound toggle, and navigation quick-anchors.

#### [NEW] [SoundController.ts](file:///d:/Agnonix/New%20folder/src/utils/SoundController.ts)
- Web Audio API synthesizer for ambient room tone, hover clicks, scene transition sweeps, and anomaly warning pulses.

#### [NEW] [CustomCursor.tsx](file:///d:/Agnonix/New%20folder/src/app/CustomCursor.tsx)
- Sleek custom crosshair cursor with interactive state morphing (`DEFAULT`, `HOVER`, `PROJECT`, `ANOMALY`).

#### [MODIFY] [App.tsx](file:///d:/Agnonix/New%20folder/src/App.tsx)
- Main application component orchestrating sound controller, boot state, smooth scroll context, 3D Canvas background, and spatial HTML UI overlays.

#### [MODIFY] [styles.css](file:///d:/Agnonix/New%20folder/src/styles.css)
- Complete design system CSS with custom variables, scanlines, typography, HUD layouts, cursor styles, and mobile responsive rules.

---

## Verification Plan

### Automated & Build Tests
- `npm run build` (TypeScript compilation + Vite bundling check).

### Browser Visual Inspection
- Run `npm run dev` and execute browser inspection across viewports:
  1. Desktop 1920x1080
  2. Desktop 1440x900
  3. Mobile/Tablet viewports
- Capture screenshots for visual QA artifact verification.
