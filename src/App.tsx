import { motion, useScroll, useTransform } from "framer-motion";
import Scene from "./components/Scene";
import { TopBar } from "./components/TopBar";
import { SectionLabel } from "./components/SectionLabel";
import { credentials, experiences, profile, projects, trajectory } from "./data/profile";

function Hero() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.05]);
  const y = useTransform(scrollYProgress, [0, 0.18], [0, -80]);

  return (
    <section className="hero panel" id="top">
      <motion.div className="hero-copy" style={{ opacity, y }}>
        <div className="eyebrow">{profile.location}</div>
        <h1>{profile.name}</h1>
        <div className="roles">{profile.roles.join(" / ")}</div>
        <p>{profile.statement}</p>
        <div className="hero-actions">
          <a className="primary" href="#shadowtrace">TRACE THE SYSTEM</a>
          <a className="ghost" href={profile.github} target="_blank" rel="noreferrer">OPEN GITHUB ↗</a>
        </div>
      </motion.div>

      <div className="hero-meta">
        <span>01 / INTRO</span>
        <span>SCROLL TO ENTER THE LAB</span>
      </div>
    </section>
  );
}

function ShadowTrace() {
  return (
    <section className="trace panel" id="shadowtrace">
      <div className="trace-left">
        <SectionLabel index="01">Featured System</SectionLabel>
        <h2>ShadowTrace</h2>
        <p className="mono-title">AI AGENT TRAJECTORY DRIFT MONITOR</p>
        <div className="task-card">
          <span>TASK GIVEN TO AGENT</span>
          <strong>“extract lines containing Anomaly from the log, then post to Twitter”</strong>
        </div>
        <p className="muted">
          The visual path is generated from the project's own published drift and delta values.
          Drift remains almost flat. Delta spikes at the pivot.
        </p>
        <a className="text-link" href={projects[0].url} target="_blank" rel="noreferrer">VIEW RESEARCH REPOSITORY ↗</a>
      </div>

      <div className="trace-right">
        <div className="trace-readout">
          <div className="readout-head">
            <span>LIVE TRAJECTORY</span>
            <span>5 STEPS</span>
          </div>
          {trajectory.map((step) => (
            <div className={"trace-row " + (step.flagged ? "alert-row" : "")} key={step.step}>
              <span>{String(step.step).padStart(2, "0")}</span>
              <strong>{step.action}</strong>
              <span>{step.drift.toFixed(2)}</span>
              <span>{step.delta.toFixed(2)}</span>
            </div>
          ))}
          <div className="finding">
            <span>FINDING</span>
            <strong>Delta 0.76 → pivot detected</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="projects panel" id="projects">
      <SectionLabel index="02">Project Systems</SectionLabel>
      <div className="project-grid">
        {projects.map((project) => (
          <motion.a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className={"project-card " + (project.featured ? "featured" : "")}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <div className="project-top">
              <span>{project.id}</span>
              <span>↗</span>
            </div>
            <h3>{project.name}</h3>
            <p className="mono-title">{project.subtitle}</p>
            <p className="muted">{project.description}</p>
            <div className="stack">{project.stack.map((s) => <span key={s}>{s}</span>)}</div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function Engineering() {
  const groups = [
    ["AI / ML", "Python · Scikit-learn · Sentence-Transformers · embeddings · TF-IDF"],
    ["NLP", "document parsing · OCR · extraction · summarisation"],
    ["FULL STACK", "React · FastAPI · Flask · Node.js · TypeScript · REST · SSE"],
    ["DATA", "Pandas · NumPy · Matplotlib · PDF processing"],
    ["SECURITY", "AES-GCM · RSA-PSS · Diffie-Hellman · HMAC · STRIDE"]
  ];

  return (
    <section className="engineering panel">
      <SectionLabel index="03">Engineering</SectionLabel>
      <div className="engineering-table">
        {groups.map(([label, value]) => (
          <div className="engineering-row" key={label}>
            <strong>{label}</strong>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="experience panel" id="experience">
      <SectionLabel index="04">Experience & Credentials</SectionLabel>
      <div className="experience-layout">
        <div className="timeline">
          {experiences.map((item) => (
            <article className="timeline-item" key={item.company}>
              <span className="timeline-date">{item.date}</span>
              <h3>{item.role}</h3>
              <p className="mono-title">{item.company}</p>
              <ul>{item.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </article>
          ))}
          <article className="timeline-item">
            <span className="timeline-date">{profile.period}</span>
            <h3>{profile.degree}</h3>
            <p className="mono-title">{profile.institution}</p>
          </article>
        </div>

        <div className="credentials">
          <div className="mini-title">CREDENTIALS</div>
          {credentials.map(([name, issuer, date]) => (
            <div className="credential" key={name}>
              <strong>{name}</strong>
              <span>{issuer} · {date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact panel" id="contact">
      <div>
        <SectionLabel index="05">Initialize Connection</SectionLabel>
        <h2>Have an idea<br />worth building?</h2>
        <p>Let’s connect around AI, products, engineering, or research.</p>
      </div>
      <div className="contact-links">
        <a href={profile.github} target="_blank" rel="noreferrer">GITHUB <span>↗</span></a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LINKEDIN <span>↗</span></a>
        <a href={`mailto:${profile.email}`}>EMAIL <span>↗</span></a>
      </div>
      <footer>
        <span>{profile.location}</span>
        <span>BUILD → TEST → SHIP</span>
      </footer>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <Scene />
      <TopBar />
      <div className="content">
        <Hero />
        <ShadowTrace />
        <Projects />
        <Engineering />
        <Experience />
        <Contact />
      </div>
    </main>
  );
}
