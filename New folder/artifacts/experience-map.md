# Continuous Experience Map Specification

**Project:** DEVESH K R // THE SYSTEM  
**Paradigm:** Continuous Cinematic WebGL Experience

---

## Complete Chapter Specification

### 1. BOOT (Phase 00)
- **Scene Purpose:** System initialization & calibration. Establishes sci-fi AI research laboratory context.
- **Camera Position:** `[0, 0.5, 24.0]`
- **Camera Target:** `[0, 0.5, 0.0]`
- **Environment:** Deep darkness, subtle scanlines, initializing particle mesh.
- **Lighting:** Zero ambient, single subtle cyan point light inside central facility outline.
- **Foreground:** Monospaced system diagnostics & calibration meter.
- **Midground:** Scanline grid filter.
- **Background:** Pure spatial black (`#03070d`).
- **Typography:** Large monospaced display: `DEVESH_KR // SYSTEM INITIALIZATION`.
- **User Interaction:** Click `[ INITIALIZE SYSTEM ]` button or press Space.
- **Transition INTO:** Cold startup black.
- **Transition OUT:** Flash to scanline grid → Particle expansion → Camera approaches facility gate.
- **Performance Budget:** < 30 draw calls, 60 FPS, < 15MB initial asset footprint.

---

### 2. ARRIVAL / HERO (Phase 01)
- **Scene Purpose:** Reveal the architectural research facility and primary identity statement.
- **Camera Position:** `[0, 1.2, 16.0]` (subtle mouse parallax lerp `+-0.5`)
- **Camera Target:** `[0, 0.2, 0.0]`
- **Environment:** Dark architectural hall with vertical structural pillars, reflective floor, volumetric cyan fog.
- **Lighting:** Ambient (`0.2`), Cyan overhead directional key light, subtle cyan floor grid accent.
- **Foreground:** Blur particle atmosphere.
- **Midground:** Primary identity lockup (`DEVESH K R // AI ENGINEER & SAFETY RESEARCHER`).
- **Background:** Vertical pylon silhouettes and distant AI Core glow.
- **Typography:** High-contrast sans-serif title with monospaced metadata HUD overlay.
- **User Interaction:** Scroll to initiate camera travel towards AI Core; hover quick-nav anchors.
- **Transition INTO:** Camera dolly forward through facility entrance gates.
- **Transition OUT:** Camera accelerates forward toward glowing AI Core.
- **Performance Budget:** < 60 draw calls, 60 FPS, instanced pillar geometry.

---

### 3. CENTRAL AI CORE (Phase 02)
- **Scene Purpose:** Represent core intelligence, research, and algorithmic processing.
- **Camera Position:** `[0, 0.8, 8.5]`
- **Camera Target:** `[0, 0.5, 0.0]`
- **Environment:** Volumetric node chamber, floating data rings, procedural wireframe core.
- **Lighting:** Core point light (`intensity: 4.5`, cyan `#3fd5f4`), dark ambient shadow.
- **Foreground:** Orbital wireframe rings.
- **Midground:** Dual concentric icosahedrons rotating on offset axes with internal glowing node core.
- **Background:** Concentric data channels and particle drift.
- **Typography:** `CENTRAL AI CORE // INTELLIGENCE & SAFETY ALGORITHMS`.
- **User Interaction:** Mouse rotation tilt, scroll forward to dive through the core center.
- **Transition INTO:** Camera slow orbital approach to Core.
- **Transition OUT:** **Camera Dive Through Core** into the ShadowTrace execution chamber.
- **Performance Budget:** Single mesh shader or low-poly concentric icosahedrons, < 40 draw calls.

---

### 4. SHADOWTRACE — SIGNATURE SCENE (Phase 03)
- **Scene Purpose:** Interactive agent trajectory divergence safety simulation demonstrating real research metric spikes.
- **Camera Position (Normal):** `[-4.0, 1.5, 4.5]` lateral tracking angle along execution rail.
- **Camera Target:** `[0.0, 0.5, -2.0]`
- **Environment:** Agent execution chamber with luminous trajectory rail, step nodes, and alert HUD.
- **Lighting:** Dynamic Cyan baseline light → Amber warning burst at Step 03.
- **Foreground:** Step telemetry readouts, drift lines, step-to-step delta indicators.
- **Midground:** 5 Execution Step Nodes:
  - Step 1 (`grep`): Drift = 0.36, Delta = 0.00
  - Step 2 (`diff`): Drift = 0.31, Delta = 0.29
  - Step 3 (`authenticate_twitter`): Drift = 0.40, **Delta = 0.76** (ANOMALY JUMP)
  - Step 4 (`respond`): Drift = 0.41, Delta = 0.58
  - Step 5 (`post_tweet`): Drift = 0.37, Delta = 0.55
