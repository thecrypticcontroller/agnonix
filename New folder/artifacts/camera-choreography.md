# Camera Choreography & Timeline Specification

**Project:** DEVESH K R // THE SYSTEM  
**Camera Engine:** Smooth Vector Spline & Lerp Controller

---

## 1. Timeline & Easing Matrix

| Progress (`p`) | Scene Phase | Camera Position Vector `(x, y, z)` | LookAt Target Vector `(x, y, z)` | Easing / Momentum |
|---|---|---|---|---|
| `0.00 - 0.08` | BOOT | `[0.0, 0.5, 24.0]` | `[0.0, 0.5, 0.0]` | Static initial hold |
| `0.08 - 0.22` | ARRIVAL | `[sin(p)*1.5, 1.2, 16.0 - p*25]` | `[0.0, 0.2, 0.0]` | Exponential approach + mouse parallax |
| `0.22 - 0.35` | AI CORE | `[sin(p*3.14)*2.0, 0.8, 8.5 - p*15]` | `[0.0, 0.5, 0.0]` | Orbital curve lerp |
| `0.35 - 0.52` | SHADOWTRACE (Step 1-2) | `[-3.5, 1.2, 2.0 - p*10]` | `[0.0, 0.5, -2.0]` | Lateral tracking angle |
| `0.45` | SHADOWTRACE Step 3 (ANOMALY) | `[-1.8, 2.2, 0.5]` | `[1.2, 1.8, -3.2]` | **Accelerate sharply + Amber shake burst** |
| `0.52 - 0.68` | PROJECT WORLDS | `[0.0, 2.0, -8.0 - p*12]` | `[activeStation.x, 0.5, activeStation.z]` | Chamber emerge & station focus |
| `0.68 - 0.80` | ENGINEERING | `[0.0, 8.0, -18.0 - p*8]` | `[0.0, 0.0, -18.0]` | Lateral overhead tilt |
| `0.80 - 0.90` | BUILD LOG | `[0.0, 0.5, -28.0 - p*14]` | `[0.0, 0.5, -34.0]` | Vertical corridor dolly |
| `0.90 - 0.97` | CONNECTION | `[0.0, 0.5, -42.0]` | `[0.0, 0.5, -46.0]` | Decelerated lock-on |
| `0.97 - 1.00` | SHUTDOWN | `[0.0, 2.0, -60.0]` | `[0.0, 0.0, -46.0]` | Slow retreat into dark space |

---

## 2. Dynamic Dampening Code Blueprint

```ts
const ease = 1 - Math.exp(-3.5 * delta);
camera.position.lerp(targetPosition, ease);
currentTarget.lerp(targetLookAt, ease);
camera.lookAt(currentTarget);
```
