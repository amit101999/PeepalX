import { site } from "@/config/site";

/**
 * Navigation structure for the header and footer.
 *
 * Header links are defined once here and reused by both the desktop nav and
 * the mobile menu, so adding a link updates both.
 */

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
];

/**
 * The site's one "contact" action. Every contact button (header, mobile menu,
 * hero, closing block) uses this label, so the same intent never appears under
 * two different names.
 *
 * It opens the Google Form in `site.projectFormUrl` (in a new tab, via
 * `Button`), or the contact page while no form is configured.
 */
export const primaryCta: NavItem = {
  label: "Start a project",
  href: site.projectFormUrl || "/contact",
};

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "Team", href: "/team" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web development", href: "/services#web-development" },
      { label: "Mobile development", href: "/services#mobile-development" },
      { label: "AI systems", href: "/services#ai-systems" },
      { label: "Automation & integrations", href: "/services#automation-integrations" },
      { label: "Data & scripting", href: "/services#data-scripting" },
      { label: "Zoho solutions", href: "/services#zoho-solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case studies", href: "/work" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/contact#faq" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Privacy policy", href: "/legal/privacy" },
  { label: "Terms and conditions", href: "/legal/terms" },
  { label: "Cookie policy", href: "/legal/cookies" },
];

/**
 * Home page sections that the header highlights while they are in view.
 * Order must match the order the sections appear on the page.
 */
export const homeSectionIds = ["services", "work", "team"] as const;
