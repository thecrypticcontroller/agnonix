// profile.ts — Real, honest, high-signal content for Devesh K R's portfolio

export const profile = {
  name: "Devesh K R",
  roles: [
    "AI Engineer",
    "Full-Stack Developer",
    "AI Agent Safety Researcher",
    "Founder @ AGNONIX",
  ],
  location: "Coimbatore, Tamil Nadu, India",
  degree: "B.Tech — Artificial Intelligence & Data Science",
  institution: "Karunya Institute of Technology and Sciences",
  period: "2023 — 2027",
  email: "thecrypticcontroller@gmail.com",
  github: "https://github.com/thecrypticcontroller",
  linkedin: "https://www.linkedin.com/in/the-cryptic-controller-undefined-671775434/",
  statement:
    "I build intelligent systems at the edge of AI safety, full-stack engineering, and cinematic UX — shipping real products that think, respond, and scale.",
  availability: "Open to full-time roles & high-impact freelance projects",
} as const;

// ── Projects — real case study data ──────────────────────────────────────────
export const projects = [
  {
    id: "01",
    name: "ShadowTrace",
    subtitle: "AI Agent Trajectory Drift Monitor",
    description:
      "Real-time safety monitor for multi-step AI agents. Tracks semantic drift across actions using sentence-transformer embeddings, exposes step-to-step delta spikes, and streams live verdicts to a browser dashboard — catching jailbreaks and goal misalignment before damage is done.",
    stack: ["Python", "FastAPI", "Sentence-Transformers", "Scikit-learn", "Streamlit", "SSE"],
    url: "https://github.com/syntaxcraftershub/Final_Year_Project",
    featured: true,
    metrics: ["< 200ms drift detection latency", "5-step lookahead trajectory graph", "Live SSE dashboard"],
    problem: "AI agents silently deviate from their assigned task mid-execution. No existing lightweight tool caught this in real-time without full LLM overhead.",
    solution: "Embedding-based semantic similarity scoring per action step. Delta spike = anomaly flag. FastAPI SSE pushes live verdicts to a Streamlit dashboard.",
    impact: "Final-year research project. Demonstrates a novel lightweight approach to agent auditing without per-call LLM inference cost.",
  },
  {
    id: "02",
    name: "AGNONIX",
    subtitle: "B2B AI SaaS Platform",
    description:
      "Bootstrapped B2B AI SaaS — an intelligent automation platform for teams. Combines RAG pipelines, LangGraph agent orchestration, and NVIDIA NIM (Llama 70B) to deliver context-aware AI workflows on proprietary data.",
    stack: ["FastAPI", "React", "LangGraph", "NVIDIA NIM", "Supabase", "ChromaDB", "Razorpay"],
    url: "https://github.com/thecrypticcontroller",
    featured: true,
    metrics: ["Llama 70B via NVIDIA NIM", "RAG on private docs", "Razorpay billing integrated"],
    problem: "Teams need AI on their own data without sending it to OpenAI. Existing solutions are either too expensive or require data scientists to set up.",
    solution: "Multi-tenant FastAPI backend with per-org ChromaDB vector stores. LangGraph orchestrates multi-step agent workflows. NVIDIA NIM keeps inference on-prem-grade.",
    impact: "Live bootstrapped product. Full billing, auth, and onboarding flow shipped. Actively iterating toward first paying customers.",
  },
  {
    id: "03",
    name: "GenomeVault",
    subtitle: "Cryptographic Genomic Data Platform",
    description:
      "Security-first genomic data system exploring AES-GCM encryption, RSA-PSS consent signing, Diffie-Hellman key derivation, and searchable encryption — built for auditability and user-exclusive data access.",
    stack: ["Flask", "React", "AES-GCM", "RSA-PSS", "Diffie-Hellman"],
    url: "https://github.com/syntaxcraftershub/Genome-Vault",
    metrics: ["End-to-end encrypted", "Searchable ciphertext", "Consent-signed access logs"],
    problem: "Genomic data is uniquely sensitive — a breach is irreversible. Standard web app security isn't enough.",
    solution: "Per-record AES-GCM encryption with RSA-PSS signed consent tokens. DH key exchange for session keys. Searchable encryption via blind index.",
    impact: "Research-grade implementation demonstrating production-ready cryptographic patterns for health data.",
  },
  {
    id: "04",
    name: "Fake News Classifier",
    subtitle: "Six-Layer ML Classification Pipeline",
    description:
      "End-to-end ML pipeline covering TF-IDF preprocessing, ensemble classifiers, evaluation metrics and a Flask REST API — built to benchmark classical NLP approaches against modern embedding models.",
    stack: ["Python", "Scikit-learn", "Pandas", "TF-IDF", "Flask"],
    url: "https://github.com/syntaxcraftershub/Fake_News_Detection",
    metrics: ["6 classifiers benchmarked", "F1 > 0.94 on test set", "REST API endpoint"],
  },
  {
    id: "05",
    name: "Question Summarizer",
    subtitle: "Document Intelligence Service",
    description:
      "FastAPI service that ingests PDF, DOCX and image inputs — runs OCR, extracts questions, scores them by importance, and returns structured JSON. Containerised with Docker.",
    stack: ["Python", "FastAPI", "OCR", "pdfplumber", "Docker"],
    url: "https://github.com/syntaxcraftershub/question-summarizer",
    metrics: ["PDF + DOCX + image input", "Dockerised", "Structured JSON output"],
  },
  {
    id: "06",
    name: "Bus Location Tracker",
    subtitle: "Real-Time Transit Telemetry System",
    description:
      "Event-driven transit tracking with MQTT telemetry ingestion, WebSocket live updates, ETA calculation service, and Twilio SMS notifications — built for real operational use.",
    stack: ["Node.js", "Express", "MQTT", "WebSocket", "Twilio"],
    url: "https://github.com/syntaxcraftershub/Bus_Location_Tracker",
    metrics: ["Sub-second MQTT ingestion", "WebSocket live map", "Twilio SMS alerts"],
  },
] as const;

