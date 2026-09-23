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
        title="Notes from the team"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
        description="We plan to write about the engineering decisions behind the systems we build: architecture trade-offs, AI integration in practice, and when automation pays off."
      />

      <Section>
        <div className="max-w-md">
          <h2 className="text-h3 font-semibold text-ink">No posts yet</h2>
          <p className="mt-3 leading-relaxed text-muted">
            The first article is not published. In the meantime, the case studies cover
            how we approach the same problems in practice.
          </p>

          <Button href="/work" className="mt-8">
            Read the case studies
          </Button>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
