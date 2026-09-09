/// <reference types="vite/client" />
// Hero.tsx — Scene 1: God-Tier Anime Entrance
// Phase 1: Screen crack + white flash
// Phase 2: Speed-line burst + impact freeze frame
// Phase 3: Aura / particle materialise → logo settles
// Background: HeroGL (R3F WebGL — absolute, z-index 0)

import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { CUES, damp, clamp } from '../../data/sceneConfig';
import HeroCharacter from '../HeroCharacter';

// Prefetch the WebGL chunk immediately at module eval time — fires the network
// request now so the browser downloads Three/R3F in the background while the
// boot animation plays. When lazy() resolves, the module is already cached.
if (typeof window !== 'undefined') {
  import('./HeroGL').catch(() => {});
}

// Lazy boundary: if the chunk fails (old browser / no WebGL) hero degrades cleanly.
const HeroGL = lazy(() =>
  import('./HeroGL').catch(() => ({ default: () => null as unknown as React.ReactElement }))
);

// CSS gradient shown while WebGL initialises — matches HeroGL's own WebGLFallback
function HeroGLPlaceholder() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(222,27,28,0.12) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
// ── Kinetic split text — chars shear/glitch on scroll ────────────────────────
function KineticText({
  children,
  className = '',
  tag: Tag = 'div',
}: {
  children: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}) {
  const wrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 1 at centre, 0 at top/bottom
      const progress = 1 - Math.abs(rect.top + rect.height / 2 - vh / 2) / (vh * 0.6);
      const p = Math.max(0, Math.min(1, progress));
      const chars = el.querySelectorAll<HTMLSpanElement>('.kchar');
      chars.forEach((c, i) => {
        const wave = Math.sin((i / chars.length) * Math.PI * 2 + (1 - p) * 4) * (1 - p) * 24;
        const skew = (1 - p) * 8;
        c.style.transform = `translateY(${wave.toFixed(1)}px) skewX(${(i % 2 === 0 ? skew : -skew).toFixed(1)}deg)`;
        c.style.opacity = String(0.3 + p * 0.7);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const content = children.split('').map((ch, i) => (
    <span key={i} className="kchar" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
      {ch === ' ' ? ' ' : ch}
    </span>
  ));

  // @ts-ignore — dynamic tag
  return <Tag ref={wrapRef} className={`kinetic-text ${className}`}>{content}</Tag>;
}

// ─── Particle system ──────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; alpha: number;
  hue: number;   // 0=red, 30=orange, 60=yellow
  phase: 'spiral' | 'ember';
}

function spawnAuraParticle(cx: number, cy: number, _t: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const dist = 80 + Math.random() * 200;
  const speed = 0.6 + Math.random() * 1.4;
  const life = 60 + Math.random() * 100;
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist * 0.45,   // elliptical aura
    vx: -Math.cos(angle) * speed * 0.5,      // converge inward
    vy: -Math.abs(Math.sin(angle)) * speed,
    life, maxLife: life,
    size: 1.5 + Math.random() * 2.5,
    alpha: 0,
    hue: Math.random() * 60,
    phase: Math.random() > 0.5 ? 'spiral' : 'ember',
  };
}

function spawnEmber(canvas: HTMLCanvasElement, mx: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.3 + Math.random() * 0.9;
  const life = 90 + Math.random() * 120;
  return {
    x: canvas.width * 0.5 + (Math.random() - 0.5) * canvas.width * 0.7,
    y: canvas.height * 0.65 + (Math.random() - 0.5) * canvas.height * 0.25,
    vx: Math.cos(angle) * speed * 0.4 + (mx - 0.5) * 0.25,
    vy: -speed * (0.5 + Math.random() * 0.5),
    life, maxLife: life,
    size: 1.0 + Math.random() * 2.0,
    alpha: 0,
    hue: Math.random() * 40,
    phase: 'ember',
  };
}

