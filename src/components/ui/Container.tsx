import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: ReactNode;
  /** `narrow` is for long-form reading columns; `default` for page sections. */
  width?: "default" | "narrow";
  className?: string;
}

/** Horizontal page gutter and max width. Every section sits inside one. */
export function Container({ children, width = "default", className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "narrow" ? "max-w-[760px]" : "max-w-[1200px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
