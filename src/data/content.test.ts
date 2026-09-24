import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ImageAsset, Testimonial } from "@/types";
import { company } from "./company";
import { getProjectBySlug, projects } from "./projects";
import { getServiceBySlug, services } from "./services";
import { team } from "./team";
import { faqs } from "./faq";
import {
  hasConfirmedAttribution,
  isPublishable,
  testimonials,
  UNCONFIRMED,
} from "./testimonials";
import { footerNav, mainNav, primaryCta } from "./navigation";
import { stageId } from "@/lib/utils/stage-id";
import { serviceOptions } from "@/lib/validation/contact";

/**
 * Guard rails for the content files.
 *
 * These catch the mistakes that are actually made when adding a project or a
 * service by hand — a duplicated slug, a typo in an image path, a screenshot
 * whose declared size does not match the file — and they catch them at
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

/**
 * Pixel size from a PNG's IHDR header or a JPEG's start-of-frame marker, or
 * null for any other file type.
 */
function imageSize(path: string): { width: number; height: number } | null {
  const file = readFileSync(path);

  if (file.toString("ascii", 12, 16) === "IHDR") {
    return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
  }

  if (file.readUInt16BE(0) !== 0xffd8) return null;

  // Walk the JPEG's marker segments to the first start-of-frame (0xC0–0xCF,
  // except DHT 0xC4, JPG 0xC8 and DAC 0xCC), which stores height then width.
  let offset = 2;
  while (offset + 9 < file.length) {
    if (file.readUInt8(offset) !== 0xff) return null;
    // Some encoders pad with extra 0xFF bytes before a marker.
    while (file.readUInt8(offset + 1) === 0xff) offset++;
    const marker = file.readUInt8(offset + 1);
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame) {
      return {
        width: file.readUInt16BE(offset + 7),
        height: file.readUInt16BE(offset + 5),
      };
    }
    offset += 2 + file.readUInt16BE(offset + 2);
  }

  return null;
}

/** Every image a project renders: its cover, gallery and case study stages. */
function projectImages(): { owner: string; image: ImageAsset }[] {
  return projects.flatMap((project) => [
    {
      owner: project.slug,
      image: {
        src: project.image,
        alt: project.imageAlt,
        width: project.imageWidth,
        height: project.imageHeight,
      },
    },
    ...(project.socialImage
      ? [{ owner: `${project.slug} (social)`, image: project.socialImage }]
      : []),
    ...(project.gallery ?? []).map((image) => ({ owner: project.slug, image })),
    ...(project.caseStudy?.stages ?? []).flatMap((stage) =>
      (stage.images ?? []).map((image) => ({
        owner: `${project.slug} / ${stage.title}`,
        image,
      })),
    ),
  ]);
}

