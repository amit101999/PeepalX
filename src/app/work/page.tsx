import { PageHeader } from "@/components/layout/PageHeader";
import { CoverDeck, type DeckCover } from "@/components/projects/CoverDeck";
import { ParallaxGrid } from "@/components/projects/ParallaxGrid";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFeature } from "@/components/projects/ProjectFeature";
import { CtaSection } from "@/components/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { primaryCta } from "@/data/navigation";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/seo/metadata";
import type { Project } from "@/types";

export const metadata = createMetadata({
  title: "Work",
  description: `Case studies of systems ${site.name} has built for clients: the business problem, how each system works, and what changed as a result.`,
  path: "/work",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work" },
];

/** Texture width for the header deck: plenty for a plate a few hundred px wide. */
const DECK_TEXTURE_WIDTH = 640;

/**
 * A project's cover as a small raster for the WebGL deck. WebGL needs a
 * raster, so an SVG cover is swapped for its PNG share image, and every
 * cover goes through the image optimiser rather than shipping the original.
 */
function deckCover(project: Project): DeckCover | null {
  const isSvg = project.image.endsWith(".svg");
  const raster = isSvg ? project.socialImage : undefined;
  const src = raster?.src ?? (isSvg ? undefined : project.image);
  const width = raster?.width ?? project.imageWidth;
  const height = raster?.height ?? project.imageHeight;
  if (!src || !width || !height) return null;

  return {
    src: `/_next/image?url=${encodeURIComponent(src)}&w=${DECK_TEXTURE_WIDTH}&q=75`,
    width,
    height,
  };
}

/**
 * All projects: the newest as a wide feature, the rest in a staggered
 * two-column grid, so a growing list never turns into a long left-right
 * zigzag. On large screens the header shows every cover as a 3D deck.
 */
export default function WorkPage() {
  const [lead, ...rest] = projects;
  const covers = projects.map(deckCover).filter((cover) => cover !== null);

  return (
    <>
      <PageHeader
        title={
          <>
            Projects and <span className="text-accent">case studies</span>
          </>
        }
        description="Systems we have designed and built for clients, written up in full: the problem, how the system works, and what changed as a result."
        breadcrumbs={breadcrumbs}
        aside={
          covers.length > 1 ? (
            <CoverDeck covers={covers} className="absolute inset-0" />
          ) : null
        }
      />

      <Section>
        <h2 className="sr-only">Case studies</h2>

        {lead ? (
          <>
            <ProjectFeature project={lead} priority />

            {rest.length > 0 ? (
              <ParallaxGrid
                className="mt-28 grid gap-x-10 gap-y-24 md:grid-cols-2"
                items={rest.map((project) => ({
                  key: project.slug,
                  node: <ProjectCard project={project} />,
                }))}
              />
            ) : null}
          </>
        ) : (
          <div className="max-w-md border-t border-line pt-8">
            <h2 className="text-h3 font-semibold text-ink">
              Case studies are on the way
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              We are writing up recent projects. Ask us about the work closest to yours.
            </p>
            <Button href={primaryCta.href} className="mt-8">
              {primaryCta.label}
            </Button>
          </div>
        )}
      </Section>

      <CtaSection
        title="Want something like this built?"
        description="Tell us what you are working on. We will come back with how we would approach it and what it would involve."
        secondary={{ label: "See our services", href: "/services" }}
      />
    </>
  );
}
