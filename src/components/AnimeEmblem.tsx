// AnimeEmblem.tsx — Original anime protagonist emblem (no known IP)
// Dark aesthetic: spiky black hair · glowing crimson eyes · high collar
// Used in BootScreen (large) and TopBar logo (small via size prop)

interface Props {
  size?    : number;   // viewBox is 160×200, default renders at 160px wide
  className?: string;
  animated?: boolean;  // enable glow-pulse + hair-drift CSS animations
}

export default function AnimeEmblem({ size = 160, className = '', animated = true }: Props) {
  return (
    <svg
      viewBox="0 0 160 200"
      width={size}
      height={size * (200 / 160)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`anime-emblem${animated ? ' anime-emblem--anim' : ''} ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Eye glow bloom */}
        <filter id="ae-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Subtle face AO */}
        <radialGradient id="ae-ao" cx="50%" cy="60%" r="50%">
          <stop offset="0%"   stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
        {/* Hair gradient */}
        <linearGradient id="ae-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#060606" />
        </linearGradient>
        {/* Red eye gradient */}
        <radialGradient id="ae-eye-l" cx="40%" cy="38%" r="55%">
          <stop offset="0%"   stopColor="#ff3030" />
          <stop offset="55%"  stopColor="#de1b1c" />
          <stop offset="100%" stopColor="#6b0000" />
        </radialGradient>
        <radialGradient id="ae-eye-r" cx="40%" cy="38%" r="55%">
          <stop offset="0%"   stopColor="#ff3030" />
          <stop offset="55%"  stopColor="#de1b1c" />
          <stop offset="100%" stopColor="#6b0000" />
        </radialGradient>
      </defs>

      {/* ── HAIR — back spikes (behind face) ─────────────────────────────── */}
      <g className="ae-hair-back" fill="url(#ae-hair)">
        {/* Far left spike */}
        <path d="M35,62 L14,8  L42,58 Z" />
        {/* Left spike */}
        <path d="M50,52 L38,4  L58,48 Z" />
        {/* Left-center spike */}
        <path d="M65,46 L58,2  L74,44 Z" />
        {/* Center spike */}
        <path d="M80,44 L78,0  L88,43 Z" />
        {/* Right-center spike */}
        <path d="M95,46 L102,4 L102,48 Z" />
        {/* Right spike */}
        <path d="M108,52 L122,6 L112,56 Z" />
        {/* Far right spike */}
        <path d="M118,62 L142,14 L120,66 Z" />
      </g>

      {/* ── BODY + HIGH COLLAR ───────────────────────────────────────────── */}
      {/* Jacket body */}
      <path
        d="M46,162 L30,200 L130,200 L114,162 Q80,178 46,162 Z"
        fill="#111"
      />
      {/* Red jacket inner stripe */}
      <path
        d="M74,162 L70,200 L90,200 L86,162 Q80,165 74,162 Z"
        fill="rgba(222,27,28,0.18)"
      />
      {/* Left collar flap */}
      <path d="M46,162 L36,136 L58,162 Z" fill="#1a1a1a" />
      <path d="M58,162 L52,200 L46,162 Z" fill="#de1b1c" opacity="0.6" />
      {/* Right collar flap */}
      <path d="M114,162 L124,136 L102,162 Z" fill="#1a1a1a" />
      <path d="M102,162 L108,200 L114,162 Z" fill="#de1b1c" opacity="0.6" />
      {/* Neck */}
      <rect x="68" y="148" width="24" height="18" rx="3" fill="#1c1c1c" />

      {/* ── FACE BASE ────────────────────────────────────────────────────── */}
      <ellipse cx="80" cy="106" rx="40" ry="48" fill="url(#ae-ao)" />
      {/* Cheekbone shadow left */}
      <ellipse cx="56" cy="112" rx="16" ry="22" fill="#141414" opacity="0.55" />
      {/* Jaw taper — makes it more angular / masculine */}
      <path d="M40,120 Q44,152 80,158 Q116,152 120,120 Q110,148 80,152 Q50,148 40,120 Z"
        fill="#151515" />

      {/* ── HAIR — front layer ───────────────────────────────────────────── */}
      {/* Top crown */}
      <path
        d="M42,64 Q58,44 80,42 Q102,44 118,64 Q104,56 80,58 Q56,56 42,64 Z"
        fill="url(#ae-hair)"
      />
      {/* Left forehead bang */}
      <path d="M42,64 Q34,84 38,104 Q32,86 36,68 Z" fill="#111" className="ae-bang-l" />
      <path d="M54,60 Q48,82 52,100 Q46,82 50,64 Z" fill="#111" />
      {/* Right side strand */}
      <path d="M118,64 Q126,82 122,102 Q124,84 120,68 Z" fill="#111" className="ae-bang-r" />
      <path d="M106,60 Q112,80 108,98 Q110,80 106,64 Z" fill="#111" />
      {/* Center fringe strands over forehead */}
      <path d="M72,58 Q70,74 72,88 Q68,74 69,60 Z" fill="#0d0d0d" />
      <path d="M82,57 Q82,70 80,82 Q80,68 80,58 Z" fill="#0d0d0d" />
      <path d="M91,58 Q93,74 90,87 Q90,72 89,60 Z" fill="#0d0d0d" />

      {/* ── EYES ─────────────────────────────────────────────────────────── */}
      {/* Left brow — sharp, angled downward inward = determined/intense */}
      <path d="M44,84 Q56,80 68,84" stroke="#0a0a0a" strokeWidth="3.5"
        strokeLinecap="round" fill="none" />
      {/* Right brow */}
      <path d="M92,84 Q104,80 116,84" stroke="#0a0a0a" strokeWidth="3.5"
        strokeLinecap="round" fill="none" />

      {/* Left eye — socket */}
      <ellipse cx="58" cy="100" rx="14" ry="10" fill="#080808" />
      {/* Left iris */}
      <ellipse cx="58" cy="100" rx="10" ry="8" fill="url(#ae-eye-l)" />
      {/* Left pupil */}
      <ellipse cx="58" cy="100" rx="4.5" ry="6" fill="#0a0000" />
      {/* Left glow halo */}
      <ellipse cx="58" cy="100" rx="11" ry="9" fill="#de1b1c" opacity="0.22"
        filter="url(#ae-glow)" className="ae-eye-glow" />
      {/* Left highlight specular */}
      <ellipse cx="54" cy="96" rx="2.2" ry="1.5" fill="rgba(255,255,255,0.65)" />
      <ellipse cx="62" cy="103" rx="1" ry="0.8" fill="rgba(255,255,255,0.3)" />
      {/* Left upper lid line */}
      <path d="M44,96 Q58,90 72,96" stroke="#070707" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />
      {/* Left lower lid line */}
      <path d="M46,104 Q58,108 70,104" stroke="#111" strokeWidth="1.2"
        strokeLinecap="round" fill="none" />

      {/* Right eye — socket */}
      <ellipse cx="102" cy="100" rx="14" ry="10" fill="#080808" />
      {/* Right iris */}
      <ellipse cx="102" cy="100" rx="10" ry="8" fill="url(#ae-eye-r)" />
      {/* Right pupil */}
      <ellipse cx="102" cy="100" rx="4.5" ry="6" fill="#0a0000" />
      {/* Right glow halo */}
      <ellipse cx="102" cy="100" rx="11" ry="9" fill="#de1b1c" opacity="0.22"
        filter="url(#ae-glow)" className="ae-eye-glow" />
      {/* Right highlight specular */}
      <ellipse cx="98" cy="96" rx="2.2" ry="1.5" fill="rgba(255,255,255,0.65)" />
      <ellipse cx="106" cy="103" rx="1" ry="0.8" fill="rgba(255,255,255,0.3)" />
      {/* Right upper lid line */}
      <path d="M88,96 Q102,90 116,96" stroke="#070707" strokeWidth="2.5"
        strokeLinecap="round" fill="none" />
      {/* Right lower lid line */}
      <path d="M90,104 Q102,108 114,104" stroke="#111" strokeWidth="1.2"
        strokeLinecap="round" fill="none" />

      {/* ── NOSE — minimal, anime-style ──────────────────────────────────── */}
      <path d="M76,118 Q80,124 84,118" stroke="#252525" strokeWidth="1.8"
        fill="none" strokeLinecap="round" />

      {/* ── MOUTH — set, determined, not smiling ─────────────────────────── */}
      <path d="M66,134 Q80,138 94,134" stroke="#2a2a2a" strokeWidth="1.5"
        fill="none" strokeLinecap="round" />
      {/* Slight chin shadow for depth */}
      <path d="M68,140 Q80,145 92,140" stroke="#1a1a1a" strokeWidth="1"
        fill="none" strokeLinecap="round" />

      {/* ── BATTLE SCAR — left cheek, subtle red ─────────────────────────── */}
      <path d="M106,96 L112,116" stroke="rgba(222,27,28,0.45)" strokeWidth="1.2"
        strokeLinecap="round" />

      {/* ── SCAN LINES — CRT vibe ────────────────────────────────────────── */}
      {[72, 79, 86, 93, 100, 107, 114, 121, 128, 135].map((y) => (
        <rect key={y} x="40" y={y} width="80" height="0.6"
          fill="rgba(222,27,28,0.05)" />
      ))}

      {/* ── RED EYE AMBIENT FLOOR ────────────────────────────────────────── */}
      <ellipse cx="80" cy="105" rx="45" ry="12" fill="rgba(222,27,28,0.04)" />
    </svg>
  );
}