describe("projects", () => {
  it("has unique slugs", () => {
    expect(duplicatesIn(projects.map((project) => project.slug))).toEqual([]);
  });

  it("finds a project by slug, and returns undefined for an unknown one", () => {
    expect(getProjectBySlug("zoho-portfolio-accounting-system")?.title).toBe(
      "Zoho-Powered Portfolio Accounting System for a PMS Firm",
    );
    expect(getProjectBySlug("zoho-spinning-mill-order-to-dispatch")?.title).toBe(
      "Zoho Order-to-Dispatch System for a Spinning Mill",
    );
    expect(getProjectBySlug("codebeamer-docs-ai-dataset")?.title).toBe(
      "Codebeamer Documentation Scraping for AI-Ready Data",
    );
    expect(getProjectBySlug("zoho-travel-booking-crm")?.title).toBe(
      "Zoho CRM Booking System for a Travel Company",
    );
    expect(getProjectBySlug("real-estate-lead-management-crm")?.title).toBe(
      "Zoho CRM Lead Management for a Real Estate Sales Company",
    );
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("keeps titles and descriptions within search result limits", () => {
    for (const project of projects) {
      expect(
        project.title.length,
        `"${project.slug}" title is too long`,
      ).toBeLessThanOrEqual(60);
      expect(
        project.description.length,
        `"${project.slug}" description is too long`,
      ).toBeLessThanOrEqual(155);
    }
  });

  it("points every image at a file in /public, with real alt text", () => {
    for (const { owner, image } of projectImages()) {
      expect(
        existsSync(join(publicDir, image.src)),
        `Missing image for ${owner}: public${image.src}`,
      ).toBe(true);
      expect(
        image.alt.trim().length,
        `Alt text too short for ${image.src}`,
      ).toBeGreaterThan(10);
    }
  });

  it("declares each screenshot's real pixel size", () => {
    for (const { owner, image } of projectImages()) {
      const actual = imageSize(join(publicDir, image.src));
      // A PNG or JPEG must be readable, or its size would go unchecked.
      if (/\.(png|jpe?g)$/i.test(image.src)) {
        expect(actual, `Could not read the size of ${image.src}`).not.toBeNull();
      }
      if (!actual) continue;

      expect(
        { width: image.width, height: image.height },
        `Size of ${image.src} (${owner}) must match the file`,
      ).toEqual(actual);
    }
  });

  it("includes the core case study sections when a case study is present", () => {
    for (const project of projects) {
      const caseStudy = project.caseStudy;
      if (!caseStudy) continue;

      expect(caseStudy.challenges.length).toBeGreaterThan(0);
      expect(caseStudy.results.length).toBeGreaterThan(0);
      expect(
        (caseStudy.stages?.length ?? 0) + (caseStudy.features?.length ?? 0),
        `"${project.slug}" needs stages or features`,
      ).toBeGreaterThan(0);
    }
  });

  it("gives every stage unique, described capabilities", () => {
    for (const project of projects) {
      const stages = project.caseStudy?.stages ?? [];
      expect(duplicatesIn(stages.map((stage) => stage.title))).toEqual([]);
      // The anchor, the rail and its active state all key off this id.
      expect(duplicatesIn(stages.map((stage) => stageId(stage.title)))).toEqual([]);

      for (const stage of stages) {
        expect(
          stage.capabilities.length,
          `"${stage.title}" has no capabilities`,
        ).toBeGreaterThan(0);
        expect(
          duplicatesIn(stage.capabilities.map((capability) => capability.title)),
        ).toEqual([]);

        for (const capability of stage.capabilities) {
          expect(capability.description.trim().length).toBeGreaterThan(10);
          expect([undefined, "delivered", "next-phase"]).toContain(capability.status);
        }
      }
    }
  });

  it("gives every process flow at least two unique, named steps", () => {
    for (const project of projects) {
      for (const stage of project.caseStudy?.stages ?? []) {
        if (stage.flow === undefined) continue;

        expect(
          stage.flow.length,
          `"${stage.title}" flow needs at least two steps`,
        ).toBeGreaterThanOrEqual(2);
        expect(duplicatesIn(stage.flow)).toEqual([]);
        for (const step of stage.flow) {
          expect(
            step.trim().length,
            `"${stage.title}" has an empty flow step`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it("says what each tool in a project's stack is for", () => {
    for (const project of projects) {
      const stack = project.caseStudy?.stack ?? [];
      expect(duplicatesIn(stack.map((tool) => tool.name))).toEqual([]);

      for (const tool of stack) {
        expect(
          tool.purpose.trim().length,
          `${tool.name} needs a purpose`,
        ).toBeGreaterThan(5);
        expect([undefined, "delivered", "next-phase"]).toContain(tool.status);
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
    expect(getServiceBySlug("ai-systems")?.title).toBe("AI systems");
    expect(getServiceBySlug("nope")).toBeUndefined();
  });

  it("gives every service capabilities and technologies to display", () => {
    for (const service of services) {
      expect(service.capabilities.length).toBeGreaterThanOrEqual(4);
      expect(service.technologies.length).toBeGreaterThan(0);
    }
  });

  it("keeps short titles short enough for compact labels", () => {
    for (const service of services) {
      expect(
        service.shortTitle.length,
        `"${service.slug}" shortTitle is too long`,
      ).toBeLessThanOrEqual(14);
    }
  });
});

describe("contact form service options", () => {
  it("offers every service by title, plus an undecided option", () => {
    // The form schema ships to the browser, so it keeps its own list rather
    // than importing the services data (descriptions, icons) into the bundle.
    expect([...serviceOptions]).toEqual([
      ...services.map((service) => service.title),
      "Not sure yet",
    ]);
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

  it("lists every service in the footer, with its title and anchor", () => {
    // The footer is a client-bundle-safe copy of the services list (the Navbar
    // imports this module), so this test is what keeps the two in step.
    const serviceLinks = footerNav
      .flatMap((column) => column.links)
      .filter((link) => link.href.startsWith("/services#"));

    expect(serviceLinks).toEqual(
      services.map((service) => ({
        label: service.title,
        href: `/services#${service.slug}`,
      })),
    );
  });

  it("uses absolute paths everywhere", () => {
    const allLinks = [...mainNav, ...footerNav.flatMap((column) => column.links)];

    for (const link of allLinks) {
      expect(link.href.startsWith("/")).toBe(true);
    }
  });

  it("sends the primary CTA to the contact page or a Google Form over https", () => {
    const isContactPage = primaryCta.href === "/contact";
    const isGoogleForm = /^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/.test(
      primaryCta.href,
    );

    expect(isContactPage || isGoogleForm, `Unexpected CTA href: ${primaryCta.href}`).toBe(
      true,
    );
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

describe("testimonials", () => {
  it("links every review to a real project", () => {
    for (const { project } of testimonials) {
      if (project) expect(getProjectBySlug(project), project).toBeDefined();
    }
  });

  it("has at most one review per project", () => {
    const projects = testimonials.flatMap(({ project }) => (project ? [project] : []));
    expect(duplicatesIn(projects)).toEqual([]);
  });

  it("keeps quotes short enough to read", () => {
    for (const testimonial of testimonials) {
      expect(testimonial.quote.trim().length, testimonial.quote).toBeGreaterThan(40);
      expect(testimonial.quote.length, testimonial.quote).toBeLessThanOrEqual(320);
    }
  });

  it("only approves reviews with confirmed attribution", () => {
    for (const testimonial of testimonials.filter((entry) => entry.approved)) {
      expect(hasConfirmedAttribution(testimonial), testimonial.quote).toBe(true);
    }
  });

  const base: Testimonial = {
    project: "x",
    quote: "q",
    company: "Spinning mill, India",
    approved: true,
  };

  it("accepts anonymous or confirmed attribution", () => {
    expect(hasConfirmedAttribution(base)).toBe(true);
    expect(hasConfirmedAttribution({ ...base, role: "Director" })).toBe(true);
    expect(
      hasConfirmedAttribution({ ...base, name: "A. Person", role: "Director" }),
    ).toBe(true);
  });

  it("rejects blank or draft attribution", () => {
    expect(hasConfirmedAttribution({ ...base, name: "" })).toBe(false);
    expect(hasConfirmedAttribution({ ...base, name: "   " })).toBe(false);
    expect(hasConfirmedAttribution({ ...base, company: "  " })).toBe(false);
    expect(hasConfirmedAttribution({ ...base, company: UNCONFIRMED })).toBe(false);
    expect(hasConfirmedAttribution({ ...base, role: `${UNCONFIRMED} ` })).toBe(false);
    expect(
      hasConfirmedAttribution({ ...base, name: "A. Person", role: UNCONFIRMED }),
    ).toBe(false);
  });

  it("publishes only approved reviews with confirmed attribution", () => {
    expect(isPublishable(base)).toBe(true);
    expect(isPublishable({ ...base, approved: false })).toBe(false);
    expect(isPublishable({ ...base, name: UNCONFIRMED })).toBe(false);
  });
});
