// =========================================================
// AGNONIX — Scene Configuration
// Timeline beats from gireeshkumarreddy/cinematic-portofilo
// Adapted for Devesh Kumar | React + Vite + TypeScript
// =========================================================

// ---- Easing utilities (ported from reference src/lib/ease.js) ----

export const clamp = (v: number, a = 0, b = 1): number =>
  v < a ? a : v > b ? b : v;

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const span = (t: number, a: number, b: number): number =>
  clamp((t - a) / (b - a));

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;
export const easeOutExpo  = (t: number): number => t >= 1 ? 1 : 1 - 2 ** (-10 * t);
export const easeOutQuint = (t: number): number => 1 - (1 - t) ** 5;
export const easeOutBack  = (t: number): number => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
export const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const damp = (cur: number, target: number, lambda: number, dt: number): number =>
  lerp(cur, target, 1 - Math.exp(-lambda * dt));

// ---- Hero scene timing (Scene 1) ----
export const T = {
  heroIn:        0.30,
  heroInDur:     2.05,
  letters:       2.10,
  letterStagger: 0.145,
  letterDur:     1.65,
  ember:         2.45,
  welcome:       2.90,
  artist:        3.18,
  legend:        3.32,
  arrows:        3.46,
  dots:          3.62,
  header:        4.45,
  settled:       6.25,
} as const;

// DOM class cues — App flips these on documentElement
export const CUES: [number, string][] = [
  [T.welcome, 'welcome'],
  [T.artist,  'artist'],
  [T.legend,  'legend'],
  [T.arrows,  'arrows'],
  [T.dots,    'dots'],
  [T.header,  'header'],
  [T.settled, 'settled'],
];

// ---- Scene 2 timing (Universe) ----
export const T2 = {
  wake:        0.20,
  gather:      1.10,
  materialise: 2.50,
  matDur:      0.72,
  rise:        3.10,
  riseDur:     1.85,
  settle:      4.90,
  settleDur:   0.60,
  hold:        5.50,
  floatOn:     6.00,
  alive:       7.40,
} as const;

// ---- Master scene list ----
export interface SceneDef {
  id: string;
  label: string;
  number: string;
  route?: string;
}

export const SCENES: SceneDef[] = [
  { id: 'hero',        label: 'DKR',         number: '00' },
  { id: 'universe',    label: 'UNIVERSE',    number: '01', route: '#universe' },
  { id: 'chrono',      label: 'CHRONO',      number: '02', route: '#chrono' },
  { id: 'projects',    label: 'PROJECTS',    number: '03', route: '#projects' },
  { id: 'engineering', label: 'ENGINEERING', number: '04', route: '#engineering' },
  { id: 'finale',      label: 'CONTACT',     number: '05', route: '#contact' },
];

// ---- Legacy compat (used by useSceneTimeline hook) ----
export const MASTER_TIMELINE = CUES.map(([at, name]) => ({ at, name }));

// ---- Letter order helper ----
export function letterOrder(nLetters: number): number[] {
  const mid = (nLetters - 1) / 2;
  return Array.from({ length: nLetters }, (_, i) => ({ i, d: Math.abs(i - mid) }))
    .sort((a, b) => a.d - b.d)
    .map((x, rank) => ({ i: x.i, rank }))
    .reduce((acc: number[], x) => { acc[x.i] = x.rank; return acc; }, []);
}

// ---- Skills / Universe data (12 cards — all materialise as ONE event) ----
export interface SkillCard {
  icon: string;
  name: string;
  tags: string[];
}

export const SKILL_CARDS: SkillCard[] = [
  { icon: '⚡', name: 'React',         tags: ['tsx', 'hooks', 'vite'] },
  { icon: '🔷', name: 'TypeScript',    tags: ['strict', 'generics'] },
  { icon: '🐍', name: 'Python',        tags: ['django', 'fastapi', 'ml'] },
  { icon: '🚀', name: 'Node.js',       tags: ['express', 'ws', 'api'] },
  { icon: '🎮', name: 'Three.js',      tags: ['webgl', 'glsl', 'r3f'] },
  { icon: '🗃️', name: 'PostgreSQL',    tags: ['sql', 'prisma', 'orm'] },
  { icon: '🐳', name: 'Docker',        tags: ['compose', 'k8s', 'ci'] },
  { icon: '☁️', name: 'Cloud',         tags: ['aws', 'vercel', 'gcp'] },
  { icon: '🤖', name: 'AI / ML',       tags: ['llm', 'agents', 'rag'] },
  { icon: '🎨', name: 'Design',        tags: ['figma', 'motion', 'ux'] },
  { icon: '📦', name: 'Rust',          tags: ['wasm', 'systems', 'cli'] },
  { icon: '🔗', name: 'Web3',          tags: ['solidity', 'ethers', 'defi'] },
];

// ---- Experience / Chrono data ----
export interface ExperienceEntry {
  period: string;
  year: number;
  role: string;
  org: string;
  desc: string;
  tags: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    period: '2025 – Present',
    year: 2025,
    role: 'Founder & Lead Engineer',
    org: 'AGNONIX',
    desc: 'Bootstrapping a B2B AI SaaS — RAG pipelines, LangGraph agent orchestration, NVIDIA NIM (Llama 70B), Supabase multi-tenant backend, and Razorpay billing. Shipping the full product solo.',
    tags: ['FastAPI', 'LangGraph', 'NVIDIA NIM', 'Supabase', 'React', 'Razorpay'],
  },
  {
    period: '2025',
    year: 2025,
    role: 'AI Research Engineer',
    org: 'ShadowTrace (Final-Year Project)',
    desc: 'Built a real-time agent trajectory drift monitor using sentence-transformer embeddings and SSE streaming. Detecting AI jailbreaks and goal misalignment without per-call LLM overhead.',
    tags: ['Python', 'FastAPI', 'Sentence-Transformers', 'SSE', 'Streamlit'],
  },
  {
    period: 'Jun 2025',
    year: 2025,
    role: 'Python & Data Science Intern',
    org: 'Nano Nino Solution',
    desc: 'Automated data preprocessing pipelines with Pandas & NumPy. Trained XGBoost/RF classifiers hitting 91% accuracy. Built executive KPI dashboards used in weekly stakeholder reviews.',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'Matplotlib'],
  },
  {
    period: 'May – Jun 2024',
    year: 2024,
    role: 'Web Development Intern',
    org: 'TheDot Tech',
    desc: 'Shipped 8 interactive UI components on a 6-week timeline. Collaborated on a 4-person team via Git branching workflow, reviewing 15+ PRs end-to-end.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Git', 'Team Collab'],
  },
  {
    period: '2023 – Present',
    year: 2023,
    role: 'Full-Stack Developer',
    org: 'Freelance & Open Source',
    desc: 'Built GenomeVault (cryptographic health data), Fake News classifier (F1 > 0.94), real-time Bus Tracker with MQTT/WebSocket/Twilio, and Document Intelligence services — all shipped to GitHub.',
    tags: ['React', 'TypeScript', 'Python', 'FastAPI', 'Node.js', 'Docker'],
  },
  {
    period: '2022 – 2023',
    year: 2022,
    role: 'B.Tech Student — AI & Data Science',
    org: 'Karunya Institute of Technology',
    desc: 'First year diving deep into algorithms, linear algebra, and Python. Started contributing to OSS projects and built first web apps. Laid the foundation for everything that followed.',
    tags: ['Python', 'C++', 'DSA', 'Linear Algebra', 'OSS'],
  },
];