- **Background:** Anomaly alert halo, warning rings, data stream particles.
- **Typography:** High-contrast tactical readouts: `TRAJECTORY DIVERGENCE DETECTED // DELTA: 0.76`.
- **User Interaction:** Scroll through execution steps; hover nodes for step diagnostics and raw logs.
- **Transition INTO:** Camera passes directly through AI Core center into execution chamber.
- **Transition OUT:** Camera emerges from execution rail into the Project Worlds chamber.
- **Performance Budget:** Instanced node geometry, buffer line renderer, < 50 draw calls.

---

### 5. PROJECT WORLDS (Phase 04)
- **Scene Purpose:** Spatial 3D exploration of 6 core engineering projects.
- **Camera Position:** `[0.0, 2.0, -8.0]`
- **Camera Target:** Active station focus `[x, y, z]`
- **Environment:** 3D Project Chamber with 6 distinct modular stations (Fake News, Summarizer, GenomeVault, Bus Tracker, Dynamic Web Nav).
- **Lighting:** Station-focused spotlights.
- **Foreground:** Station title badges and stack tags.
- **Midground:** Interactive project primitive meshes (document stacks, encrypted blocks, transit telemetry paths).
- **Background:** Facility structural outline.
- **Typography:** Project numbers (`01`–`06`), titles, repository links.
- **User Interaction:** Hover station to focus camera; click to open full repository diagnostics.
- **Transition INTO:** Camera emerges into spatial chamber.
- **Transition OUT:** Camera tilts overhead into Engineering Network graph.

---

### 6. ENGINEERING NETWORK (Phase 05)
- **Scene Purpose:** Interactive 3D skill network linking technologies to project evidence.
- **Camera Position:** `[0.0, 8.0, -18.0]` (30° overhead spatial view)
- **Camera Target:** `[0.0, 0.0, -18.0]`
- **Environment:** 3D Force Graph of domain nodes and tech stacks with animated connection lines.
- **Lighting:** Subdued ambient with emissive node glow.
- **Foreground:** Interactive stack labels (`Python`, `FastAPI`, `React`, `Docker`, `Scikit-learn`).
- **Midground:** Spatial graph node spheres and connecting geometry.
- **Background:** Infinite dark grid.
- **Typography:** `PROVEN IN: [PROJECT NAME]`.
- **User Interaction:** Hover tech nodes to illuminate connected projects and skills.
- **Transition INTO:** Camera tilt and elevation to overhead view.
- **Transition OUT:** Camera descends into Build Log corridor.

---

### 7. BUILD LOG (Phase 06)
- **Scene Purpose:** Chronological timeline corridor of career and research milestones.
- **Camera Position:** `[0.0, 0.5, -28.0]`
- **Camera Target:** `[0.0, 0.5, -34.0]`
- **Environment:** Illuminated architectural pylon corridor (2024 TheDot Tech → 2025 Nano Nino → 2025+ ShadowTrace → 2026 Build/Test/Ship).
- **Lighting:** Alternating pylon glow lights.
- **Foreground:** Milestone year markers.
- **Midground:** Architectural station blocks with project role descriptions.
- **Background:** Dark corridor perspective lines.
- **Typography:** `2024 — 2026 ARCHITECTURAL LOG`.
- **User Interaction:** Scroll dolly down corridor; hover pylons for role breakdown.
- **Transition INTO:** Linear dolly into corridor.
- **Transition OUT:** Camera decelerates towards central connection podium.

---

### 8. CONNECTION (Phase 07)
- **Scene Purpose:** Contact and collaboration gateway.
- **Camera Position:** `[0.0, 0.5, -42.0]`
- **Camera Target:** `[0.0, 0.5, -46.0]`
- **Environment:** Fading facility lights, single cyan spotlight on central podium.
- **Lighting:** Single high-contrast spotlight.
- **Foreground:** Terminal links (`GITHUB`, `LINKEDIN`, `EMAIL`).
- **Midground:** Connection lockup: `HAVE AN IDEA WORTH BUILDING?`.
- **Background:** Deep space shadow.
- **Typography:** Clean display title with monospaced link action items.
- **User Interaction:** Hover & click social/email channels.
- **Transition INTO:** Facility lighting decay.
- **Transition OUT:** Pull-back to final shutdown black.

---

### 9. SHUTDOWN (Phase 08)
- **Scene Purpose:** Cinematic resolution and session completion.
- **Camera Position:** Retracting to `[0.0, 2.0, -60.0]`
- **Camera Target:** `[0.0, 0.0, -46.0]`
- **Environment:** Geometry dissolves into darkness, single distant particle point remaining.
- **Lighting:** Complete dark decay.
- **Foreground:** Final text: `SESSION COMPLETE // BUILD → TEST → SHIP`.
- **Midground:** Dissolving particle ring.
- **Background:** Black space.
- **Typography:** Monospaced terminal termination text.
- **User Interaction:** Click `[ REBOOT SYSTEM ]` to return to hero.
- **Transition INTO:** Environmental collapse.
- **Transition OUT:** Reboot trigger back to Phase 00/01.
