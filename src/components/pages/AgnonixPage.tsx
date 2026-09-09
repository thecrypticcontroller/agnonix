// AgnonixPage.tsx — Cinematic case study for AGNONIX B2B AI SaaS
// Full-page deep-dive: problem → architecture → stack → traction → CTA

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── Architecture diagram ──────────────────────────────────────────────────────
interface ArchNode {
  id: string; label: string; sublabel?: string;
  x: number; y: number; w: number; h: number;
  accent: boolean;
}

const ARCH_NODES: ArchNode[] = [
  { id: 'ui',       label: 'React UI',        sublabel: 'Vite · TS',            x: 5,  y: 10, w: 18, h: 14, accent: false },
  { id: 'api',      label: 'FastAPI',          sublabel: 'Auth · Billing',        x: 5,  y: 40, w: 18, h: 14, accent: true  },
  { id: 'lang',     label: 'LangGraph',        sublabel: 'Agent orchestration',   x: 33, y: 22, w: 20, h: 16, accent: true  },
  { id: 'nim',      label: 'NVIDIA NIM',       sublabel: 'Llama 70B',             x: 63, y: 10, w: 20, h: 14, accent: true  },
  { id: 'chroma',   label: 'ChromaDB',         sublabel: 'Per-org vector store',  x: 63, y: 40, w: 20, h: 14, accent: false },
  { id: 'supabase', label: 'Supabase',         sublabel: 'Multi-tenant DB',       x: 33, y: 60, w: 20, h: 14, accent: false },
  { id: 'razorpay', label: 'Razorpay',         sublabel: 'Billing & subscriptions', x: 5, y: 70, w: 18, h: 14, accent: false },
];

// cx/cy helpers
const cx = (n: ArchNode) => n.x + n.w / 2;
const cy = (n: ArchNode) => n.y + n.h / 2;

const ARCH_EDGES: [string, string][] = [
  ['ui', 'api'], ['api', 'lang'], ['lang', 'nim'], ['lang', 'chroma'],
  ['api', 'supabase'], ['api', 'razorpay'],
];

