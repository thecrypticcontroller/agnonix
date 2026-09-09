// useTextScramble.ts — Matrix-style letter scramble that settles to final text
// Usage:
//   const { output, trigger } = useTextScramble('AGNONIX')
//   <span onMouseEnter={trigger}>{output}</span>
//
// Or auto-trigger on mount/reveal:
//   const { output } = useTextScramble('AGNONIX', { autoPlay: true, delay: 200 })

import { useState, useEffect, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>?/\\|';

interface ScrambleOptions {
  autoPlay?: boolean;   // trigger on mount, default false
  delay?   : number;   // ms before autoPlay starts, default 0
  speed?   : number;   // ms per frame, default 40
  cycles?  : number;   // how many noise cycles per char, default 6
}

export function useTextScramble(
  text: string,
  options: ScrambleOptions = {}
) {
  const { autoPlay = false, delay = 0, speed = 40, cycles = 6 } = options;

  const [output, setOutput] = useState(text);
  const rafRef  = useRef(0);
  const frameRef = useRef(0);
  const resolvedRef = useRef<boolean[]>([]);

  const scramble = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    resolvedRef.current = Array(text.length).fill(false);
    frameRef.current = 0;

    const tick = () => {
      frameRef.current++;
      const chars = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (resolvedRef.current[i]) return char;
        if (frameRef.current > i * cycles) {
          resolvedRef.current[i] = true;
          return char;
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });
      setOutput(chars.join(''));

      if (resolvedRef.current.every(Boolean)) return;
      rafRef.current = setTimeout(tick, speed) as unknown as number;
    };

    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, speed, cycles]);

  useEffect(() => {
    if (!autoPlay) { setOutput(text); return; }
    const t = setTimeout(scramble, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  }, [autoPlay, delay, scramble, text]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return { output, trigger: scramble };
}
