/**
 * Runs once when a server instance starts.
 *
 * Contact delivery validates its configuration per request, so a broken setup
 * would otherwise go unnoticed until a real visitor's enquiry fails. Checking
 * at boot puts the problem in the deploy logs straight away. It only logs: the
 * rest of the site is static and keeps working.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { parseServerEnv } = await import("@/config/env");
  const result = parseServerEnv();

  if (!result.ok) {
    console.error(
      `[config] Contact form delivery is misconfigured: ${result.issues.join("; ")}`,
    );
  }
}
