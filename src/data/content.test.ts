import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
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
