import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { company } from "./company";
import { getProjectBySlug, projects } from "./projects";
import { getServiceBySlug, services } from "./services";
import { team } from "./team";
import { faqs } from "./faq";
import { footerNav, mainNav } from "./navigation";

/**
 * Guard rails for the content files.
 *
 * These catch the mistakes that are actually made when adding a project or a
 * service by hand — a duplicated slug, a typo in an image path, a footer link
 * pointing at a service that no longer exists — and they catch them at
 * `npm test` rather than as a broken page in production.
 */

const publicDir = join(process.cwd(), "public");

function duplicatesIn(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => (seen.has(value) ? true : (seen.add(value), false)));
}

/** True for a real YYYY-MM-DD date — rejects impossible ones like 2026-02-31. */
function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

describe("projects", () => {
  it("has unique slugs", () => {
    expect(duplicatesIn(projects.map((project) => project.slug))).toEqual([]);
  });

  it("points every project at an image that exists in /public", () => {
    for (const project of projects) {
      expect(
        existsSync(join(publicDir, project.image)),
        `Missing image for "${project.slug}": public${project.image}`,
      ).toBe(true);
    }
  });

  it("gives every project alt text that is not just the title", () => {
    for (const project of projects) {
      expect(project.imageAlt.length).toBeGreaterThan(10);
    }
  });

  it("finds a project by slug, and returns undefined for an unknown one", () => {
    expect(getProjectBySlug("ai-knowledge-assistant")?.title).toBe(
      "AI Knowledge Assistant",
    );
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("includes all case study sections when a case study is present", () => {
    for (const project of projects) {
      if (!project.caseStudy) continue;

      expect(project.caseStudy.architecture.length).toBeGreaterThan(0);
      expect(project.caseStudy.results.length).toBeGreaterThan(0);
      expect(project.caseStudy.features.length).toBeGreaterThan(0);
    }
  });

  it("points every gallery image at a file in /public, with alt text", () => {
    for (const project of projects) {
      for (const image of project.gallery ?? []) {
        expect(
          existsSync(join(publicDir, image.src)),
          `Missing gallery image for "${project.slug}": public${image.src}`,
        ).toBe(true);
        expect(image.alt.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it("uses real dates for updatedAt and https for live links", () => {
    for (const project of projects) {
      if (project.updatedAt !== undefined) {
        expect(
          isCalendarDate(project.updatedAt),
          `"${project.slug}" updatedAt must be YYYY-MM-DD`,
        ).toBe(true);
      }

      if (project.liveUrl !== undefined) {
        expect(
          project.liveUrl.startsWith("https://"),
          `"${project.slug}" liveUrl must use https`,
        ).toBe(true);
      }
    }
  });
});

describe("services", () => {
  it("has unique slugs", () => {
    expect(duplicatesIn(services.map((service) => service.slug))).toEqual([]);
  });

  it("finds a service by slug", () => {
    expect(getServiceBySlug("ai-systems")?.title).toBe("AI & Intelligent Systems");
    expect(getServiceBySlug("nope")).toBeUndefined();
  });

  it("gives every service capabilities and technologies to display", () => {
    for (const service of services) {
      expect(service.capabilities.length).toBeGreaterThanOrEqual(4);
      expect(service.technologies.length).toBeGreaterThan(0);
    }
  });
});

describe("team", () => {
  it("has unique slugs and an image for each member", () => {
    expect(duplicatesIn(team.map((member) => member.slug))).toEqual([]);

    for (const member of team) {
      expect(
        existsSync(join(publicDir, member.image)),
        `Missing photo for "${member.slug}": public${member.image}`,
      ).toBe(true);
    }
  });

  it("uses https for every profile link that is filled in", () => {
    for (const member of team) {
      for (const [platform, url] of Object.entries(member.links)) {
        if (!url) continue;
        expect(
          url.startsWith("https://"),
          `${member.slug}: ${platform} link must use https`,
        ).toBe(true);
      }
    }
  });
});

describe("company", () => {
  it("has a story, a mission and a vision", () => {
    expect(company.story.length).toBeGreaterThan(0);
    expect(company.mission.trim().length).toBeGreaterThan(20);
    expect(company.vision.trim().length).toBeGreaterThan(20);
  });

  it("dates every milestone as YYYY or YYYY-MM", () => {
    for (const milestone of company.milestones) {
      expect(
        /^\d{4}(-(0[1-9]|1[0-2]))?$/.test(milestone.date),
        `Milestone "${milestone.title}" has an invalid date: ${milestone.date}`,
      ).toBe(true);
    }
  });

  it("uses a two-letter country code when an address is set", () => {
    if (!company.address) return;
    expect(company.address.country).toMatch(/^[A-Z]{2}$/);
  });
});

describe("navigation", () => {
  it("only links to service anchors that exist", () => {
    const serviceLinks = footerNav
      .flatMap((column) => column.links)
      .filter((link) => link.href.startsWith("/services#"));

    for (const link of serviceLinks) {
      const slug = link.href.split("#")[1];
      expect(
        getServiceBySlug(slug ?? ""),
        `Unknown service anchor: ${link.href}`,
      ).toBeDefined();
    }
  });

  it("uses absolute paths everywhere", () => {
    const allLinks = [...mainNav, ...footerNav.flatMap((column) => column.links)];

    for (const link of allLinks) {
      expect(link.href.startsWith("/")).toBe(true);
    }
  });
});

describe("faq", () => {
  it("has no duplicate questions", () => {
    expect(duplicatesIn(faqs.map((item) => item.question))).toEqual([]);
  });

  it("answers every question it asks", () => {
    for (const item of faqs) {
      expect(item.answer.trim().length).toBeGreaterThan(20);
    }
  });
});
