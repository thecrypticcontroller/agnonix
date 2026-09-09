// useSceneVisibility.ts — IO-based visibility flag for scene sections
// Returns a ref to attach + isVisible boolean for inline style transitions

import { useRef, useState, useEffect } from 'react';

interface Options {
  threshold?: number;
  once?     : boolean; // default true — disconnect after first trigger
}

export function useSceneVisibility(options: Options = {}) {
  const { threshold = 0.1, once = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return { ref, isVisible };
}
