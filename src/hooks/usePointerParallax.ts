import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePointerParallaxOptions {
  smoothing?: number;
  intensity?: number;
}

interface UsePointerParallaxReturn {
  x: number;
  y: number;
  tx: number;
  ty: number;
}

function damp(a: number, b: number, lambda: number, dt: number): number {
  return a + (b - a) * (1 - Math.exp(-lambda * dt));
}

export function usePointerParallax(options: UsePointerParallaxOptions = {}): UsePointerParallaxReturn {
  const { smoothing = 0.3, intensity = 0.5 } = options;

  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isTouch = typeof window !== 'undefined'
    ? window.matchMedia('(pointer: coarse)').matches : false;

  const isDisabled = reducedMotion || isTouch;

  const [damped, setDamped] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    targetRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    };
  }, []);

  useEffect(() => {
    if (isDisabled) return;

    const frame = () => {
      const dt = 1 / 60;
      const lambda = smoothing * 10;
      setDamped((prev) => ({
        x: damp(prev.x, targetRef.current.x, lambda, dt),
        y: damp(prev.y, targetRef.current.y, lambda, dt),
      }));
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current); };
  }, [isDisabled, smoothing]);

  useEffect(() => {
    if (isDisabled) return;
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isDisabled, handlePointerMove]);

  if (isDisabled) return { x: 0, y: 0, tx: 0, ty: 0 };

  return {
    x: damped.x,
    y: damped.y,
    tx: damped.x * intensity * 20,
    ty: damped.y * intensity * 20,
  };
}

export function useParallaxGate(): boolean {
  const [canParallax, setCanParallax] = useState(true);

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touch = window.matchMedia('(pointer: coarse)');
    setCanParallax(!(rm.matches || touch.matches));

    const handleChange = () => setCanParallax(!(rm.matches || touch.matches));
    rm.addEventListener('change', handleChange);
    touch.addEventListener('change', handleChange);
    return () => {
      rm.removeEventListener('change', handleChange);
      touch.removeEventListener('change', handleChange);
    };
  }, []);

  return canParallax;
}
