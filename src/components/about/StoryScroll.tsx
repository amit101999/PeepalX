import type { ReactNode } from "react";

/**
 * The company story read like a document: from `lg` the heading stays pinned
 * beside the text with a rail that fills as the reader moves through it, and
 * each paragraph comes to full strength as it crosses the middle of the
 * screen, so the eye is drawn to the one being read.
 *
 * All of the motion is CSS scroll timelines (`data-story`, `data-story-rail`
 * and `data-focus` in globals.css), so this ships no JavaScript. That keeps
 * an animation library off the About page entirely: Motion here cost about
 * 40 KB gzip of initial JS for an effect CSS can do. Browsers without scroll
 * timelines, visitors who prefer reduced motion, and print all get every
 * paragraph at full strength and the rail fully drawn.
 */
export function StoryScroll({
  heading,
  opening,
  paragraphs,
}: {
  heading: ReactNode;
  opening?: string;
  paragraphs: string[];
}) {
  return (
    <div
      data-story
      className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20"
    >
      <div className="lg:sticky lg:top-32 lg:self-start">
        {heading}
        <div
          aria-hidden="true"
          className="relative mt-8 hidden h-40 w-px bg-line lg:block"
        >
          <span data-story-rail className="absolute inset-0 bg-accent" />
        </div>
      </div>

      <div className="flex max-w-2xl flex-col gap-6 leading-relaxed text-ink-soft">
        {opening ? (
          <p data-focus className="font-display text-h3 font-medium text-ink">
            {opening}
          </p>
        ) : null}
        {paragraphs.map((paragraph) => (
          <p key={paragraph} data-focus>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
