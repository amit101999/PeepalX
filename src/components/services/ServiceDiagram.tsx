import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Diagram, Flow, Label, Part, Plate, Trace, chamfer } from "./diagram";

/*
 * One diagram per service, each showing how that kind of system works rather
 * than decorating it: the request path of a web app, a phone talking to its
 * API, a retrieval pipeline, an integration loop, raw data becoming a report,
 * Zoho apps joined to the rest of a stack.
 *
 * Coordinates are in the shared 320 x 320 viewBox (see diagram.tsx). Phases
 * order the build: 1 outlines, 2 the main parts, 3 the details.
 */

/** Interface, API and database, with a request travelling round the three. */
function WebDiagram() {
  return (
    <Diagram>
      <Trace d="M20 284H300" strokeWidth={1} className="stroke-line-strong" />

      {/* Browser window */}
      <Plate x={40} y={40} width={176} height={128} cut={10} />
      <Trace d="M40 64H216" />
      <Part phase={2}>
        {[54, 64, 74].map((cx) => (
          <circle key={cx} cx={cx} cy={52} r={2.5} className="fill-line-strong" />
        ))}
      </Part>
      <Part phase={2} from={{ y: 8 }}>
        <rect x={54} y={78} width={72} height={9} className="fill-accent" />
        <rect x={54} y={95} width={124} height={5} className="fill-line-strong" />
        <rect x={54} y={106} width={96} height={5} className="fill-line-strong" />
      </Part>
      <Part phase={3} from={{ y: 10 }}>
        <path d={chamfer(54, 122, 66, 34, 6)} className="fill-green-100" />
        <path d={chamfer(128, 122, 74, 34, 6)} className="fill-green-100" />
        <rect x={136} y={134} width={34} height={4} className="fill-green-300" />
        <rect x={136} y={143} width={50} height={4} className="fill-green-300" />
      </Part>

      {/* API */}
      <Plate x={196} y={196} width={92} height={44} phase={2} />
      <Part phase={2}>
        <Label x={242} y={218}>
          API
        </Label>
      </Part>

      {/* Database */}
      <Part phase={2}>
        <path d="M48 208V254A40 10 0 0 0 128 254V208Z" className="fill-green-100" />
        <ellipse cx={88} cy={208} rx={40} ry={10} className="fill-surface" />
      </Part>
      <Trace d="M48 208A40 10 0 1 0 128 208A40 10 0 1 0 48 208" phase={2} />
      <Trace d="M48 208V254A40 10 0 0 0 128 254V208" phase={2} />
      <Trace d="M48 231A40 10 0 0 0 128 231" phase={3} strokeWidth={1} />
      <Part phase={3}>
        <Label x={88} y={246}>
          DB
        </Label>
      </Part>

      {/* Request out, query, response back */}
      <Trace d="M184 168V182H242V196" phase={2} />
      <Trace d="M196 218H128" phase={2} />
      <Trace d="M88 198V168" phase={2} />
      <Flow d="M184 168V182H242V196" />
      <Flow d="M196 218H128" delay={0.9} />
      <Flow d="M88 198V168" delay={1.8} />
    </Diagram>
  );
}

