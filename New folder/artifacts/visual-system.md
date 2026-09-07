# Visual System & Aesthetic Specification

**Project:** DEVESH K R // THE SYSTEM  
**Design Philosophy:** Architectural Sci-Fi, Technical Precision, Dark Atmospheric WebGL

---

## 1. Palette & Semantic Color Allocation

```css
:root {
  /* System / Intelligence / Standard Operation */
  --color-cyan-glow: #3fd5f4;
  --color-cyan-dim: #0b789e;
  --color-cyan-deep: #052636;

  /* Anomaly / Trajectory Divergence / Warning */
  --color-amber-glow: #f5c56d;
  --color-amber-dim: #9e6414;
  --color-amber-deep: #3b2104;

  /* Identity / Structural Whites & Grays */
  --color-text-bright: #f0f7fb;
  --color-text-muted: #8ca3b5;
  --color-border-subtle: rgba(63, 213, 244, 0.18);

  /* Deep Space / Architectural Darkness */
  --color-bg-space: #03070d;
  --color-bg-surface: #09111a;
  --color-bg-card: rgba(9, 17, 26, 0.75);
}
```

- **CYAN:** Normal operation, core intelligence, standard nodes, operational telemetry.
- **AMBER:** Trajectory divergence at Step 3 (`authenticate_twitter`, Delta=0.76), anomaly detection, interactive focus.
- **BLACK/NAVY:** Volumetric environment depth, grid lines, high-contrast dark space background.

---

## 2. Typography Hierarchy

1. **Display Titles:** High-contrast geometric sans-serif (`Space Grotesk` / `Outfit` / `Inter`, system fallback uppercase, tight letter spacing, crisp rendering).
2. **Instrumentation Labels:** Monospaced technical font (`JetBrains Mono` / `Fira Code` / `Courier New`, lowercase/uppercase technical annotations, coordinate readouts, drift metrics).
3. **Spatial 3D Text:** Rendered via WebGL vector labels or screen-projected HTML HUD badges with 3D depth alignment.

---

## 3. Lighting & Materials Specification

- **Materials:**
  - Standard metallic floor with roughness `0.48` and metalness `0.9` for subtle reflection of overhead lights.
  - Holographic & Wireframe materials (`emissiveIntensity: 1.4` to `2.2`) for procedural AI Core and node spheres.
  - Transparent data rail lines with custom opacity animation.
- **Lighting:**
  - Ambient light: Low intensity (`0.18`–`0.25`) to preserve deep shadows.
  - Directional primary: `[4, 8, 6]` with soft shadows.
  - Point lights: Dynamic point lights inside AI Core and ShadowTrace anomaly node that change color from Cyan to Amber during event triggers.

---

## 4. Post-Processing Pipeline

- **Unreal Bloom:** Intensity `1.15`, luminance threshold `0.16`, smooth mipmap blur for glowing emissive nodes.
- **Depth of Field:** Focal length `0.05`, focus distance calculated relative to active camera path.
- **Vignette:** Darkness `0.75`, Eskil `false` for dark cinematic border frame.
- **Chromatic Aberration:** Dynamic offset (spikes to `0.008` during ShadowTrace Step 03 event).

---

## 5. Sound Design (Optional Synthesized Web Audio API)

- Non-intrusive sound effects generated via Web Audio API oscillators:
  - System boot hum (low sine sweep).
  - Hover tick (subtle high frequency pulse).
  - Anomaly pulse (dual frequency triangle alert).
  - Scene transition sweep (filtered white noise).
