import type { Metadata, Viewport } from "next";
import { Figtree, Schibsted_Grotesk } from "next/font/google";
import { ViewTransition } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/ui/JsonLd";
import { site, siteUrl } from "@/config/site";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";
import "@/styles/globals.css";

/**
 * Two typefaces: Schibsted Grotesk for headings, Figtree for everything else.
 *
 * `next/font` downloads both at build time and serves them from our own
 * origin, so there is no request to Google at runtime, no CSP exception, and
 * no font-related layout shift. Both are variable fonts, so each is a single
 * file whatever weights the design uses. `display: swap` keeps text readable
 * while they load.
 */
const display = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-schibsted",
});

const text = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  // Makes every relative URL in page metadata resolve to an absolute one.
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f8f4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `data-scroll-behavior` keeps route changes instant while in-page anchor
    // links still scroll smoothly (Next.js 16 no longer does this by default).
    <html
      lang={site.locale}
      className={`${display.variable} ${text.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-dvh flex-col">
        {/* First tab stop on every page: jump straight past the navigation. */}
        <a
          href="#main"
          className="sr-only rounded-md bg-ink px-4 py-2 text-sm text-canvas focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to main content
        </a>

        <Navbar />

        {/*
          Route changes crossfade instead of snapping. React's <ViewTransition>
          needs no configuration in the App Router, costs no bundle size, and
          browsers without the View Transitions API navigate as before.
          `name` (not `default`, which sets a class) is what the
          ::view-transition-group(page) rules in globals.css target. The header
          and footer are identical across routes, so they sit in the default
          root snapshot and no movement is visible there.
        */}
        <ViewTransition name="page">
          <main id="main" className="flex-1">
            {children}
          </main>
        </ViewTransition>

        <Footer />

        {/* Site-wide structured data, emitted once for every page. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
