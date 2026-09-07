# Interaction & Custom Cursor Specification

**Project:** DEVESH K R // THE SYSTEM  
**Interaction Mechanics:** Smooth Lenis Scroll, Custom Semantic Cursor, Raycasting 3D Pickers, Sound Feedback

---

## 1. Custom Cursor States

- `DEFAULT`: Clean 14px outer ring + 3px center cyan dot (`#3fd5f4`).
- `HOVER` / `INTERACTIVE`: Ring expands to 28px, center dot pulses, label `[ SELECT ]`.
- `PROJECT`: Ring turns into target reticle with rotation, label `[ INSPECT WORLD ]`.
- `ANOMALY`: Cursor turns Amber (`#f5c56d`), inner reticle pulses fast, label `[ TRAJECTORY ALERT ]`.

---

## 2. 3D Raycasting & Pickers

1. **ShadowTrace Step Nodes:** Hovering node displays step telemetry badge, drift graph bar, raw action log, and step description.
2. **Project Chamber Stations:** Hovering station mesh smoothly pulls camera 1.5 units closer and highlights metallic edge wireframe. Clicking station opens repository details modal.
3. **Engineering Graph Nodes:** Hovering skill node highlights connected project badges and tech stack dependencies.
