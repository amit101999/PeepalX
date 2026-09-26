"use client";

import { useEffect, useRef, useState } from "react";

/** One project cover, as the deck needs it: a raster image and its size. */
export interface DeckCover {
  src: string;
  width: number;
  height: number;
}

/** Plate proportions (16:10, the covers' aspect in the project grid). */
const PLATE_W = 3.2;
const PLATE_H = 2;
/** The logo's 45° cut, as a share of the plate height. */
const CUT = 0.16;
/** Hairline around each plate, like the site's `Frame`. */
const EDGE = 0.025;
/** Hairline colour: `--color-line-strong` in globals.css. WebGL cannot read CSS variables. */
const EDGE_COLOUR = 0xc6cfc3;

/** Each plate sits up, right and back from the one in front: the X stroke's 45°. */
const STEP = { x: 0.42, y: 0.34, z: -0.75 };

/** How long the plates take to settle in, and the stagger between them (seconds). */
const ENTER = 0.9;
const STAGGER = 0.12;

/**
 * A plate outline with the top-left and bottom-right corners cut, centred on
 * the origin. The same chamfer the site's CSS `chamfer` utility draws.
 */
function chamferPoints(width: number, height: number, cut: number) {
  const x = width / 2;
  const y = height / 2;
  return [
    [-x + cut, y],
    [x, y],
    [x, -y + cut],
    [x - cut, -y],
    [-x, -y],
    [-x, y - cut],
  ] as const;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * The project covers as a deck of chamfered plates in 3D, receding up and to
 * the right at the logo's diagonal, with the newest project in front. The
 * plates settle in one after another, float gently, and the deck turns a
 * little towards the mouse: the body of work at a glance, before the list.
 *
 * Decorative only: every cover is shown properly (with its caption) in the
 * listing below, so this is hidden from assistive technology.
 *
 * Cost control, as with the home page's `SignalField`:
 *  - `three` is imported only once the deck is on screen. The deck is hidden
 *    below `lg`, and a hidden element never intersects, so phones and tablets
 *    never download it.
 *  - Textures are 640px WebP/AVIF from the image optimiser, not the originals.
 *  - The render loop runs only while the deck is visible, at a capped pixel ratio.
 *  - Under reduced motion it draws one settled frame and never animates.
 *  - Without WebGL it falls back to the lead cover as a still image.
 *  - Everything is disposed on unmount.
 */
export function CoverDeck({
  covers,
  className,
}: {
  covers: DeckCover[];
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // Drawn front to back, so the first project is the front plate. Kept in a
  // ref so the effect runs once, not on every parent render.
  const coversRef = useRef(covers);

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
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 9.6);

      // The whole deck turns as one; each plate floats inside it.
      const deck = new THREE.Group();
      deck.rotation.set(-0.08, -0.42, 0);
      scene.add(deck);

      const toShape = (width: number, height: number, cut: number) =>
        new THREE.Shape(
          chamferPoints(width, height, cut).map(([x, y]) => new THREE.Vector2(x, y)),
        );

      // ShapeGeometry's UVs are raw coordinates; map them to 0..1 over the plate.
      const faceGeometry = new THREE.ShapeGeometry(toShape(PLATE_W, PLATE_H, CUT));
      const uv = faceGeometry.attributes.uv!;
      const position = faceGeometry.attributes.position!;
      for (let i = 0; i < uv.count; i++) {
        uv.setXY(i, position.getX(i) / PLATE_W + 0.5, position.getY(i) / PLATE_H + 0.5);
      }
      // The outer cut is larger, so the hairline stays even along the diagonal.
      const edgeGeometry = new THREE.ShapeGeometry(
        toShape(PLATE_W + EDGE * 2, PLATE_H + EDGE * 2, CUT + EDGE * 0.83),
      );

      const loader = new THREE.TextureLoader();
      const textures: InstanceType<typeof THREE.Texture>[] = [];
      const materials: InstanceType<typeof THREE.MeshBasicMaterial>[] = [];
      const plateAspect = PLATE_W / PLATE_H;

      const plates = coversRef.current.map((cover, index) => {
        const texture = loader.load(cover.src, () => {
          if (reduce) renderer.render(scene, camera);
        });
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        // Crop like `object-cover object-top`: fill the plate, keep the top.
        const imageAspect = cover.width / cover.height;
        if (imageAspect > plateAspect) {
          texture.repeat.set(plateAspect / imageAspect, 1);
          texture.offset.set((1 - texture.repeat.x) / 2, 0);
        } else {
          texture.repeat.set(1, imageAspect / plateAspect);
          texture.offset.set(0, 1 - texture.repeat.y);
        }
        textures.push(texture);

        // Each plate owns its materials, so it can fade in on its own.
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const edgeMaterial = new THREE.MeshBasicMaterial({
          color: EDGE_COLOUR,
          transparent: true,
        });
        materials.push(material, edgeMaterial);

        const plate = new THREE.Group();
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.position.z = -0.002;
        plate.add(edge, new THREE.Mesh(faceGeometry, material));

        // Centre the deck on its middle plate.
        const offset = index - (coversRef.current.length - 1) / 2;
        plate.userData.home = new THREE.Vector3(
          offset * STEP.x,
          offset * STEP.y,
          offset * STEP.z,
        );
        plate.userData.materials = [material, edgeMaterial];
        deck.add(plate);
        return plate;
      });

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

      /** Places every plate for time `t` (seconds since the deck appeared). */
      const pose = (t: number) => {
        plates.forEach((plate, index) => {
          const home = plate.userData.home as InstanceType<typeof THREE.Vector3>;
          const enter = reduce
            ? 1
            : easeOutCubic(Math.min(Math.max((t - index * STAGGER) / ENTER, 0), 1));
          const float = reduce ? 0 : Math.sin(t * 0.8 + index * 0.9) * 0.05;
          plate.position.set(home.x, home.y + float - (1 - enter) * 0.8, home.z);
          for (const material of plate.userData.materials as InstanceType<
            typeof THREE.MeshBasicMaterial
          >[]) {
            material.opacity = enter;
          }
          plate.visible = enter > 0;
        });
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      // The deck turns a little towards the mouse, eased so it feels weighty.
      const target = { x: 0, y: 0 };
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        target.x = (event.clientX / window.innerWidth - 0.5) * 0.35;
        target.y = (event.clientY / window.innerHeight - 0.5) * 0.2;
      };

      // Time accumulates only while running, so the float resumes where it
      // paused instead of jumping when the deck scrolls back into view.
      let elapsed = 0;
      let last = 0;
      const frame = (now: number) => {
        elapsed += Math.min((now - last) / 1000, 0.1);
        last = now;
        deck.rotation.y += (-0.42 + target.x - deck.rotation.y) * 0.05;
        deck.rotation.x += (-0.08 + target.y - deck.rotation.x) * 0.05;
        pose(elapsed);
        renderer.render(scene, camera);
      };

      let visibility: IntersectionObserver | undefined;
      if (reduce) {
        pose(0);
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
      const fadeIn = requestAnimationFrame(() => {
        renderer.domElement.style.opacity = "1";
      });

      cleanup = () => {
        cancelAnimationFrame(fadeIn);
        renderer.setAnimationLoop(null);
        visibility?.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        faceGeometry.dispose();
        edgeGeometry.dispose();
        textures.forEach((texture) => texture.dispose());
        materials.forEach((material) => material.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Start once the deck is actually on screen (never, below `lg`).
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
  }, []);

  const lead = covers[0];

  return (
    <div ref={hostRef} aria-hidden="true" className={className}>
      {failed && lead ? (
        // No WebGL: the lead cover as a plain still, chamfered like the plates.
        // eslint-disable-next-line @next/next/no-img-element -- already an optimiser URL
        <img
          src={lead.src}
          alt=""
          className="absolute top-1/2 left-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 border border-line-strong chamfer"
        />
      ) : null}
    </div>
  );
}
