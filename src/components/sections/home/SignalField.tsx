"use client";

import { useEffect, useRef } from "react";

/*
 * Colours from the green scale in globals.css, repeated here because WebGL
 * cannot read CSS custom properties. Low: green-700, high: green-300.
 */
const LOW = [0x0f / 255, 0x52 / 255, 0x36 / 255];
const HIGH = [0x95 / 255, 0xda / 255, 0xbc / 255];

/** Grid resolution. ~5k points is light for any GPU that runs WebGL at all. */
const COLUMNS = 120;
const ROWS = 44;
const SPACING = 0.42;

/*
 * Camera: aimed above the field so the wave sits in the lower part of the
 * frame, under the heading and copy rather than behind them.
 */
const CAMERA_Y = 3.2;
const LOOK_AT_Y = 2.2;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vHeight;
  varying float vFade;

  void main() {
    vec3 p = position;
    // Three slow, overlapping swells: enough to feel alive, never busy.
    float h = sin(p.x * 0.32 + uTime * 0.55) * 0.55
            + sin(p.z * 0.48 + uTime * 0.38) * 0.35
            + sin((p.x + p.z) * 0.18 + uTime * 0.27) * 0.6;
    p.y += h;
    vHeight = clamp(h * 0.45 + 0.5, 0.0, 1.0);

    vec4 view = modelViewMatrix * vec4(p, 1.0);
    // Fade points out towards the horizon so the field has no hard far edge.
    vFade = smoothstep(26.0, 6.0, -view.z);
    gl_Position = projectionMatrix * view;
    gl_PointSize = uSize * uPixelRatio / -view.z;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uHigh;
  varying float vHeight;
  varying float vFade;

  void main() {
    // Round, soft-edged points.
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.2, d);
    vec3 colour = mix(uLow, uHigh, vHeight);
    gl_FragColor = vec4(colour, edge * vFade * (0.25 + vHeight * 0.5));
  }
`;

/**
 * A slow wave of points behind the closing call to action: a quiet sense of
 * systems in motion on the page's one dark block. Decorative only (hidden
 * from assistive technology, pointer-events off).
 *
 * Cost control, since Three.js is large:
 *  - `three` is imported only when the block comes within 300px of the
 *    viewport, so it never touches the initial page load.
 *  - The render loop runs only while the block is on screen, at a capped
 *    device pixel ratio.
 *  - Under reduced motion it draws a single still frame and never animates.
 *  - If WebGL is unavailable the block simply keeps its CSS gradient.
 *  - Everything is disposed on unmount.
 */
export function SignalField({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
      } catch {
        return; // No WebGL: the CSS background stands on its own.
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.opacity = "0";
      renderer.domElement.style.transition = "opacity 1.2s ease";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);
      camera.position.set(0, CAMERA_Y, 9);
      camera.lookAt(0, LOOK_AT_Y, -4);

      const positions = new Float32Array(COLUMNS * ROWS * 3);
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          const i = (row * COLUMNS + col) * 3;
          positions[i] = (col - COLUMNS / 2) * SPACING;
          positions[i + 1] = 0;
          positions[i + 2] = -row * SPACING + 4;
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 34 },
          uPixelRatio: { value: pixelRatio },
          uLow: { value: new THREE.Vector3(...LOW) },
          uHigh: { value: new THREE.Vector3(...HIGH) },
        },
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const resize = () => {
        const { clientWidth: width, clientHeight: height } = host;
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        if (reduce) renderer.render(scene, camera);
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      // A small drift towards the mouse, eased so the field feels weighty.
      const target = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        target.x = (event.clientX / window.innerWidth - 0.5) * 1.2;
        target.y = (event.clientY / window.innerHeight - 0.5) * 0.5;
      };

      // Time accumulates only while running, so the wave resumes where it
      // paused instead of jumping when the block scrolls back into view.
      let elapsed = 0;
      let last = 0;
      const frame = (now: number) => {
        elapsed += Math.min((now - last) / 1000, 0.1);
        last = now;
        material.uniforms.uTime!.value = elapsed;
        camera.position.x += (target.x - camera.position.x) * 0.03;
        camera.position.y += (CAMERA_Y - target.y - camera.position.y) * 0.03;
        camera.lookAt(0, LOOK_AT_Y, -4);
        renderer.render(scene, camera);
      };

      let visibility: IntersectionObserver | undefined;
      if (reduce) {
        material.uniforms.uTime!.value = 2.4; // a pleasant still frame
        renderer.render(scene, camera);
      } else {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        visibility = new IntersectionObserver(([entry]) => {
          if (entry?.isIntersecting) {
            last = performance.now();
            renderer.setAnimationLoop(frame);
          } else {
            renderer.setAnimationLoop(null);
          }
        });
        visibility.observe(host);
      }
      // Next frame, so the opacity change is a transition rather than a jump.
      const fadeIn = requestAnimationFrame(() => {
        renderer.domElement.style.opacity = "1";
      });

      cleanup = () => {
        cancelAnimationFrame(fadeIn);
        renderer.setAnimationLoop(null);
        visibility?.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Load Three.js only as the block approaches the viewport.
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        approach.disconnect();
        void start();
      },
      { rootMargin: "300px 0px" },
    );
    approach.observe(host);

    return () => {
      disposed = true;
      approach.disconnect();
      cleanup?.();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className={className} />;
}
