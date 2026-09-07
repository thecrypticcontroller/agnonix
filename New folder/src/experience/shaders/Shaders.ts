import * as THREE from "three";

export const HologramShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#3fd5f4") },
    uOpacity: { value: 0.8 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vPosition = position;
      vec3 pos = position;
      pos.x += sin(pos.y * 10.0 + uTime * 2.0) * 0.02;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    void main() {
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      float scanline = sin(vPosition.y * 40.0 - uTime * 5.0) * 0.5 + 0.5;
      float alpha = (fresnel * 0.8 + scanline * 0.2) * uOpacity;
      vec3 finalColor = uColor + vec3(fresnel * 0.5);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

export const EnergyCoreShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorNormal: { value: new THREE.Color("#3fd5f4") },
    uColorAlert: { value: new THREE.Color("#f5c56d") },
    uAlertProgress: { value: 0 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec3 pos = position;
      pos += normal * (sin(uTime * 3.0 + position.y * 5.0) * 0.04);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColorNormal;
    uniform vec3 uColorAlert;
    uniform float uAlertProgress;
    void main() {
      float pulse = sin(uTime * 4.0 + vPosition.x * 8.0) * 0.5 + 0.5;
      vec3 baseColor = mix(uColorNormal, uColorAlert, uAlertProgress);
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
      gl_FragColor = vec4(baseColor * (0.8 + pulse * 0.4) + vec3(fresnel * 0.6), 0.9);
    }
  `
};
