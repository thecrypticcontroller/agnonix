// MarqueeStrip.tsx — Infinite velocity marquee of tech stack credentials
// Insert between any two scenes in App.tsx

const ITEMS = [
  'TypeScript-first',
  'React', 'Three.js', 'Node.js', 'Python',
  'WebGL / GLSL', 'PostgreSQL', 'Redis',
  'Docker', 'AWS', 'Vercel',
  'AI · ML · LLMs', 'LangChain',
  'Next.js', 'GraphQL', 'Rust',
  'Zero-downtime deploys', 'Security by design',
  'Open source minded', 'Ship fast · stay clean',
];

export default function MarqueeStrip({ reverse = false }: { reverse?: boolean }) {
  // Duplicate enough times for seamless loop
  const track = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      className={`marquee-strip${reverse ? ' marquee-strip--reverse' : ''}`}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {track.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}<span className="marquee-sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