/** A phone app with the API behind it: requests out, push notifications in. */
function MobileDiagram() {
  return (
    <Diagram>
      {/* Phone */}
      <Plate x={112} y={28} width={112} height={264} cut={16} />
      <Trace d="M152 44H184" phase={2} strokeWidth={3} className="stroke-line-strong" />
      <Part phase={2}>
        <path d={chamfer(124, 58, 88, 208, 8)} className="fill-tint" />
      </Part>
      <Part phase={3} from={{ y: 10 }}>
        <rect x={134} y={70} width={48} height={8} className="fill-accent" />
        <path d={chamfer(134, 88, 68, 46, 6)} className="fill-green-100" />
        <path d={chamfer(134, 142, 68, 46, 6)} className="fill-green-100" />
        <rect x={142} y={100} width={40} height={4} className="fill-green-300" />
        <rect x={142} y={154} width={30} height={4} className="fill-green-300" />
        <rect x={134} y={238} width={68} height={16} rx={8} className="fill-accent" />
      </Part>

      {/* Notification landing on the screen */}
      <Part phase={3} from={{ x: 28, scale: 0.9 }}>
        <path
          d={chamfer(178, 104, 118, 40, 8)}
          strokeWidth={1.5}
          className="fill-surface stroke-accent"
        />
        <circle cx={196} cy={124} r={8} className="fill-green-500" />
        <rect x={212} y={116} width={70} height={5} className="fill-line-strong" />
        <rect x={212} y={127} width={46} height={5} className="fill-line-strong" />
      </Part>

      {/* API */}
      <Plate x={16} y={188} width={60} height={40} phase={2} />
      <Part phase={2}>
        <Label x={46} y={208}>
          API
        </Label>
      </Part>

      {/* Requests go up and over; responses and pushes come back underneath. */}
      <Trace d="M46 188V150H112" phase={2} />
      <Trace d="M46 228V266H112" phase={2} />
      <Flow d="M46 188V150H112" />
      <Flow d="M112 266H46V228" delay={1.3} />
    </Diagram>
  );
}

/** Documents indexed, the relevant passages retrieved, a model answering from them. */
function AiDiagram() {
  const retrieved = new Set(["1-0", "2-2", "0-3", "3-1"]);

  return (
    <Diagram>
      {/* Source documents */}
      <Part>
        <path
          d={chamfer(36, 80, 68, 88, 8)}
          strokeWidth={1}
          className="fill-green-100 stroke-line-strong"
        />
        <path
          d={chamfer(28, 88, 68, 88, 8)}
          strokeWidth={1}
          className="fill-green-100 stroke-line-strong"
        />
      </Part>
      <Plate x={20} y={96} width={68} height={88} />
      <Part phase={2} from={{ y: 6 }}>
        {[
          [112, 44],
          [122, 50],
          [132, 36],
          [142, 46],
          [152, 40],
          [162, 28],
        ].map(([y, width]) => (
          <rect
            key={y}
            x={30}
            y={y}
            width={width}
            height={4}
            className="fill-line-strong"
          />
        ))}
      </Part>

      {/* Vector index: every chunk embedded, the matching ones picked out */}
      <Plate x={132} y={104} width={72} height={72} phase={2} />
      <Part phase={2} from={{ scale: 0.7 }}>
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={147 + col * 14}
              cy={119 + row * 14}
              r={3.5}
              className={
                retrieved.has(`${col}-${row}`) ? "fill-green-500" : "fill-line-strong"
              }
            />
          )),
        )}
      </Part>

      {/* Model */}
      <Trace
        d="M262 102A38 38 0 1 1 262 178A38 38 0 1 1 262 102"
        phase={2}
        strokeWidth={1}
        className="stroke-line-strong"
      />
      <Part phase={2} from={{ scale: 0.6 }}>
        <circle cx={262} cy={140} r={26} className="fill-accent" />
      </Part>
      <Part phase={3}>
        <g data-spin>
          <circle
            cx={262}
            cy={140}
            r={16}
            fill="none"
            strokeWidth={2}
            strokeDasharray="5 6"
            className="stroke-green-300"
          />
        </g>
        <circle cx={262} cy={140} r={4.5} className="fill-surface" />
      </Part>

      {/* Answer, checked */}
      <Plate x={206} y={214} width={100} height={56} phase={3} />
      <Trace
        d="M220 242l6 6 12-12"
        phase={3}
        strokeWidth={2.5}
        className="stroke-green-500"
      />
      <Part phase={3}>
        <rect x={248} y={234} width={44} height={4} className="fill-line-strong" />
        <rect x={248} y={246} width={30} height={4} className="fill-line-strong" />
      </Part>

      <Trace d="M104 140H132" phase={2} />
      <Trace d="M204 140H236" phase={2} />
      <Trace d="M262 166V214" phase={3} />
      <Flow d="M104 140H132" duration={2.7} />
      <Flow d="M204 140H236" duration={2.7} delay={0.9} />
      <Flow d="M262 166V214" duration={2.7} delay={1.8} />
    </Diagram>
  );
}

