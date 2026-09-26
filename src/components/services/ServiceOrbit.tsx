"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/*
 * Colours from globals.css, repeated here because WebGL cannot read CSS
 * custom properties: line-strong for the orbit, green-300/500/600 for the
 * core and the work flowing out of it.
 */
const ORBIT_COLOUR = 0xc6cfc3;
const SPOKE_COLOUR = [0x95 / 255, 0xda / 255, 0xbc / 255]; // green-300
const ACTIVE_COLOUR = [0x14 / 255, 0x6b / 255, 0x45 / 255]; // green-600 (accent)
const CORE_LOW = [0x24 / 255, 0xa8 / 255, 0x6e / 255]; // green-500
const CORE_HIGH = [0x95 / 255, 0xda / 255, 0xbc / 255]; // green-300

/* Geometry, in scene units. The ring lies flat and the camera looks down on
   it, so it reads as a tilted orbit with a near (bottom) and far (top) side. */
const RADIUS = 2.6;
const CORE_RADIUS = 0.62; // where spokes start, just outside the HTML core disc
const HALO_RADIUS = 0.82;
const HALO_POINTS = 420;
const PULSES_PER_SPOKE = 3;
const CAMERA = { y: 4.9, z: 5.6 };

/** One full turn of the idle drift, in seconds: slow enough to read labels. */
const DRIFT_PERIOD = 90;

/** Only animate where there is room for the chips and motion is welcome. */
const ENABLE_QUERY = "(min-width: 640px) and (prefers-reduced-motion: no-preference)";

const pointVertex = /* glsl */ `
  attribute float aAlpha;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vDepth;
  void main() {
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vDepth = smoothstep(10.0, 5.0, -view.z);
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * view;
    gl_PointSize = uSize * uPixelRatio / -view.z;
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uHigh;
  varying float vAlpha;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.15, d);
    gl_FragColor = vec4(mix(uLow, uHigh, vDepth), edge * vAlpha * (0.35 + vDepth * 0.65));
  }
`;

/** Shortest signed angle from `from` to `to`, so a turn never goes the long way. */
function angleDelta(from: number, to: number) {
  const tau = Math.PI * 2;
  return ((((to - from) % tau) + tau * 1.5) % tau) - Math.PI;
}

/**
 * The service map's diagram as a slowly turning 3D system: the six services
 * orbit one core, with work pulsing out along each spoke. Pointing at (or
 * tabbing to) a service in the index beside it turns the orbit to bring that
 * service to the front and lights its spoke.
 *
 * Progressive enhancement over the static SVG diagram (`fallback`):
 *  - Server HTML, small screens, reduced motion and browsers without WebGL
 *    all keep the SVG, which has its own CSS animation.
 *  - `three` is imported only when the diagram nears the viewport, and the
 *    render loop runs only while it is on screen.
 *  - The service chips are real HTML (Lucide icons and text, rendered on the
 *    server and passed in as `nodes`), positioned each frame by projecting
 *    their 3D positions, so they stay crisp at any pixel ratio.
 *
 * The whole diagram is decorative and hidden from assistive technology; the
 * index is the navigation.
 */
