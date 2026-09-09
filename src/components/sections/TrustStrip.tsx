import { Container } from "@/components/ui/Container";

/**
 * The credibility strip directly below the hero.
 *
 * Deliberately factual: capability areas and how the team works. No client
 * counts, satisfaction percentages or years-of-experience figures, because
 * none of those can currently be evidenced.
 */

const capabilities = [
  "Web Applications",
  "Mobile Applications",
  "Artificial Intelligence",
  "Automation",
  "Integrations",
  "Business Platforms",
];

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-elevated">
      <Container>
        <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-x-7">
            {capabilities.map((capability) => (
              <li key={capability} className="text-[0.8125rem] font-medium text-ink-soft">
                {capability}
              </li>
            ))}
          </ul>

          <p className="shrink-0 text-[0.8125rem] text-muted lg:text-right">
            Three engineers · Full-stack capability · End-to-end delivery
          </p>
        </div>
      </Container>
    </section>
  );
}
