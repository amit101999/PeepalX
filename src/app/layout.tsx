import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/ui/JsonLd";
import { site, siteUrl } from "@/config/site";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";
import "@/styles/globals.css";

/**
 * One typeface for the whole site.
 *
 * `next/font` downloads Inter at build time and serves it from our own origin,
 * so there is no request to Google at runtime, no extra DNS lookup, and no
 * font-related layout shift. `display: swap` keeps text readable while it
 * loads.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
  themeColor: "#fbfaf9",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.locale} className={inter.variable}>
      <body className="flex min-h-dvh flex-col">
        {/* First tab stop on every page: jump straight past the navigation. */}
        <a
          href="#main"
          className="sr-only rounded-md bg-ink px-4 py-2 text-sm text-canvas focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:ring-accent"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer />

        {/* Site-wide structured data, emitted once for every page. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
