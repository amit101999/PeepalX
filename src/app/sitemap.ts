import type { MetadataRoute } from "next";
import { site, siteUrl } from "@/config/site";
import { legalNav } from "@/data/navigation";
import { projects } from "@/data/projects";

/**
 * sitemap.xml, generated from the routes that actually exist.
 *
 * Project pages come from the data file, so publishing a project adds it here
 * automatically, dated by its `updatedAt`. Static pages carry no date: the
 * build date would claim every page changed on every deploy, and search
 * engines learn to ignore a `lastmod` that is always new.
 *
 * Left out on purpose, because listing a noindex page sends contradictory
 * instructions:
 *   - `/blog`, while it has no posts.
 *   - the legal pages, until `site.legalCopyReviewed` is true.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/work", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/team", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    ...(site.legalCopyReviewed
      ? legalNav.map(({ href }) => ({ path: href, priority: 0.3 }))
      : []),
  ];

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    ...(project.updatedAt
      ? { lastModified: new Date(`${project.updatedAt}T00:00:00Z`) }
      : {}),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${siteUrl}${path === "/" ? "" : path}`,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...projectRoutes,
  ];
}
