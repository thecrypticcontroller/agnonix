// Type shim — replaced once `npm install lenis` is run
// Prevents TS errors before install

declare module 'lenis' {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal';
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    on(event: string, cb: (data: { progress: number; velocity: number }) => void): void;
    off(event: string, cb: (...args: unknown[]) => void): void;
    destroy(): void;
    scrollTo(target: number | string | HTMLElement, options?: { offset?: number; duration?: number }): void;
  }
}
