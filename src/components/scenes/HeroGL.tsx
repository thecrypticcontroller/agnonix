// HeroGL.tsx — GOD MODE WebGL background for Hero
// R3F canvas: 3D DKR hexagon mesh + holographic GLSL shader
//             + mouse-reactive particle field + bloom post-processing
// Sits as position:absolute behind Hero's existing CSS/canvas layer.
// PERF: geometry disposal, mobile post-processing guard, stable Vector2 ref

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { Vector2 } from 'three';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ── Device capability ─────────────────────────────────────────────────────────
const IS_TOUCH = typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches;
// Reduce particles on mobile/touch devices
const PARTICLE_COUNT = IS_TOUCH ? 80 : 320;

// ── Mouse tracker ─────────────────────────────────────────────────────────────
function useMouse() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  useEffect(() => {
    if (IS_TOUCH) return; // no mouse on touch
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return mouse;
}

// ── DKR Hex Emblem ────────────────────────────────────────────────────────────
// A lathe-extruded hexagonal prism with custom holographic shader material
const HEX_VSHADER = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv       = uv;
    vNormal   = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HEX_FSHADER = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vPosition;

  void main() {
    vec3  red    = vec3(0.87, 0.106, 0.11);
    vec3  hot    = vec3(1.0,  0.165, 0.165);
    vec3  black  = vec3(0.0);

    // Fresnel rim
    float rim    = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.8);

    // Animated scan line
    float scan   = step(0.49, fract(vUv.y * 14.0 + uTime * 0.35));

    // Mouse-driven iridescence shift
    float shift  = dot(vNormal.xy, uMouse) * 0.5;
    float irid   = 0.5 + 0.5 * sin(uTime * 0.7 + vUv.x * 6.0 + shift * 3.14);

    vec3  col    = mix(black, red, rim * 0.85);
    col         += hot * irid * rim * 0.4;
    col         += red * scan * 0.06;

    // Subtle face fill
    col         += red * 0.07;

    gl_FragColor  = vec4(col, rim * 0.9 + 0.08);
  }
`;

function DKRHex({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Hexagonal prism geometry — FIX: dispose on unmount to prevent GPU leak
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    const sides = 6;
    const r = 1.2;
    for (let i = 0; i <= sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 6;
      i === 0 ? shape.moveTo(Math.cos(a) * r, Math.sin(a) * r)
        : shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.04,
      bevelSegments: 4,
    });
  }, []);

  // FIX: dispose ExtrudeGeometry on unmount
  useEffect(() => {
    return () => { geo.dispose(); };
  }, [geo]);

  // FIX: stable EdgesGeometry — create once alongside geo, dispose on unmount
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  useEffect(() => {
    return () => { edgesGeo.dispose(); };
  }, [edgesGeo]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
      matRef.current.uniforms.uMouse.value.lerp(mouse.current, 0.06);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.current.y * 0.25,
        0.04
      );
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} geometry={geo} position={[0, 0, 0]}>
        <shaderMaterial
          ref={matRef}
          vertexShader={HEX_VSHADER}
          fragmentShader={HEX_FSHADER}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* FIX: use stable edgesGeo ref — was recreating EdgesGeometry every render */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color="#de1b1c" opacity={0.25} transparent />
      </lineSegments>
    </Float>
  );
}

// ── Particle Field ────────────────────────────────────────────────────────────
function ParticleField({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      speeds[i] = 0.003 + Math.random() * 0.005;
    }
    return { positions, speeds };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const base = i * 3;
      pos[base + 1] -= speeds[i];
      if (pos[base + 1] < -8) pos[base + 1] = 8;
      // Subtle mouse repel (skip on touch — no mouse)
      if (!IS_TOUCH) {
        const dx = pos[base] - mouse.current.x * 6;
        const dy = pos[base + 1] - mouse.current.y * 4;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 1.5) {
          pos[base] += (dx / d) * 0.04;
          pos[base + 1] += (dy / d) * 0.03;
        }
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#de1b1c"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

// ── Energy rings ──────────────────────────────────────────────────────────────
function EnergyRings() {
  const refs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const radii = [1.9, 2.5, 3.2];
  const speeds = [0.008, -0.005, 0.004];

  useFrame(() => {
    refs.forEach((r, i) => {
      if (r.current) r.current.rotation.z += speeds[i];
    });
  });

  return (
    <>
      {radii.map((radius, i) => (
        <mesh key={i} ref={refs[i]} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[radius, 0.008, 6, 80]} />
          <meshBasicMaterial
            color="#de1b1c"
            transparent
            opacity={0.18 - i * 0.04}
          />
        </mesh>
      ))}
    </>
  );
}

// ── Scroll progress tracker ───────────────────────────────────────────────────
function useScrollProgress() {
  const scrollRef = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      scrollRef.current = scrollHeight > clientHeight
        ? scrollTop / (scrollHeight - clientHeight)
        : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrollRef;
}

// ── Camera drift — mouse parallax + scroll-jacked depth/tilt ─────────────────
function CameraDrift({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const { camera } = useThree();
  const scrollRef = useScrollProgress();

  useFrame(() => {
    const scroll = scrollRef.current;

    // Scroll-jacked: pull camera back and tilt downward as user scrolls
    const targetZ = 6 - scroll * 3.5;   // zoom out as scroll increases (max pull-back ≈ 9.5)
    const tiltX = scroll * 0.8;       // downward camera drift

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x, mouse.current.x * 0.8, 0.03
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y, mouse.current.y * 0.5 - tiltX, 0.03
    );
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.025);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Post-processing — skipped on mobile to protect framerate ─────────────────
// FIX: stable Vector2 constant (was allocating new Vector2 every render)
const CHROMA_OFFSET = new Vector2(0.002, 0.002);

function PostFX() {
  // Skip heavy post-processing on touch/mobile devices
  if (IS_TOUCH) return null;
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.18}
        luminanceSmoothing={0.9}
        intensity={1.6}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
        offset={CHROMA_OFFSET}
      />
    </EffectComposer>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  const mouse = useMouse();
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight color="#de1b1c" intensity={3} position={[2, 2, 3]} distance={12} decay={2} />
      <pointLight color="#ff4444" intensity={1.5} position={[-3, -2, 2]} distance={10} decay={2} />

      <CameraDrift mouse={mouse} />
      <DKRHex mouse={mouse} />
      <EnergyRings />
      <ParticleField mouse={mouse} />
      <Stars radius={60} depth={30} count={IS_TOUCH ? 300 : 800} factor={2} fade speed={0.4} />

      <PostFX />
    </>
  );
}

// ── WebGL fallback ────────────────────────────────────────────────────────────
function WebGLFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(222,27,28,0.12) 0%, transparent 70%)',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function HeroGL() {
  // FIX: detect WebGL support and gracefully degrade
  const webGLSupported = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      );
    } catch {
      return false;
    }
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {webGLSupported ? (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 52 }}
          gl={{ antialias: !IS_TOUCH, alpha: true, powerPreference: 'high-performance' }}
          dpr={IS_TOUCH ? 1 : [1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      ) : (
        <WebGLFallback />
      )}
    </div>
  );
}
