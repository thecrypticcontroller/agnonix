// TopBar.tsx — Fixed top navigation, driven by is-header CSS cue
// Magnetic hover: nav links and logo physically pull toward cursor

import { useState, useRef, useCallback, useEffect } from 'react';
import AnimeEmblem from './AnimeEmblem';
import { SCENES } from '../data/sceneConfig';
import { profile } from '../data/profile';

// ── Inline magnetic hook (avoids circular import) ─────────────────────────────
function useMag(strength = 0.42) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * strength;
    const dy = (e.clientY - (r.top  + r.height / 2)) * strength;
    el.style.transition = 'transform 0.08s linear';
    el.style.transform  = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`;
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.6s cubic-bezier(.34,1.56,.64,1)';
    el.style.transform  = '';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

// ── Magnetic nav link ─────────────────────────────────────────────────────────
function MagLink({
  href, children, target, rel, onClick, ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const { ref, onMouseMove, onMouseLeave } = useMag(0.38);
  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLAnchorElement>}
      onMouseLeave={onMouseLeave as React.MouseEventHandler<HTMLAnchorElement>}
      className="mag-link"
    >
      {children}
    </a>
  );
}

// exclude the hero from nav links
const NAV_SCENES = SCENES.filter((s) => s.route);

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Condense + blur on scroll — reads Lenis-updated scrollY
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = () => setMenuOpen((o) => !o);
  const close  = () => setMenuOpen(false);

  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };

  return (
    <>
      <header className={`top-bar${scrolled ? ' is-scrolled' : ''}`} role="banner" onKeyDown={handleKeydown}>
        <a href="#hero" className="top-bar__logo" aria-label="AGNONIX — back to top">
          <span className="top-bar__logo-char" aria-hidden="true">
            <AnimeEmblem size={28} animated={false} />
          </span>
          AGN<em>O</em>NIX
        </a>

        <nav aria-label="Main navigation">
          <ul className="top-bar__nav" role="list">
            {NAV_SCENES.map((s) => (
              <li key={s.id} role="listitem">
                <MagLink href={s.route!}>{s.label}</MagLink>
              </li>
            ))}
            <li role="listitem">
              <MagLink
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                ariaLabel="GitHub"
              >
                GitHub ↗
              </MagLink>
            </li>
          </ul>
        </nav>

        <button
          className="burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={toggle}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile menu */}
      <ul
        id="mobile-menu"
        className="mobile-menu"
        role="list"
        aria-hidden={!menuOpen}
        hidden={!menuOpen}
      >
        {NAV_SCENES.map((s, i) => (
          <li key={s.id} role="listitem" style={{ '--i': i } as React.CSSProperties}>
            <a href={s.route} onClick={close}>{s.label}</a>
          </li>
        ))}
        <li role="listitem" style={{ '--i': NAV_SCENES.length } as React.CSSProperties}>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" onClick={close}>
            GitHub ↗
          </a>
        </li>
      </ul>
    </>
  );
}
