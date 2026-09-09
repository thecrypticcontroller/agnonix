import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2020",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js core — largest chunk, split so it loads independently
          three: ["three"],
          // React Three Fiber + Drei helpers
          r3f: ["@react-three/fiber", "@react-three/drei"],
          // Post-processing — bloom/chromatic aberration, desktop-only
          postfx: ["@react-three/postprocessing", "postprocessing"],
        }
      }
    }
  }
});
