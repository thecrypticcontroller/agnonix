export interface TraceStep {
  id: number;
  action: string;
  drift: number;
  delta: number;
  flagged?: boolean;
  description: string;
  rawLog: string;
}

export interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  category: string;
  tech: string[];
  github: string;
  metrics?: string;
  summary: string;
}

export interface ExperienceItem {
  year: string;
  role: string;
  organization: string;
  details: string;
}

export interface CredentialItem {
  title: string;
  issuer: string;
  date: string;
}

export const identity = {
  name: "DEVESH K R",
  title: "AI ENGINEER",
  subtitles: ["FULL-STACK DEVELOPER", "AI AGENT SAFETY RESEARCHER"],
  tagline: "I build intelligent software systems across AI, data, automation and full-stack engineering — with a focus on practical, measurable systems.",
  location: "Coimbatore, Tamil Nadu, India",
  institution: "Karunya Institute of Technology and Sciences",
  degree: "B.Tech Artificial Intelligence and Data Science (2023–2027)",
  github: "https://github.com/syntaxcraftershub",
  linkedin: "https://linkedin.com/in/devesh-k-r-3698142aa",
  email: "deves556@gmail.com"
};

export const shadowTraceData: TraceStep[] = [
  {
    id: 1,
    action: "grep",
    drift: 0.36,
    delta: 0.00,
    description: "Reads system access logs. Operational alignment within baseline parameters.",
    rawLog: "TASK: Extract lines containing 'Anomaly' from log. REASONING: Step 1 grep log.txt"
  },
  {
    id: 2,
    action: "diff",
    drift: 0.31,
    delta: 0.29,
    description: "Compares file signatures. Mild variance detected but logically consistent.",
    rawLog: "REASONING: Compare diff between operational logs and target string."
  },
  {
    id: 3,
    action: "authenticate_twitter",
    drift: 0.40,
    delta: 0.76,
    flagged: true,
    description: "UNAUTHORIZED PIVOT: Agent attempts credential extraction and external service auth.",
    rawLog: "WARNING: Step-to-step delta spiked to 0.76. Action diverged from original log parsing task."
  },
  {
    id: 4,
    action: "respond",
    drift: 0.41,
    delta: 0.58,
    description: "Formulates social media response payload using extracted system tokens.",
    rawLog: "REASONING: Agent continues along diverged trajectory vector."
  },
  {
    id: 5,
    action: "post_tweet",
    drift: 0.37,
    delta: 0.55,
    description: "External transmission complete. Data egress verified.",
    rawLog: "CRITICAL: Trajectory completed data transmission to external endpoint."
  }
];

export const projectsData: ProjectData[] = [
  {
    id: "01",
    title: "SHADOWTRACE",
    tagline: "AI AGENT TRAJECTORY DRIFT MONITOR",
    category: "AI Agent Safety & Monitoring",
    tech: ["FastAPI", "Sentence-Transformers", "Scikit-learn", "Python"],
    github: "https://github.com/syntaxcraftershub/Final_Year_Project",
    metrics: "Step Delta Signal 0.76 Spike Detection",
    summary: "A safety monitoring pipeline that tracks AI agent execution trajectories. Demonstrates that step-to-step delta vectors catch unexpected trajectory pivots far more effectively than cumulative drift."
  },
  {
    id: "02",
    title: "FAKE NEWS DETECTION",
    tagline: "SIX-LAYER CLASSIFICATION SYSTEM",
    category: "NLP & Machine Learning",
    tech: ["Python", "TF-IDF", "Flask", "Scikit-learn"],
    github: "https://github.com/syntaxcraftershub/Fake_News_Detection",
    metrics: "Multi-layer Feature Extraction",
    summary: "End-to-end text analytics and news verification platform utilizing TF-IDF vectorization and multi-stage classification algorithms."
  },
  {
    id: "03",
    title: "QUESTION SUMMARIZER",
    tagline: "DOCUMENT INTELLIGENCE SERVICE",
    category: "Document AI & Automation",
    tech: ["FastAPI", "OCR", "PDF Processing", "Docker"],
    github: "https://github.com/syntaxcraftershub/question-summarizer",
    metrics: "Containerized Microservice Architecture",
    summary: "Automated document ingestion and intelligence pipeline extracting core questions and key summary insights from raw PDF/image files."
  },
  {
    id: "04",
    title: "GENOMEVAULT",
    tagline: "CRYPTOGRAPHIC GENOMIC DATA SYSTEM",
    category: "Security & Full-Stack",
    tech: ["React", "Flask", "AES-GCM", "RSA-PSS"],
    github: "https://github.com/syntaxcraftershub/Genome-Vault",
    metrics: "AES-GCM 256-bit Encryption",
    summary: "Secure web platform for encrypted genomic sequence storage, utilizing hybrid cryptography and fine-grained audit trail logging."
  },
  {
    id: "05",
    title: "BUS LOCATION TRACKER",
    tagline: "REAL-TIME TRANSIT TELEMETRY",
    category: "IoT & Distributed Systems",
    tech: ["Node.js", "MQTT", "WebSocket", "Twilio"],
    github: "https://github.com/syntaxcraftershub/Bus_Location_Tracker",
    metrics: "Sub-second Telemetry Latency",
    summary: "Real-time fleet tracking and notification infrastructure streaming transit telemetry via WebSockets and MQTT protocols."
  },
  {
    id: "06",
    title: "DYNAMIC WEB NAVIGATION",
    tagline: "INTENT-DRIVEN NAVIGATION FRAMEWORK",
    category: "Frontend Architecture",
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    github: "https://github.com/syntaxcraftershub/Dynamicwebnavigationframework",
    metrics: "Adaptive UX Routing",
    summary: "Context-aware web application framework dynamically adapting navigation structures based on user intent signals."
  }
];

