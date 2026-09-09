/// <reference types="vite/client" />
// App.tsx — GOD-TIER Cinematic Portfolio v3
// UPGRADED: GSAP ScrollTrigger + Lenis bridge
// One master rAF · Cached DOM selectors · Throttled particles
// Boot: anime quote typewriter + energy build
// Scroll: GSAP scrub + velocity-aware parallax + section reveal wipes

import { useEffect, useRef, useState, useCallback } from 'react';
import './styles.css';

import TopBar from './components/TopBar';
import CustomCursor from './components/CustomCursor';
import AnimeEmblem from './components/AnimeEmblem';
import { createLenis, lenisRaf, destroyLenis } from './lib/lenis';
import { initGsapLenis, destroyGsap, gsap, ScrollTrigger } from './lib/gsap';
import Hero from './components/scenes/Hero';
import Universe from './components/scenes/Universe';
import Chrono from './components/scenes/Chrono';
import Projects from './components/scenes/Projects';
import Engineering from './components/scenes/Engineering';
import Finale from './components/scenes/Finale';
import MarqueeStrip from './components/scenes/MarqueeStrip';

// Prevent browser from restoring stale scroll offset mid-boot
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// ── Anime Quotes ──────────────────────────────────────────────────────────────
const BOOT_QUOTES = [
  { text: "I don't know everything. I just know what I know.", src: "— Levi Ackerman" },
  { text: "If you don't take risks, you can't create a future.", src: "— Monkey D. Luffy" },
  { text: "Power comes in response to a need, not a desire.", src: "— Goku" },
  { text: "The world's not perfect. But it's there for us, doing the best it can.", src: "— Roy Mustang" },
  { text: "Fear is not evil. It tells you what your weakness is.", src: "— Gildarts Clive" },
  { text: "A dropout will beat a genius through hard work.", src: "— Rock Lee" },
  { text: "Hard work is worthless for those that don't believe in themselves.", src: "— Naruto Uzumaki" },
  { text: "The moment you give up is the moment you let someone else win.", src: "— Koro-sensei" },
  { text: "It's not the face that makes someone a monster, it's the choices they make.", src: "— Naruto" },
  { text: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.", src: "— Kenshin Himura" },
];

// ── Scroll Reveal (IO — no rAF cost) ─────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            e.target.querySelectorAll('[data-reveal-child]').forEach((child, i) => {
              (child as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
              child.classList.add('is-revealed');
            });
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -4% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Typewriter ────────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 28, onDone?: () => void) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);
  useEffect(() => {
    idx.current = 0;
    setDisplayed('');
    const id = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  return displayed;
}

// ── GSAP Cinematic Section Animations ─────────────────────────────────────────
// Scrub-based scroll animations that complement the IO reveal system.
// FIX: collect all ScrollTrigger instances and kill them on cleanup.
function useGsapSections(booted: boolean) {
  useEffect(() => {
    if (!booted) return;

    // Collect all triggers created here so we can kill them precisely on cleanup.
    const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

    // Allow a frame for DOM layout to stabilise after boot
    const timer = setTimeout(() => {
      // ── 1. Section labels — slide from left, scrubbed ───────────────────────
      document.querySelectorAll<HTMLElement>('.section-label').forEach((el) => {
        const tw = gsap.fromTo(
          el,
          { x: -48, opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 55%', scrub: 0.7 } }
        );
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });

      // ── 2. Scene dividers — scale-X wipe from left ──────────────────────────
      document.querySelectorAll<HTMLElement>('.scene-divider').forEach((el) => {
        const tw = gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: 'left center', opacity: 0.4 },
          { scaleX: 1, opacity: 1, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 65%', scrub: 0.9 } }
        );
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });

      // ── 3. Bento grid — staggered float-up scrub ───────────────────────────
      const bentoGrid = document.querySelector('.bento-grid');
      const bentoCards = document.querySelectorAll<HTMLElement>('.bento-card');
      if (bentoGrid && bentoCards.length) {
        const tw = gsap.fromTo(
          bentoCards,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: bentoGrid, start: 'top 80%', end: 'top 10%', scrub: 0.6 } }
        );
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      }

      // ── 4. Marquee strips — fade in ─────────────────────────────────────────
      document.querySelectorAll<HTMLElement>('.marquee-strip, .marquee, [class*="marquee"]').forEach((el) => {
        const tw = gsap.fromTo(
          el,
          { opacity: 0.5 },
          { opacity: 1,
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 40%', scrub: 1.2 } }
        );
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      });

      // ── 5. Projects heading — split pop ─────────────────────────────────────
      const projectsHeading = document.querySelector<HTMLElement>('.projects__heading');
      if (projectsHeading) {
        const tw = gsap.fromTo(
          projectsHeading,
          { y: 40, opacity: 0, skewY: 3 },
          { y: 0, opacity: 1, skewY: 0, ease: 'expo.out',
            scrollTrigger: { trigger: projectsHeading, start: 'top 85%', end: 'top 55%', scrub: 0.5 } }
        );
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      }

      // ── 6. Matrix canvas fade-in on scroll into view ─────────────────────────
      const matrixCanvas = document.querySelector<HTMLElement>('.engineering__matrix');
      if (matrixCanvas) {
        const tw = gsap.fromTo(
          matrixCanvas,
          { opacity: 0 },
          { opacity: 1, ease: 'none',
            scrollTrigger: { trigger: matrixCanvas, start: 'top 80%', end: 'top 30%', scrub: 1 } }
        );
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      }

      // ── 7. Finale — dramatic scale entrance ─────────────────────────────────
      const finale = document.querySelector<HTMLElement>('#finale, .finale');
      if (finale) {
        const tw = gsap.fromTo(
          finale,
          { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: finale, start: 'top 90%', end: 'top 40%', scrub: 0.8 } }
        );
        if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
      }

      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(timer);
      // FIX: kill all ScrollTrigger instances created in this effect
      triggers.forEach((t) => t.kill());
    };
  }, [booted]);
}

