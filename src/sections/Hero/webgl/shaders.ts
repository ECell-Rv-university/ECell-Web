/**
 * Full-screen passes for the hero reveal.
 *
 * SIM_FRAG advances the ink simulation (density + velocity, ping-ponged);
 * FINAL_FRAG composites the flat white/black title with the 3D scene that
 * shows through the ink.
 */
export const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const NOISE = /* glsl */ `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}
`;

// Ping-pong ink pass. R holds ink density, GB a velocity field. The pointer
// pushes ink along its direction of travel, so fast strokes fling streaks
// ahead of the cursor; curl noise drags the edges into fingers and drips.
export const SIM_FRAG = /* glsl */ `
uniform sampler2D uPrev;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform vec2 uMouseVel;
uniform vec2 uTexel;
uniform float uAspect;
uniform float uRadius;
uniform float uStrength;
uniform float uDecay;
uniform float uVelDecay;
uniform float uDt;
uniform float uTime;
varying vec2 vUv;
${NOISE}
float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 asp = vec2(uAspect, 1.0);

  vec2 q = vUv * asp * 3.5 + vec2(uTime * 0.12, -uTime * 0.09);
  float e = 0.02;
  float n0 = noise(q);
  vec2 curl = vec2(noise(q + vec2(0.0, e)) - n0, -(noise(q + vec2(e, 0.0)) - n0)) / e;

  vec2 vel = texture2D(uPrev, vUv).gb;
  vec2 back = vUv - (vel + curl * 0.06) * uDt;
  vec4 s = texture2D(uPrev, back);
  float spread = 0.25 * (
    texture2D(uPrev, back + vec2(uTexel.x, 0.0)).r +
    texture2D(uPrev, back - vec2(uTexel.x, 0.0)).r +
    texture2D(uPrev, back + vec2(0.0, uTexel.y)).r +
    texture2D(uPrev, back - vec2(0.0, uTexel.y)).r
  );
  float ink = mix(s.r, max(s.r, spread), 0.5) * uDecay;
  vec2 v = s.gb * uVelDecay;

  float d = segDist(vUv * asp, uPrevMouse * asp, uMouse * asp);
  float wob = noise(vUv * asp * 5.0 + uTime * 0.6);
  float r = uRadius * (0.6 + 0.8 * wob);
  float stamp = exp(-pow(d / r, 2.0) * 2.0);

  ink = clamp(ink + stamp * uStrength * (1.0 - ink), 0.0, 1.0);
  v = mix(v, uMouseVel, clamp(stamp * 0.6, 0.0, 1.0));

  gl_FragColor = vec4(ink, v, 1.0);
}
`;

// Flat text everywhere; inside the liquid mask, the nebula behind glass letters.
export const FINAL_FRAG = /* glsl */ `
uniform sampler2D uText;
uniform sampler2D uScene;
uniform sampler2D uMask;
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;
${NOISE}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
vec3 toSRGB(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  float textA = texture2D(uText, vUv).r;
  vec3 base = vec3(1.0 - textA);

  float m = texture2D(uMask, vUv).r;
  // Domain-warped noise breaks the ink edge into fingers and stray droplets.
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 warp = vec2(fbm(p * 3.0 + uTime * 0.035), fbm(p * 3.0 + 5.2 - uTime * 0.03));
  float n = fbm(p * 4.0 + warp * 1.6);
  float fine = noise(p * 18.0 + warp * 3.0);
  float field = m + (n - 0.5) * 0.5 + (fine - 0.5) * 0.05;
  float aa = fwidth(field) * 0.75 + 1e-4;
  float reveal = smoothstep(0.42 - aa, 0.42 + aa, field);

  // Treat the ink as a thick liquid: it bulges up from its edge, so the rim
  // tilts outward, catches a highlight and bends what is seen through it.
  float depth = smoothstep(0.42, 0.62, field);
  float steep = 1.0 - depth;
  vec2 g = vec2(dFdx(depth), dFdy(depth));
  vec2 dir = g / (length(g) + 1e-5);
  vec3 nrm = normalize(vec3(-dir * steep * 1.6, 1.0));
  vec3 light = normalize(vec3(-0.45, 0.6, 0.65));
  vec3 halfV = normalize(light + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(nrm, halfV), 0.0), 70.0) * steep;
  float rim = pow(steep, 3.0) * 0.06;

  vec2 refractUv = vUv + nrm.xy * 0.018 * steep;
  vec3 inner = toSRGB(aces(texture2D(uScene, refractUv).rgb));
  inner += vec3(spec * 0.85 + rim);
  gl_FragColor = vec4(mix(base, inner, reveal), 1.0);
}
`;
