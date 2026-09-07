import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<"DEFAULT" | "HOVER" | "ANOMALY">("DEFAULT");

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target.closest(".anomaly-trigger")) {
        setMode("ANOMALY");
      } else if (target.closest("a, button, .interactive")) {
        setMode("HOVER");
      } else {
        setMode("DEFAULT");
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className={`custom-cursor cursor-${mode.toLowerCase()}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
    >
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </div>
  );
}
