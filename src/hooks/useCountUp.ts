// useCountUp.ts — Animated number counter
// Usage: const val = useCountUp(target, { duration: 1400, start: 0 })
// Wire to an IntersectionObserver trigger via the `enabled` flag

import { useState, useEffect, useRef } from 'react';

interface CountUpOptions {
  duration?  : number;   // ms, default 1400
  start?     : number;   // start value, default 0
  decimals?  : number;   // decimal places, default 0
  easing?    : (t: number) => number;
}

const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export function useCountUp(
  target: number,
  enabled = true,
  options: CountUpOptions = {}
): string {
  const {
    duration = 1400,
    start    = 0,
    decimals = 0,
    easing   = easeOutExpo,
  } = options;

  const [value, setValue]   = useState(start);
  const startTimeRef        = useRef<number | null>(null);
  const rafRef              = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    startTimeRef.current = null;

    const tick = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easing(progress);
      setValue(start + (target - start) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, enabled, duration, start]); // eslint-disable-line react-hooks/exhaustive-deps

  return value.toFixed(decimals);
}
