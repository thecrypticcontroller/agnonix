// ShadowTracePage.tsx — Cinematic case study for ShadowTrace
// Full-page deep-dive: problem → solution → architecture → metrics → live demo data

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { trajectory } from '../../data/profile';

// ── Drift monitor live-replay canvas ──────────────────────────────────────────
function DriftCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRef   = useRef(0);
  const tickRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const PAD  = 40;
    const steps = trajectory.length;
    const colW  = (W - PAD * 2) / (steps - 1);
    const scaleY = (H - PAD * 2);

    let frame = 0;
    let animStep = 0;  // which trajectory step we're drawing toward (0..steps)

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Grid lines
      [0.25, 0.5, 0.75, 1.0].forEach(v => {
        const y = PAD + scaleY * (1 - v);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(222,27,28,0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '10px monospace';
        ctx.fillText(v.toFixed(2), 4, y + 4);
      });

      // Threshold line at 0.5
      const threshY = PAD + scaleY * 0.5;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(222,27,28,0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.moveTo(PAD, threshY); ctx.lineTo(W - PAD, threshY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(222,27,28,0.6)';
      ctx.font = '10px monospace';
      ctx.fillText('ANOMALY THRESHOLD', PAD + 4, threshY - 6);

      const drawn = Math.min(animStep, steps);

      // Draw drift line
      if (drawn > 0) {
        ctx.beginPath();
        trajectory.slice(0, drawn).forEach((s, i) => {
          const x = PAD + i * colW;
          const y = PAD + scaleY * (1 - s.drift);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(255,120,120,0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw delta bars
      trajectory.slice(0, drawn).forEach((s, i) => {
        const x = PAD + i * colW;
        const barH = scaleY * s.delta;
        const flagged = s.flagged;
        ctx.fillStyle = flagged
          ? `rgba(222,27,28,${0.5 + (frame % 60) / 120})`
          : 'rgba(222,27,28,0.25)';
        ctx.fillRect(x - 6, PAD + scaleY - barH, 12, barH);

        // Step dot
        const y = PAD + scaleY * (1 - s.drift);
        ctx.beginPath();
        ctx.arc(x, y, flagged ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = flagged ? '#de1b1c' : '#ff6666';
        ctx.fill();
        if (flagged) {
          ctx.beginPath();
          ctx.arc(x, y, 10 + (frame % 30) * 0.3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(222,27,28,${0.4 - (frame % 30) / 75})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Action label
        if (i < drawn) {
          ctx.save();
          ctx.translate(x, H - 8);
          ctx.rotate(-Math.PI / 6);
          ctx.fillStyle = flagged ? 'rgba(222,27,28,0.9)' : 'rgba(255,255,255,0.45)';
          ctx.font = `${flagged ? 'bold ' : ''}9px monospace`;
          ctx.fillText(s.action, 0, 0);
          ctx.restore();
        }
      });

      // Verdict badge on last drawn
      if (drawn > 0) {
        const last = trajectory[drawn - 1];
        const x = PAD + (drawn - 1) * colW;
        const y = PAD + scaleY * (1 - last.drift);
        if (last.flagged) {
          ctx.fillStyle = 'rgba(222,27,28,0.9)';
          ctx.roundRect(x + 10, y - 12, 64, 20, 4);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('ANOMALY', x + 16, y + 2);
        }
      }

      frame++;
      if (frame % 40 === 0 && animStep < steps) animStep++;

      tickRef.current = requestAnimationFrame(draw);
    }

    tickRef.current = requestAnimationFrame(draw);
    stepRef.current = animStep;
    return () => cancelAnimationFrame(tickRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 220, display: 'block', borderRadius: 8 }}
      aria-label="Live drift monitor visualization"
    />
  );
}

// ── Stack node diagram ────────────────────────────────────────────────────────
const STACK_NODES = [
  { label: 'Agent\nActions',     x: 10,  y: 40, color: '#555' },
  { label: 'Sentence\nEncoder',  x: 28,  y: 40, color: '#de1b1c' },
  { label: 'Cosine\nSimilarity', x: 50,  y: 40, color: '#de1b1c' },
  { label: 'Delta\nSpike?',      x: 70,  y: 40, color: '#de1b1c' },
  { label: 'SSE\nStream',        x: 88,  y: 40, color: '#888' },
];
const STACK_EDGES = [[0,1],[1,2],[2,3],[3,4]];

function StackDiagram() {
  return (
    <svg
      viewBox="0 0 100 80"
      style={{ width: '100%', maxWidth: 600, display: 'block', margin: '0 auto' }}
      aria-label="ShadowTrace architecture diagram"
    >
      {/* Edges */}
      {STACK_EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={STACK_NODES[a].x + 8} y1={STACK_NODES[a].y}
          x2={STACK_NODES[b].x - 8} y2={STACK_NODES[b].y}
          stroke="rgba(222,27,28,0.4)" strokeWidth="0.8"
          markerEnd="url(#arrow)"
        />
      ))}
      <defs>
        <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="rgba(222,27,28,0.6)" />
        </marker>
      </defs>
      {/* Nodes */}
      {STACK_NODES.map((n, i) => (
        <g key={i}>
          <rect x={n.x - 8} y={n.y - 10} width={16} height={20} rx={2}
            fill="rgba(10,10,10,0.9)" stroke={n.color} strokeWidth="0.8" />
          {n.label.split('\n').map((line, li) => (
            <text key={li} x={n.x} y={n.y - 2 + li * 6}
              textAnchor="middle" fontSize="4" fill={n.color === '#de1b1c' ? '#ff6666' : '#aaa'}>
              {line}
            </text>
          ))}
        </g>
      ))}
      {/* Labels */}
      <text x="50" y="72" textAnchor="middle" fontSize="4" fill="rgba(255,255,255,0.3)">
        FastAPI + SSE → Streamlit Dashboard
      </text>
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ShadowTracePage() {
  const [revealIdx, setRevealIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('cs-revealed');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-cs-reveal]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="cs-page">
      <style>{`
        .cs-page {
          background: #080808;
          color: #e8e8e8;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }
        .cs-back {
          position: fixed;
          top: 20px;
          left: 24px;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(222,27,28,0.85);
          text-decoration: none;
          font-size: 13px;
          font-family: monospace;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }
        .cs-back:hover { color: #de1b1c; }
        .cs-hero {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 80px 8vw 64px;
          position: relative;
          border-bottom: 1px solid rgba(222,27,28,0.12);
          background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(222,27,28,0.07) 0%, transparent 70%);
        }
        .cs-eyebrow {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #de1b1c;
          margin-bottom: 16px;
          font-family: monospace;
        }
        .cs-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #fff 60%, rgba(222,27,28,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cs-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.5);
          max-width: 520px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .cs-metrics-row {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
        }
        .cs-metric { display: flex; flex-direction: column; gap: 4px; }
        .cs-metric-val {
          font-size: 1.6rem;
          font-weight: 800;
          color: #de1b1c;
          font-variant-numeric: tabular-nums;
        }
        .cs-metric-label { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; }

        .cs-section {
          padding: 80px 8vw;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .cs-section.cs-revealed { opacity: 1; transform: translateY(0); }
        .cs-section-label {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(222,27,28,0.6);
          margin-bottom: 20px;
          font-family: monospace;
        }
        .cs-section-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 700;
          margin-bottom: 20px;
          color: #fff;
        }
        .cs-body {
          font-size: 1rem;
          line-height: 1.75;
          color: rgba(255,255,255,0.6);
          max-width: 680px;
        }
        .cs-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 24px; }
        .cs-tag {
          padding: 5px 12px;
          border: 1px solid rgba(222,27,28,0.3);
          border-radius: 3px;
          font-size: 11px;
          color: rgba(222,27,28,0.8);
          font-family: monospace;
          letter-spacing: 0.05em;
        }
        .cs-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) { .cs-two-col { grid-template-columns: 1fr; } }
        .cs-demo-box {
          background: rgba(222,27,28,0.04);
          border: 1px solid rgba(222,27,28,0.15);
          border-radius: 10px;
          padding: 24px;
        }
        .cs-demo-title {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(222,27,28,0.7);
          margin-bottom: 16px;
          font-family: monospace;
        }
        .cs-traj-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .cs-traj-step {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          font-family: monospace;
          min-width: 20px;
        }
        .cs-traj-action {
          font-size: 12px;
          font-family: monospace;
          font-weight: 600;
          min-width: 120px;
        }
        .cs-traj-action.flagged { color: #de1b1c; }
        .cs-traj-action.ok { color: rgba(255,255,255,0.5); }
        .cs-traj-note { font-size: 11px; color: rgba(255,255,255,0.35); line-height: 1.4; }
        .cs-flag-badge {
          font-size: 9px;
          background: rgba(222,27,28,0.15);
          border: 1px solid rgba(222,27,28,0.4);
          color: #de1b1c;
          padding: 2px 6px;
          border-radius: 2px;
          font-family: monospace;
          white-space: nowrap;
        }
        .cs-cta {
          padding: 80px 8vw;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }
        .cs-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border: 1px solid #de1b1c;
          color: #de1b1c;
          text-decoration: none;
          font-size: 13px;
          font-family: monospace;
          letter-spacing: 0.08em;
          border-radius: 3px;
          transition: background 0.2s, color 0.2s;
        }
        .cs-link:hover { background: #de1b1c; color: #000; }
        .cs-link--ghost {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.5);
        }
        .cs-link--ghost:hover { background: rgba(255,255,255,0.08); color: #fff; }
      `}</style>

      <Link to="/" className="cs-back">← back</Link>

      {/* Hero */}
      <div className="cs-hero">
        <p className="cs-eyebrow">Case Study · 01 · AI Safety</p>
        <h1 className="cs-title">ShadowTrace</h1>
        <p className="cs-subtitle">
          Real-time agent trajectory drift monitor. Catches jailbreaks and goal misalignment
          before damage is done — without per-call LLM overhead.
        </p>
        <div className="cs-metrics-row">
          <div className="cs-metric">
            <span className="cs-metric-val">&lt;200ms</span>
            <span className="cs-metric-label">Drift Detection Latency</span>
          </div>
          <div className="cs-metric">
            <span className="cs-metric-val">5-step</span>
            <span className="cs-metric-label">Lookahead Trajectory Graph</span>
          </div>
          <div className="cs-metric">
            <span className="cs-metric-val">Live SSE</span>
            <span className="cs-metric-label">Dashboard Stream</span>
          </div>
        </div>
      </div>

      {/* Problem */}
      <div className="cs-section" data-cs-reveal>
        <p className="cs-section-label">01 · Problem</p>
        <h2 className="cs-section-title">AI agents silently deviate mid-execution.</h2>
        <p className="cs-body">
          Multi-step AI agents are increasingly autonomous — browsing, writing files, calling APIs,
          making decisions. But when an agent drifts from its assigned task, it's invisible until
          the damage is done. Existing safety tools either require expensive per-call LLM inference
          or can only audit logs after the fact. There was no lightweight, real-time solution.
        </p>
      </div>

      {/* Solution */}
      <div className="cs-section" data-cs-reveal>
        <p className="cs-section-label">02 · Solution</p>
        <div className="cs-two-col">
          <div>
            <h2 className="cs-section-title">Embedding-based semantic drift scoring.</h2>
            <p className="cs-body">
              Each agent action is encoded into a dense vector using sentence-transformer embeddings.
              Cosine similarity between consecutive action embeddings produces a delta — a measure of
              semantic shift. When delta spikes above a configurable threshold, ShadowTrace flags the
              step as anomalous and streams a live verdict to the dashboard via FastAPI SSE.
            </p>
            <div className="cs-tags">
              {['Python', 'FastAPI', 'Sentence-Transformers', 'Scikit-learn', 'SSE', 'Streamlit'].map(t => (
                <span key={t} className="cs-tag">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <StackDiagram />
          </div>
        </div>
      </div>

      {/* Live demo */}
      <div className="cs-section" data-cs-reveal>
        <p className="cs-section-label">03 · Live Replay</p>
        <h2 className="cs-section-title">Watch a jailbreak unfold in real time.</h2>
        <p className="cs-body" style={{ marginBottom: 32 }}>
          A task: "summarise the log file." By step 3, the agent pivots — authenticating to Twitter.
          Delta spikes. ShadowTrace flags it before the tweet goes out.
        </p>
        <div className="cs-demo-box" style={{ marginBottom: 32 }}>
          <p className="cs-demo-title">Drift + Delta Monitor — Live Replay</p>
          <DriftCanvas />
        </div>
        <div className="cs-demo-box">
          <p className="cs-demo-title">Agent Trajectory Log</p>
          {trajectory.map((s, i) => (
            <div key={i} className="cs-traj-row">
              <span className="cs-traj-step">S{s.step}</span>
              <span className={`cs-traj-action ${s.flagged ? 'flagged' : 'ok'}`}>{s.action}</span>
              <span className="cs-traj-note">{s.note}</span>
              {s.flagged && <span className="cs-flag-badge">FLAGGED</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Impact */}
      <div className="cs-section" data-cs-reveal>
        <p className="cs-section-label">04 · Impact</p>
        <h2 className="cs-section-title">A novel lightweight approach to agent auditing.</h2>
        <p className="cs-body">
          ShadowTrace demonstrates that real-time agent safety monitoring is achievable without
          per-call LLM inference costs. By operating at the embedding layer, the system adds
          under 200ms latency while catching semantic pivots that rule-based systems would miss
          entirely. Built as a final-year research project; currently being extended into
          a production-grade safety layer for AGNONIX.
        </p>
      </div>

      {/* CTA */}
      <div className="cs-cta">
        <a
          href="https://github.com/syntaxcraftershub/Final_Year_Project"
          target="_blank"
          rel="noreferrer"
          className="cs-link"
        >
          View on GitHub →
        </a>
        <Link to="/projects/agnonix" className="cs-link cs-link--ghost">
          Next: AGNONIX →
        </Link>
      </div>
    </div>
  );
}