// ─── Timing constants ─────────────────────────────────────────────────────────
const PHASE1_END = 1.2;   // screen crack + flash
const PHASE2_END = 2.4;   // speed lines + freeze
const PHASE3_START = 2.0;  // aura begins (overlaps)
const LOGO_IN = 2.6;   // logo materialises
const LOGO_DUR = 0.9;
const SUBTITLE_IN = 3.4;
const CHIPS_IN = 3.8;

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);   // crack + flash overlay
  const speedRef = useRef<HTMLDivElement>(null);   // speed-line container
  const auraRef = useRef<HTMLDivElement>(null);   // CSS aura ring
  const logoRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const pointer = useRef({ mx: 0.5, my: 0.5, tx: 0, ty: 0, x: 0, y: 0 });
  const firedRef = useRef(new Set<string>());
  const t0Ref = useRef(0);
  const rafRef = useRef(0);

  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);  // 0=pre, 1=crack, 2=speedline, 3=aura
  // Defer HeroGL React render by 600 ms so the crash animation runs uncontested
  // on CPU/GPU. The prefetch above already fetches the chunk during this window.
  const [glMounted, setGlMounted] = useState(false);

  const fireCue = useCallback((name: string) => {
    if (firedRef.current.has(name)) return;
    firedRef.current.add(name);
    document.documentElement.classList.add(`is-${name}`);
  }, []);

  // Trigger GL mount after 600 ms — chunk is already prefetched, so this just
  // controls when React creates the R3F canvas (avoiding GPU contest with crack/flash).
  useEffect(() => {
    const id = setTimeout(() => setGlMounted(true), 600);
    return () => clearTimeout(id);
  }, []);

  // ─── Canvas: particles ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let auraActive = false;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onPtr = (e: PointerEvent) => {
      pointer.current.mx = e.clientX / window.innerWidth;
      pointer.current.my = e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onPtr, { passive: true });

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.45;
      const elapsed = (performance.now() - t0Ref.current) / 1000;

      // Spawn aura particles during phase 3
      if (elapsed > PHASE3_START && elapsed < PHASE3_START + 1.8) {
        auraActive = true;
        if (particles.current.length < 120) {
          for (let s = 0; s < 4; s++) {
            particles.current.push(spawnAuraParticle(cx, cy, elapsed));
          }
        }
      }

      // Always spawn idle embers after logo settles
      if (elapsed > LOGO_IN + LOGO_DUR && particles.current.filter(p => p.phase === 'ember').length < 60) {
        particles.current.push(spawnEmber(canvas, pointer.current.mx));
      }

      // Update & draw all particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life--;
        if (p.life <= 0) { particles.current.splice(i, 1); continue; }
        const lt = p.life / p.maxLife;
        p.alpha = lt < 0.15 ? lt / 0.15 : lt;
        p.alpha = Math.min(1, p.alpha) * (p.phase === 'spiral' ? 0.85 : 0.65);
        p.vy -= 0.01;
        p.vx *= 0.988;
        p.x += p.vx;
        p.y += p.vy;

        const r = Math.round(255 - p.hue * 1.2);
        const g = Math.round(p.hue * 0.7 * lt);
        const b = 10;

        // Glow
        if (p.phase === 'spiral') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * lt * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * 0.2})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * lt, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();
      }

      // Draw aura ring glow on canvas (dynamic)
      if (auraActive && elapsed < PHASE3_START + 2.2) {
        const prog = clamp((elapsed - PHASE3_START) / 1.4);
        const radius = 30 + prog * 140;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(222,27,28,${0.18 * (1 - prog)})`);
        grad.addColorStop(0.6, `rgba(222,27,28,${0.08 * (1 - prog)})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('pointermove', onPtr); };
  }, []);

  // ─── Main orchestration loop ────────────────────────────────────────────────
  useEffect(() => {
    t0Ref.current = performance.now();

    const coarse = matchMedia('(pointer: coarse)').matches;
    const onPtr2 = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!coarse) window.addEventListener('pointermove', onPtr2, { passive: true });

    let last = performance.now();

    function frame(now: number) {
      const t = (now - t0Ref.current) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      // Fire CSS cues
      for (const [at, name] of CUES) { if (t >= at) fireCue(name); }

      // ── Phase transitions ──
      if (t >= 0.1 && t < PHASE1_END) setPhase(1);
      else if (t >= PHASE1_END && t < PHASE2_END) setPhase(2);
      else if (t >= PHASE2_END) setPhase(3);

      // ── Overlay crack flash ──
      if (overlayRef.current) {
        if (t < 0.05) {
          overlayRef.current.style.opacity = '1';
          overlayRef.current.style.display = 'block';
        } else if (t < PHASE1_END) {
          const p = clamp((t - 0.05) / (PHASE1_END - 0.05));
          overlayRef.current.style.opacity = String(1 - p);
        } else {
          overlayRef.current.style.display = 'none';
        }
      }

      // ── Speed lines ──
      if (speedRef.current) {
        if (t >= PHASE1_END && t < PHASE2_END) {
          const p = clamp((t - PHASE1_END) / 0.35);
          speedRef.current.style.opacity = String(p > 0.5 ? 2 - p * 2 : p * 2);
          speedRef.current.style.transform = `scale(${0.85 + p * 0.15})`;
          speedRef.current.style.display = 'block';
        } else {
          speedRef.current.style.display = 'none';
        }
      }

      // ── Logo entrance ──
      if (logoRef.current) {
        const lp = clamp((t - LOGO_IN) / LOGO_DUR);
        const e = lp >= 1 ? 1 : 1 - Math.pow(2, -10 * lp);
        logoRef.current.style.opacity = String(Math.min(1, lp / 0.3));
        logoRef.current.style.transform = `scale(${0.6 + e * 0.4}) translateY(${(1 - e) * 30}px)`;
        logoRef.current.style.filter = lp < 0.5
          ? `blur(${(1 - lp * 2) * 12}px) brightness(${1 + (1 - lp * 2) * 3})`
          : 'none';
      }

      // ── Subtitle ──
      if (subtitleRef.current) {
        const sp = clamp((t - SUBTITLE_IN) / 0.6);
        subtitleRef.current.style.opacity = String(sp);
        subtitleRef.current.style.transform = `translateY(${(1 - sp) * 16}px)`;
      }

      // ── Chips ──
      if (chipsRef.current) {
        const cp = clamp((t - CHIPS_IN) / 0.7);
        chipsRef.current.style.opacity = String(cp);
        chipsRef.current.style.transform = `translateY(${(1 - cp) * 12}px)`;
      }

      // ── Pointer parallax on logo ──
      const po = pointer.current;
      po.x = damp(po.x, po.tx, 3.1, dt);
      po.y = damp(po.y, po.ty, 3.1, dt);
      const gate = clamp((t - LOGO_IN - LOGO_DUR + 0.4) / 1.0);
      if (logoRef.current) {
        if (gate > 0) {
          const lp = clamp((t - LOGO_IN) / LOGO_DUR);
          const e = lp >= 1 ? 1 : 1 - Math.pow(2, -10 * lp);
          logoRef.current.style.transform =
            `scale(${0.6 + e * 0.4}) translate(${po.x * gate * 10}px, ${po.y * gate * 6}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (!coarse) window.removeEventListener('pointermove', onPtr2);
    };
  }, [fireCue]);

  return (
    <section className="hero scene" id="hero" aria-label="Hero" style={{ position: 'relative' }}>

      {/* ── WebGL Background (R3F) — deferred 600 ms, prefetched immediately ── */}
      {glMounted ? (
        <Suspense fallback={<HeroGLPlaceholder />}>
          <HeroGL />
        </Suspense>
      ) : (
        <HeroGLPlaceholder />
      )}

      {/* ── Ember / aura canvas ── */}
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />

      {/* ── Phase 1: Screen crack + white flash overlay ── */}
      <div
        ref={overlayRef}
        className="hero__crack-overlay"
        aria-hidden="true"
      >
        {/* SVG crack lines */}
        <svg className="hero__cracks" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          {/* Main crack from centre */}
          <line x1="500" y1="300" x2="220" y2="60" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="500" y1="300" x2="780" y2="40" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="500" y1="300" x2="90" y2="400" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
          <line x1="500" y1="300" x2="910" y2="450" stroke="white" strokeWidth="1.0" strokeLinecap="round" />
          <line x1="500" y1="300" x2="350" y2="600" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="500" y1="300" x2="650" y2="590" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
          {/* Branch cracks */}
          <line x1="350" y1="180" x2="200" y2="140" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
          <line x1="650" y1="160" x2="800" y2="200" stroke="white" strokeWidth="0.6" strokeLinecap="round" />
          <line x1="250" y1="350" x2="140" y2="280" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
          <line x1="750" y1="370" x2="860" y2="300" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
        </svg>
        {/* White flash */}
        <div className="hero__flash" />
      </div>

      {/* ── Phase 2: Speed lines ── */}
      <div ref={speedRef} className="hero__speed-lines" aria-hidden="true" style={{ display: 'none' }}>
        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i / 36) * Math.PI * 2;
            const cx = 500, cy = 300;
            const r1 = 60 + (i % 3) * 20;
            const r2 = 520 + (i % 4) * 60;
            return (
              <line
                key={i}
                x1={cx + Math.cos(angle) * r1} y1={cy + Math.sin(angle) * r1}
                x2={cx + Math.cos(angle) * r2} y2={cy + Math.sin(angle) * r2}
                stroke="white"
                strokeWidth={0.4 + (i % 5) * 0.15}
                strokeLinecap="round"
                opacity={0.3 + (i % 3) * 0.15}
              />
            );
          })}
        </svg>
        {/* Impact rings */}
        <div className="hero__impact-ring hero__impact-ring--1" />
        <div className="hero__impact-ring hero__impact-ring--2" />
        <div className="hero__impact-ring hero__impact-ring--3" />
      </div>

      {/* ── Ambient red glow ── */}
      <div className="hero__post" aria-hidden="true" />

      {/* ── Anime warrior character — The Architect ── */}
      <div
        className={`hero-char hero-char--p${phase}`}
        aria-hidden="true"
      >
        <HeroCharacter phase={phase} />
      </div>

      {/* ── Aura ring (CSS) ── */}
      <div
        ref={auraRef}
        className={`hero__aura${phase >= 3 ? ' is-active' : ''}`}
        aria-hidden="true"
      />

      {/* ── Logo: Geometric tech emblem ── */}
      <div
        ref={logoRef}
        className="hero__logo"
        style={{ opacity: 0, transform: 'scale(0.6) translateY(30px)' }}
        aria-label="DKR — Devesh K R"
      >
        {/* SVG geometric faction emblem */}
        <svg
          className="hero__emblem"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Outer hexagon */}
          <polygon
            points="100,8 172,50 172,150 100,192 28,150 28,50"
            stroke="#de1b1c" strokeWidth="2" fill="none"
            className="emblem-hex emblem-hex--outer"
          />
          {/* Inner hexagon */}
          <polygon
            points="100,28 154,58 154,142 100,172 46,142 46,58"
            stroke="#de1b1c" strokeWidth="1" fill="none" opacity="0.4"
            className="emblem-hex emblem-hex--inner"
          />
          {/* Central diamond */}
          <polygon
            points="100,60 130,100 100,140 70,100"
            stroke="#de1b1c" strokeWidth="1.5" fill="rgba(222,27,28,0.08)"
            className="emblem-diamond"
          />
          {/* Corner tick marks */}
          <line x1="100" y1="8" x2="100" y2="22" stroke="#de1b1c" strokeWidth="2" />
          <line x1="100" y1="178" x2="100" y2="192" stroke="#de1b1c" strokeWidth="2" />
          <line x1="28" y1="50" x2="40" y2="57" stroke="#de1b1c" strokeWidth="2" />
          <line x1="160" y1="57" x2="172" y2="50" stroke="#de1b1c" strokeWidth="2" />
          <line x1="28" y1="150" x2="40" y2="143" stroke="#de1b1c" strokeWidth="2" />
          <line x1="160" y1="143" x2="172" y2="150" stroke="#de1b1c" strokeWidth="2" />
          {/* DKR initials */}
          <text
            x="100" y="108"
            textAnchor="middle"
            fontFamily="'Anton', sans-serif"
            fontSize="38"
            fill="#de1b1c"
            letterSpacing="4"
            className="emblem-initials"
          >DKR</text>
          {/* Scan lines (decorative) */}
          <line x1="46" y1="95" x2="70" y2="95" stroke="#de1b1c" strokeWidth="0.5" opacity="0.5" />
          <line x1="130" y1="95" x2="154" y2="95" stroke="#de1b1c" strokeWidth="0.5" opacity="0.5" />
          <line x1="46" y1="105" x2="70" y2="105" stroke="#de1b1c" strokeWidth="0.5" opacity="0.3" />
          <line x1="130" y1="105" x2="154" y2="105" stroke="#de1b1c" strokeWidth="0.5" opacity="0.3" />
          {/* Glitch bar — animates in CSS */}
          <rect x="60" y="88" width="80" height="3" fill="#de1b1c" opacity="0.12" className="emblem-glitch" />
        </svg>

        {/* Name below emblem */}
        <div className="hero__logo-name" aria-label="Devesh K R">
          <span className="logo-name__first">DEVESH</span>
          <span className="logo-name__sep"> </span>
          <span className="logo-name__last">K R</span>
        </div>
      </div>

      {/* ── Subtitle (kinetic split text) ── */}
      <div
        ref={subtitleRef}
        className="hero__artist"
        style={{ opacity: 0, transform: 'translateY(16px)' }}
      >
        <KineticText>AI Engineer & Full-Stack Developer</KineticText>
      </div>

      {/* ── Spec chips ── */}
      <div
        ref={chipsRef}
        className="hero__chips"
        role="list"
        aria-label="Specialisations"
        style={{ opacity: 0, transform: 'translateY(12px)' }}
      >
        {['React', 'Three.js', 'TypeScript', 'AI / ML', 'Cloud'].map((s) => (
          <span key={s} className="chip" role="listitem">{s}</span>
        ))}
      </div>

      {/* ── Corner arrows ── */}
      <div className="hero__arrows" aria-hidden="true">
        <div className="corner-arrow corner-arrow--tl" />
        <div className="corner-arrow corner-arrow--tr" />
        <div className="corner-arrow corner-arrow--bl" />
        <div className="corner-arrow corner-arrow--br" />
      </div>

      {/* ── Dot grid ── */}
      <div className="hero__dots" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => <span key={i} />)}
      </div>

      {/* ── Scroll indicator ── */}
      <div className="hero__scroll" aria-label="Scroll to explore">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
