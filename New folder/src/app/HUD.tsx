import { useState } from "react";
import { sound } from "../utils/SoundController";

interface HUDProps {
  scrollProgress: number;
  activeChapter: string;
}

export default function HUD({ scrollProgress, activeChapter }: HUDProps) {
  const [audioActive, setAudioActive] = useState(sound.isEnabled());

  const handleAudioToggle = () => {
    const newState = sound.toggle();
    setAudioActive(newState);
  };

  return (
    <div className="hud-container">
      {/* Top Left System Identity */}
      <div className="hud-brand">
        <span className="brand-dot" />
        <span className="brand-title">DEVESH_KR // SYSTEM</span>
      </div>

      {/* Top Center Live Chapter Telemetry */}
      <div className="hud-telemetry">
        <span className="hud-pulse" />
        LIVE SCANNER // {activeChapter.toUpperCase()}
      </div>

      {/* Top Right Quick Controls */}
      <div className="hud-controls">
        <button className="hud-btn" onClick={handleAudioToggle}>
          AUDIO: {audioActive ? "ON" : "OFF"}
        </button>
      </div>

      {/* Bottom Progress Bar */}
      <div className="hud-scroll-bar">
        <div className="hud-scroll-fill" style={{ width: `${Math.round(scrollProgress * 100)}%` }} />
      </div>
    </div>
  );
}
