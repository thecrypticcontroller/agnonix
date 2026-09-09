// lib/gsap.ts — GSAP ScrollTrigger singleton + Lenis bridge
// Centralises plugin registration so it only happens once.
// Call initGsapLenis() right after createLenis() in App.tsx.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Keep a weakref to the current Lenis instance so cleanup is safe
let _scrollListener: (() => void) | null = null;

/**
 * Wire GSAP ScrollTrigger to an active Lenis instance.
 * Lenis v1+ modifies the real scrollTop, so ScrollTrigger just needs
 * to be told to re-read it on every Lenis scroll event.
 */
export function initGsapLenis(lenis: { on: (e: string, cb: (data: unknown) => void) => void; off: (e: string, cb: (data: unknown) => void) => void }): void {
  if (_scrollListener) return; // already wired
  _scrollListener = () => ScrollTrigger.update();
  lenis.on('scroll', _scrollListener);

  // Refresh all triggers once on init (DOM settled by now)
  ScrollTrigger.refresh();
}

/**
 * Remove Lenis listener and kill all active triggers.
 * Call in the same cleanup as destroyLenis().
 */
export function destroyGsap(lenis?: { off: (e: string, cb: (data: unknown) => void) => void }): void {
  if (_scrollListener && lenis) {
    lenis.off('scroll', _scrollListener);
  }
  _scrollListener = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

export { gsap, ScrollTrigger };
