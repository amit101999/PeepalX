"use client";

import { useEffect, useRef, useState } from "react";
import {
  BRAND_COLORS,
  BRAND_MARK_PATHS,
  BRAND_MARK_VIEWBOX,
  BrandMark,
} from "@/components/layout/Logo";

/** Mark pieces, back to front, in the order `BrandMark` paints them. */
const PIECES = ["stem", "leg", "fold", "back", "stroke", "bowl"] as const;
type Piece = (typeof PIECES)[number];

/** A colour stop: offset along the gradient (0..1) and a CSS colour. */
type Stops = [number, string][];

/**
 * How each piece is coloured, copied from `BrandMark` and `BrandGradients`:
 * a flat colour, or a linear gradient between two points in mark units.
 */
const FILLS: Record<
  Piece,
  string | { from: [number, number]; to: [number, number]; stops: Stops }
> = {
  stem: BRAND_COLORS.navy,
  leg: BRAND_COLORS.navy,
  fold: BRAND_COLORS.navy,
  back: BRAND_COLORS.navy,
  stroke: {
    from: [15, 166],
    to: [497, 496],
    stops: [
      [0, BRAND_COLORS.navy],
      [0.35, BRAND_COLORS.blueDeep],
      [0.7, BRAND_COLORS.blue],
      [1, BRAND_COLORS.cyan],
    ],
  },
  bowl: {
    from: [15, 0],
    to: [500, 0],
    stops: [
      [0, BRAND_COLORS.blueDeep],
      [0.45, BRAND_COLORS.blue],
      [1, BRAND_COLORS.cyan],
    ],
  },
};

const [, , MARK_W, MARK_H] = BRAND_MARK_VIEWBOX.split(" ").map(Number) as [
  number,
  number,
  number,
  number,
];

/**
 * Plate thickness, and the gap between assembled plates in mark units: just
 * enough to keep the faces in order, so the finished mark reads flat.
 */
const DEPTH = 14;
const LAYER = 2;
/** How far apart the pieces start, in mark units: an exploded drawing. */
const SPREAD = { z: 90, out: 0.3 };
/** Assembly timing (seconds): each piece's travel, and the stagger between them. */
const ENTER = 1.5;
const STAGGER = 0.11;
/**
 * Resting turn of the whole mark (radians): face on, so once assembled it is
 * the header logo. Depth shows while the plates fly in and as the mark leans
 * towards the mouse.
 */
const REST = { x: 0, y: 0 };
/** Resolution of each plate's face texture, in pixels per mark unit. */
const FACE_SCALE = 2;

const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

/**
 * The PeepalX mark as an exploded drawing that assembles itself: the six
 * pieces of the logo, cut as thin plates, start pulled apart in depth and
 * slide together into the finished mark, which then turns gently towards the
 * mouse. On a page about a company of co-founders, the logo coming together
 * is the one idea it illustrates.
 *
 * Assembled, it is the header logo exactly: it rests face on, the plates sit
 * flush, and each plate's face is painted from the logo's own fills (flat
 * navy, or the same multi-stop gradients `BrandGradients` draws) rather than
 * lit, so the colours match the flat mark. Only the plates' cut edges are lit.
 *
 * Decorative only (the page says everything in text), so it is hidden from
 * assistive technology. Costs are kept to the same rules as `CoverDeck`:
 *  - `three` loads only once the mark is on screen; the header hides it below
 *    `lg`, and a hidden element never intersects, so phones never download it.
 *  - The render loop runs only while visible, at a capped pixel ratio.
 *  - Under reduced motion it draws the assembled mark once and stops.
 *  - Without WebGL it shows the flat SVG mark instead.
 *  - Everything is disposed on unmount.
 */
