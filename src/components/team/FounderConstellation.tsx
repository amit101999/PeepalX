"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/*
 * Colours from globals.css, repeated here because WebGL cannot read CSS
 * custom properties: line-strong for the founders' own ring, green-300 for
 * the links to "you", green-600 (accent) for the pulses travelling on them.
 */
const RING_COLOUR = 0xc6cfc3;
const LINK_COLOUR = 0x95dabc;
const PULSE_COLOUR = 0x146b45;

/** Founders sit on a circle of this radius around "you", in scene units. */
const RADIUS = 2.2;
/** Pulses per link, and how long one takes to cross it (seconds). */
const PULSES_PER_LINK = 2;
const PULSE_PERIOD = 3.2;
/** One full turn of the idle drift, in seconds: slow enough to read names. */
const DRIFT_PERIOD = 70;

/**
 * The page's claim, drawn: three founders, each joined directly to you, with
 * nothing in between. The founders' triangle turns slowly in 3D around the
 * "you" node, work pulses along each direct line, and the whole figure leans
 * a little towards the mouse.
 *
 * The name chips are real HTML (passed in as `nodes`, rendered on the
 * server), positioned each frame by projecting their 3D points, so the text
 * stays crisp. The figure is decorative and hidden from assistive technology:
 * the founders are listed properly just below.
 *
 * Cost control, as with the Work page's `CoverDeck`:
 *  - `three` is imported only once the figure is on screen. It lives in the
 *    PageHeader aside, which is hidden below `lg`, so phones never load it.
 *  - The render loop runs only while visible, at a capped pixel ratio.
 *  - Reduced motion draws one still frame. No WebGL keeps the chips hidden
 *    and leaves the aside empty (the heading beside it stands on its own).
 *  - Everything is disposed on unmount.
 */
export function FounderConstellation({
  nodes,
  you,
  className,
}: {
  /** One chip per founder, in team order. */
  nodes: React.ReactNode[];
  /** The chip for the centre node. */
  you: React.ReactNode;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const youRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const count = nodes.length;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || count === 0) return;

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
        return; // No WebGL: the aside stays empty.
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
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
      camera.position.set(0, 1.3, 6.9);
      camera.lookAt(0, -0.5, 0);

      // The whole figure leans towards the mouse; `spin` turns inside it.
      const figure = new THREE.Group();
      figure.rotation.x = 0.55;
      scene.add(figure);
      const spin = new THREE.Group();
      figure.add(spin);

      // Founders evenly spaced on the ring, the first one at the front.
      const founders = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return new THREE.Vector3(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
      });
      const centre = new THREE.Vector3(0, 0, 0);

      // The founders' own ring: a faint closed loop between them.
      const ringGeometry = new THREE.BufferGeometry().setFromPoints(founders);
      const ringMaterial = new THREE.LineBasicMaterial({
        color: RING_COLOUR,
        transparent: true,
        opacity: 0.9,
      });
      spin.add(new THREE.LineLoop(ringGeometry, ringMaterial));

      // A direct line from "you" to each founder.
      const linkGeometry = new THREE.BufferGeometry().setFromPoints(
        founders.flatMap((point) => [centre, point]),
      );
      const linkMaterial = new THREE.LineBasicMaterial({ color: LINK_COLOUR });
      spin.add(new THREE.LineSegments(linkGeometry, linkMaterial));

      // Pulses running both ways along each link: a conversation, not a feed.
      const pulseCount = count * PULSES_PER_LINK;
      const pulsePositions = new Float32Array(pulseCount * 3);
      const pulseGeometry = new THREE.BufferGeometry();
      pulseGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(pulsePositions, 3),
      );
      const pulseMaterial = new THREE.PointsMaterial({
        color: PULSE_COLOUR,
        size: 0.19,
        sizeAttenuation: true,
      });
      spin.add(new THREE.Points(pulseGeometry, pulseMaterial));

      const placePulses = (t: number) => {
        founders.forEach((point, link) => {
          for (let k = 0; k < PULSES_PER_LINK; k++) {
            const phase = (t / PULSE_PERIOD + k / PULSES_PER_LINK + link * 0.31) % 1;
            // Alternate pulses travel outwards and inwards.
            const along = k % 2 === 0 ? phase : 1 - phase;
            const index = (link * PULSES_PER_LINK + k) * 3;
            pulsePositions[index] = point.x * along;
            pulsePositions[index + 1] = 0;
            pulsePositions[index + 2] = point.z * along;
          }
        });
        pulseGeometry.attributes.position!.needsUpdate = true;
      };

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

      // Chips follow their projected points; nearer ones sit on top.
      const projected = new THREE.Vector3();
      const placeChip = (
        chip: HTMLDivElement | null,
        local: InstanceType<typeof THREE.Vector3>,
      ) => {
        if (!chip) return;
        projected.copy(local).applyMatrix4(spin.matrixWorld);
        const depth = projected.z;
        projected.project(camera);
        const x = (projected.x * 0.5 + 0.5) * width;
        const y = (-projected.y * 0.5 + 0.5) * height;
        const near = (depth + RADIUS) / (RADIUS * 2); // 0 far .. 1 near
        chip.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${0.86 + near * 0.14})`;
        chip.style.opacity = String(0.55 + near * 0.45);
        chip.style.zIndex = String(Math.round(near * 10));
      };

      const draw = (t: number) => {
        spin.rotation.y = reduce ? -0.35 : (t / DRIFT_PERIOD) * Math.PI * 2;
        placePulses(reduce ? 0.4 : t);
        scene.updateMatrixWorld();
        renderer.render(scene, camera);
        founders.forEach((point, i) => placeChip(chipRefs.current[i] ?? null, point));
        placeChip(youRef.current, centre);
      };

      const resizeObserver = new ResizeObserver(() => {
        resize();
        if (reduce) draw(0);
      });
      resizeObserver.observe(host);
      resize();

      // Lean towards the mouse, eased so it feels weighty.
      const target = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        target.x = (event.clientX / window.innerWidth - 0.5) * 0.4;
        target.y = (event.clientY / window.innerHeight - 0.5) * 0.25;
      };

      // Time accumulates only while running, so the drift resumes where it
      // paused instead of jumping when the figure scrolls back into view.
      let elapsed = 0;
      let last = 0;
      const frame = (now: number) => {
        elapsed += Math.min((now - last) / 1000, 0.1);
        last = now;
        figure.rotation.z += (target.x * -0.3 - figure.rotation.z) * 0.05;
        figure.rotation.x += (0.55 + target.y - figure.rotation.x) * 0.05;
        draw(elapsed);
      };

      let visibility: IntersectionObserver | undefined;
      if (reduce) {
        draw(0);
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
        draw(0);
      }
      setReady(true);

      cleanup = () => {
        renderer.setAnimationLoop(null);
        visibility?.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        ringGeometry.dispose();
        ringMaterial.dispose();
        linkGeometry.dispose();
        linkMaterial.dispose();
        pulseGeometry.dispose();
        pulseMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Start once the figure is actually on screen (never, below `lg`).
    const appear = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      appear.disconnect();
      void start();
    });
    appear.observe(host);

    return () => {
      disposed = true;
      appear.disconnect();
      cleanup?.();
    };
  }, [count]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn(
        "transition-opacity duration-700",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {nodes.map((node, i) => (
        <div
          key={i}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          className="absolute top-0 left-0 will-change-transform"
        >
          {node}
        </div>
      ))}
      <div ref={youRef} className="absolute top-0 left-0 will-change-transform">
        {you}
      </div>
    </div>
  );
}
