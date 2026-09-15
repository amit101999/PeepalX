import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { projects } from "@/data/projects";

/**
 * sitemap.xml, generated from the routes that actually exist.
 *
 * Project pages come from the data file, so publishing a project adds it here
 * automatically, dated by its `updatedAt`. `/blog` is excluded while it has no
 * posts — it is marked noindex, and listing a noindex page in the sitemap sends
 * search engines contradictory instructions.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/work", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/team", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/legal/privacy", priority: 0.3 },
    { path: "/legal/terms", priority: 0.3 },
    { path: "/legal/cookies", priority: 0.3 },
  ];

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    // A real edit date tells search engines when a case study changed; the
    // build date would claim every project changed on every deploy.
    lastModified: project.updatedAt
      ? new Date(`${project.updatedAt}T00:00:00Z`)
      : buildDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${siteUrl}${path === "/" ? "" : path}`,
      lastModified: buildDate,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...projectRoutes,
  ];
}
