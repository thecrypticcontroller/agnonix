import { useEffect, useState } from "react";
import { sound } from "../utils/SoundController";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING NEURAL CORE...");

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 16 + 6;
      if (current >= 25 && current < 55) {
        setStatusText("VERIFYING SHADOWTRACE METRIC PIPELINE...");
      } else if (current >= 55 && current < 85) {
        setStatusText("LOADING 3D RESEARCH ENVIRONMENT...");
      } else if (current >= 85) {
        setStatusText("SYSTEM READY. PREPARING REVEAL...");
      }

      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
      setProgress(Math.round(current));
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="boot-overlay">
      <div className="boot-scanlines" />
      <div className="boot-content">
        <div className="boot-header">DEVESH_KR // SYSTEM INITIALIZATION</div>
        <h1 className="boot-title">
          RESEARCH FACILITY <br />
          <span>INITIALIZING ENVIRONMENT</span>
        </h1>
        <div className="boot-progress-wrapper">
          <div className="boot-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="boot-meta">
          <span>{progress}% CALIBRATED</span>
          <span>{statusText}</span>
        </div>
        <button
          className="boot-start-btn"
          onClick={() => {
            sound.toggle();
            onComplete();
          }}
        >
          [ ENTER EXPERIENCE ]
        </button>
      </div>
    </div>
  );
}
