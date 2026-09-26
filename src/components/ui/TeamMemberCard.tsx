import { Github, Linkedin, Twitter } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { TiltPortrait } from "@/components/team/TiltPortrait";
import type { TeamMember } from "@/types";

const socialIcons: Record<string, { icon: LucideIcon; label: string }> = {
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  github: { icon: Github, label: "GitHub" },
  twitter: { icon: Twitter, label: "X" },
};

/**
 * A team member.
 *
 * Social icons render only for links that have a URL, so an unfinished profile
 * simply shows fewer icons rather than dead links.
 */
export function TeamMemberCard({
  member,
  showBio = true,
  tilt = false,
}: {
  member: TeamMember;
  /** The home page teaser shows name and role only. */
  showBio?: boolean;
  /** The portrait leans towards the mouse (the /team page). */
  tilt?: boolean;
}) {
  const links = Object.entries(member.links).filter(
    ([platform, url]) => url && socialIcons[platform],
  );

  const portrait = (
    <div className="relative aspect-4/5 overflow-hidden bg-elevated chamfer cut-lg">
      <Image
        src={member.image}
        alt={member.imageAlt ?? `Portrait of ${member.name}`}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-[600ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.02] motion-reduce:transform-none"
      />
    </div>
  );

  return (
    <article className="group flex h-full flex-col">
      {tilt ? <TiltPortrait>{portrait}</TiltPortrait> : portrait}

      <h3 className="mt-5 text-h3 font-semibold text-ink">{member.name}</h3>
      <p className="mt-1 text-sm font-medium text-accent">{member.role}</p>
      {showBio ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>
      ) : null}

      {links.length > 0 ? (
        <ul className="mt-auto flex items-center gap-1 pt-5">
          {links.map(([platform, url]) => {
            const entry = socialIcons[platform];
            if (!entry || !url) return null;
            const Icon = entry.icon;

            return (
              <li key={platform}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} on ${entry.label} (opens in a new tab)`}
                  className="inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-ink"
                >
                  <Icon aria-hidden="true" className="size-[18px]" />
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}