export function MarkAssembly({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const [THREE, { SVGLoader }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/SVGLoader.js"),
      ]);
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        setFailed(true);
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.opacity = "0";
      renderer.domElement.style.transition = "opacity 0.8s ease";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 1, 100);
      camera.position.set(0, 0, 14);

      // Soft light from the upper left, so the plates' cut edges read as
      // depth without shifting the brand colours far from the flat logo.
      scene.add(new THREE.AmbientLight(0xffffff, 2.1));
      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(-4, 5, 8);
      scene.add(key);

      // The mark in scene units: 1/100 of a mark unit, centred, and flipped
      // because SVG's y axis points down.
      const mark = new THREE.Group();
      mark.rotation.set(REST.x, REST.y, 0);
      const flip = new THREE.Group();
      flip.scale.set(0.01, -0.01, 0.01);
      mark.add(flip);
      scene.add(mark);

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_MARK_VIEWBOX}">${PIECES.map(
        (piece) => `<path id="${piece}" d="${BRAND_MARK_PATHS[piece]}"/>`,
      ).join("")}</svg>`;
      const parsed = new SVGLoader().parse(svg).paths;

      const geometries: InstanceType<typeof THREE.BufferGeometry>[] = [];
      const textures: InstanceType<typeof THREE.CanvasTexture>[] = [];
      const faceMaterials: InstanceType<typeof THREE.MeshBasicMaterial>[] = [];

      /** A piece's face, drawn as the flat logo draws it, as a texture. */
      const faceTexture = (piece: Piece) => {
        const canvas = document.createElement("canvas");
        canvas.width = MARK_W * FACE_SCALE;
        canvas.height = MARK_H * FACE_SCALE;
        const context = canvas.getContext("2d")!;
        context.scale(FACE_SCALE, FACE_SCALE);
        const fill = FILLS[piece];
        if (typeof fill === "string") {
          context.fillStyle = fill;
        } else {
          const gradient = context.createLinearGradient(...fill.from, ...fill.to);
          fill.stops.forEach(([offset, colour]) => gradient.addColorStop(offset, colour));
          context.fillStyle = gradient;
        }
        context.fill(new Path2D(BRAND_MARK_PATHS[piece]));
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        textures.push(texture);
        return texture;
      };

      // Cut edges only: the faces use the unlit face materials.
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.6,
        metalness: 0.05,
        // The flip mirrors the winding, so draw both faces.
        side: THREE.DoubleSide,
      });

      const colourAt = (
        piece: Piece,
        x: number,
        y: number,
        out: InstanceType<typeof THREE.Color>,
      ) => {
        const fill = FILLS[piece];
        if (typeof fill === "string") return out.setStyle(fill);
        // Project the point onto the gradient line, as SVG's linearGradient does.
        const dx = fill.to[0] - fill.from[0];
        const dy = fill.to[1] - fill.from[1];
        const t = clamp01(
          ((x - fill.from[0]) * dx + (y - fill.from[1]) * dy) / (dx * dx + dy * dy),
        );
        const upper = fill.stops.findIndex(([offset]) => offset >= t);
        const [bOffset, bColour] = fill.stops[Math.max(upper, 1)]!;
        const [aOffset, aColour] = fill.stops[Math.max(upper, 1) - 1]!;
        const mix = bOffset === aOffset ? 0 : (t - aOffset) / (bOffset - aOffset);
        return out.setStyle(aColour).lerp(new THREE.Color(bColour), mix);
      };

      const colour = new THREE.Color();
      const plates = PIECES.map((piece, index) => {
        const path = parsed.find(
          (entry) => (entry.userData?.node as Element | undefined)?.id === piece,
        )!;
        const geometry = new THREE.ExtrudeGeometry(path.toShapes(), {
          depth: DEPTH,
          bevelEnabled: false,
          curveSegments: 32,
        });
        const position = geometry.attributes.position!;
        const colours = new Float32Array(position.count * 3);
        for (let i = 0; i < position.count; i++) {
          colourAt(piece, position.getX(i), position.getY(i), colour).toArray(
            colours,
            i * 3,
          );
        }
        geometry.setAttribute("color", new THREE.BufferAttribute(colours, 3));
        // Map each face point to the same point of the logo drawing (the
        // texture's y runs up, the drawing's down).
        const uvs = new Float32Array(position.count * 2);
        for (let i = 0; i < position.count; i++) {
          uvs[i * 2] = position.getX(i) / MARK_W;
          uvs[i * 2 + 1] = 1 - position.getY(i) / MARK_H;
        }
        geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
        geometry.computeBoundingBox();
        const centre = new THREE.Vector3();
        geometry.boundingBox!.getCenter(centre);
        geometry.translate(-MARK_W / 2, -MARK_H / 2, 0);
        geometries.push(geometry);

        // ExtrudeGeometry's group 0 is the two faces, group 1 the cut edges.
        const face = new THREE.MeshBasicMaterial({
          map: faceTexture(piece),
          side: THREE.DoubleSide,
        });
        faceMaterials.push(face);
        const mesh = new THREE.Mesh(geometry, [face, material]);
        // Assembled: stacked back to front, a hair apart, centred on the stack.
        const rest = (index - (PIECES.length - 1) / 2) * LAYER;
        // Exploded: pushed apart in depth and outwards from the mark's centre.
        const away = new THREE.Vector3(
          (centre.x - MARK_W / 2) * SPREAD.out,
          (centre.y - MARK_H / 2) * SPREAD.out,
          (index - (PIECES.length - 1) / 2) * SPREAD.z,
        );
        mesh.userData = { rest, away };
        flip.add(mesh);
        return mesh;
      });

      /** Places every piece for time `t` (seconds since the mark appeared). */
      const pose = (t: number) => {
        plates.forEach((plate, index) => {
          const { rest, away } = plate.userData as {
            rest: number;
            away: InstanceType<typeof THREE.Vector3>;
          };
          const left = reduce
            ? 0
            : 1 - easeOutQuart(clamp01((t - index * STAGGER) / ENTER));
          plate.position.set(away.x * left, away.y * left, rest + away.z * left);
        });
      };

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

      // The mark turns a little towards the mouse, eased so it feels weighty.
      const target = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        target.x = (event.clientX / window.innerWidth - 0.5) * 0.5;
        target.y = (event.clientY / window.innerHeight - 0.5) * 0.25;
      };

      // Fade the canvas in with the first drawn frame, so it never shows blank.
      const show = () => {
        renderer.domElement.style.opacity = "1";
      };

      // Time accumulates only while running, so the mark resumes where it
      // paused instead of jumping when it scrolls back into view.
      let elapsed = 0;
      let last = 0;
      const frame = (now: number) => {
        elapsed += Math.min((now - last) / 1000, 0.1);
        last = now;
        mark.rotation.y += (REST.y + target.x - mark.rotation.y) * 0.05;
        mark.rotation.x += (REST.x + target.y - mark.rotation.x) * 0.05;
        pose(elapsed);
        renderer.render(scene, camera);
        show();
      };

      let visibility: IntersectionObserver | undefined;
      if (reduce) {
        pose(0);
        renderer.render(scene, camera);
        show();
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
      cleanup = () => {
        renderer.setAnimationLoop(null);
        visibility?.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        geometries.forEach((geometry) => geometry.dispose());
        material.dispose();
        faceMaterials.forEach((face) => face.dispose());
        textures.forEach((texture) => texture.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Start once the mark is actually on screen (never, below `lg`).
    const appear = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      appear.disconnect();
      // Any failure while building the scene falls back to the flat mark.
      start().catch((error: unknown) => {
        console.error("MarkAssembly failed to start", error);
        cleanup?.();
        host.querySelector("canvas")?.remove();
        setFailed(true);
      });
    });
    appear.observe(host);

    return () => {
      disposed = true;
      appear.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden="true" className={className}>
      {failed ? (
        <BrandMark className="absolute top-1/2 left-1/2 h-3/4 -translate-x-1/2 -translate-y-1/2" />
      ) : null}
    </div>
  );
}