/** Four business systems on one loop, with retries at the centre. */
function AutomationDiagram() {
  const systems = [
    { x: 40, y: 54, label: "Orders" },
    { x: 216, y: 54, label: "CRM" },
    { x: 216, y: 222, label: "Invoices" },
    { x: 40, y: 222, label: "Support" },
  ];

  return (
    <Diagram>
      <Trace d="M72 76H248V244H72Z" />
      <Flow d="M72 76H248V244H72Z" duration={7} dash={0.02} />
      <Flow d="M72 76H248V244H72Z" duration={7} dash={0.02} delay={-3.5} />

      {systems.map((system) => (
        <g key={system.label}>
          <Plate x={system.x} y={system.y} width={64} height={44} phase={2} />
          <Part phase={2}>
            <Label x={system.x + 32} y={system.y + 22}>
              {system.label}
            </Label>
          </Part>
        </g>
      ))}

      {/* A failed sync is retried, not lost */}
      <Trace
        d="M160 126A34 34 0 1 1 160 194A34 34 0 1 1 160 126"
        phase={2}
        strokeWidth={1}
        className="stroke-line-strong"
      />
      <Part phase={3} from={{ scale: 0.7 }}>
        <g data-spin>
          <path
            d="M160 142A18 18 0 1 1 142 160"
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            className="stroke-accent"
          />
          <path d="M135 161l7-8 7 8Z" className="fill-accent" />
          <circle cx={160} cy={160} r={24} fill="none" />
        </g>
        <Label x={160} y={208} className="fill-muted font-medium">
          Retries
        </Label>
      </Part>
    </Diagram>
  );
}

/** Scattered records sorted into a table by a scheduled script, then reported. */
function DataDiagram() {
  // Where each record starts, relative to its place in the sorted table.
  const scatter = [
    [-14, 22],
    [18, -26],
    [-6, 34],
    [26, 12],
    [-20, -18],
    [10, 30],
    [-24, 6],
    [14, -34],
    [-10, -22],
    [22, 24],
    [-18, 30],
    [6, -16],
    [-26, -8],
    [18, 20],
    [-8, 26],
    [24, -10],
    [-16, -30],
    [12, 16],
    [-22, 18],
    [8, -24],
  ];
  const tones = ["fill-accent", "fill-green-300", "fill-line-strong", "fill-green-500"];
  const bars = [48, 84, 64, 108];

  return (
    <Diagram>
      <Trace d="M20 284H300" strokeWidth={1} className="stroke-line-strong" />

      {/* Records settle into rows */}
      {scatter.map(([dx, dy], index) => (
        <Part key={index} from={{ x: dx, y: dy }}>
          <circle
            cx={44 + (index % 4) * 14}
            cy={104 + Math.floor(index / 4) * 14}
            r={3.5}
            className={tones[(index * 3) % tones.length]}
          />
        </Part>
      ))}
      <Trace d={chamfer(28, 90, 76, 84, 8)} phase={3} />

      {/* Schedule */}
      <Part phase={2}>
        <circle cx={164} cy={72} r={18} className="fill-surface" />
      </Part>
      <Trace d="M164 54A18 18 0 1 1 164 90A18 18 0 1 1 164 54" phase={2} />
      <Part phase={3}>
        <path
          d="M164 72H172"
          strokeWidth={2}
          strokeLinecap="round"
          className="stroke-accent"
        />
        <g data-spin>
          <circle cx={164} cy={72} r={18} fill="none" />
          <path
            d="M164 72V60"
            strokeWidth={2}
            strokeLinecap="round"
            className="stroke-accent"
          />
        </g>
      </Part>
      <Trace d="M164 90V112" phase={2} />

      {/* Script */}
      <Plate x={132} y={112} width={64} height={56} phase={2} />
      <Trace d="M146 132l8 8-8 8" phase={3} strokeWidth={2} />
      <Trace d="M160 148H178" phase={3} strokeWidth={2} />

      {/* Report */}
      <Trace d="M222 116V244H302" />
      {bars.map((height, index) => (
        <Part key={height} phase={index < 2 ? 2 : 3} rise>
          <rect
            x={232 + index * 17}
            y={244 - height}
            width={11}
            height={height}
            className={index === bars.length - 1 ? "fill-accent" : "fill-green-300"}
          />
        </Part>
      ))}

      <Trace d="M104 140H132" phase={2} />
      <Trace d="M196 140H222" phase={2} />
      <Flow d="M104 140H132" />
      <Flow d="M196 140H222" delay={1.3} />
    </Diagram>
  );
}

