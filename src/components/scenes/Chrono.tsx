// Chrono.tsx — GOD MODE: Speed-line reveal, glitch year buttons, cinematic entries

import { useRef, useState, useCallback, useEffect } from 'react';
import { EXPERIENCE, ExperienceEntry } from '../../data/sceneConfig';
import { useSceneVisibility } from '../../hooks/useSceneVisibility';

const YEARS = [2022, 2023, 2024, 2025];

// ── Speed-line canvas ─────────────────────────────────────────────────────────
function SpeedLines({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const COUNT = 28;
    let frame = 0;
    const MAX_FRAMES = 18;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const progress = frame / MAX_FRAMES;
      for (let i = 0; i < COUNT; i++) {
        const angle = (i / COUNT) * Math.PI * 2;
        const len   = (80 + Math.random() * 120) * (1 - progress * 0.6);
        const x1 = cx + Math.cos(angle) * 20;
        const y1 = cy + Math.sin(angle) * 20;
        const x2 = cx + Math.cos(angle) * (20 + len);
        const y2 = cy + Math.sin(angle) * (20 + len);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(222,27,28,${((1 - progress) * 0.55).toFixed(2)})`;
        ctx.lineWidth = 1.2;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      frame++;
      if (frame < MAX_FRAMES) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    draw();
  }, [trigger]);

  return <canvas ref={canvasRef} className="chrono__speed-lines" aria-hidden="true" />;
}

// ── Year button ───────────────────────────────────────────────────────────────
function YearBtn({
  year, active, onClick,
}: { year: number; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`year-btn year-btn--god${active ? ' is-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      data-text={year}
    >
      {year}
    </button>
  );
}

// ── Entry card ────────────────────────────────────────────────────────────────
function EntryCard({
  entry, index, visible,
}: { entry: ExperienceEntry; index: number; visible: boolean }) {
  return (
    <article
      className={`chrono__entry${visible ? ' is-visible' : ''}`}
      role="listitem"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* Timeline node */}
      <div className="chrono__node" aria-hidden="true">
        <span className="chrono__node-dot" />
        <span className="chrono__node-line" />
      </div>

      <div className="chrono__entry-period">{entry.period}</div>
      <div className="chrono__entry-content">
        <div className="chrono__entry-role">{entry.role}</div>
        <div className="chrono__entry-org">{entry.org}</div>
        <p className="chrono__entry-desc">{entry.desc}</p>
        <div className="chrono__entry-tags" role="list">
          {entry.tags.map((t) => (
            <span key={t} className="chip" role="listitem">{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

// ── Chrono ────────────────────────────────────────────────────────────────────
export default function Chrono() {
  const { ref, isVisible } = useSceneVisibility({ threshold: 0.1 });
  const [activeYear, setActiveYear] = useState(2024);
  const [speedTrigger, setSpeedTrigger] = useState(0);
  const [entriesVisible, setEntriesVisible] = useState(false);

  const visible: ExperienceEntry[] = EXPERIENCE.filter((e) => e.year <= activeYear);

  const selectYear = useCallback((y: number) => {
    setEntriesVisible(false);
    setSpeedTrigger((t) => t + 1);
    setTimeout(() => {
      setActiveYear(y);
      setEntriesVisible(true);
    }, 120);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const id = setTimeout(() => setEntriesVisible(true), 200);
      return () => clearTimeout(id);
    }
  }, [isVisible]);

  return (
    <div ref={ref}>
      <section className="chrono scene" id="chrono" aria-label="Experience Timeline">
        <SpeedLines trigger={speedTrigger} />

        <header className="chrono__header">
          <div className="section-label" style={{ marginBottom: 20 }}>
            02 / Chrono
          </div>
          <h2 className="chrono__heading">
            The <em>Years</em> That<br />Shaped Me
          </h2>
        </header>

        {/* Year navigation */}
        <nav className="chrono__years" aria-label="Select year">
          {YEARS.map((y) => (
            <YearBtn
              key={y}
              year={y}
              active={y === activeYear}
              onClick={() => selectYear(y)}
            />
          ))}
        </nav>

        {/* Experience entries */}
        <div className="chrono__entries" role="list">
          {visible.map((entry, i) => (
            <EntryCard
              key={entry.period}
              entry={entry}
              index={i}
              visible={entriesVisible}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