function ArchDiagram() {
  const nodeMap = Object.fromEntries(ARCH_NODES.map(n => [n.id, n]));
  return (
    <svg
      viewBox="0 0 90 90"
      style={{ width: '100%', maxWidth: 640, display: 'block', margin: '0 auto' }}
      aria-label="AGNONIX system architecture"
    >
      <defs>
        <marker id="ag-arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="rgba(222,27,28,0.5)" />
        </marker>
        <filter id="ag-glow">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {ARCH_EDGES.map(([a, b], i) => {
        const na = nodeMap[a], nb = nodeMap[b];
        return (
          <line key={i}
            x1={cx(na)} y1={cy(na)} x2={cx(nb)} y2={cy(nb)}
            stroke="rgba(222,27,28,0.25)" strokeWidth="0.6"
            markerEnd="url(#ag-arrow)"
          />
        );
      })}

      {/* Nodes */}
      {ARCH_NODES.map(n => (
        <g key={n.id} filter={n.accent ? 'url(#ag-glow)' : undefined}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={2}
            fill="rgba(8,8,8,0.95)"
            stroke={n.accent ? '#de1b1c' : 'rgba(255,255,255,0.1)'}
            strokeWidth={n.accent ? 0.8 : 0.5}
          />
          <text x={cx(n)} y={n.y + 6} textAnchor="middle"
            fontSize={n.accent ? 4 : 3.5} fontWeight={n.accent ? 'bold' : 'normal'}
            fill={n.accent ? '#ff6666' : 'rgba(255,255,255,0.7)'}>
            {n.label}
          </text>
          {n.sublabel && (
            <text x={cx(n)} y={n.y + 11} textAnchor="middle" fontSize="3"
              fill="rgba(255,255,255,0.3)">
              {n.sublabel}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ── Animated stat counter ─────────────────────────────────────────────────────
function StatCounter({ label, value, suffix = '' }: { label: string; value: string; suffix?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '2.4rem', fontWeight: 900, color: '#de1b1c',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>
        {value}<span style={{ fontSize: '1.2rem' }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6, letterSpacing: '0.08em' }}>
        {label}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AgnonixPage() {
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
    <div className="cs-page" style={{ background: '#080808', color: '#e8e8e8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .cs-page [data-cs-reveal] {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .cs-page [data-cs-reveal].cs-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .ag-hero {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 80px 8vw 64px;
          position: relative;
          border-bottom: 1px solid rgba(222,27,28,0.12);
          background:
            radial-gradient(ellipse 60% 50% at 80% 30%, rgba(222,27,28,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(222,27,28,0.05) 0%, transparent 70%);
        }
        .ag-eyebrow {
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #de1b1c; margin-bottom: 16px; font-family: monospace;
        }
        .ag-title {
          font-size: clamp(3rem, 9vw, 7rem); font-weight: 900; line-height: 0.9;
          letter-spacing: -0.03em; margin-bottom: 20px;
          background: linear-gradient(135deg, #fff 50%, rgba(222,27,28,0.6));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ag-subtitle {
          font-size: 1.1rem; color: rgba(255,255,255,0.5); max-width: 540px;
          line-height: 1.6; margin-bottom: 36px;
        }
        .ag-stats {
          display: flex; gap: 48px; flex-wrap: wrap; align-items: flex-end;
        }
        .ag-section {
          padding: 80px 8vw;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ag-label {
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(222,27,28,0.6); margin-bottom: 20px; font-family: monospace;
        }
        .ag-section-title {
          font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700;
          margin-bottom: 20px; color: #fff;
        }
        .ag-body {
          font-size: 1rem; line-height: 1.75; color: rgba(255,255,255,0.6); max-width: 680px;
        }
        .ag-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 24px; }
        .ag-tag {
          padding: 5px 12px; border: 1px solid rgba(222,27,28,0.3); border-radius: 3px;
          font-size: 11px; color: rgba(222,27,28,0.8); font-family: monospace; letter-spacing: 0.05em;
        }
        .ag-two-col {
          display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start;
        }
        @media (max-width: 768px) { .ag-two-col { grid-template-columns: 1fr; } }
        .ag-feature-list { list-style: none; padding: 0; margin: 0; }
        .ag-feature-list li {
          padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.95rem; color: rgba(255,255,255,0.6); line-height: 1.5;
          display: flex; gap: 12px; align-items: flex-start;
        }
        .ag-feature-list li::before {
          content: '▸'; color: #de1b1c; font-size: 0.7rem; margin-top: 4px; flex-shrink: 0;
        }
        .ag-traction-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px; margin-top: 32px;
        }
        .ag-traction-card {
          padding: 24px; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px;
          background: rgba(255,255,255,0.02);
        }
        .ag-traction-icon { font-size: 1.5rem; margin-bottom: 12px; }
        .ag-traction-title { font-size: 0.9rem; font-weight: 600; color: #fff; margin-bottom: 6px; }
        .ag-traction-desc { font-size: 0.8rem; color: rgba(255,255,255,0.4); line-height: 1.5; }
        .ag-cta {
          padding: 80px 8vw; display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
        }
        .ag-link {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border: 1px solid #de1b1c; color: #de1b1c;
          text-decoration: none; font-size: 13px; font-family: monospace;
          letter-spacing: 0.08em; border-radius: 3px; transition: background 0.2s, color 0.2s;
        }
        .ag-link:hover { background: #de1b1c; color: #000; }
        .ag-link--ghost { border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); }
        .ag-link--ghost:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .ag-back {
          position: fixed; top: 20px; left: 24px; z-index: 100;
          display: flex; align-items: center; gap: 8px;
          color: rgba(222,27,28,0.85); text-decoration: none;
          font-size: 13px; font-family: monospace; letter-spacing: 0.05em; transition: color 0.2s;
        }
        .ag-back:hover { color: #de1b1c; }
      `}</style>

      <Link to="/" className="ag-back">← back</Link>

      {/* Hero */}
      <div className="ag-hero">
        <p className="ag-eyebrow">Case Study · 02 · AI SaaS</p>
        <h1 className="ag-title">AGNONIX</h1>
        <p className="ag-subtitle">
          Bootstrapped B2B AI SaaS — intelligent automation for teams on their own data.
          RAG pipelines, LangGraph orchestration, NVIDIA NIM inference. Shipped solo.
        </p>
        <div className="ag-stats">
          <StatCounter value="70B" label="Llama via NVIDIA NIM" />
          <StatCounter value="100%" label="Solo-built" />
          <StatCounter value="Full" label="Billing + Auth + Onboarding" suffix=" stack" />
        </div>
      </div>

      {/* Problem */}
      <div className="ag-section" data-cs-reveal>
        <p className="ag-label">01 · Problem</p>
        <h2 className="ag-section-title">Teams need AI on their own data — without sending it to OpenAI.</h2>
        <p className="ag-body">
          Most AI tooling forces teams to send proprietary data to third-party LLM APIs. Enterprise
          solutions require data science teams to set up. Smaller alternatives lack the inference
          quality. There was a gap: a production-grade, multi-tenant AI platform that keeps your
          data private, runs powerful models, and ships with billing and auth already wired.
        </p>
      </div>

      {/* Architecture */}
      <div className="ag-section" data-cs-reveal>
        <p className="ag-label">02 · Architecture</p>
        <div className="ag-two-col">
          <div>
            <h2 className="ag-section-title">A full production stack, shipped solo.</h2>
            <ul className="ag-feature-list">
              <li>Per-org ChromaDB vector stores — private RAG on proprietary documents, fully isolated between tenants</li>
              <li>LangGraph agent orchestration — multi-step workflows with state persistence and tool integration</li>
              <li>NVIDIA NIM (Llama 70B) — on-prem-grade inference quality without cloud LLM data exposure</li>
              <li>Supabase multi-tenant backend — Row Level Security enforces org isolation at the database layer</li>
              <li>Razorpay billing — subscription plans, usage metering, and payment flow fully integrated</li>
            </ul>
            <div className="ag-tags">
              {['FastAPI', 'React', 'LangGraph', 'NVIDIA NIM', 'Supabase', 'ChromaDB', 'Razorpay', 'TypeScript'].map(t => (
                <span key={t} className="ag-tag">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <ArchDiagram />
          </div>
        </div>
      </div>

      {/* What's shipped */}
      <div className="ag-section" data-cs-reveal>
        <p className="ag-label">03 · What's Shipped</p>
        <h2 className="ag-section-title">A live product — not a prototype.</h2>
        <div className="ag-traction-grid">
          {[
            { icon: '🔐', title: 'Auth & Multi-tenancy', desc: 'JWT-based auth with per-org data isolation enforced at RLS level. No org can see another\'s data.' },
            { icon: '💳', title: 'Billing & Subscriptions', desc: 'Razorpay integration with subscription tiers, usage limits, and automated billing flow.' },
            { icon: '🤖', title: 'AI Workflows', desc: 'LangGraph-powered multi-step agent pipelines running Llama 70B via NVIDIA NIM on private docs.' },
            { icon: '📄', title: 'RAG on Private Data', desc: 'Per-org ChromaDB vector stores. Upload documents, query them intelligently via the AI layer.' },
            { icon: '🚀', title: 'Onboarding Flow', desc: 'End-to-end user onboarding: account creation, org setup, plan selection, and first AI query in under 5 minutes.' },
            { icon: '📊', title: 'Usage Dashboard', desc: 'Query history, token consumption, and billing status surfaced in a clean React dashboard.' },
          ].map(card => (
            <div key={card.title} className="ag-traction-card">
              <div className="ag-traction-icon">{card.icon}</div>
              <div className="ag-traction-title">{card.title}</div>
              <div className="ag-traction-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current state */}
      <div className="ag-section" data-cs-reveal>
        <p className="ag-label">04 · Status</p>
        <h2 className="ag-section-title">Live, iterating toward first paying customers.</h2>
        <p className="ag-body">
          AGNONIX is an active bootstrapped product. The full billing, auth, onboarding, and AI
          workflow stack is shipped and functional. Current focus: user acquisition and refining
          the onboarding flow based on early user feedback. Built entirely solo — from FastAPI
          backend to React frontend to deployment infrastructure.
        </p>
      </div>

      {/* CTA */}
      <div className="ag-cta">
        <a
          href="https://github.com/thecrypticcontroller"
          target="_blank"
          rel="noreferrer"
          className="ag-link"
        >
          GitHub →
        </a>
        <Link to="/projects/shadowtrace" className="ag-link ag-link--ghost">
          ← ShadowTrace
        </Link>
        <Link to="/" className="ag-link ag-link--ghost">
          ← Back to portfolio
        </Link>
      </div>
    </div>
  );
}
