/**
 * Analytics configuration.
 *
 * Analytics is opt-in and off by default: with no environment variables set,
 * the site loads zero third-party scripts. To enable a provider later, set
 * NEXT_PUBLIC_ANALYTICS_PROVIDER and NEXT_PUBLIC_ANALYTICS_ID, then render the
 * provider's script from `components/layout/Analytics.tsx`.
 *
 * Note: adding a third-party script also means widening `script-src` and
 * `connect-src` in the Content Security Policy in `next.config.ts`.
 */

export type AnalyticsProvider = "plausible" | "posthog" | "ga" | "gtm";

export interface AnalyticsConfig {
  provider: AnalyticsProvider;
  id: string;
}

const supportedProviders: AnalyticsProvider[] = ["plausible", "posthog", "ga", "gtm"];

function isSupported(value: string): value is AnalyticsProvider {
  return (supportedProviders as string[]).includes(value);
}

/** Returns the configured analytics provider, or null when disabled. */
export function getAnalyticsConfig(): AnalyticsConfig | null {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER?.trim().toLowerCase();
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID?.trim();

  if (!provider || !id || !isSupported(provider)) return null;

  return { provider, id };
}
