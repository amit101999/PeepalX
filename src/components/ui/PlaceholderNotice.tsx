/**
 * Disclosure shown above the project grid while any project is still example
 * content.
 *
 * Lives here rather than inside a section component because both the home page
 * and /work render it. It disappears on its own once every project in
 * `src/data/projects.ts` has `isPlaceholder: false`.
 */
export function PlaceholderNotice() {
  return (
    <p className="mt-10 rounded-lg border border-line bg-elevated px-4 py-3 text-sm text-muted">
      <span className="font-medium text-ink">Note:</span> the projects below are
      illustrative examples of the kind of systems we build, not delivered client
      engagements. Real case studies will replace them as work is published.
    </p>
  );
}