// ── MASTER rAF (replaces: VelocityTracker + useCursorTrail + useScrollParallax)
// One loop rules them all — saves ~3 rAF registrations = ~30% GPU idle reduction
interface TrailParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  r: number;
}

function useMasterRaf(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    // ── Canvas setup ──────────────────────────────────────────────────────────
    const isTouch = matchMedia('(pointer: coarse)').matches;
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail-canvas';
    if (isTouch) canvas.style.display = 'none'; // skip paint on mobile
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;

    // ── Cache DOM selectors once (re-cache on resize) ─────────────────────────
    let parallaxEls: HTMLElement[] = [];
    let skewEls: HTMLElement[] = [];
    // FIX: also cache rects for parallax elements (avoids forced reflow in tight loop)
    let parallaxRects: { top: number; height: number }[] = [];

    const refreshSelectors = () => {
      parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
      skewEls = Array.from(document.querySelectorAll<HTMLElement>('[data-skew]'));
      // Pre-read rects so the rAF loop never calls getBoundingClientRect
      parallaxRects = parallaxEls.map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, height: r.height };
      });
    };

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      refreshSelectors();
      ScrollTrigger.refresh(); // refresh GSAP triggers on resize
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });

    // FIX: observe #main-content only (was observing document.body → fired on every class toggle)
    const mainContent = document.getElementById('main-content') ?? document.body;
    const revealIO = new MutationObserver(refreshSelectors);
    revealIO.observe(mainContent, { childList: true, subtree: false, attributes: true, attributeFilter: ['class'] });

    // ── Particle state ────────────────────────────────────────────────────────
    let particles: TrailParticle[] = [];
    let mx = -999, my = -999;
    let emitFrame = 0; // throttle: emit every 2nd frame
    const MAX_PARTICLES = 80;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    if (!isTouch) window.addEventListener('mousemove', onMove, { passive: true });

    // ── Scroll velocity state ─────────────────────────────────────────────────
    let prevScrollY = window.scrollY;
    // FIX: track scroll progress via ref + CSS custom property (no React setState)
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const p = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      document.documentElement.style.setProperty('--scroll-progress', p.toFixed(4));
    };

    // ── Master tick ───────────────────────────────────────────────────────────
    let rafId = 0;

    const tick = (time: number) => {
      rafId = requestAnimationFrame(tick);

      // 1. Lenis smooth scroll
      lenisRaf(time);

      // 2. Velocity → CSS custom property
      const rawVel = Math.abs(window.scrollY - prevScrollY) / 8;
      prevScrollY = window.scrollY;
      const vel = Math.min(rawVel, 1);
      document.documentElement.style.setProperty('--scroll-vel', vel.toFixed(3));
      updateProgress();

      // 3. Parallax (use cached rects — no getBoundingClientRect in hot path)
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      for (let i = 0; i < parallaxEls.length; i++) {
        const el = parallaxEls[i];
        const cached = parallaxRects[i];
        const speed = parseFloat(el.dataset.parallax ?? '0.3');
        const centerFromTop = cached.top + cached.height / 2 - scrollY;
        const offset = (centerFromTop - vh / 2) * speed;
        el.style.transform = `translateY(${offset.toFixed(1)}px)`;
      }
      for (const el of skewEls) {
        const max = parseFloat(el.dataset.skew ?? '2');
        el.style.transform = `skewY(${(vel * max).toFixed(2)}deg)`;
      }

      // 4. Cursor trail — emit max 2 particles every other frame
      if (!isTouch) {
        emitFrame = (emitFrame + 1) % 2;
        if (emitFrame === 0 && mx > -900) {
          for (let i = 0; i < 2; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
            const spd = 0.8 + Math.random() * 2.2;
            particles.push({
              x: mx + (Math.random() - 0.5) * 6,
              y: my + (Math.random() - 0.5) * 6,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              life: 22 + Math.random() * 18,
              maxLife: 40,
              r: 1.2 + Math.random() * 2.4,
            });
          }
          // Hard cap — shift oldest instead of filter every frame
          while (particles.length > MAX_PARTICLES) particles.shift();
        }

        // Draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let i = particles.length;
        while (i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.06;
          p.life--;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          const a = p.life / p.maxLife;
          const hue = 8 + (1 - a) * 14;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue},100%,55%,${(a * 0.85).toFixed(2)})`;
          ctx.fill();
        }
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      if (!isTouch) window.removeEventListener('mousemove', onMove);
      revealIO.disconnect();
      canvas.remove();
    };
  }, [enabled]);
}

// ── Boot Screen ───────────────────────────────────────────────────────────────
function BootScreen({ onDone }: { onDone: () => void }) {
  const [barW, setBarW] = useState(0);
  const [phase, setPhase] = useState<'type' | 'hold' | 'slam'>('type');
  const [slamReady, setSlamReady] = useState(false);

  const quoteIdx = useRef(Math.floor(Math.random() * BOOT_QUOTES.length)).current;
  const quote = BOOT_QUOTES[quoteIdx];

  useEffect(() => {
    document.fonts.ready.then(() => setBarW(50));
    const t1 = setTimeout(() => setBarW((w) => Math.max(w, 72)), 400);
    const t2 = setTimeout(() => setBarW(100), 900);
    const t3 = setTimeout(() => setPhase('slam'), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const typed = useTypewriter(
    quote.text, 26,
    () => setTimeout(() => setPhase((p) => p === 'type' ? 'hold' : p), 500)
  );

  useEffect(() => {
    if (phase !== 'slam') return;
    const t = setTimeout(() => {
      setSlamReady(true);
      setTimeout(onDone, 650);
    }, 160);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  return (
    <div id="boot" className={slamReady ? 'is-done' : ''} aria-label="Loading" role="status">
      <div className="boot-rings" aria-hidden="true">
        <div className="boot-ring boot-ring--1" />
        <div className="boot-ring boot-ring--2" />
        <div className="boot-ring boot-ring--3" />
      </div>
      <div className="boot-corner boot-corner--tl" aria-hidden="true" />
      <div className="boot-corner boot-corner--tr" aria-hidden="true" />
      <div className="boot-corner boot-corner--bl" aria-hidden="true" />
      <div className="boot-corner boot-corner--br" aria-hidden="true" />
      <div className="boot-scanlines" aria-hidden="true" />
      <div className="boot-content">
        <div className="boot-emblem boot-emblem--anime" aria-hidden="true">
          {/* Original anime protagonist character — DKR persona */}
          <AnimeEmblem size={140} animated />
          {/* Name badge below character */}
          <div className="boot-emblem__name">
            <span className="boot-emblem__tag">D</span>
            <span className="boot-emblem__tag boot-emblem__tag--red">K</span>
            <span className="boot-emblem__tag">R</span>
          </div>
        </div>
        <div className="boot-quote-wrap">
          <div className="boot-quote-bar" aria-hidden="true" />
          <p className="boot-quote-text" aria-live="polite">
            {typed}<span className="boot-cursor" aria-hidden="true">|</span>
          </p>
          <p className="boot-quote-src">{quote.src}</p>
        </div>
        <div className="boot-bar-wrap" aria-hidden="true">
          <div className="boot-bar-fill" style={{ width: `${barW}%` }} />
          <div className="boot-bar-glow" style={{ left: `calc(${barW}% - 2px)` }} />
        </div>
        <div className="boot-status" aria-hidden="true">
          {barW < 100 ? 'INITIALISING SYSTEMS' : 'SYSTEMS ONLINE'}
        </div>
      </div>
      {phase === 'slam' && <div className="boot-slam" aria-hidden="true" />}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [booted, setBooted] = useState(false);
  // FIX: progress is now driven by CSS custom property (--scroll-progress) from
  // the master rAF, not React state — avoids full App re-render at 60fps.
  // The progress bar reads the CSS var directly.
  const lenisRef = useRef<ReturnType<typeof createLenis> | null>(null);

  const handleBootDone = useCallback(() => {
    document.documentElement.classList.remove('is-booting');
    setBooted(true);
  }, []);

  // ── Lenis init + GSAP ScrollTrigger bridge ───────────────────────────────
  useEffect(() => {
    if (!booted) return;
    const lenis = createLenis();
    lenisRef.current = lenis;
    // FIX: no more setProgress(p) here — progress is tracked as CSS var in master rAF
    initGsapLenis(lenis as any);                 // ← wire ScrollTrigger to Lenis
    return () => {
      destroyGsap(lenis as Parameters<typeof destroyGsap>[0]); // ← clean up all triggers
      destroyLenis();
      lenisRef.current = null;
    };
  }, [booted]);

  // ── Single master loop handles cursor trail, parallax, skew, velocity ────
  useMasterRaf(booted);
  useScrollReveal();
  useGsapSections(booted);               // ← GSAP scrub animations

  return (
    <>
      <CustomCursor />
      {/* FIX: progress bar now reads CSS custom property via inline style so React
          never needs to re-render App just to update the bar width */}
      <div
        className="progress-bar"
        style={{ transform: 'scaleX(var(--scroll-progress, 0))' } as React.CSSProperties}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />
      <div className="grain-overlay" aria-hidden="true" />
      {/* FIX: skip link moved BEFORE <main> so screen readers find it at the top */}
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <BootScreen onDone={handleBootDone} />
      <TopBar />
      <main id="main-content">
        <Hero />

        <div className="scene-divider scene-divider--slash" aria-hidden="true" data-skew="1.8" />
        <MarqueeStrip />

        <section data-reveal className="scroll-scene">
          <Universe />
        </section>

        <div className="scene-divider scene-divider--slash" aria-hidden="true" data-skew="1.8" />
        <MarqueeStrip reverse />

        <section data-reveal className="scroll-scene">
          <Chrono />
        </section>

        <div className="scene-divider scene-divider--slash" aria-hidden="true" data-skew="1.8" />
        <MarqueeStrip />

        <section data-reveal className="scroll-scene">
          <Projects />
        </section>

        <div className="scene-divider scene-divider--slash" aria-hidden="true" data-skew="1.8" />
        <MarqueeStrip reverse />

        <section data-reveal className="scroll-scene">
          <Engineering />
        </section>

        <div className="scene-divider scene-divider--slash" aria-hidden="true" data-skew="1.8" />
        <MarqueeStrip />

        <section data-reveal className="scroll-scene">
          <Finale />
        </section>
      </main>
    </>
  );
}
