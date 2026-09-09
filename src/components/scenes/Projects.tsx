// Projects.tsx — GOD MODE 2026: Horizontal scroll track + kinetic cards

import { useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/profile';
import { useSceneVisibility } from '../../hooks/useSceneVisibility';

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: typeof projects[number];
  index: number;
  isVisible: boolean;
}) {
  const cardRef    = useRef<HTMLAnchorElement>(null);
  const isFeatured = 'featured' in project && project.featured;
  const isInternal = project.url?.startsWith('/');

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    el.style.setProperty('--card-rx', `${(-y * 8).toFixed(1)}deg`);
    el.style.setProperty('--card-ry', `${( x * 10).toFixed(1)}deg`);
    el.style.setProperty('--light-x', `${(e.clientX - rect.left).toFixed(0)}px`);
    el.style.setProperty('--light-y', `${(e.clientY - rect.top).toFixed(0)}px`);
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--card-rx', '0deg');
    el.style.setProperty('--card-ry', '0deg');
  }, []);

  const cardStyle = {
    opacity:    isVisible ? 1 : 0,
    transform:  isVisible ? 'translateY(0) skewY(0deg)' : 'translateY(36px) skewY(1.5deg)',
    transition: `opacity 0.65s var(--ease-expo) ${index * 0.08}s, transform 0.65s var(--ease-expo) ${index * 0.08}s`,
  };

  const inner = (
    <>
      {/* Cursor spotlight */}
      <div className="project-card__spotlight" aria-hidden="true" />
      {/* Red accent top line */}
      <div className="project-card__redline" aria-hidden="true" />

      {/* Glitch number */}
      <span
        className="project-card__num project-card__num--glitch"
        aria-hidden="true"
        data-text={project.id}
      >{project.id}</span>

      {/* Screen */}
      <div className="project-card__screen" aria-hidden="true">
        <div className="project-card__screen-grid" />
        <span className="project-card__screen-icon">{isFeatured ? '⚡' : '▶'}</span>
        {isFeatured && <span className="project-card__badge">FEATURED</span>}
      </div>

      <div className="project-card__info">
        <span className="project-card__subtitle">{project.subtitle}</span>
        <h3 className="project-card__name">{project.name}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__stack" role="list">
          {project.stack.map((tech, i) => (
            <span key={i} className="project-card__tag" role="listitem">{tech}</span>
          ))}
        </div>
        <span className="project-card__link" aria-hidden="true">
          View Project <span className="project-card__arrow">→</span>
        </span>
      </div>
    </>
  );

  if (isInternal && project.url) {
    return (
      <Link
        ref={cardRef}
        to={project.url}
        className={`project-card project-card--god${isFeatured ? ' is-featured' : ''}`}
        role="listitem"
        aria-label={`${project.name}: ${project.subtitle}`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={cardStyle}
      >
        {inner}
      </Link>
    );
  }

  return (
    <a
      ref={cardRef}
      href={project.url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-card project-card--god${isFeatured ? ' is-featured' : ''}`}
      role="listitem"
      aria-label={`${project.name}: ${project.subtitle}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={cardStyle}
    >
      {inner}
    </a>
  );
}

// ── Horizontal scroll with momentum drag ─────────────────────────────────────
function useHorizontalDrag(trackRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let isDown  = false;
    let startX  = 0;
    let scrollL = 0;

    const onDown = (e: MouseEvent) => {
      isDown  = true;
      startX  = e.clientX;
      scrollL = track.scrollLeft;
      track.style.cursor = 'grabbing';
    };
    const onUp = () => {
      isDown = false;
      track.style.cursor = 'grab';
    };
    const onMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      track.scrollLeft = scrollL - dx;
    };

    track.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);

    return () => {
      track.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [trackRef]);
}

export default function Projects() {
  const { ref, isVisible } = useSceneVisibility({ threshold: 0.08 });
  const trackRef = useRef<HTMLDivElement>(null);
  useHorizontalDrag(trackRef);

  return (
    <div ref={ref}>
      <section className="projects scene" id="projects" aria-label="Projects">
        <div className="projects__glow" aria-hidden="true" />

        <header className="projects__header">
          <div className="section-label" style={{ marginBottom: 20 }}>
            03 / Projects
          </div>
          <h2 className="projects__heading">Work That <em>Matters</em></h2>
          <p className="projects__sub">
            Drag to explore — systems built with intent, shipped with precision.
          </p>
        </header>

        {/* ── Horizontal scroll track ── */}
        <div className="projects__hscroll-wrap" aria-label="Projects horizontal scroll">
          <div className="projects__hscroll-track" ref={trackRef} role="list">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
          {/* Fade-out edges */}
          <div className="projects__hscroll-fade projects__hscroll-fade--left"  aria-hidden="true" />
          <div className="projects__hscroll-fade projects__hscroll-fade--right" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
