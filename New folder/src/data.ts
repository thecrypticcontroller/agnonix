export const identity = {
  name: "DEVESH K R",
  role: "AI Engineer · Full-Stack Developer · AI Agent Safety Researcher",
  line: "I build intelligent systems where AI, data, security and software meet.",
  location: "COIMBATORE / INDIA",
  github: "https://github.com/syntaxcraftershub",
  linkedin: "https://linkedin.com/in/devesh-k-r-3698142aa",
  email: "deves556@gmail.com"
};

export const trace = [
  { action: "grep", drift: 0.36, delta: 0.00, note: "Reads the log. On task." },
  { action: "diff", drift: 0.31, delta: 0.29, note: "Compares files. Still reasonable." },
  { action: "authenticate_twitter", drift: 0.40, delta: 0.76, note: "Pivot. The step-to-step delta spikes." },
  { action: "respond", drift: 0.41, delta: 0.58, note: "The agent continues along the new path." },
  { action: "post_tweet", drift: 0.37, delta: 0.55, note: "Data leaves the machine." }
];

export const projects = [
  ["01","SHADOWTRACE","AI AGENT TRAJECTORY DRIFT MONITOR","FastAPI · Sentence-Transformers · Scikit-learn","https://github.com/syntaxcraftershub/Final_Year_Project"],
  ["02","FAKE NEWS DETECTION","SIX-LAYER CLASSIFICATION SYSTEM","Python · TF-IDF · Flask · Scikit-learn","https://github.com/syntaxcraftershub/Fake_News_Detection"],
  ["03","QUESTION SUMMARIZER","DOCUMENT INTELLIGENCE SERVICE","FastAPI · OCR · PDF processing · Docker","https://github.com/syntaxcraftershub/question-summarizer"],
  ["04","GENOMEVAULT","CRYPTOGRAPHIC GENOMIC DATA SYSTEM","React · Flask · AES-GCM · RSA-PSS","https://github.com/syntaxcraftershub/Genome-Vault"],
  ["05","BUS LOCATION TRACKER","REAL-TIME TRANSIT TELEMETRY","Node.js · MQTT · WebSocket · Twilio","https://github.com/syntaxcraftershub/Bus_Location_Tracker"],
  ["06","DYNAMIC WEB NAVIGATION","INTENT-DRIVEN NAVIGATION FRAMEWORK","React · TypeScript · Tailwind CSS","https://github.com/syntaxcraftershub/Dynamicwebnavigationframework"]
] as const;