/** Zoho apps around one hub, joined to the rest of the stack. */
function ZohoDiagram() {
  const modules = [
    { x: 40, y: 72, label: "CRM" },
    { x: 136, y: 72, label: "Creator" },
    { x: 40, y: 216, label: "Flow" },
    { x: 136, y: 216, label: "Books" },
  ];

  return (
    <Diagram>
      <Trace
        d={chamfer(20, 40, 208, 240, 12)}
        strokeWidth={1}
        className="stroke-line-strong"
      />
      <Part>
        <Label x={32} y={56} anchor="start" className="fill-muted font-medium">
          Zoho
        </Label>
      </Part>

      {/* Hub */}
      <Part phase={2} from={{ scale: 0.7 }}>
        <path d={chamfer(96, 132, 56, 56, 8)} className="fill-accent" />
      </Part>
      <Part phase={3}>
        {[
          [106, 142],
          [128, 142],
          [106, 164],
          [128, 164],
        ].map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={14}
            height={14}
            className="fill-green-300"
          />
        ))}
      </Part>

      {modules.map((module) => (
        <g key={module.label}>
          <Plate x={module.x} y={module.y} width={72} height={32} phase={2} />
          <Part phase={2}>
            <Label x={module.x + 36} y={module.y + 16}>
              {module.label}
            </Label>
          </Part>
        </g>
      ))}
      <Trace d="M110 132V104M138 132V104M110 188V216M138 188V216" phase={3} />

      {/* The rest of the stack, outside Zoho */}
      {[104, 216].map((cy) => (
        <g key={cy}>
          <Part phase={2}>
            <circle cx={276} cy={cy} r={18} className="fill-surface" />
            <circle cx={276} cy={cy} r={5} className="fill-green-300" />
          </Part>
          <Trace
            d={`M276 ${cy - 18}A18 18 0 1 1 276 ${cy + 18}A18 18 0 1 1 276 ${cy - 18}`}
            phase={2}
          />
        </g>
      ))}
      <Part phase={3}>
        <Label x={276} y={160} className="fill-muted font-medium">
          Your stack
        </Label>
      </Part>

      <Trace d="M152 148H196V104H258" phase={3} />
      <Trace d="M152 172H196V216H258" phase={3} />
      <Flow d="M152 148H196V104H258" />
      <Flow d="M258 216H196V172H152" delay={1.3} />
    </Diagram>
  );
}

const DIAGRAMS: Record<string, () => ReactNode> = {
  "web-development": WebDiagram,
  "mobile-development": MobileDiagram,
  "ai-systems": AiDiagram,
  "automation-integrations": AutomationDiagram,
  "data-scripting": DataDiagram,
  "zoho-solutions": ZohoDiagram,
};

/**
 * The diagram for a service. A service added to `src/data/services.ts`
 * without a diagram here gets its icon on a plate instead, so the page never
 * breaks for want of a drawing.
 */
export function ServiceDiagram({ slug, icon: Icon }: { slug: string; icon: LucideIcon }) {
  const Drawing = DIAGRAMS[slug];
  if (Drawing) return <Drawing />;

  return (
    <Diagram>
      <Plate x={100} y={100} width={120} height={120} cut={14} />
      <Part phase={2} from={{ scale: 0.8 }}>
        <Icon
          x={130}
          y={130}
          width={60}
          height={60}
          strokeWidth={1.5}
          className="text-accent"
        />
      </Part>
    </Diagram>
  );
}
