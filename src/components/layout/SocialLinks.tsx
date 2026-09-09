import { Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { activeSocialLinks } from "@/config/site";
import type { SocialPlatform } from "@/config/site";
import { cn } from "@/lib/utils/cn";

const icons: Record<SocialPlatform, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

const labels: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  twitter: "X",
  instagram: "Instagram",
  youtube: "YouTube",
};

/**
 * Renders only the social accounts that have a URL in `src/config/site.ts`.
 * With none configured the component renders nothing at all, so the footer
 * never shows a row of dead icons.
 */
export function SocialLinks({ className }: { className?: string }) {
  if (activeSocialLinks.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {activeSocialLinks.map(({ platform, url }) => {
        const Icon = icons[platform];

        return (
          <li key={platform}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels[platform]} (opens in a new tab)`}
              className="inline-flex size-10 items-center justify-center rounded-md text-canvas/60 transition-colors hover:bg-canvas/10 hover:text-canvas"
            >
              <Icon aria-hidden="true" className="size-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
