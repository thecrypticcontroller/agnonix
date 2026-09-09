// Finale.tsx — GOD TIER 2026: Cinematic contact outro
// Full-bleed statement + email + socials + status beacon
// Reference: agency contact pages — heavy typography, minimal chrome

import { useRef, useEffect } from 'react';
import { profile } from '../../data/profile';
import { useSceneVisibility } from '../../hooks/useSceneVisibility';

// ── Animated availability beacon ─────────────────────────────────────────────
function Beacon() {
  return (
    <span className="finale-beacon" aria-label="Available for work">
      <span className="finale-beacon__dot" />
      <span className="finale-beacon__label">Available for work</span>
    </span>
  );
}

// ── Clip-path word reveal ────────────────────────────────────────────────────
function RevealWords({
  children,
  delay = 0,
  className = '',
}: {
  children: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll<HTMLSpanElement>('.rword').forEach((w, i) => {
            w.style.transitionDelay = `${delay + i * 0.06}s`;
            w.classList.add('is-revealed');
          });
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-words ${className}`} aria-label={children}>
      {children.split(' ').map((word, i, arr) => (
        <span key={i} className="rword-wrap">
          <span className="rword">{word}</span>
          {i < arr.length - 1 && ' '}
        </span>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Finale() {
  const { ref, isVisible } = useSceneVisibility({ threshold: 0.05 });
  const emailRef = useRef<HTMLAnchorElement>(null);

  // Magnetic effect on email link
  useEffect(() => {
    const el = emailRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.35;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.35;
      el.style.transition = 'transform 0.1s linear';
      el.style.transform  = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
    };
    const onLeave = () => {
      el.style.transition = 'transform 0.7s cubic-bezier(.34,1.56,.64,1)';
      el.style.transform  = '';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref}>
      <section
        className="finale scene"
        id="contact"
        aria-label="Contact"
        data-reveal
      >
        {/* Red ambient glow */}
        <div className="finale__glow" aria-hidden="true" />

        {/* Top rule */}
        <div
          className="finale__rule"
          style={{
            transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.1s cubic-bezier(.19,1,.22,1)',
          }}
          aria-hidden="true"
        />

        {/* Section label */}
        <p
          className="section-label finale__eyebrow"
          style={{
            opacity:   isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(12px)',
            transition: 'opacity .6s .2s, transform .6s .2s',
          }}
        >
          05 / Contact
        </p>

        {/* Giant statement headline */}
        <div className="finale__headline" aria-label="Let's build something great together">
          <RevealWords delay={0.3} className="finale__line">
            Let&apos;s build
          </RevealWords>
          <div className="finale__line finale__line--mixed">
            <RevealWords delay={0.45}>something</RevealWords>
            <RevealWords delay={0.62} className="finale__word--red">great.</RevealWords>
          </div>
        </div>

        {/* Email CTA */}
        <div
          className="finale__email-wrap"
          style={{
            opacity:   isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(24px)',
            transition: 'opacity .8s .9s, transform .8s .9s',
          }}
        >
          <span className="finale__email-prompt">Reach out ↓</span>
          <a
            ref={emailRef}
            href={`mailto:${profile.email}`}
            className="finale__email"
            aria-label={`Email ${profile.email}`}
          >
            {profile.email}
            <span className="finale__email-arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Bottom bar */}
        <div
          className="finale__bottom"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity .8s 1.2s',
          }}
        >
          <Beacon />

          <nav className="finale__socials" aria-label="Social links">
            <a href={profile.github}   target="_blank" rel="noopener noreferrer" className="finale__social-link">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="finale__social-link">LinkedIn ↗</a>
          </nav>

          <p className="finale__copy">
            © {new Date().getFullYear()} Devesh K R · AGNONIX
          </p>
        </div>

        {/* Decorative corner bracket */}
        <div className="finale__corner-tl" aria-hidden="true" />
        <div className="finale__corner-br" aria-hidden="true" />
      </section>
    </div>
  );
}