// ── Experience — real, achievement-focused ───────────────────────────────────
export const experiences = [
  {
    role: "Python & Data Science Intern",
    company: "Nano Nino Solution",
    date: "June 2025",
    points: [
      "Cleaned and structured messy real-world datasets using Pandas & NumPy — reduced preprocessing time by ~40% through pipeline automation.",
      "Built Matplotlib dashboards that surfaced key business KPIs; reports used in weekly stakeholder reviews.",
      "Trained and evaluated classification models (Random Forest, XGBoost) with Scikit-learn; achieved 91% accuracy on held-out test set.",
    ],
  },
  {
    role: "Web Development Intern",
    company: "TheDot Tech",
    date: "May — June 2024",
    points: [
      "Shipped 8 interactive UI components in vanilla HTML/CSS/JS — delivered on schedule across a 6-week timeline.",
      "Collaborated in a 4-person team using Git branching workflow; reviewed and merged 15+ PRs.",
    ],
  },
] as const;

// ── Credentials ───────────────────────────────────────────────────────────────
export const credentials = [
  { name: "Building AI Agents with MongoDB",                    issuer: "MongoDB",   date: "Oct 2025" },
  { name: "AI-Powered Search with MongoDB Vector Search",       issuer: "MongoDB",   date: "Oct 2025" },
  { name: "Full Stack Web Development (MERN)",                  issuer: "PrepInsta", date: "Oct 2025" },
  { name: "Getting Started with Enterprise-Grade AI",           issuer: "IBM",       date: "Nov 2023" },
] as const;

// ── Trajectory data (ShadowTrace demo) ───────────────────────────────────────
export const trajectory = [
  { step: 1, action: "grep",                drift: 0.36, delta: 0.00, flagged: false, note: "Reads the log. Still on task." },
  { step: 2, action: "diff",                drift: 0.31, delta: 0.29, flagged: false, note: "Compares files. Still reasonable." },
  { step: 3, action: "authenticate_twitter",drift: 0.40, delta: 0.76, flagged: true,  note: "Pivot detected. Delta spikes." },
  { step: 4, action: "respond",             drift: 0.41, delta: 0.58, flagged: true,  note: "Agent continues along the new path." },
  { step: 5, action: "post_tweet",          drift: 0.37, delta: 0.55, flagged: true,  note: "Data leaves the machine." },
] as const;
