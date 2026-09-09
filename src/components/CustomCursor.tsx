// CustomCursor.tsx — Morphing cursor: signature of every agency-tier portfolio
// Dot: snaps to exact position. Ring: spring lags behind for premium feel.
// Hover state: ring expands + mixes blend mode. Click: ring contracts sharply.

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Only on pointer-capable devices
    if (matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const lbl = labelRef.current;
    if (!dot || !ring || !lbl) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let rafId = 0;
    let state: 'default' | 'link' | 'project' | 'text' = 'default';

    /* ── spring constants ─────────────────────────────── */
    const EASE_DEFAULT = 0.10;
    const EASE_HOVER = 0.075;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onDown = () => ring.classList.add('is-clicking');
    const onUp = () => ring.classList.remove('is-clicking');

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const link = t.closest('a, button, .mag-link, [role="button"]');
      const project = t.closest('.project-card');
      const heading = t.closest('h1, h2, h3');

      if (project) {
        state = 'project';
        ring.classList.add('is-project');
        ring.classList.remove('is-link', 'is-text');
        lbl.textContent = 'VIEW';
      } else if (link) {
        state = 'link';
        ring.classList.add('is-link');
        ring.classList.remove('is-project', 'is-text');
        lbl.textContent = '';
      } else if (heading) {
        state = 'text';
        ring.classList.add('is-text');
        ring.classList.remove('is-link', 'is-project');
        lbl.textContent = '';
      } else {
        state = 'default';
        ring.classList.remove('is-link', 'is-project', 'is-text');
        lbl.textContent = '';
      }
    };

    const onOut = () => {
      state = 'default';
      ring.classList.remove('is-link', 'is-project', 'is-text');
      lbl.textContent = '';
    };

    function tick() {
      // dot snaps
      if (!dot || !ring) return;
      dot.style.transform = `translate(${(mx - 4).toFixed(1)}px, ${(my - 4).toFixed(1)}px)`;

      // ring springs
      const ease = state === 'default' ? EASE_DEFAULT : EASE_HOVER;
      rx += (mx - rx) * ease;
      ry += (my - ry) * ease;

      const rSize = state === 'project' ? 80 : state === 'link' ? 44 : state === 'text' ? 56 : 32;
      ring.style.transform = `translate(${(rx - rSize / 2).toFixed(1)}px, ${(ry - rSize / 2).toFixed(1)}px)`;
      ring.style.width = `${rSize}px`;
      ring.style.height = `${rSize}px`;

      rafId = requestAnimationFrame(tick);
    }

    tick();

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    // Show cursor elements
    dot.style.opacity = '1';
    ring.style.opacity = '1';

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-ring__label" />
      </div>
    </>
  );
}
