"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { FINAL_FRAG, SIM_FRAG, VERT } from "../webgl/shaders";
import { drawFlatText, layoutText } from "../webgl/text";
import { buildLetter, type Letter } from "../webgl/letters";
import { GALAXY_FRAG, GALAXY_VERT, buildGalaxy } from "../webgl/galaxy";
import "../styles/HeroReveal.css";

/**
 * Hero title with a liquid ink reveal. Moving the pointer pours ink over the
 * flat title; inside it, glass balloon letters float over a particle nebula.
 */
export default function HeroReveal(): React.ReactElement {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      host.classList.add("hero-reveal--fallback");
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Render at up to 1.5x, but cap the total pixel count so 4K/ultrawide
    // monitors and phones stay smooth. Recomputed on every resize.
    const maxPixels = coarse ? 1.2e6 : 3.7e6;
    let pixelRatio = 1;
    renderer.domElement.className = "hero-reveal__canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.PlaneGeometry(2, 2);

    // --- Nebula ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    const galaxyGeometry = buildGalaxy(coarse ? 18000 : 42000);
    const galaxyMaterial = new THREE.ShaderMaterial({
      vertexShader: GALAXY_VERT,
      fragmentShader: GALAXY_FRAG,
      uniforms: {
        uSpin: { value: 0 },
        uTime: { value: 0 },
        uSizeScale: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.rotation.z = 0.28;
    galaxy.scale.setScalar(1.6);
    scene.add(galaxy);
    let spin = 0;

    // --- Glass balloon letters, drawn over the nebula ---
    const letterScene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTexture = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    letterScene.environment = envTexture;
    letterScene.environmentIntensity = 1.1;

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-0.6, 0.9, 1);
    letterScene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.2);
    rim.position.set(1, -0.4, 0.6);
    letterScene.add(rim);

    // Tinted glass: the shaded colour (reflections, highlights) is added at
    // full strength while only `opacity` of the nebula behind is blocked.
    const letterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x151515,
      metalness: 1,
      roughness: 0.18,
      // alphaTest runs after opacity is applied: half of 0.3 trims at the outline.
      alphaTest: 0.15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });

    const letterCamera = new THREE.PerspectiveCamera(30, 1, 1, 20000);
    const letterGroup = new THREE.Group();
    letterScene.add(letterGroup);
    let letters: Letter[] = [];
    let layoutSize = 100;

    const disposeLetters = () => {
      for (const l of letters) {
        letterGroup.remove(l.mesh);
        l.mesh.geometry.dispose();
        l.mesh.material.dispose();
        l.alphaTexture.dispose();
      }
      letters = [];
    };

    // --- Render targets ---
    const rtOpts = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    };
    let simA = new THREE.WebGLRenderTarget(1, 1, rtOpts);
    let simB = new THREE.WebGLRenderTarget(1, 1, rtOpts);
    const sceneRT = new THREE.WebGLRenderTarget(1, 1, { ...rtOpts, depthBuffer: true, samples: coarse ? 0 : 2 });
    renderer.autoClear = false;

    const textCanvas = document.createElement("canvas");
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.generateMipmaps = false;

    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: SIM_FRAG,
      uniforms: {
        uPrev: { value: null },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uPrevMouse: { value: new THREE.Vector2(-10, -10) },
        uMouseVel: { value: new THREE.Vector2() },
        uTexel: { value: new THREE.Vector2(1, 1) },
        uAspect: { value: 1 },
        uRadius: { value: 0.1 },
        uStrength: { value: 0 },
        uDecay: { value: 0.97 },
        uVelDecay: { value: 0.93 },
        uDt: { value: 1 / 60 },
        uTime: { value: 0 },
      },
    });
    const finalMaterial = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FINAL_FRAG,
      uniforms: {
        uText: { value: textTexture },
        uScene: { value: sceneRT.texture },
        uMask: { value: null },
        uTime: { value: 0 },
        uAspect: { value: 1 },
      },
    });
    const simScene = new THREE.Scene();
    simScene.add(new THREE.Mesh(quad, simMaterial));
    const finalScene = new THREE.Scene();
    finalScene.add(new THREE.Mesh(quad, finalMaterial));

    let fontFamily = getComputedStyle(host).getPropertyValue("--font-archivo").trim() || "Archivo";
    let cssW = 0;
    let cssH = 0;
    // Once the ink has fully faded there is nothing to draw, so the loop idles.
    let quiet = 0;
    let dirty = true;

    const buildText = () => {
      if (!cssW || !cssH) return;
      const layout = layoutText(cssW, cssH, fontFamily);
      layoutSize = layout.size;
      drawFlatText(textCanvas, layout, cssW, cssH, Math.min(pixelRatio, 2560 / cssW));
      textTexture.needsUpdate = true;
      dirty = true;

      disposeLetters();
      layout.glyphs.forEach((g, i) => {
        if (g.char.trim() === "") return;
        const letter = buildLetter(g, layout, cssW, cssH, letterMaterial, i, coarse ? 110 : 150);
        if (letter) {
          letters.push(letter);
          letterGroup.add(letter.mesh);
        }
      });
    };

    const resize = () => {
      // offsetWidth ignores the scroll scale transform on the stage.
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      if (!w || !h || (w === cssW && h === cssH)) return;
      cssW = w;
      cssH = h;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(maxPixels / (w * h)));
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(w, h, false);
      sceneRT.setSize(Math.round(w * pixelRatio), Math.round(h * pixelRatio));
      const sw = Math.max(2, Math.round(w / 2));
      const sh = Math.max(2, Math.round(h / 2));
      simA.setSize(sw, sh);
      simB.setSize(sw, sh);
      simMaterial.uniforms.uTexel.value.set(1 / sw, 1 / sh);
      renderer.setClearColor(0x000000, 1);
      renderer.setRenderTarget(simA);
      renderer.clear();
      renderer.setRenderTarget(simB);
      renderer.clear();
      renderer.setRenderTarget(null);

      camera.aspect = w / h;
      // Pull back on narrow screens so the disc still reads as a spiral.
      camera.position.setLength(w / h < 1 ? 4.2 : 2.9);
      camera.updateProjectionMatrix();
      galaxyMaterial.uniforms.uSizeScale.value = h * pixelRatio * 0.0045;

      // World units are CSS pixels at z = 0, so letters line up with the flat text.
      letterCamera.aspect = w / h;
      letterCamera.position.set(0, 0, h / 2 / Math.tan(THREE.MathUtils.degToRad(letterCamera.fov / 2)));
      letterCamera.near = letterCamera.position.z * 0.1;
      letterCamera.far = letterCamera.position.z * 4;
      letterCamera.updateProjectionMatrix();

      simMaterial.uniforms.uAspect.value = w / h;
      finalMaterial.uniforms.uAspect.value = w / h;
      buildText();
    };

    // Pointer state in UV space of the canvas (accounts for the scroll scale).
    const pointer = new THREE.Vector2(-10, -10);
    const smoothed = new THREE.Vector2(-10, -10);
    const lastStamp = new THREE.Vector2(-10, -10);
    const tilt = new THREE.Vector2();
    const tiltTarget = new THREE.Vector2();
    const wander = new THREE.Vector2();
    const rawVel = new THREE.Vector2();
    const vel = new THREE.Vector2();
    const orbit = new THREE.Spherical();
    let hasPointer = false;
    let lastInput = -Infinity;

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.set((e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height);
      if (!hasPointer) {
        smoothed.copy(pointer);
        lastStamp.copy(pointer);
        hasPointer = true;
      }
      lastInput = performance.now();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, cssW ? 150 : 0);
    });
    ro.observe(host);
    camera.position.set(0, 1, 1);
    resize();

    let disposed = false;
    document.fonts?.load(`900 100px ${fontFamily}`).then(() => {
      if (disposed) return;
      fontFamily = getComputedStyle(host).getPropertyValue("--font-archivo").trim() || fontFamily;
      buildText();
    }).catch(() => {});

    const timer = new THREE.Timer();
    let raf = 0;
    const tick = (timestamp: number) => {
      raf = requestAnimationFrame(tick);
      timer.update(timestamp);
      if (!visible || document.hidden) return;
      const dt = Math.min(timer.getDelta(), 1 / 20);
      const t = timer.getElapsed();

      // Touch screens have no hover: a blob wanders on its own, and a finger
      // dragging across the hero takes over until it lifts for a moment.
      let target = pointer;
      const touching = performance.now() - lastInput < 1500;
      if (coarse && !reduceMotion && !touching) {
        target = wander.set(
          0.5 + Math.sin(t * 0.43) * 0.32 + Math.sin(t * 0.17) * 0.08,
          0.5 + Math.sin(t * 0.61 + 1.3) * 0.22,
        );
        if (!hasPointer) {
          smoothed.copy(target);
          lastStamp.copy(target);
          hasPointer = true;
        }
      }

      smoothed.lerp(target, 1 - Math.pow(0.00001, dt));
      const aspect = simMaterial.uniforms.uAspect.value as number;
      // Ink only flows while the pointer moves: a resting cursor lets it fade.
      rawVel.copy(smoothed).sub(lastStamp).divideScalar(Math.max(dt, 1e-3)).clampLength(0, 8);
      vel.lerp(rawVel, 1 - Math.pow(0.0005, dt));
      const speed = Math.hypot(vel.x * aspect, vel.y);
      const flow = THREE.MathUtils.smoothstep(speed, 0.03, 1.0);

      quiet = flow > 0.01 ? 0 : quiet + dt;
      if (quiet > 4 && !dirty) {
        lastStamp.copy(smoothed);
        return;
      }
      dirty = false;

      // Mask simulation
      simMaterial.uniforms.uPrev.value = simA.texture;
      simMaterial.uniforms.uPrevMouse.value.copy(lastStamp);
      simMaterial.uniforms.uMouse.value.copy(smoothed);
      simMaterial.uniforms.uMouseVel.value.copy(vel).multiplyScalar(0.45);
      simMaterial.uniforms.uRadius.value = 0.07 + Math.min(speed * 0.06, 0.15);
      simMaterial.uniforms.uStrength.value = hasPointer ? flow * Math.min(dt * 60, 1.5) * 0.5 : 0;
      simMaterial.uniforms.uDecay.value = Math.pow(0.982, dt * 60);
      simMaterial.uniforms.uVelDecay.value = Math.pow(0.93, dt * 60);
      simMaterial.uniforms.uDt.value = dt;
      simMaterial.uniforms.uTime.value = t;
      renderer.setRenderTarget(simB);
      renderer.render(simScene, quadCamera);
      [simA, simB] = [simB, simA];
      lastStamp.copy(smoothed);

      // Nebula: spins faster while the ink is moving, camera leans to the cursor.
      const motion = reduceMotion ? 0 : 1;
      spin += dt * (0.12 + flow * 1.1) * motion;
      galaxyMaterial.uniforms.uSpin.value = spin;
      galaxyMaterial.uniforms.uTime.value = t * motion;
      tilt.lerp(tiltTarget.set(smoothed.x - 0.5, smoothed.y - 0.5), 1 - Math.pow(0.05, dt));
      const dist = camera.position.length();
      orbit.set(dist, 1.0 - tilt.y * 0.5 * motion, tilt.x * 0.9 * motion);
      camera.position.setFromSpherical(orbit);
      camera.lookAt(0, 0, 0);

      // Letters: tilt toward the cursor, puff up as it passes.
      letterGroup.rotation.y = tilt.x * 0.35 * motion;
      letterGroup.rotation.x = -tilt.y * 0.3 * motion;
      const px = smoothed.x * cssW;
      const py = (1 - smoothed.y) * cssH;
      for (const l of letters) {
        const near = flow > 0.05 && Math.hypot(px - l.cx, py - l.cy) < layoutSize * 0.85 ? 1 : 0;
        l.heat = Math.max(l.heat * Math.pow(0.975, dt * 60), near);
        const targetInflate = 0.55 + 0.45 * l.heat;
        // Under-damped spring so letters overshoot and wobble like balloons.
        l.inflateVel += ((targetInflate - l.inflate) * 90 - l.inflateVel * 9) * dt;
        l.inflate += l.inflateVel * dt;

        const p = l.phase;
        const swell = 1 + (l.inflate - 0.55) * 0.06;
        l.mesh.scale.set(swell, swell, Math.max(0.05, l.inflate));
        l.mesh.position.set(
          l.baseX,
          l.baseY + Math.sin(t * 1.1 + p) * layoutSize * 0.015 * motion,
          Math.sin(t * 0.8 + p) * layoutSize * 0.04 * motion,
        );
        l.mesh.rotation.set(
          Math.sin(t * 0.9 + p) * 0.08 * motion,
          Math.sin(t * 0.7 + p * 1.7) * 0.12 * motion,
          Math.sin(t * 0.6 + p * 0.6) * 0.04 * motion,
        );
      }

      renderer.setRenderTarget(sceneRT);
      renderer.setClearColor(0x000000, 1);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.clearDepth();
      renderer.render(letterScene, letterCamera);
      renderer.setRenderTarget(null);

      finalMaterial.uniforms.uMask.value = simA.texture;
      finalMaterial.uniforms.uTime.value = t;
      renderer.render(finalScene, quadCamera);
    };
    raf = requestAnimationFrame(tick);

    // If the GPU drops the context (driver reset, too many tabs), fall back to
    // the static title instead of leaving a blank canvas.
    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      host.classList.add("hero-reveal--fallback");
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      io.disconnect();
      ro.disconnect();
      disposeLetters();
      letterMaterial.dispose();
      envTexture.dispose();
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      simA.dispose();
      simB.dispose();
      sceneRT.dispose();
      textTexture.dispose();
      simMaterial.dispose();
      finalMaterial.dispose();
      quad.dispose();
      timer.dispose();
      renderer.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={hostRef} className="hero-reveal">
      <span className="hero-reveal__fallback" aria-hidden="true">
        ECELL RVU
      </span>
    </div>
  );
}
