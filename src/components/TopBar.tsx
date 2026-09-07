import { profile } from "../data/profile";

export function TopBar() {
  return (
    <header className="topbar">
      <a href="#top" className="brand">DEVE<span>SH</span> K R</a>
      <nav>
        <a href="#shadowtrace">01 / ShadowTrace</a>
        <a href="#projects">02 / Projects</a>
        <a href="#experience">03 / Experience</a>
        <a href="#contact">04 / Contact</a>
      </nav>
      <a className="status" href={profile.github} target="_blank" rel="noreferrer">
        <span className="dot" /> SYSTEM ONLINE
      </a>
    </header>
  );
}
