import { activeSocialLinks, site, siteUrl } from "@/config/site";
import { services } from "@/data/services";
import type { FaqItem, Project } from "@/types";

/**
 * schema.org structured data builders.
 *
 * Rule followed throughout: only describe things the page actually shows. We
 * do not emit review, rating or organisation figures that the site cannot
 * back up with real content.
 */

/** A JSON-LD document. Values are whatever schema.org allows. */
export type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  const sameAs = activeSocialLinks.map(({ url }) => url);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: siteUrl,
    description: site.description,
    logo: `${siteUrl}/brand/logo.svg`,
    ...(site.email ? { email: site.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    description: site.description,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
  };
}

/** One Service entry per offering, used on the services page. */
export function servicesSchema(): JsonLd[] {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    url: `${siteUrl}/services#${service.slug}`,
    provider: { "@id": `${siteUrl}/#organization` },
  }));
}

export function faqSchema(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export interface Crumb {
  name: string;
  /** Path beginning with "/". */
  path: string;
}

/**
 * A project case study as a CreativeWork, credited to the organisation.
 * Built only from fields the project page displays.
 */
export function caseStudySchema(project: Project): JsonLd {
  const url = `${siteUrl}/work/${project.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#case-study`,
    name: project.title,
    headline: project.title,
    description: project.description,
    url,
    // The share image is always raster and figure-free; the cover may be SVG.
    image: `${siteUrl}${project.socialImage?.src ?? project.image}`,
    genre: "Case study",
    keywords: project.technologies.join(", "),
    creator: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
  };
}

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };
}
