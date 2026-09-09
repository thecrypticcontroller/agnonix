// lib/lenis.ts — Lenis smooth scroll singleton
// The #1 thing that makes a portfolio feel agency-tier vs just "good"
// Requires: npm install lenis

import Lenis from 'lenis';

let instance: Lenis | null = null;

export function createLenis(): Lenis {
  if (instance) { instance.destroy(); }

  instance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
    infinite: false,
  });

  return instance;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function destroyLenis(): void {
  instance?.destroy();
  instance = null;
}

/** Wire Lenis into an existing rAF loop */
export function lenisRaf(time: number): void {
  instance?.raf(time);
}
