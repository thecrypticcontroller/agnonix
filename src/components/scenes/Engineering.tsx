// Engineering.tsx — GOD MODE 2026: Asymmetric Bento grid + Matrix rain + micro-hover states
// PERF: ResizeObserver for matrix canvas, passive resize listener

import { useEffect, useRef, useState } from 'react';
import { useSceneVisibility } from '../../hooks/useSceneVisibility';

// ── Matrix rain ───────────────────────────────────────────────────────────────
function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]()=+-*/&|^%$#@!';
    const FS = 13;
    let drops: number[] = [];
    let rafId = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drops = Array.from(
        { length: Math.floor(canvas.width / FS) },
        () => Math.random() * -50
      );
    };
    resize();

    // FIX: ResizeObserver instead of window resize — scoped to canvas element,
    // avoids the global listener and fires correctly when the section reveals.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = `rgba(222,27,28,${(0.1 + Math.random() * 0.18).toFixed(2)})`;
        ctx.font = `${FS}px 'Courier New',monospace`;
        ctx.fillText(ch, i * FS, y * FS);
        if (y * FS > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="engineering__matrix" aria-hidden="true" />;
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimCounter({
  to, suffix = '', dur = 1600,
}: { to: number; suffix?: string; dur?: number }) {
  const [val, setVal]   = useState(0);
  const [done, setDone] = useState(false);
  const ran   = useRef(false);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
          else setDone(true);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (elRef.current) io.observe(elRef.current);
    return () => io.disconnect();
  }, [to, dur]);

  return (
    <div ref={elRef} className={`bento__stat-num${done ? ' is-done' : ''}`}>
      {val}{suffix}
    </div>
  );
}

// ── Bento Card with micro-hover tilt + spotlight ──────────────────────────────
function BentoCard({
  className = '',
  children,
  accent = false,
}: {
  className?: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    el.style.setProperty('--bx', `${(x * 8).toFixed(1)}deg`);
    el.style.setProperty('--by', `${(-y * 6).toFixed(1)}deg`);
    el.style.setProperty('--blx', `${(e.clientX - rect.left).toFixed(0)}px`);
    el.style.setProperty('--bly', `${(e.clientY - rect.top).toFixed(0)}px`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--bx', '0deg');
    el.style.setProperty('--by', '0deg');
  };

  return (
    <div
      ref={cardRef}
      className={`bento-card${accent ? ' bento-card--accent' : ''} ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="bento-card__glow" aria-hidden="true" />
      {children}
    </div>
  );
}

// ── Engineering ───────────────────────────────────────────────────────────────
export default function Engineering() {
  const { ref } = useSceneVisibility({ threshold: 0.1 });

  const STACK_ICONS = [
    { label: 'TypeScript', icon: 'TS' },
    { label: 'React',      icon: 'Re' },
    { label: 'Node.js',    icon: 'No' },
    { label: 'Python',     icon: 'Py' },
    { label: 'Three.js',   icon: '3J' },
    { label: 'PostgreSQL', icon: 'Pg' },
    { label: 'Docker',     icon: 'Dk' },
    { label: 'AWS',        icon: 'AW' },
  ];

  const PRINCIPLES = [
    'TypeScript from top to bottom',
    'Tests that mean something',
    "Deploys that don't wake anyone at 3am",
    'Cinematic WebGL experiences',
    'Distributed back-end systems',
    'Zero-compromise UX',
  ];

  return (
    <div ref={ref}>
      <section className="engineering scene" id="engineering" aria-label="About">
        <MatrixCanvas />
        <div className="engineering__overlay" aria-hidden="true" />

        <div className="engineering__inner">
          <div className="section-label" style={{ marginBottom: 32 }}>04 / Engineering</div>

          {/* ── Asymmetric Bento Grid ─────────────────────────────────────── */}
          <div className="bento-grid">

            {/* A — Hero statement */}
            <BentoCard className="bento-grid__hero" accent>
              <div className="bento__eyebrow">Philosophy</div>
              <h2 className="bento__heading">
                Built to <em>Last</em>,<br />Designed to <em>Move</em>
              </h2>
              <p className="bento__sub">
                I build systems at the intersection of performance and beauty —
                where the code is as considered as the design. Every project begins
                with a question: <em>what does this need to feel like?</em>
              </p>
            </BentoCard>

            {/* B — Years stat */}
            <BentoCard className="bento-grid__stat-a">
              <div className="bento__eyebrow">Experience</div>
              <AnimCounter to={3} suffix="+" dur={1400} />
              <div className="bento__stat-label">Years of<br />production code</div>
            </BentoCard>

            {/* C — Projects stat */}
            <BentoCard className="bento-grid__stat-b">
              <div className="bento__eyebrow">Output</div>
              <AnimCounter to={12} suffix="+" dur={1200} />
              <div className="bento__stat-label">Shipped<br />projects</div>
            </BentoCard>

            {/* D — Craft infinity */}
            <BentoCard className="bento-grid__stat-c" accent>
              <div className="bento__eyebrow">Obsession</div>
              <div className="bento__stat-num is-done">∞</div>
              <div className="bento__stat-label">Commitment<br />to craft</div>
            </BentoCard>

            {/* E — Stack icons */}
            <BentoCard className="bento-grid__stack">
              <div className="bento__eyebrow">Stack</div>
              <div className="bento__icons">
                {STACK_ICONS.map(({ label, icon }) => (
                  <div key={label} className="bento__icon-pill" title={label}>
                    <span className="bento__icon-code">{icon}</span>
                    <span className="bento__icon-label">{label}</span>
                  </div>
                ))}
              </div>
            </BentoCard>

            {/* F — Principles list */}
            <BentoCard className="bento-grid__principles">
              <div className="bento__eyebrow">Principles</div>
              <ul className="bento__list" aria-label="Engineering principles">
                {PRINCIPLES.map((p) => (
                  <li key={p} className="bento__list-item">
                    <span className="bento__list-dot" aria-hidden="true">—</span>
                    {p}
                  </li>
                ))}
              </ul>
            </BentoCard>

            {/* G — AI focus card */}
            <BentoCard className="bento-grid__ai" accent>
              <div className="bento__eyebrow">Focus 2026</div>
              <div className="bento__ai-label">AI-Augmented<br />Development</div>
              <div className="bento__ai-sub">
                LangChain · GPT-4 · Claude · RAG pipelines · Vector DBs
              </div>
            </BentoCard>

            {/* H — Chips */}
            <BentoCard className="bento-grid__chips">
              <div className="bento__eyebrow">Labels</div>
              <div className="engineering__chips">
                {[
                  'TypeScript-first', 'Zero-compromise UX', 'Ship fast, stay clean',
                  'AI-augmented dev', 'Open source minded', 'Security by design',
                ].map((c) => (
                  <span key={c} className="chip chip--outlined">{c}</span>
                ))}
              </div>
            </BentoCard>

          </div>
        </div>
      </section>
    </div>
  );
}
