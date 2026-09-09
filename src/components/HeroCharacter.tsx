// HeroCharacter.tsx — "The Architect" | Canvas-based cel-shaded character
// Original character inspired by manga power-awakening aesthetics.
// Phase 0 = normal idle | Phase 1 = awakening begins | Phase 2 = mid-transform | Phase 3 = full ultra

import { useEffect, useRef, useCallback } from 'react';

interface Props { phase: 0 | 1 | 2 | 3; }

/* ─── colour lerp helper ─────────────────────────────────────────── */
type RGB = [number, number, number];
function lc(a: RGB, b: RGB, t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function lca(a: RGB, b: RGB, t: number, alpha: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgba(${r},${g},${bl},${alpha})`;
}

/* ─── seeded RNG ─────────────────────────────────────────────────── */
function seededRand(seed: number, s: number): number {
  return Math.abs(Math.sin(seed * 9301 + s * 49297 + 1013904223) * 0.5 + 0.5) % 1;
}

/* ─── lightning bolt ─────────────────────────────────────────────── */
function drawLightning(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  segs: number,
  deviation: number,
  color: string,
  alpha: number,
  seed: number
) {
  if (alpha <= 0) return;
  const pts: [number, number][] = [[x1, y1]];
  const dx = x2 - x1; const dy = y2 - y1;
  for (let i = 1; i < segs; i++) {
    const t = i / segs;
    const px = x1 + dx * t + (seededRand(seed, i * 3) - 0.5) * deviation;
    const py = y1 + dy * t + (seededRand(seed, i * 3 + 1) - 0.5) * deviation * 0.5;
    pts.push([px, py]);
  }
  pts.push([x2, y2]);

  ctx.save();
  ctx.globalAlpha = alpha * 0.35;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.9;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
  ctx.restore();
}

/* ─── particle types ─────────────────────────────────────────────── */
type PType = 'orb' | 'spark' | 'wisp';
interface Particle {
  type: PType;
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  hue: number; // 0=orange 1=cyan
  angle: number;
}

function spawnParticle(W: number, H: number, f: number): Particle {
  const cx = W * 0.5;
  const cy = H * 0.45;
  const r = W * 0.28 * (0.5 + Math.random() * 0.7);
  const a = Math.random() * Math.PI * 2;
  const types: PType[] = f < 0.3 ? ['spark'] : f < 0.6 ? ['spark', 'wisp'] : ['orb', 'spark', 'wisp'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    type,
    x: cx + Math.cos(a) * r * (type === 'orb' ? 0.4 : 1),
    y: cy + Math.sin(a) * r * 0.55 * (type === 'orb' ? 0.4 : 1),
    vx: (Math.random() - 0.5) * (type === 'spark' ? 3.5 : 0.8),
    vy: -(Math.random() * (type === 'spark' ? 4 : 1.5) + 0.5),
    life: 0,
    maxLife: type === 'orb' ? 80 + Math.random() * 60
           : type === 'wisp' ? 50 + Math.random() * 40
           : 20 + Math.random() * 30,
    size: type === 'orb' ? 4 + Math.random() * 5
        : type === 'wisp' ? 8 + Math.random() * 12
        : 1 + Math.random() * 2,
    hue: Math.min(1, f * 1.4),
    angle: Math.random() * Math.PI * 2,
  };
}

/* ─── colour palettes ────────────────────────────────────────────── */
const C = {
  // skin
  skinBase:   [220, 170, 130] as RGB,
  skinShadow: [180, 120,  85] as RGB,
  skinRim:    [255, 210, 175] as RGB,
  // hair normal (dark brown-black) → ultra (silver-white)
  hairN:  [ 28,  16,   8] as RGB,
  hairU:  [200, 220, 235] as RGB,
  hairTipN: [ 50, 30, 15] as RGB,
  hairTipU: [230, 245, 255] as RGB,
  // gi / clothes
  giOuter:  [210,  80,  20] as RGB,
  giInner:  [240, 130,  50] as RGB,
  giShadow: [150,  45,  10] as RGB,
  pants:    [ 35,  40,  55] as RGB,
  pantsSh:  [ 20,  25,  38] as RGB,
  belt:     [ 15,  12,  10] as RGB,
  // wristbands / accents
  wristN:   [ 30,  30,  80] as RGB,
  wristU:   [ 20, 160, 220] as RGB,
  // eye colour
  eyeWhite: [240, 242, 245] as RGB,
  irisN:    [ 90,  50,  25] as RGB,
  irisU:    [  0, 200, 255] as RGB,
  pupil:    [  5,   5,  10] as RGB,
  // aura
  auraN:    [255, 140,  30] as RGB,
  auraU:    [ 60, 170, 255] as RGB,
  // ground ring
  ringN:    [200,  80,  20] as RGB,
  ringU:    [ 40, 140, 255] as RGB,
};

/* ─── main draw function ─────────────────────────────────────────── */
function draw(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  f: number,          // 0 = normal, 1 = full ultra
  t: number,          // elapsed seconds
  particles: Particle[]
) {
  ctx.clearRect(0, 0, W, H);

  const cx = W * 0.5;
  // character anchors (proportional)
  const groundY = H * 0.96;
  const feetY   = H * 0.88;
  const waistY  = H * 0.60;
  const shoulderY = H * 0.38;
  const neckY   = H * 0.30;
  const chinY   = H * 0.255;
  const midFaceY = H * 0.22;
  const foreheadY = H * 0.175;
  const topHead = H * 0.08;
  const torsoW  = W * 0.22;
  const shoulderW = W * 0.30;
  const headR   = W * 0.115;
  const float   = f >= 0.85 ? Math.sin(t * 2.1) * H * 0.015 : 0;
  const floatY  = float; // positive = up compensation

  // ── 1. Aura background ──────────────────────────────────────────
  const auraAlpha = f * 0.7;
  if (auraAlpha > 0.01) {
    const auraColor = f < 0.5
      ? lca(C.auraN, C.auraU, f * 2, 1)
      : lca(C.auraN, C.auraU, 1, 1);
    const grad = ctx.createRadialGradient(cx, waistY - floatY, 0, cx, waistY - floatY, W * 0.55);
    grad.addColorStop(0, `rgba(${f < 0.5 ? '255,160,60' : '80,180,255'},${auraAlpha * 0.45})`);
    grad.addColorStop(0.55, `rgba(${f < 0.5 ? '220,80,20' : '30,100,255'},${auraAlpha * 0.18})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // outer aura flame spikes
    if (f > 0.15) {
      const flameAlpha = (f - 0.15) / 0.85;
      ctx.save();
      ctx.globalAlpha = flameAlpha * 0.55 * (0.7 + 0.3 * Math.sin(t * 3.7));
      ctx.shadowColor = auraColor;
      ctx.shadowBlur = 30;
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2 + t * 0.4;
        const r1 = W * 0.25;
        const r2 = W * (0.32 + 0.08 * seededRand(Math.floor(t * 4), i));
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * r1, waistY - floatY + Math.sin(ang) * r1 * 0.5);
        ctx.quadraticCurveTo(
          cx + Math.cos(ang + 0.3) * r2 * 0.7,
          waistY - floatY + Math.sin(ang + 0.3) * r2 * 0.35,
          cx + Math.cos(ang + 0.2) * r2,
          waistY - floatY + Math.sin(ang + 0.2) * r2 * 0.5
        );
        ctx.fillStyle = f > 0.5
          ? `rgba(80,180,255,${flameAlpha * 0.3})`
          : `rgba(255,130,40,${flameAlpha * 0.3})`;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // ── 2. Particles ─────────────────────────────────────────────────
  for (const p of particles) {
    const pl = p.life / p.maxLife;
    const pa = pl < 0.2 ? pl / 0.2 : pl > 0.8 ? (1 - pl) / 0.2 : 1;
    ctx.save();
    ctx.globalAlpha = pa * (0.5 + p.hue * 0.5);

    if (p.type === 'orb') {
      const og = ctx.createRadialGradient(p.x, p.y - floatY * 0.3, 0, p.x, p.y - floatY * 0.3, p.size * 2.5);
      og.addColorStop(0, p.hue > 0.5 ? '#aee8ff' : '#ffe0a0');
      og.addColorStop(0.5, p.hue > 0.5 ? 'rgba(60,160,255,0.8)' : 'rgba(255,120,30,0.8)');
      og.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.shadowColor = p.hue > 0.5 ? '#40aaff' : '#ff8020';
      ctx.shadowBlur = 14;
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(p.x, p.y - floatY * 0.3, p.size * 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'spark') {
      ctx.strokeStyle = p.hue > 0.5 ? `rgba(160,220,255,${pa})` : `rgba(255,200,100,${pa})`;
      ctx.lineWidth = p.size;
      ctx.shadowColor = p.hue > 0.5 ? '#80d0ff' : '#ffb050';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - floatY * 0.3);
      ctx.lineTo(p.x - p.vx * 4, p.y - floatY * 0.3 - p.vy * 4);
      ctx.stroke();
    } else { // wisp
      ctx.fillStyle = p.hue > 0.5 ? `rgba(100,200,255,${pa * 0.4})` : `rgba(255,160,60,${pa * 0.4})`;
      ctx.shadowColor = p.hue > 0.5 ? '#50b0ff' : '#ff9030';
      ctx.shadowBlur = 20;
      ctx.save();
      ctx.translate(p.x, p.y - floatY * 0.3);
      ctx.rotate(p.angle + t * 0.5);
      ctx.scale(1, 0.4);
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // ── 3. Ground glow ring ──────────────────────────────────────────
  if (f > 0.05) {
    const ra = (f - 0.05) / 0.95;
    const rw = W * (0.32 + 0.06 * Math.sin(t * 2.2)) * ra;
    const ringGrad = ctx.createRadialGradient(cx, groundY, 0, cx, groundY, rw);
    const rc = f < 0.5 ? C.ringN : C.ringU;
    ringGrad.addColorStop(0, `rgba(${rc[0]},${rc[1]},${rc[2]},${ra * 0.7})`);
    ringGrad.addColorStop(0.5, `rgba(${rc[0]},${rc[1]},${rc[2]},${ra * 0.3})`);
    ringGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.ellipse(cx, groundY, rw, rw * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── 4. Shadow (ground) ───────────────────────────────────────────
  {
    const shadowW = W * 0.18 * (1 - f * 0.6);
    const shadowGrad = ctx.createRadialGradient(cx, groundY, 0, cx, groundY, shadowW);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(cx, groundY, shadowW, shadowW * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── 5. Legs ──────────────────────────────────────────────────────
  const legFY = floatY;
  // left leg
  ctx.save();
  // pants
  ctx.fillStyle = lc(C.pants, C.pantsSh, 0.3);
  ctx.beginPath();
  ctx.moveTo(cx - torsoW * 0.55, waistY - legFY);
  ctx.quadraticCurveTo(cx - torsoW * 0.58, (waistY + feetY) * 0.5 - legFY, cx - torsoW * 0.35, feetY - legFY);
  ctx.lineTo(cx - torsoW * 0.08, feetY - legFY);
  ctx.quadraticCurveTo(cx - torsoW * 0.3, (waistY + feetY) * 0.5 - legFY, cx - torsoW * 0.28, waistY - legFY);
  ctx.fill();

  // shadow side of left leg
  ctx.fillStyle = lc(C.pantsSh, C.pants, 0.1);
  ctx.beginPath();
  ctx.moveTo(cx - torsoW * 0.55, waistY - legFY);
  ctx.quadraticCurveTo(cx - torsoW * 0.58, (waistY + feetY) * 0.5 - legFY, cx - torsoW * 0.35, feetY - legFY);
  ctx.lineTo(cx - torsoW * 0.43, feetY - legFY);
  ctx.quadraticCurveTo(cx - torsoW * 0.62, (waistY + feetY) * 0.5 - legFY, cx - torsoW * 0.55, waistY - legFY);
  ctx.fill();
  ctx.restore();

  // right leg
  ctx.save();
  ctx.fillStyle = lc(C.pants, C.pantsSh, 0.3);
  ctx.beginPath();
  ctx.moveTo(cx + torsoW * 0.28, waistY - legFY);
  ctx.quadraticCurveTo(cx + torsoW * 0.3, (waistY + feetY) * 0.5 - legFY, cx + torsoW * 0.08, feetY - legFY);
  ctx.lineTo(cx + torsoW * 0.35, feetY - legFY);
  ctx.quadraticCurveTo(cx + torsoW * 0.58, (waistY + feetY) * 0.5 - legFY, cx + torsoW * 0.55, waistY - legFY);
  ctx.fill();
  ctx.restore();

  // feet / boots
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.fillStyle = '#1a1410';
    ctx.beginPath();
    const bx = cx + side * torsoW * 0.22;
    ctx.ellipse(bx, feetY - legFY + H * 0.015, torsoW * 0.22, H * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── 6. Belt ──────────────────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = lc(C.belt, [30, 30, 30], 0);
  ctx.beginPath();
  ctx.roundRect(cx - torsoW * 0.7, waistY - legFY - H * 0.025, torsoW * 1.4, H * 0.038, 4);
  ctx.fill();
  // belt buckle
  ctx.fillStyle = '#888';
  ctx.fillRect(cx - W * 0.02, waistY - legFY - H * 0.022, W * 0.04, H * 0.032);
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(cx - W * 0.02, waistY - legFY - H * 0.022, W * 0.04, H * 0.032);
  ctx.restore();

  // ── 7. Torso / Gi ────────────────────────────────────────────────
  ctx.save();
  // gi base
  ctx.fillStyle = lc(C.giOuter, [180, 60, 15], 0.2);
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW, shoulderY - legFY);
  ctx.lineTo(cx - torsoW * 0.72, waistY - legFY);
  ctx.lineTo(cx + torsoW * 0.72, waistY - legFY);
  ctx.lineTo(cx + shoulderW, shoulderY - legFY);
  ctx.closePath();
  ctx.fill();

  // gi inner / chest lighter
  ctx.fillStyle = lc(C.giInner, [220, 120, 40], 0.15);
  ctx.beginPath();
  ctx.moveTo(cx - torsoW * 0.18, shoulderY - legFY - H * 0.01);
  ctx.lineTo(cx + torsoW * 0.18, shoulderY - legFY - H * 0.01);
  ctx.lineTo(cx + torsoW * 0.08, waistY - legFY);
  ctx.lineTo(cx - torsoW * 0.08, waistY - legFY);
  ctx.fill();

  // gi shadow left side
  ctx.fillStyle = lc(C.giShadow, [120, 35, 8], 0.2);
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW, shoulderY - legFY);
  ctx.lineTo(cx - torsoW * 0.72, waistY - legFY);
  ctx.lineTo(cx - torsoW * 0.4, waistY - legFY);
  ctx.lineTo(cx - torsoW * 0.25, shoulderY - legFY);
  ctx.fill();
  ctx.globalAlpha = 1;

  // gi lapel lines
  ctx.strokeStyle = lc(C.giShadow, [120, 35, 8], 0.3);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, shoulderY - legFY);
  ctx.lineTo(cx - torsoW * 0.38, waistY - legFY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, shoulderY - legFY);
  ctx.lineTo(cx + torsoW * 0.38, waistY - legFY);
  ctx.stroke();
  ctx.restore();

  // ── 8. Arms ──────────────────────────────────────────────────────
  // Left arm (extended / power stance)
  ctx.save();
  const elbowLX = cx - shoulderW * 1.25;
  const elbowLY = (shoulderY + waistY) * 0.5 - legFY;
  const fistLX  = cx - shoulderW * 1.1;
  const fistLY  = waistY - H * 0.05 - legFY;

  // upper arm
  ctx.fillStyle = lc(C.giOuter, [180, 60, 15], 0.2);
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW + W * 0.02, shoulderY - legFY);
  ctx.lineTo(elbowLX - W * 0.02, elbowLY);
  ctx.lineTo(elbowLX + W * 0.025, elbowLY + H * 0.01);
  ctx.lineTo(cx - shoulderW + W * 0.07, shoulderY + H * 0.01 - legFY);
  ctx.fill();

  // forearm (skin)
  ctx.fillStyle = lc(C.skinBase, C.skinShadow, 0.15);
  ctx.beginPath();
  ctx.moveTo(elbowLX - W * 0.02, elbowLY);
  ctx.lineTo(fistLX - W * 0.03, fistLY);
  ctx.lineTo(fistLX + W * 0.03, fistLY + H * 0.005);
  ctx.lineTo(elbowLX + W * 0.025, elbowLY + H * 0.01);
  ctx.fill();
  // shadow on forearm
  ctx.fillStyle = lc(C.skinShadow, C.skinBase, 0.1);
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(elbowLX - W * 0.02, elbowLY);
  ctx.lineTo(fistLX - W * 0.03, fistLY);
  ctx.lineTo(fistLX - W * 0.01, fistLY + H * 0.003);
  ctx.lineTo(elbowLX, elbowLY + H * 0.008);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  // Right arm (raised / power pose)
  ctx.save();
  const elbowRX = cx + shoulderW * 1.2;
  const elbowRY = shoulderY + H * 0.05 - legFY;
  const fistRX  = cx + shoulderW * 1.05;
  const fistRY  = waistY - H * 0.12 - legFY;

  ctx.fillStyle = lc(C.giOuter, [180, 60, 15], 0.2);
  ctx.beginPath();
  ctx.moveTo(cx + shoulderW - W * 0.02, shoulderY - legFY);
  ctx.lineTo(elbowRX + W * 0.02, elbowRY);
  ctx.lineTo(elbowRX - W * 0.025, elbowRY + H * 0.01);
  ctx.lineTo(cx + shoulderW - W * 0.07, shoulderY + H * 0.01 - legFY);
  ctx.fill();

  ctx.fillStyle = lc(C.skinBase, C.skinShadow, 0.15);
  ctx.beginPath();
  ctx.moveTo(elbowRX + W * 0.02, elbowRY);
  ctx.lineTo(fistRX + W * 0.03, fistRY);
  ctx.lineTo(fistRX - W * 0.03, fistRY + H * 0.005);
  ctx.lineTo(elbowRX - W * 0.025, elbowRY + H * 0.01);
  ctx.fill();
  ctx.restore();

  // Wristbands
  const wristColor = lc(C.wristN, C.wristU, f);
  ctx.save();
  ctx.shadowColor = lca(C.wristN, C.wristU, f, 1);
  ctx.shadowBlur = f * 14;
  ctx.fillStyle = wristColor;
  // left
  ctx.beginPath();
  ctx.roundRect(fistLX - W * 0.035, fistLY - H * 0.01, W * 0.07, H * 0.022, 3);
  ctx.fill();
  // right
  ctx.beginPath();
  ctx.roundRect(fistRX - W * 0.035, fistRY - H * 0.005, W * 0.07, H * 0.022, 3);
  ctx.fill();
  ctx.restore();

  // Fists
  for (const [fx, fy] of [[fistLX, fistLY + H * 0.015], [fistRX, fistRY + H * 0.018]]) {
    ctx.save();
    ctx.fillStyle = lc(C.skinBase, C.skinShadow, 0.2);
    ctx.beginPath();
    ctx.ellipse(fx, fy, W * 0.048, H * 0.028, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // knuckle line
    ctx.strokeStyle = lc(C.skinShadow, C.skinBase, 0.15);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(fx - W * 0.03, fy - H * 0.006);
    ctx.lineTo(fx + W * 0.03, fy - H * 0.006);
    ctx.stroke();
    // ki glow on fists
    if (f > 0.4) {
      const kg = (f - 0.4) / 0.6;
      ctx.globalAlpha = kg * (0.5 + 0.5 * Math.sin(t * 4.5 + (fx > cx ? 1 : -1)));
      ctx.shadowColor = lca(C.auraN, C.auraU, f, 1);
      ctx.shadowBlur = 20;
      ctx.strokeStyle = lca(C.auraN, C.auraU, f, kg * 0.8);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(fx, fy, W * 0.058, H * 0.034, 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── 9. Neck ───────────────────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = lc(C.skinBase, C.skinShadow, 0.2);
  ctx.beginPath();
  ctx.roundRect(cx - W * 0.04, neckY - legFY, W * 0.08, shoulderY - neckY, 4);
  ctx.fill();
  // neck shadow
  ctx.fillStyle = lc(C.skinShadow, C.skinBase, 0.1);
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.roundRect(cx - W * 0.04, neckY - legFY, W * 0.02, shoulderY - neckY, [4, 0, 0, 4]);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();

  // ── 10. Head ─────────────────────────────────────────────────────
  ctx.save();
  const hx = cx;
  const hy = midFaceY - legFY;
  // base head shape
  ctx.fillStyle = lc(C.skinBase, C.skinShadow, 0.05);
  ctx.beginPath();
  ctx.ellipse(hx, hy, headR, headR * 1.18, 0, 0, Math.PI * 2);
  ctx.fill();
  // shadow side (left)
  const headShadGrad = ctx.createLinearGradient(hx - headR, hy, hx + headR * 0.2, hy);
  headShadGrad.addColorStop(0, `rgba(${C.skinShadow[0]},${C.skinShadow[1]},${C.skinShadow[2]},0.45)`);
  headShadGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = headShadGrad;
  ctx.beginPath();
  ctx.ellipse(hx, hy, headR, headR * 1.18, 0, 0, Math.PI * 2);
  ctx.fill();
  // rim highlight (right)
  const rimGrad = ctx.createLinearGradient(hx, hy, hx + headR, hy);
  rimGrad.addColorStop(0.7, 'rgba(0,0,0,0)');
  rimGrad.addColorStop(1, `rgba(${C.skinRim[0]},${C.skinRim[1]},${C.skinRim[2]},0.35)`);
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.ellipse(hx, hy, headR, headR * 1.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── 11. Face details ─────────────────────────────────────────────
  ctx.save();
  const eyeY = midFaceY - H * 0.012 - legFY;
  const eyeSpread = headR * 0.48;
  const eyeW = headR * 0.32;
  const eyeH = headR * 0.18;

  // eyebrow
  const browColor = lc(C.hairN, [80, 80, 90], f);
  ctx.strokeStyle = browColor;
  ctx.lineWidth = H * 0.006;
  ctx.lineCap = 'round';
  // left brow (slight angry angle for power face)
  ctx.beginPath();
  ctx.moveTo(hx - eyeSpread - eyeW * 0.5, eyeY - eyeH * 2.5);
  ctx.quadraticCurveTo(hx - eyeSpread, eyeY - eyeH * 3.2, hx - eyeSpread + eyeW * 0.5, eyeY - eyeH * 2.2);
  ctx.stroke();
  // right brow
  ctx.beginPath();
  ctx.moveTo(hx + eyeSpread - eyeW * 0.5, eyeY - eyeH * 2.2);
  ctx.quadraticCurveTo(hx + eyeSpread, eyeY - eyeH * 3.2, hx + eyeSpread + eyeW * 0.5, eyeY - eyeH * 2.5);
  ctx.stroke();

  // eyes — whites
  for (const side of [-1, 1]) {
    const ex = hx + side * eyeSpread;
    ctx.fillStyle = lc(C.eyeWhite, [220, 235, 245], 0.2);
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
    ctx.fill();

    // iris
    const irisR = eyeW * 0.62;
    const irisGrad = ctx.createRadialGradient(ex - irisR * 0.2, eyeY - irisR * 0.2, 0, ex, eyeY, irisR);
    irisGrad.addColorStop(0, lc(C.irisN, C.irisU, f));
    irisGrad.addColorStop(0.7, lca(C.irisN, C.irisU, f, 1));
    irisGrad.addColorStop(1, lca([0, 80, 120], [0, 160, 220], f, 0.8));
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, irisR, irisR * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // pupil
    ctx.fillStyle = lc(C.pupil, [0, 10, 30], f);
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, irisR * 0.42, irisR * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    // eye glow (ultra)
    if (f > 0.3) {
      const eg = (f - 0.3) / 0.7;
      ctx.save();
      ctx.globalAlpha = eg * (0.6 + 0.4 * Math.sin(t * 5 + side));
      ctx.shadowColor = '#00ccff';
      ctx.shadowBlur = 18 * eg;
      ctx.strokeStyle = `rgba(0,200,255,${eg * 0.9})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, eyeW * 0.75, eyeH * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();
      // bright center dot
      ctx.fillStyle = `rgba(220,250,255,${eg})`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ex - irisR * 0.15, eyeY - irisR * 0.15, irisR * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // catchlight
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(ex + irisR * 0.2, eyeY - irisR * 0.22, irisR * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  // nose (minimal)
  ctx.strokeStyle = lc(C.skinShadow, [160, 100, 70], 0.15);
  ctx.lineWidth = H * 0.004;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hx + headR * 0.1, eyeY + eyeH * 2);
  ctx.quadraticCurveTo(hx + headR * 0.12, eyeY + eyeH * 4, hx, eyeY + eyeH * 4.2);
  ctx.stroke();

  // mouth / jaw set line
  ctx.strokeStyle = lc(C.skinShadow, [150, 90, 60], 0.2);
  ctx.lineWidth = H * 0.005;
  ctx.beginPath();
  ctx.moveTo(hx - headR * 0.25, chinY - H * 0.01 - legFY);
  ctx.quadraticCurveTo(hx, chinY - H * 0.005 - legFY, hx + headR * 0.25, chinY - H * 0.01 - legFY);
  ctx.stroke();
  ctx.restore();

  // ── 12. Hair ─────────────────────────────────────────────────────
  ctx.save();
  const hairBase = lc(C.hairN, C.hairU, f);
  const hairTip  = lc(C.hairTipN, C.hairTipU, f);

  ctx.shadowColor = f > 0.5 ? 'rgba(200,230,255,0.6)' : 'rgba(0,0,0,0.3)';
  ctx.shadowBlur  = f > 0.5 ? 12 * f : 4;

  // back hair layer
  ctx.fillStyle = hairBase;
  ctx.beginPath();
  ctx.ellipse(hx, midFaceY - headR * 0.3 - legFY, headR * 1.05, headR * 0.7, -0.15, Math.PI, Math.PI * 2);
  ctx.fill();

  // hair spikes — defined as [tipX offset, tipY, base angle spread]
  const spikes = [
    // centre top spike (tallest)
    { tx: hx + headR * 0.05, ty: topHead + H * 0.01 - legFY, bx: hx - headR * 0.25, bx2: hx + headR * 0.22 },
    // left spike
    { tx: hx - headR * 0.65, ty: topHead + H * 0.04 - legFY, bx: hx - headR * 0.7, bx2: hx - headR * 0.1 },
    // far left spike
    { tx: hx - headR * 1.05, ty: foreheadY + H * 0.01 - legFY, bx: hx - headR * 1.0, bx2: hx - headR * 0.55 },
    // right spike
    { tx: hx + headR * 0.55, ty: topHead + H * 0.05 - legFY, bx: hx + headR * 0.08, bx2: hx + headR * 0.65 },
    // far right spike
    { tx: hx + headR * 0.92, ty: foreheadY + H * 0.015 - legFY, bx: hx + headR * 0.5, bx2: hx + headR * 0.98 },
  ];

  for (let si = 0; si < spikes.length; si++) {
    const sp = spikes[si];
    const sway = f > 0.4 ? Math.sin(t * 1.8 + si * 1.3) * W * 0.012 * (f - 0.4) : 0;
    const grad = ctx.createLinearGradient(sp.bx, foreheadY - legFY, sp.tx + sway, sp.ty);
    grad.addColorStop(0, hairBase);
    grad.addColorStop(0.65, hairBase);
    grad.addColorStop(1, hairTip);
    ctx.fillStyle = grad;
    ctx.beginPath();
    const baseY = foreheadY + H * 0.015 - legFY;
    ctx.moveTo(sp.bx, baseY);
    ctx.quadraticCurveTo(
      (sp.bx + sp.tx + sway) * 0.5 - W * 0.02,
      (baseY + sp.ty) * 0.5 - H * 0.04,
      sp.tx + sway, sp.ty
    );
    ctx.quadraticCurveTo(
      (sp.bx2 + sp.tx + sway) * 0.5 + W * 0.02,
      (baseY + sp.ty) * 0.5 - H * 0.02,
      sp.bx2, baseY
    );
    ctx.fill();
    // spike highlight
    if (f > 0.5) {
      ctx.globalAlpha = (f - 0.5) * 0.6 * (0.6 + 0.4 * Math.sin(t * 3 + si));
      ctx.strokeStyle = 'rgba(200,230,255,0.8)';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#a0d8ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo((sp.bx + sp.bx2) / 2, baseY);
      ctx.lineTo(sp.tx + sway, sp.ty);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = f > 0.5 ? 12 * f : 4;
    }
  }

  // front hair bang
  ctx.fillStyle = hairBase;
  ctx.beginPath();
  ctx.moveTo(hx - headR * 0.6, foreheadY - legFY);
  ctx.quadraticCurveTo(hx - headR * 0.1, foreheadY - H * 0.02 - legFY, hx + headR * 0.35, foreheadY - legFY);
  ctx.lineTo(hx + headR * 0.3, foreheadY + H * 0.02 - legFY);
  ctx.quadraticCurveTo(hx, foreheadY + H * 0.008 - legFY, hx - headR * 0.55, foreheadY + H * 0.02 - legFY);
  ctx.fill();
  ctx.restore();

  // ── 13. Collar / gi top ──────────────────────────────────────────
  ctx.save();
  ctx.fillStyle = lc(C.giOuter, [180, 60, 15], 0.2);
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW * 0.65, shoulderY - legFY);
  ctx.lineTo(cx - torsoW * 0.22, neckY - legFY + H * 0.01);
  ctx.lineTo(cx + torsoW * 0.22, neckY - legFY + H * 0.01);
  ctx.lineTo(cx + shoulderW * 0.65, shoulderY - legFY);
  ctx.lineTo(cx + shoulderW, shoulderY - legFY);
  ctx.lineTo(cx + shoulderW * 0.8, shoulderY - legFY - H * 0.01);
  ctx.lineTo(cx, neckY - legFY - H * 0.015);
  ctx.lineTo(cx - shoulderW * 0.8, shoulderY - legFY - H * 0.01);
  ctx.lineTo(cx - shoulderW, shoulderY - legFY);
  ctx.fill();
  ctx.restore();

  // ── 14. Ki crown / halo (ultra only) ─────────────────────────────
  if (f > 0.7) {
    const ka = (f - 0.7) / 0.3;
    ctx.save();
    ctx.globalAlpha = ka * (0.5 + 0.5 * Math.sin(t * 4));
    ctx.strokeStyle = lca(C.auraN, C.auraU, f, 1);
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#40ccff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.ellipse(hx, topHead - H * 0.02 - legFY, headR * 1.3, headR * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    // inner halo ring
    ctx.globalAlpha = ka * 0.4;
    ctx.lineWidth = 5;
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.ellipse(hx, topHead - H * 0.02 - legFY, headR * 1.1, headR * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ── 15. Lightning bolts ───────────────────────────────────────────
  if (f > 0.2) {
    const la = Math.min(1, (f - 0.2) / 0.5);
    const seed = Math.floor(t * 7);

    // body lightning bolts
    const bolts = [
      [cx - shoulderW * 0.8, shoulderY - legFY - H * 0.02, cx - W * 0.45, groundY - H * 0.1],
      [cx + shoulderW * 0.8, shoulderY - legFY - H * 0.02, cx + W * 0.45, groundY - H * 0.1],
      [cx - headR, topHead - legFY, cx - W * 0.48, waistY - legFY],
      [cx + headR, topHead - legFY, cx + W * 0.48, waistY - legFY],
    ];

    const lCol = f < 0.5 ? '#ffcc44' : '#88ddff';
    for (let bi = 0; bi < bolts.length; bi++) {
      const b = bolts[bi];
      if (seededRand(seed, bi * 7 + 3) > 0.3) {
        drawLightning(ctx, b[0], b[1], b[2], b[3], 8, W * 0.06, lCol, la * 0.7, seed + bi * 31);
      }
    }

    // small inter-spike arcs
    if (f > 0.55) {
      const sa = (f - 0.55) / 0.45;
      drawLightning(ctx, hx - headR * 0.6, topHead - legFY, hx + headR * 0.5, topHead - legFY - H * 0.02, 5, W * 0.035, lCol, sa * 0.6, seed + 99);
    }
  }

  // ── 16. Scan line (ultra transformation effect) ───────────────────
  if (f > 0.12 && f < 0.95) {
    const sp = (f - 0.12) / 0.83;
    const scanY = H * (1 - sp);
    const scanGrad = ctx.createLinearGradient(0, scanY - H * 0.03, 0, scanY + H * 0.03);
    const scanCol = f < 0.5 ? '255,180,60' : '100,200,255';
    scanGrad.addColorStop(0, `rgba(${scanCol},0)`);
    scanGrad.addColorStop(0.5, `rgba(${scanCol},${0.6 * Math.sin(t * 8 + f * 20)})`);
    scanGrad.addColorStop(1, `rgba(${scanCol},0)`);
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - H * 0.03, W, H * 0.06);
  }
}

/* ─── component ──────────────────────────────────────────────────── */
export default function HeroCharacter({ phase }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef({ f: 0, t: 0, lastTime: 0, particles: [] as Particle[], spawnTimer: 0 });
  const phaseRef   = useRef(phase);
  const rafRef     = useRef(0);

  phaseRef.current = phase;

  // phase → factor target
  const TARGETS: Record<0 | 1 | 2 | 3, number> = { 0: 0, 1: 0.25, 2: 0.62, 3: 1.0 };

  const loop = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    if (!canvas || !ctx) { rafRef.current = requestAnimationFrame(loop); return; }

    const W = canvas.width;
    const H = canvas.height;
    const state = stateRef.current;
    const dt = Math.min((now - (state.lastTime || now)) / 1000, 0.05);
    state.lastTime = now;
    state.t += dt;

    // smooth factor toward target
    const target = TARGETS[phaseRef.current];
    const speed  = target > state.f ? 0.55 : 0.35;
    state.f += (target - state.f) * speed * dt * 3.2;
    if (Math.abs(state.f - target) < 0.001) state.f = target;

    // particles
    state.spawnTimer += dt;
    const spawnRate = state.f < 0.1 ? 999 : state.f < 0.3 ? 0.15 : state.f < 0.6 ? 0.08 : 0.04;
    while (state.spawnTimer > spawnRate) {
      state.spawnTimer -= spawnRate;
      if (state.particles.length < 120) {
        state.particles.push(spawnParticle(W, H, state.f));
      }
    }

    // update + prune particles
    state.particles = state.particles.filter(p => {
      p.x += p.vx * dt * 30;
      p.y += p.vy * dt * 30;
      p.vy -= dt * (p.type === 'spark' ? 0.5 : 0.1); // slight upward drift
      p.life++;
      return p.life < p.maxLife;
    });

    draw(ctx, W, H, state.f, state.t, state.particles);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // start loop
  useEffect(() => {
    stateRef.current.lastTime = 0;
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [loop]);

  // resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width  = Math.round(width  * dpr);
        canvas.height = Math.round(height * dpr);
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }
    });
    ro.observe(canvas);
    // initial size
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.round(canvas.offsetWidth  * dpr);
    canvas.height = Math.round(canvas.offsetHeight * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    />
  );
}
