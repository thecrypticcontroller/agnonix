/**
 * useSceneTimeline Hook
 *
 * Replaces the cinematic portfolio's cue system.
 * Manages timeline progression, fires cues at specific timestamps,
 * and maintains animation state via CSS classes on the root element.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface TimelineCue {
  timestamp: number;
  name: string;
  action?: () => void;
}

interface UseSceneTimelineReturn {
  currentTime: number;
  firedCues: Set<string>;
  rootRef: React.RefObject<HTMLElement>;
  isRunning: boolean;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
}

export function useSceneTimeline(cues: TimelineCue[]): UseSceneTimelineReturn {
  const rootRef = useRef<HTMLElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [firedCues, setFiredCues] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(true);

  const t0Ref = useRef(performance.now());
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isRunning) return;

    const frame = (now: number) => {
      const t = (now - t0Ref.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime(t);

      cues.forEach(({ timestamp, name, action }) => {
        if (t >= timestamp) {
          setFiredCues(prev => {
            const newCues = new Set(prev);
            if (!newCues.has(name)) {
              newCues.add(name);
              rootRef.current?.classList.add(`is-${name}`);
              action?.();
            }
            return newCues;
          });
        }
      });

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, cues]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  const seek = useCallback((time: number) => {
    t0Ref.current = performance.now() - time * 1000;
    setCurrentTime(time);

    setFiredCues(_prev => {
      const newCues = new Set<string>();
      cues.forEach(({ timestamp, name }) => {
        if (time >= timestamp) {
          newCues.add(name);
          rootRef.current?.classList.add(`is-${name}`);
        } else {
          rootRef.current?.classList.remove(`is-${name}`);
        }
      });
      return newCues;
    });
  }, [cues]);

  return {
    currentTime,
    firedCues,
    rootRef,
    isRunning,
    pause,
    resume,
    seek,
  };
}