export function ServiceOrbit({
  fallback,
  nodes,
  core,
}: {
  fallback: ReactNode;
  nodes: ReactNode[];
  core: ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const count = nodes.length;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !window.matchMedia(ENABLE_QUERY).matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return; // No WebGL: the SVG diagram stays.
      }

      const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x000000, 0);
      Object.assign(renderer.domElement.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
      });
      host.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
      camera.position.set(0, CAMERA.y, CAMERA.z);
      camera.lookAt(0, 0, 0);

      // Everything that turns with the orbit.
      const orbit = new THREE.Group();
      scene.add(orbit);

      const ringPoints: InstanceType<typeof THREE.Vector3>[] = [];
      for (let i = 0; i < 160; i++) {
        const a = (i / 160) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS));
      }
      const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMaterial = new THREE.LineBasicMaterial({ color: ORBIT_COLOUR });
      orbit.add(new THREE.LineLoop(ringGeometry, ringMaterial));

      // Spokes, one segment per service, coloured per vertex so the active
      // one can switch to the accent.
      const step = (Math.PI * 2) / count;
      const nodeLocal = Array.from(
        { length: count },
        (_, i) =>
          new THREE.Vector3(Math.sin(i * step) * RADIUS, 0, Math.cos(i * step) * RADIUS),
      );
      const spokePositions = new Float32Array(count * 6);
      const spokeColours = new Float32Array(count * 6);
      nodeLocal.forEach((node, i) => {
        const dir = node.clone().normalize();
        const from = dir.clone().multiplyScalar(CORE_RADIUS);
        const to = dir.clone().multiplyScalar(RADIUS - 0.34);
        spokePositions.set([from.x, 0, from.z, to.x, 0, to.z], i * 6);
        spokeColours.set([...SPOKE_COLOUR, ...SPOKE_COLOUR], i * 6);
      });
      const spokeGeometry = new THREE.BufferGeometry();
      spokeGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(spokePositions, 3),
      );
      const spokeColourAttribute = new THREE.BufferAttribute(spokeColours, 3);
      spokeGeometry.setAttribute("color", spokeColourAttribute);
      const spokeMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
      orbit.add(new THREE.LineSegments(spokeGeometry, spokeMaterial));

      // Pulses: points that travel out along each spoke.
      const pulseCount = count * PULSES_PER_SPOKE;
      const pulsePositions = new Float32Array(pulseCount * 3);
      const pulseAlpha = new Float32Array(pulseCount);
      const pulseGeometry = new THREE.BufferGeometry();
      pulseGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(pulsePositions, 3),
      );
      pulseGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(pulseAlpha, 1));
      const pulseMaterial = new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uSize: { value: 150 },
          uPixelRatio: { value: pixelRatio },
          uLow: { value: new THREE.Vector3(...ACTIVE_COLOUR) },
          uHigh: { value: new THREE.Vector3(...CORE_LOW) },
        },
      });
      orbit.add(new THREE.Points(pulseGeometry, pulseMaterial));

      // The core: a sphere of points turning on its own axis.
      const haloPositions = new Float32Array(HALO_POINTS * 3);
      const haloAlpha = new Float32Array(HALO_POINTS).fill(0.9);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < HALO_POINTS; i++) {
        const y = 1 - (i / (HALO_POINTS - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        haloPositions.set(
          [
            Math.cos(golden * i) * r * HALO_RADIUS,
            y * HALO_RADIUS,
            Math.sin(golden * i) * r * HALO_RADIUS,
          ],
          i * 3,
        );
      }
      const haloGeometry = new THREE.BufferGeometry();
      haloGeometry.setAttribute("position", new THREE.BufferAttribute(haloPositions, 3));
      haloGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(haloAlpha, 1));
      const haloMaterial = new THREE.ShaderMaterial({
        vertexShader: pointVertex,
        fragmentShader: pointFragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uSize: { value: 42 },
          uPixelRatio: { value: pixelRatio },
          uLow: { value: new THREE.Vector3(...CORE_HIGH) },
          uHigh: { value: new THREE.Vector3(...CORE_LOW) },
        },
      });
      const halo = new THREE.Points(haloGeometry, haloMaterial);
      halo.rotation.z = 0.35;
      scene.add(halo);

      let width = 0;
      let height = 0;
      const resize = () => {
        width = host.clientWidth;
        height = host.clientHeight;
        if (width === 0 || height === 0) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      // Which service the index is pointing at, if any.
      const map = host.closest("[data-service-map]");
      const links = map ? Array.from(map.querySelectorAll("[data-map-link]")) : [];
      let active = -1;
      let spokesFor = -2; // which `active` the spoke colours were last written for
      const onEnter = (event: Event) => {
        const index = links.findIndex((link) => link.contains(event.target as Node));
        if (index !== -1) active = index;
      };
      const onLeave = (event: Event) => {
        const next = (event as FocusEvent).relatedTarget as Node | null;
        if (!next || !links.some((link) => link.contains(next))) active = -1;
      };
      map?.addEventListener("pointerover", onEnter);
      map?.addEventListener("focusin", onEnter);
      map?.addEventListener("pointerout", onLeave);
      map?.addEventListener("focusout", onLeave);

      // A slight tilt towards the mouse while it is over the diagram.
      const tilt = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const box = host.getBoundingClientRect();
        tilt.x = ((event.clientX - box.left) / box.width - 0.5) * 0.9;
        tilt.y = ((event.clientY - box.top) / box.height - 0.5) * 0.6;
      };
      const onPointerLeave = () => {
        tilt.x = 0;
        tilt.y = 0;
      };
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);

      const world = new THREE.Vector3();
      let spin = 0;
      let elapsed = 0;
      let last = performance.now();

      const frame = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        elapsed += dt;

        // Idle: drift. Pointed at: ease round until that service is in front.
        if (active === -1) {
          spin += (dt * Math.PI * 2) / DRIFT_PERIOD;
        } else {
          spin += angleDelta(spin, -active * step) * Math.min(dt * 4, 1);
        }
        orbit.rotation.y = spin;
        halo.rotation.y += dt * 0.25;

        camera.position.x += (tilt.x - camera.position.x) * 0.05;
        camera.position.y += (CAMERA.y - tilt.y - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        if (spokesFor !== active) {
          for (let i = 0; i < count; i++) {
            const colour = i === active ? ACTIVE_COLOUR : SPOKE_COLOUR;
            spokeColours.set([...colour, ...colour], i * 6);
          }
          spokeColourAttribute.needsUpdate = true;
          spokesFor = active;
        }

        // Pulses run outward, faster on the active spoke.
        for (let i = 0; i < count; i++) {
          const dir = nodeLocal[i]!;
          const speed = i === active ? 0.9 : 0.35;
          for (let p = 0; p < PULSES_PER_SPOKE; p++) {
            const t = (elapsed * speed + p / PULSES_PER_SPOKE + i * 0.17) % 1;
            const distance = CORE_RADIUS + t * (RADIUS - 0.34 - CORE_RADIUS);
            const k = i * PULSES_PER_SPOKE + p;
            pulsePositions.set(
              [(dir.x / RADIUS) * distance, 0, (dir.z / RADIUS) * distance],
              k * 3,
            );
            // Fade in from the core and out before the node.
            pulseAlpha[k] = Math.sin(t * Math.PI) * (i === active ? 1 : 0.7);
          }
        }
        pulseGeometry.attributes.position!.needsUpdate = true;
        pulseGeometry.attributes.aAlpha!.needsUpdate = true;

        renderer.render(scene, camera);

        // Place each HTML chip over its node, nearer ones larger and on top.
        orbit.updateMatrixWorld();
        for (let i = 0; i < count; i++) {
          const chip = chipRefs.current[i];
          if (!chip) continue;
          world.copy(nodeLocal[i]!).applyMatrix4(orbit.matrixWorld);
          const near = (world.z / RADIUS + 1) / 2; // 0 far side, 1 near side
          world.project(camera);
          const x = ((world.x + 1) / 2) * width;
          const y = ((1 - world.y) / 2) * height;
          const scale = 0.82 + near * 0.26;
          chip.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
          chip.style.opacity = String(0.55 + near * 0.45);
          chip.style.zIndex = String(Math.round(near * 10));
          chip.dataset.active = i === active ? "true" : "false";
        }
      };

      let visibility: IntersectionObserver | undefined = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            last = performance.now();
            renderer.setAnimationLoop(frame);
          } else {
            renderer.setAnimationLoop(null);
          }
        },
      );
      visibility.observe(host);
      frame(performance.now()); // place the chips before revealing them
      setReady(true);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        visibility?.disconnect();
        visibility = undefined;
        resizeObserver.disconnect();
        map?.removeEventListener("pointerover", onEnter);
        map?.removeEventListener("focusin", onEnter);
        map?.removeEventListener("pointerout", onLeave);
        map?.removeEventListener("focusout", onLeave);
        host.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerleave", onPointerLeave);
        [ringGeometry, spokeGeometry, pulseGeometry, haloGeometry].forEach((g) =>
          g.dispose(),
        );
        [ringMaterial, spokeMaterial, pulseMaterial, haloMaterial].forEach((m) =>
          m.dispose(),
        );
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Load Three.js only as the diagram approaches the viewport.
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        approach.disconnect();
        void start();
      },
      { rootMargin: "200px 0px" },
    );
    approach.observe(host);

    return () => {
      disposed = true;
      approach.disconnect();
      cleanup?.();
      setReady(false);
    };
  }, [count]);

  return (
    <div ref={hostRef} aria-hidden="true" className="relative size-full">
      {/* The static diagram: shown until (and unless) the 3D one takes over.
          `fallback` and `core` sit in `contents` wrappers because React's dev
          build flagged them, as elements from the server, with a missing-key
          warning when they were direct children here. */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 1 }}
      >
        <div className="contents">{fallback}</div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0, visibility: ready ? "visible" : "hidden" }}
      >
        <div className="contents">{core}</div>
        {nodes.map((node, index) => (
          <div
            key={index}
            ref={(element) => {
              chipRefs.current[index] = element;
            }}
            data-active="false"
            className="group/orbit absolute top-0 left-0 will-change-transform"
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
