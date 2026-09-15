import { Badge } from "@/components/ui/Badge";
import type { ProjectTool } from "@/types";

/** The products a project runs on, each with the one job it does in the system. */
export function ProjectStack({ tools }: { tools: ProjectTool[] }) {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <li key={tool.name} className="border-t border-line py-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h3 className="font-medium text-ink">
              {tool.name}
              {tool.status === "next-phase" ? (
                <span className="sr-only"> (next phase)</span>
              ) : null}
            </h3>
            {tool.status === "next-phase" ? (
              <Badge tone="outline">Next phase</Badge>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{tool.purpose}</p>
        </li>
      ))}
    </ul>
  );
}
