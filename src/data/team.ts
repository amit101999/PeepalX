import type { TeamMember } from "@/types";

/**
 * The founding team.
 *
 * The `bio` lines below describe each role in general terms only. They are
 * deliberately free of specific claims about education, employment history or
 * years of experience — replace them with each person's own wording before
 * launch.
 *
 * Photos: drop a square image (at least 800x800) at `public/team/<slug>.jpg`
 * and update `image`. A neutral placeholder is used until then.
 *
 * Social links: leave a field out or empty and the icon is not rendered.
 */
export const team: TeamMember[] = [
  {
    slug: "amit-thakur",
    name: "Amit Thakur",
    role: "Co-Founder, Developer",
    bio: "Co-founder on the engineering side of the company, working across client projects from architecture and implementation through to delivery.",
    image: "/team/placeholder.svg",
    links: {
      linkedin: "",
      github: "",
    },
  },
  {
    slug: "manish-gupta",
    name: "Manish Gupta",
    role: "Co-Founder, Developer",
    bio: "Co-founder on the engineering side of the company, building and maintaining the systems we deliver and the practices behind them.",
    image: "/team/placeholder.svg",
    links: {
      linkedin: "",
      github: "",
    },
  },
  {
    slug: "amandeep-kumar",
    name: "Amandeep Kumar",
    role: "Co-Founder, Marketing",
    bio: "Co-founder responsible for marketing and client relationships, and usually the first point of contact for a new enquiry.",
    image: "/team/placeholder.svg",
    links: {
      linkedin: "",
    },
  },
];
