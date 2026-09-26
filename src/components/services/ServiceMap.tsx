import { ArrowDown } from "lucide-react";
import type { CSSProperties } from "react";
import { BrandMark } from "@/components/layout/Logo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";
import { ServiceOrbit } from "./ServiceOrbit";

/* The diagram's geometry, in viewBox units. Wider than tall so the labels
   beside the left and right nodes have room. */
const VIEW_WIDTH = 480;
const VIEW_HEIGHT = 400;
const CENTER_X = VIEW_WIDTH / 2;
const CENTER_Y = VIEW_HEIGHT / 2;
const ORBIT = 132; // centre to each service node
const CORE_RADIUS = 52;
const NODE_RADIUS = 28;
const LABEL_GAP = 44; // node centre to its label

function nodePosition(index: number, count: number) {
  const angle = ((-90 + (index * 360) / count) * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  // Labels sit outward from the core: above or below the top and bottom
  // nodes, beside the ones on the left and right.
  const beside = Math.abs(cos) > 0.3;

  return {
    cos,
    sin,
    x: CENTER_X + cos * ORBIT,
    y: CENTER_Y + sin * ORBIT,
    label: beside
      ? {
          dx: Math.sign(cos) * (NODE_RADIUS + 12),
          dy: 0,
          anchor: cos > 0 ? ("start" as const) : ("end" as const),
        }
      : { dx: 0, dy: Math.sign(sin) * LABEL_GAP, anchor: "middle" as const },
  } as const;
}

/** A spoke from the edge of the core to the edge of a node. */
function spokePath(cos: number, sin: number) {
  const round = (value: number) => Math.round(value * 100) / 100;
  const start = CORE_RADIUS + 4;
  const end = ORBIT - NODE_RADIUS - 4;

  return `M${round(CENTER_X + cos * start)} ${round(CENTER_Y + sin * start)}L${round(CENTER_X + cos * end)} ${round(CENTER_Y + sin * end)}`;
}

/**
 * The top of /services: an index of the six services beside a diagram of them
 * around one core, which is the page's argument in one picture (most projects
 * draw on several services, so they sit under one team).
 *
 * The index is the real navigation: plain anchor links to each service below.
 * The diagram is decorative and hidden from assistive technology; pointing at
 * a link lights up its node (CSS `:has()`, see "Service map" in globals.css).
 *
 * The SVG is the baseline. On larger screens with motion allowed,
 * `ServiceOrbit` replaces it with a 3D version (Three.js, loaded lazily) that
 * turns to face whichever service the index is pointing at. This component
 * stays a Server Component and renders both the SVG and the orbit's HTML chips.
 */
export function ServiceMap() {
  const nodes = services.map((service, index) => ({
    service,
    ...nodePosition(index, services.length),
  }));

  return (
    <Section spacing="loose">
      <div
        data-service-map
        className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12"
      >
        <div>
          <SectionHeading
            title="Six services, one team"
            description="Jump to the one you came for, or read on: the sections below show how each kind of system fits together."
          />

          <nav aria-label="Services on this page" className="mt-10">
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <li key={service.slug} className="border-t border-line">
                    <a
                      href={`#${service.slug}`}
                      data-map-link
                      className="group -mx-2 flex items-start gap-4 rounded-md px-2 py-4 transition-colors hover:bg-tint"
                    >
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center bg-accent-soft text-accent transition-colors chamfer cut-sm group-hover:bg-accent group-hover:text-surface">
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.75}
                          className="size-[1.125rem]"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg font-semibold text-ink">
                          {service.title}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-muted">
                          {service.summary}
                        </span>
                      </span>
                      <ArrowDown
                        aria-hidden="true"
                        className="mt-1.5 size-4 shrink-0 text-faint transition-transform duration-300 ease-(--ease-spring) group-hover:translate-y-1 group-hover:text-accent"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="relative mx-auto aspect-[480/400] w-full max-w-[34rem] lg:mr-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 blueprint [mask-image:radial-gradient(circle_at_50%_50%,#000_20%,transparent_68%)]"
          />

          <ServiceOrbit
            fallback={
              <div className="relative size-full">
                <svg
                  viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                  focusable="false"
                  className="relative size-full overflow-visible"
                >
                  {/* Orbit through the node centres */}
                  <path
                    d={`M${CENTER_X} ${CENTER_Y - ORBIT}A${ORBIT} ${ORBIT} 0 1 1 ${CENTER_X} ${CENTER_Y + ORBIT}A${ORBIT} ${ORBIT} 0 1 1 ${CENTER_X} ${CENTER_Y - ORBIT}`}
                    pathLength={1}
                    data-draw
                    fill="none"
                    strokeWidth={1}
                    className="stroke-line-strong"
                  />

                  {/* Spokes, in the same order as the index, so position matches. */}
                  <g fill="none" strokeWidth={1.5} strokeLinecap="round">
                    {nodes.map(({ service, cos, sin }, index) => (
                      <path
                        key={service.slug}
                        d={spokePath(cos, sin)}
                        pathLength={1}
                        data-draw
                        data-map-spoke
                        style={{ "--i": index + 2 } as CSSProperties}
                      />
                    ))}
                  </g>

                  {/* Work leaving the core for each service */}
                  <g>
                    {nodes.map(({ service, cos, sin }, index) => (
                      <path
                        key={service.slug}
                        d={spokePath(cos, sin)}
                        pathLength={1}
                        data-flow
                        fill="none"
                        strokeWidth={4}
                        strokeLinecap="round"
                        className="stroke-green-500"
                        style={
                          {
                            strokeDasharray: "0.1 0.9",
                            "--flow-duration": "2.4s",
                            "--flow-delay": `${index * 0.4}s`,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </g>

                  {/* Core */}
                  <g data-pop>
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r={CORE_RADIUS}
                      strokeWidth={1.5}
                      className="fill-surface stroke-accent"
                    />
                    <g data-spin>
                      <circle
                        cx={CENTER_X}
                        cy={CENTER_Y}
                        r={CORE_RADIUS - 8}
                        fill="none"
                        strokeWidth={1}
                        strokeDasharray="3 7"
                        className="stroke-green-300"
                      />
                    </g>
                  </g>

                  <g data-map-nodes>
                    {nodes.map(({ service, x, y, label }, index) => {
                      const Icon = service.icon;

                      return (
                        <g key={service.slug} transform={`translate(${x} ${y})`}>
                          <g data-pop style={{ "--i": index + 1 } as CSSProperties}>
                            <g data-map-node>
                              <circle
                                r={NODE_RADIUS}
                                strokeWidth={1.5}
                                className="stroke-accent"
                              />
                              <Icon
                                x={-11}
                                y={-11}
                                width={22}
                                height={22}
                                strokeWidth={1.75}
                              />
                            </g>
                            <text
                              x={label.dx}
                              y={label.dy}
                              textAnchor={label.anchor}
                              dominantBaseline="central"
                              className="fill-ink-soft font-sans text-[13px] font-semibold max-sm:hidden"
                            >
                              {service.shortTitle}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* The PeepalX mark at the core, in its own brand colours. */}
                <div
                  data-pop
                  className="absolute top-1/2 left-1/2 w-[9%] -translate-x-1/2 -translate-y-1/2"
                >
                  <BrandMark className="h-auto w-full" />
                </div>
              </div>
            }
            core={
              <div className="absolute top-1/2 left-1/2 flex aspect-square w-[15%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-accent bg-surface shadow-[0_10px_30px_-12px_rgb(20_107_69/0.45)]">
                <BrandMark className="h-auto w-[58%]" />
              </div>
            }
            nodes={services.map((service) => {
              const Icon = service.icon;

              return (
                <span
                  key={service.slug}
                  className="relative flex size-11 items-center justify-center rounded-full border-[1.5px] border-accent bg-surface text-accent shadow-[0_8px_22px_-10px_rgb(20_107_69/0.5)] transition-colors duration-300 group-data-[active=true]/orbit:bg-accent group-data-[active=true]/orbit:text-surface lg:size-12"
                >
                  <Icon strokeWidth={1.75} className="size-5" />
                  <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full bg-surface/90 px-2.5 py-0.5 text-[13px] font-semibold whitespace-nowrap text-ink-soft shadow-[0_1px_0_var(--color-line)] transition-colors duration-300 group-data-[active=true]/orbit:text-accent">
                    {service.shortTitle}
                  </span>
                </span>
              );
            })}
          />
        </div>
      </div>
    </Section>
  );
}
