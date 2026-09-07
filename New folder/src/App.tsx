import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import ExperienceCanvas from "./experience/ExperienceCanvas";
import BootSequence from "./app/BootSequence";
import HUD from "./app/HUD";
import CustomCursor from "./app/CustomCursor";
import { identity, shadowTraceData, projectsData, experienceLog, credentials, TraceStep } from "./content/profile";
import { sound } from "./utils/SoundController";
import "./styles.css";

export default function App() {
  const [bootDone, setBootDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeChapter, setActiveChapter] = useState("01 ARRIVAL");
  const [hoveredStep, setHoveredStep] = useState<TraceStep | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bootDone) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1.0
    });

    let rafId: number;
    const onTick = (time: number) => {
      lenis.raf(time);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, totalScroll)));
      setScrollProgress(progress);

      // Determine active chapter for HUD
      if (progress < 0.15) setActiveChapter("01 ARRIVAL");
      else if (progress < 0.35) setActiveChapter("02 CENTRAL AI CORE");
      else if (progress < 0.55) setActiveChapter("03 SHADOWTRACE SAFETY MONITOR");
      else if (progress < 0.72) setActiveChapter("04 PROJECT WORLDS");
      else if (progress < 0.84) setActiveChapter("05 ENGINEERING NETWORK");
      else if (progress < 0.94) setActiveChapter("06 THE BUILD LOG");
      else setActiveChapter("07 SHUTDOWN & CONNECTION");

      rafId = requestAnimationFrame(onTick);
    };

    rafId = requestAnimationFrame(onTick);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [bootDone]);

  return (
    <div ref={rootRef} className="app-root">
      <CustomCursor />

      {!bootDone ? (
        <BootSequence onComplete={() => setBootDone(true)} />
      ) : (
        <>
          <HUD scrollProgress={scrollProgress} activeChapter={activeChapter} />

          {/* 3D WebGL World Canvas */}
          <ExperienceCanvas
            scrollProgress={scrollProgress}
            mousePos={mousePos}
            activeStepIndex={hoveredStep ? hoveredStep.id - 1 : -1}
            onHoverStep={(step) => {
              setHoveredStep(step);
              if (step && step.flagged) {
                sound.playAnomalyPulse();
              } else if (step) {
                sound.playTick();
              }
            }}
            activeProjectIndex={activeProjectIndex}
            onSelectProject={(index) => {
              setActiveProjectIndex(index);
              sound.playSweep();
            }}
          />

          {/* HTML Overlay Journey Content */}
          <main className="content-container">
            {/* HERO / ARRIVAL */}
            <section className="section-hero screen">
              <div className="hero-lockup">
                <div className="hud-tag">RESEARCH FACILITY // SPEC-01</div>
                <h1 className="hero-title">{identity.name}</h1>
                <div className="hero-subtitle">
                  {identity.title} · {identity.subtitles.join(" · ")}
                </div>
                <p className="hero-tagline">{identity.tagline}</p>
                <div className="hero-meta-row">
                  <span>LOCATION: {identity.location}</span>
                  <span>EDUCATION: {identity.degree}</span>
                </div>
                <div className="hero-actions">
                  <a href="#shadowtrace" className="btn-primary" onClick={() => sound.playSweep()}>
                    [ ENTER SHADOWTRACE SIMULATION ]
                  </a>
                  <a href={identity.github} target="_blank" rel="noreferrer" className="btn-secondary">
                    GITHUB ↗
                  </a>
                </div>
              </div>
            </section>

            {/* CENTRAL AI CORE INTERSECTION */}
            <section className="section-core screen">
              <div className="core-lockup">
                <div className="hud-tag">CHAPTER 02 // ALGORITHMIC CORE</div>
                <h2>CENTRAL AI CORE</h2>
                <p className="body-copy">
                  Procedural wireframe core representing multi-agent orchestration, feature extraction, and continuous alignment monitoring. Scroll to travel through the core into the execution space.
                </p>
              </div>
            </section>

            {/* SHADOWTRACE SIGNATURE SCENE */}
            <section className="section-shadowtrace screen" id="shadowtrace">
              <div className="trace-container">
                <div className="hud-tag">CHAPTER 03 // SIGNATURE RESEARCH SCENE</div>
                <h2 className="trace-title">SHADOWTRACE</h2>
                <p className="trace-sub">AI AGENT TRAJECTORY DRIFT MONITOR</p>

                <div className="trace-grid">
                  <div className="trace-copy">
                    <p className="body-copy">
                      A safety system for the moment an AI agent quietly changes direction. The interactive 3D simulation uses the project's real trajectory values: cumulative drift stays flat, while step-to-step delta catches the pivot at Step 3 (`authenticate_twitter`).
                    </p>

                    <div className="trace-honest-callout">
                      <strong>AUTHENTIC RESEARCH INSIGHT:</strong>
                      <p>Cumulative drift alone failed to separate execution classes. Step-to-step delta provided the critical signal (Spike 0.76).</p>
                    </div>

                    <div className="trace-actions">
                      <a href={projectsData[0].github} target="_blank" rel="noreferrer" className="btn-primary">
                        [ VIEW RESEARCH REPOSITORY ↗ ]
                      </a>
                    </div>
                  </div>

                  {/* Telemetry Log Table */}
                  <div className="trace-table">
                    <div className="table-header">
                      <span>STEP</span>
                      <span>ACTION</span>
                      <span>DRIFT</span>
                      <span>DELTA</span>
                    </div>
                    {shadowTraceData.map((step) => (
                      <div
                        key={step.id}
                        className={`table-row ${step.flagged ? "anomaly-trigger hot" : ""} ${
                          hoveredStep?.id === step.id ? "active-hover" : ""
                        }`}
                        onMouseEnter={() => {
                          setHoveredStep(step);
                          if (step.flagged) sound.playAnomalyPulse();
                        }}
                        onMouseLeave={() => setHoveredStep(null)}
                      >
                        <span className="row-id">0{step.id}</span>
                        <span className="row-action">{step.action}</span>
                        <span className="row-val">{step.drift.toFixed(2)}</span>
                        <span className={`row-val ${step.flagged ? "alert-text" : ""}`}>
                          {step.delta.toFixed(2)}
                        </span>
                      </div>
                    ))}

                    {hoveredStep && (
                      <div className="step-card-popup">
                        <strong>STEP 0{hoveredStep.id}: {hoveredStep.action}</strong>
                        <p>{hoveredStep.description}</p>
                        <code>{hoveredStep.rawLog}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* PROJECT WORLDS */}
            <section className="section-projects screen" id="projects">
              <div className="projects-container">
                <div className="hud-tag">CHAPTER 04 // SPATIAL CHAMBER</div>
                <h2>PROJECT WORLDS</h2>
                <div className="project-selector">
                  {projectsData.map((p, i) => (
                    <button
                      key={p.id}
                      className={`proj-pill ${i === activeProjectIndex ? "active" : ""}`}
                      onClick={() => {
                        setActiveProjectIndex(i);
                        sound.playSweep();
                      }}
                    >
                      {p.id} // {p.title}
                    </button>
                  ))}
                </div>

                <div className="project-card">
                  <div className="proj-badge">{projectsData[activeProjectIndex].id}</div>
                  <h3>{projectsData[activeProjectIndex].title}</h3>
                  <div className="proj-tagline">{projectsData[activeProjectIndex].tagline}</div>
                  <p className="proj-summary">{projectsData[activeProjectIndex].summary}</p>

                  <div className="proj-stack-list">
                    {projectsData[activeProjectIndex].tech.map((t) => (
                      <span key={t} className="tech-chip">
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={projectsData[activeProjectIndex].github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    [ EXPLORE REPOSITORY ↗ ]
                  </a>
                </div>
              </div>
            </section>

            {/* THE BUILD LOG */}
            <section className="section-buildlog screen" id="experience">
              <div className="buildlog-container">
                <div className="hud-tag">CHAPTER 06 // TIMELINE</div>
                <h2>THE BUILD LOG</h2>
                <div className="timeline-list">
                  {experienceLog.map((exp) => (
                    <div key={exp.year} className="timeline-item">
                      <div className="time-year">{exp.year}</div>
                      <div className="time-content">
                        <h3>{exp.role}</h3>
                        <div className="time-org">{exp.organization}</div>
                        <p>{exp.details}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verified Credentials */}
                <div className="credentials-section">
                  <div className="hud-tag">VERIFIED CREDENTIALS</div>
                  <div className="cred-grid">
                    {credentials.map((c) => (
                      <div key={c.title} className="cred-card">
                        <strong>{c.title}</strong>
                        <span>{c.issuer} · {c.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SHUTDOWN / CONNECTION */}
            <section className="section-contact screen" id="contact">
              <div className="contact-container">
                <div className="hud-tag">CHAPTER 07 // TERMINAL SHUTDOWN</div>
                <h2>HAVE AN IDEA<br /><span>WORTH BUILDING?</span></h2>
                <p>Let’s connect around AI, product engineering, research or intelligent systems.</p>

                <div className="contact-links">
                  <a href={identity.github} target="_blank" rel="noreferrer" className="btn-primary">
                    GITHUB ↗
                  </a>
                  <a href={identity.linkedin} target="_blank" rel="noreferrer" className="btn-primary">
                    LINKEDIN ↗
                  </a>
                  <a href={`mailto:${identity.email}`} className="btn-primary">
                    EMAIL ME ↗
                  </a>
                </div>

                <div className="shutdown-footer">
                  <span>SESSION COMPLETE // DEVESH K R</span>
                  <span>BUILD → TEST → SHIP</span>
                </div>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
}
