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
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
];

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
      { label: "Web Development", href: "/services#web-development" },
      { label: "Mobile Development", href: "/services#mobile-development" },
      { label: "AI & Intelligent Systems", href: "/services#ai-systems" },
      { label: "Automation & Integrations", href: "/services#automation-integrations" },
      { label: "Data & Scripting", href: "/services#data-scripting" },
      { label: "Zoho Solutions", href: "/services#zoho-solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case Studies", href: "/work" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms & Conditions", href: "/legal/terms" },
  { label: "Cookie Policy", href: "/legal/cookies" },
];

/**
 * Home page sections that the header highlights while they are in view.
 * Order must match the order the sections appear on the page.
 */
export const homeSectionIds = [
  "services",
  "work",
  "process",
  "technology",
  "team",
  "faq",
] as const;
