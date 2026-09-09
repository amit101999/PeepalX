import { PageHeader } from "@/components/layout/PageHeader";
import { CtaSection } from "@/components/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Notes on engineering, AI and automation from the team. Not yet published.",
  path: "/blog",
  // Nothing to index yet. Remove this once the first post is live.
  noIndex: true,
});

/**
 * Blog placeholder.
 *
 * The route exists so the footer link works and so the structure is ready, but
 * it holds no invented posts. When you are ready to write, add a `posts` data
 * file and a `/blog/[slug]` route following the pattern in `/work/[slug]`.
 */
export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the team"
        description="We are planning to write about the engineering decisions behind the systems we build — architecture trade-offs, AI integration in practice, and what automation is genuinely worth."
      />

      <Section>
        <div className="rounded-xl border border-line bg-elevated px-6 py-14 text-center sm:py-20">
          <h2 className="text-h3 font-semibold text-ink">No posts yet</h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
            The first article is not published. In the meantime, the project case studies
            cover how we approach the same problems in practice.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/work">Read the case studies</Button>
            <Button href="/contact" variant="secondary">
              Ask us directly
            </Button>
          </div>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
