// useMagnetic.ts — Magnetic hover effect hook
// Pulls an element toward the cursor within its bounding box.
// Usage: const { elRef, handlers } = useMagnetic(0.4)
//   <a ref={elRef} {...handlers}>...</a>

import { useRef, useCallback } from 'react';

export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.38) {
  const elRef = useRef<T>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = elRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transition = 'transform 0.1s linear';
      el.style.transform  = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.65s cubic-bezier(.34,1.56,.64,1)';
    el.style.transform  = 'translate(0px, 0px)';
  }, []);

  return { elRef, handlers: { onMouseMove, onMouseLeave } as {
    onMouseMove:  React.MouseEventHandler<T>;
    onMouseLeave: React.MouseEventHandler<T>;
  }};
}
