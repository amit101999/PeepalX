import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Building blocks for the service diagrams on /services.
 *
 * Every diagram is drawn in a 320 x 320 viewBox in the site's drafting style:
 * hairline construction lines, chamfered plates, one green for structure.
 * The motion lives in globals.css ("Services page"); these components only
 * set the data attributes it keys on, so they stay Server Components.
 */

type Phase = 1 | 2 | 3;

/** Path data for a rectangle with its top-left and bottom-right corners cut at 45°, like `chamfer`. */
export function chamfer(x: number, y: number, width: number, height: number, cut = 8) {
  return `M${x + cut} ${y}H${x + width}V${y + height - cut}L${x + width - cut} ${y + height}H${x}V${y + cut}Z`;
}

/** A line that draws itself in as the diagram scrolls into view. */
export function Trace({
  d,
  phase = 1,
  className,
  strokeWidth = 1.5,
}: {
  d: string;
  phase?: Phase;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <path
      d={d}
      pathLength={1}
      data-trace
      data-phase={phase}
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("stroke-accent", className)}
    />
  );
}

/**
 * A short dash that travels along `d`, start to end, on a loop: which way work
 * or data moves along a connector. Draw the connector itself with `Trace`.
 */
export function Flow({
  d,
  delay = 0,
  duration = 2.6,
  dash = 0.05,
}: {
  d: string;
  /** Seconds. Offsets flows that share a diagram so they do not pulse together. */
  delay?: number;
  duration?: number;
  /** Dash length as a fraction of the path. Shorten it on long paths so it stays a dot. */
  dash?: number;
}) {
  return (
    <path
      d={d}
      pathLength={1}
      data-flow
      fill="none"
      strokeWidth={4}
      strokeLinecap="round"
      className="stroke-green-500"
      style={
        {
          "--flow-delay": `${delay}s`,
          "--flow-duration": `${duration}s`,
          strokeDasharray: `${dash} ${1 - dash}`,
        } as CSSProperties
      }
    />
  );
}

/**
 * A group that arrives rather than draws: it fades in from an offset and/or
 * a scale. `from.y` of 12 means it rises 12 units into place; `rise` grows it
 * up from its base instead, for bars.
 */
export function Part({
  children,
  phase = 1,
  from,
  rise = false,
}: {
  children: ReactNode;
  phase?: Phase;
  from?: { x?: number; y?: number; scale?: number };
  rise?: boolean;
}) {
  return (
    <g
      data-assemble={rise ? "rise" : ""}
      data-phase={phase}
      style={
        {
          "--from-x": `${from?.x ?? 0}px`,
          "--from-y": `${from?.y ?? 0}px`,
          "--from-sx": rise ? 1 : (from?.scale ?? 1),
          "--from-sy": rise ? 0 : (from?.scale ?? 1),
        } as CSSProperties
      }
    >
      {children}
    </g>
  );
}

/** A plate: a chamfered surface whose outline draws while its fill fades in. */
export function Plate({
  x,
  y,
  width,
  height,
  cut = 8,
  phase = 1,
  fill = "fill-surface",
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  cut?: number;
  phase?: Phase;
  /** A Tailwind fill utility. */
  fill?: string;
}) {
  const d = chamfer(x, y, width, height, cut);

  return (
    <>
      <Part phase={phase}>
        <path d={d} className={fill} />
      </Part>
      <Trace d={d} phase={phase} />
    </>
  );
}

/** A small label set in the diagram, e.g. "API". */
export function Label({
  x,
  y,
  children,
  anchor = "middle",
  className,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      className={cn("fill-ink-soft font-sans text-[11px] font-semibold", className)}
    >
      {children}
    </text>
  );
}

/**
 * The drafting furniture every diagram shares: a baseline, and registration
 * crosses at the corners of the working area, as on the hero mark.
 */
export function DraftingMarks() {
  const corners = [
    [20, 20],
    [300, 20],
    [20, 300],
    [300, 300],
  ] as const;

  return (
    <g className="stroke-control" strokeWidth={1} fill="none">
      {corners.map(([x, y]) => (
        <Trace
          key={`${x}-${y}`}
          d={`M${x - 7} ${y}H${x + 7}M${x} ${y - 7}V${y + 7}`}
          strokeWidth={1}
          className="stroke-control"
        />
      ))}
    </g>
  );
}

/** The svg element every diagram renders into. Decorative: the text beside it says the same. */
export function Diagram({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 320"
      aria-hidden="true"
      focusable="false"
      className={cn("size-full overflow-visible", className)}
    >
      <DraftingMarks />
      {children}
    </svg>
  );
}
