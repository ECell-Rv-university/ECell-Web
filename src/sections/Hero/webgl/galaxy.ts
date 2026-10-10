import * as THREE from "three";

// "Idea nebula": a spiral galaxy of particles in the ECell palette. Inner
// stars orbit faster than outer ones, so the arms wind as it spins.
export const GALAXY_VERT = /* glsl */ `
attribute float aRadius;
attribute float aAngle;
attribute float aHeight;
attribute float aSize;
attribute float aSeed;
attribute vec3 aColor;
uniform float uSpin;
uniform float uTime;
uniform float uSizeScale;
varying vec3 vColor;
void main() {
  float ang = aAngle + uSpin / (aRadius * 1.6 + 0.35);
  vec3 pos = vec3(cos(ang) * aRadius, aHeight, sin(ang) * aRadius);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float twinkle = 0.65 + 0.35 * sin(uTime * (1.5 + aSeed * 3.0) + aSeed * 40.0);
  gl_PointSize = aSize * uSizeScale * twinkle / -mv.z;
  vColor = aColor * twinkle;
}
`;

export const GALAXY_FRAG = /* glsl */ `
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(max(0.0, 1.0 - d * 2.0), 2.2);
  gl_FragColor = vec4(vColor, a);
}
`;

export function buildGalaxy(count: number): THREE.BufferGeometry {
  const radius = new Float32Array(count);
  const angle = new Float32Array(count);
  const height = new Float32Array(count);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const color = new Float32Array(count * 3);

  const core = new THREE.Color("#fff1d6");
  const red = new THREE.Color("#ff001a");
  const blue = new THREE.Color("#2f45ff");
  const cream = new THREE.Color("#bab5a6");
  const c = new THREE.Color();
  const branches = 4;
  const haloCount = Math.floor(count * 0.12);
  const signed = () => (Math.random() < 0.5 ? -1 : 1);

  for (let i = 0; i < count; i++) {
    let x: number;
    let z: number;
    let y: number;
    if (i < haloCount) {
      // Sparse dust far outside the disc, so the reveal is never empty.
      const r = 1.2 + Math.random() * 3;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r;
      z = Math.sin(a) * r;
      y = (Math.random() - 0.5) * 2.4;
      c.copy(cream).multiplyScalar(0.35 + Math.random() * 0.4);
      size[i] = 0.6 + Math.random() * 0.8;
    } else {
      const r = Math.pow(Math.random(), 1.6);
      const branch = ((i % branches) / branches) * Math.PI * 2;
      const spin = r * 5;
      const spread = 0.32 * (0.25 + r);
      x = Math.cos(branch + spin) * r + Math.pow(Math.random(), 3) * signed() * spread;
      z = Math.sin(branch + spin) * r + Math.pow(Math.random(), 3) * signed() * spread;
      y = Math.pow(Math.random(), 3) * signed() * 0.12 * (1.2 - r);
      if (r < 0.4) c.copy(core).lerp(red, r / 0.4);
      else c.copy(red).lerp(blue, (r - 0.4) / 0.6);
      if (Math.random() < 0.12) c.setRGB(1, 1, 1);
      c.multiplyScalar(r < 0.08 ? 2.2 : 1.1);
      size[i] = 0.8 + Math.random() * 1.6;
    }
    radius[i] = Math.hypot(x, z);
    angle[i] = Math.atan2(z, x);
    height[i] = y;
    seed[i] = Math.random();
    color[i * 3] = c.r;
    color[i * 3 + 1] = c.g;
    color[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  // Positions are computed in the shader; this attribute only sets the count.
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1));
  geometry.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1));
  geometry.setAttribute("aHeight", new THREE.BufferAttribute(height, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5);
  return geometry;
}
