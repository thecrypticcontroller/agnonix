// Universe.tsx — GOD MODE: Constellation particle web + holographic 3D-tilt skill cards
// Devil Mode: red energy veins between nodes, cursor repel, holographic shimmer
// PERF: passive resize listener, mobile star-count reduction

import { useEffect, useRef, useState, useCallback } from 'react';
import { SKILL_CARDS } from '../../data/sceneConfig';
import { useSceneVisibility } from '../../hooks/useSceneVisibility';

// ── Device capability ─────────────────────────────────────────────────────────
const IS_TOUCH = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches;
// Fewer stars on mobile — still looks good, saves half the O(n²) link checks
const STAR_COUNT = IS_TOUCH ? 40 : 80;

// ── Constellation canvas ──────────────────────────────────────────────────────
interface Star { x: number; y: number; vx: number; vy: number; r: number; }

function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 0.8 + Math.random() * 1.6,
      }));
    };
    resize();
    // FIX: passive: true on resize listener
    window.addEventListener('resize', resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    if (!IS_TOUCH) canvas.addEventListener('mousemove', onMove);

    const LINK_DIST = 130;
    const MOUSE_DIST = 170;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const stars = starsRef.current;
      const { x: mx, y: my } = mouseRef.current;

      stars.forEach((s) => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = width; if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height; if (s.y > height) s.y = 0;
      });

      // O(n²) link loop — with STAR_COUNT=40 on mobile this is 780 checks vs 3160
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.4;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(222,27,28,${alpha.toFixed(2)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
        if (!IS_TOUCH) {
          const mdx = stars[i].x - mx;
          const mdy = stars[i].y - my;
          const md = Math.sqrt(mdx * mdx + mdy * mdy);
          if (md < MOUSE_DIST) {
            const alpha = (1 - md / MOUSE_DIST) * 0.75;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(222,27,28,${alpha.toFixed(2)})`;
            ctx.lineWidth = 1.1;
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      }

      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(222,27,28,0.75)';
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      if (!IS_TOUCH) canvas.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="universe__canvas" aria-hidden="true" />;
}

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
function SkillCard({ card, index, materialised }: {
  card: typeof SKILL_CARDS[number];
  index: number;
  materialised: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const floatDur = 3 + (index % 5) * 0.8;
  const floatDelay = ((index * 137.5) % 4).toFixed(2);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transition = 'transform 0.1s linear';
    el.style.transform = `perspective(600px) rotateY(${(x * 20).toFixed(1)}deg) rotateX(${(-y * 16).toFixed(1)}deg) scale(1.07)`;
    el.style.setProperty('--shine-x', `${((x + 0.5) * 100).toFixed(0)}%`);
    el.style.setProperty('--shine-y', `${((y + 0.5) * 100).toFixed(0)}%`);
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.6s var(--ease-out)';
    el.style.transform = '';
    if (materialised) {
      setTimeout(() => {
        if (el) el.style.transition = '';
      }, 600);
    }
  }, [materialised]);

  return (
    <article
      ref={cardRef}
      className="skill-card skill-card--god"
      role="listitem"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transitionDelay: `${index * 0.045}s`,
        ...(materialised ? {
          animation: `floatCard ${floatDur}s ease-in-out ${floatDelay}s infinite`,
        } : {}),
      } as React.CSSProperties}
    >
      <div className="skill-card__holo" aria-hidden="true" />
      <div className="skill-card__scan" aria-hidden="true" />
      <div className="skill-card__border" aria-hidden="true" />
      <div className="skill-card__icon" aria-hidden="true">{card.icon}</div>
      <div className="skill-card__name">{card.name}</div>
      <div className="skill-card__tags" role="list">
        {card.tags.map((tag) => (
          <span key={tag} className="skill-card__tag chip" role="listitem">{tag}</span>
        ))}
      </div>
    </article>
  );
}

// ── Universe ──────────────────────────────────────────────────────────────────
export default function Universe() {
  const { ref, isVisible } = useSceneVisibility({ threshold: 0.12 });
  const gridRef = useRef<HTMLDivElement>(null);
  const [materialised, setMaterialised] = useState(false);

  useEffect(() => {
    if (isVisible && !materialised) {
      const id = setTimeout(() => setMaterialised(true), 80);
      return () => clearTimeout(id);
    }
  }, [isVisible, materialised]);

  useEffect(() => {
    gridRef.current?.classList.toggle('is-materialised', materialised);
  }, [materialised]);

  return (
    <div ref={ref}>
      <section className="universe scene" id="universe" aria-label="Skills Universe">
        <ConstellationCanvas />

        <div className="universe__bg" aria-hidden="true">
          <div className="universe__ring universe__ring--1" />
          <div className="universe__ring universe__ring--2" />
          <div className="universe__ring universe__ring--3" />
        </div>

        <header className="universe__header">
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>
            01 / Universe
          </div>
          <h2 className="universe__heading">
            The <em>Tools</em> of<br />My Universe
          </h2>
          <p className="universe__sub">Full-stack · AI · Rendering · Cloud</p>
        </header>

        <div className="universe__grid" ref={gridRef} role="list">
          {SKILL_CARDS.map((card, i) => (
            <SkillCard key={card.name} card={card} index={i} materialised={materialised} />
          ))}
        </div>
      </section>
    </div>
  );
}
