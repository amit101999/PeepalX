import {
  Compass,
  Handshake,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { CompanyValue } from "@/types";

export const companyValues: CompanyValue[] = [
  {
    title: "Customer First",
    description:
      "We solve the business problem in front of us. If a smaller build gets you there, we will say so.",
    icon: Users,
  },
  {
    title: "Quality",
    description:
      "Code that someone else can read, extend and operate a year from now, including us.",
    icon: ShieldCheck,
  },
  {
    title: "Transparency",
    description:
      "Clear scope, timelines and trade-offs. We tell you what we do not know as readily as what we do.",
    icon: MessagesSquare,
  },
  {
    title: "Long-Term Partnership",
    description:
      "We would rather support a system for years than hand off a project and disappear.",
    icon: Handshake,
  },
  {
    title: "Continuous Learning",
    description:
      "The tooling changes constantly. We keep our practices current without chasing every trend.",
    icon: Sparkles,
  },
  {
    title: "Ownership",
    description:
      "We take responsibility for what we build, including the parts that turn out to be harder than expected.",
    icon: Compass,
  },
];