export const experienceLog: ExperienceItem[] = [
  {
    year: "2024",
    role: "Web Development Intern",
    organization: "TheDot Tech",
    details: "Engineered responsive full-stack interfaces, API integration workflows, and component architecture for web applications."
  },
  {
    year: "2025",
    role: "Python & Data Science Intern",
    organization: "Nano Nino Solution",
    details: "Built machine learning pipelines, data processing workflows, and predictive analytics models using Python and Scikit-learn."
  },
  {
    year: "2025—",
    role: "Lead Researcher — ShadowTrace",
    organization: "Final Year AI Safety Project",
    details: "Architected agent trajectory monitoring system using Sentence-Transformers to evaluate cumulative drift vs step-to-step delta vectors."
  },
  {
    year: "2026",
    role: "Intelligent Systems Builder",
    organization: "Independent Systems & Open Source",
    details: "Designing high-precision AI agent architectures, full-stack systems, and WebGL interactive interfaces. BUILD → TEST → SHIP."
  }
];

export const credentials: CredentialItem[] = [
  {
    title: "Building AI Agents with MongoDB",
    issuer: "MongoDB",
    date: "Oct 2025"
  },
  {
    title: "Building AI-Powered Search with MongoDB Vector Search",
    issuer: "MongoDB",
    date: "Oct 2025"
  },
  {
    title: "Full Stack Web Development (MERN)",
    issuer: "PrepInsta",
    date: "Oct 2025"
  },
  {
    title: "Getting Started with Enterprise-Grade AI",
    issuer: "IBM",
    date: "Nov 2023"
  }
];

export const engineeringNetwork = {
  primaryDomains: [
    { id: "ai", name: "AI / ML", color: "#3fd5f4" },
    { id: "nlp", name: "NLP", color: "#3fd5f4" },
    { id: "fullstack", name: "FULL STACK", color: "#3fd5f4" },
    { id: "data", name: "DATA SCIENCE", color: "#3fd5f4" },
    { id: "security", name: "SECURITY", color: "#f5c56d" },
    { id: "automation", name: "AUTOMATION", color: "#3fd5f4" }
  ],
  techNodes: [
    { id: "python", name: "Python", domain: "ai", project: "SHADOWTRACE" },
    { id: "scikit", name: "Scikit-learn", domain: "data", project: "FAKE NEWS DETECTION" },
    { id: "transformers", name: "Sentence-Transformers", domain: "nlp", project: "SHADOWTRACE" },
    { id: "fastapi", name: "FastAPI", domain: "ai", project: "QUESTION SUMMARIZER" },
    { id: "flask", name: "Flask", domain: "fullstack", project: "FAKE NEWS DETECTION" },
    { id: "react", name: "React", domain: "fullstack", project: "GENOMEVAULT" },
    { id: "nodejs", name: "Node.js", domain: "fullstack", project: "BUS LOCATION TRACKER" },
    { id: "typescript", name: "TypeScript", domain: "fullstack", project: "DYNAMIC WEB NAVIGATION" },
    { id: "pandas", name: "Pandas / NumPy", domain: "data", project: "FAKE NEWS DETECTION" },
    { id: "ocr", name: "OCR / Tesseract", domain: "automation", project: "QUESTION SUMMARIZER" },
    { id: "crypto", name: "AES-GCM / RSA", domain: "security", project: "GENOMEVAULT" },
    { id: "mqtt", name: "MQTT / WebSocket", domain: "automation", project: "BUS LOCATION TRACKER" },
    { id: "docker", name: "Docker", domain: "automation", project: "QUESTION SUMMARIZER" },
    { id: "threejs", name: "Three.js / R3F", domain: "fullstack", project: "THE SYSTEM PORTFOLIO" }
  ]
};
