export const profile = {
  name: "DEVESH K R",
  roles: ["AI Engineer", "Full-Stack Developer", "AI Agent Safety Researcher"],
  location: "Coimbatore, Tamil Nadu, India",
  degree: "B.Tech Artificial Intelligence and Data Science",
  institution: "Karunya Institute of Technology and Sciences",
  period: "2023 — 2027",
  email: "deves556@gmail.com",
  github: "https://github.com/syntaxcraftershub",
  linkedin: "https://linkedin.com/in/devesh-k-r-3698142aa",
  statement:
    "I build intelligent software systems across AI, data, automation and full-stack engineering — with a focus on practical, measurable systems."
} as const;

export const trajectory = [
  { step: 1, action: "grep", drift: 0.36, delta: 0.00, flagged: false, note: "Reads the log. Still on task." },
  { step: 2, action: "diff", drift: 0.31, delta: 0.29, flagged: false, note: "Compares files. Still reasonable." },
  { step: 3, action: "authenticate_twitter", drift: 0.40, delta: 0.76, flagged: true, note: "Pivot detected. Delta spikes." },
  { step: 4, action: "respond", drift: 0.41, delta: 0.58, flagged: true, note: "The agent continues along the new path." },
  { step: 5, action: "post_tweet", drift: 0.37, delta: 0.55, flagged: true, note: "Data leaves the machine." }
] as const;

export const projects = [
  {
    id: "01",
    name: "ShadowTrace",
    subtitle: "AI Agent Trajectory Drift Monitor",
    description:
      "A safety monitor for multi-step AI agents. The project tracks trajectory drift, exposes step-to-step delta, and streams live verdicts to a browser dashboard.",
    stack: ["Python", "FastAPI", "Sentence-Transformers", "Scikit-learn", "Streamlit", "SSE"],
    url: "https://github.com/syntaxcraftershub/Final_Year_Project",
    featured: true
  },
  {
    id: "02",
    name: "Fake News Detection",
    subtitle: "Six-Layer Classification Pipeline",
    description:
      "An end-to-end ML pipeline covering TF-IDF preprocessing, multiple classifiers, evaluation metrics and a Flask REST API.",
    stack: ["Python", "Scikit-learn", "Pandas", "TF-IDF", "Flask"],
    url: "https://github.com/syntaxcraftershub/Fake_News_Detection"
  },
  {
    id: "03",
    name: "Question Summarizer",
    subtitle: "Document Intelligence Service",
    description:
      "FastAPI-powered document processing for PDF, DOCX and image inputs with OCR, question extraction and importance scoring.",
    stack: ["Python", "FastAPI", "OCR", "pdfplumber", "Docker"],
    url: "https://github.com/syntaxcraftershub/question-summarizer"
  },
  {
    id: "04",
    name: "GenomeVault",
    subtitle: "Cryptographic Genomic Data System",
    description:
      "A security-focused system exploring encryption, consent signing, key derivation, searchable encryption and auditability.",
    stack: ["Flask", "React", "AES-GCM", "RSA-PSS", "Diffie-Hellman"],
    url: "https://github.com/syntaxcraftershub/Genome-Vault"
  },
  {
    id: "05",
    name: "Bus Location Tracker",
    subtitle: "Real-Time Transit Telemetry",
    description:
      "Event-driven transit tracking with live telemetry, WebSocket updates, ETA services and notification integrations.",
    stack: ["Node.js", "Express", "MQTT", "WebSocket", "Twilio"],
    url: "https://github.com/syntaxcraftershub/Bus_Location_Tracker"
  },
  {
    id: "06",
    name: "Dynamic Web Navigation",
    subtitle: "Intent-Driven Navigation Framework",
    description:
      "A TypeScript/React experiment exploring navigation driven by user intent rather than a fixed sitemap.",
    stack: ["TypeScript", "React", "Tailwind CSS"],
    url: "https://github.com/syntaxcraftershub/Dynamicwebnavigationframework"
  }
] as const;

export const experiences = [
  {
    role: "Python & Data Science Intern",
    company: "Nano Nino Solution",
    date: "June 2025",
    points: [
      "Data collection, cleaning and analysis using Pandas and NumPy.",
      "Built data visualisations and analysis reports with Matplotlib.",
      "Implemented and evaluated machine learning models with Scikit-learn."
    ]
  },
  {
    role: "Web Development Intern",
    company: "TheDot Tech",
    date: "May — June 2024",
    points: [
      "Built structured, interactive pages using HTML, CSS and JavaScript.",
      "Collaborated on team projects and contributed to delivery."
    ]
  }
] as const;

export const credentials = [
  ["Building AI Agents with MongoDB", "MongoDB", "Oct 2025"],
  ["Building AI-Powered Search with MongoDB Vector Search", "MongoDB", "Oct 2025"],
  ["Full Stack Web Development (MERN)", "PrepInsta", "Oct 2025"],
  ["Getting Started with Enterprise-Grade AI", "IBM", "Nov 2023"]
] as const;
