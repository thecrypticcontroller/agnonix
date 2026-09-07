# Performance Optimization Plan

**Project:** DEVESH K R // THE SYSTEM  
**Performance Budget:** Constant 60 FPS Desktop, 30+ FPS Mobile, < 65 Draw Calls, Dynamic DPR scaling.

---

## 1. Key Optimization Strategies

1. **Dynamic DPR & Tier Detection:**
   - Desktop: `dpr={[1, 2]}`
   - Mobile / Low-power mode: `dpr={[1, 1.25]}`, disabled Depth of Field pass, reduced particle count (300 -> 100).
2. **Buffer Attribute Particle Instancing:**
   - Single instanced buffer geometry for sparkles/stars instead of thousands of individual React mesh objects.
3. **Geometry Reuse & Memoization:**
   - Share materials and geometry instances across scene modules (`useMemo`).
4. **Frustum Culling & Depth Window Visibility:**
   - Only render geometry when active camera Z depth is within bounds.
5. **Memory Disposal:**
   - Explicit cleanup of geometries, textures, and web audio oscillators on unmount.
