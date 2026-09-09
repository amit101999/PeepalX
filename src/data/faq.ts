import type { FaqItem } from "@/types";

/**
 * FAQ content.
 *
 * These answers are also emitted as FAQPage structured data, so keep them
 * factual and keep them matching what the page actually says.
 */
export const faqs: FaqItem[] = [
  {
    question: "What kind of projects do you work on?",
    answer:
      "Web and mobile applications, AI systems, automation and integration work, and custom Zoho builds. In practice that ranges from a first version of a product to adding a specific capability to software a company already runs.",
  },
  {
    question: "Do you work with startups?",
    answer:
      "Yes. Early-stage work is a good fit for how we build: a clearly scoped first version, shipped in reviewable increments, with the architecture kept simple enough to change once you have real users.",
  },
  {
    question: "Can you build AI solutions?",
    answer:
      "Yes. We build AI agents, retrieval systems over your own documents, assistants and document processing, and we integrate AI into existing products. We are equally willing to tell you when a problem does not need AI to be solved well.",
  },
  {
    question: "Can you integrate with software we already use?",
    answer:
      "That is a large part of our work. If a system exposes an API or webhooks we can usually connect it. Where an integration is not feasible we will say so before the project starts rather than during it.",
  },
  {
    question: "Do you provide maintenance and support?",
    answer:
      "Yes. Support after launch can be arranged as an ongoing agreement or on a per-request basis, whichever suits the system and your team.",
  },
  {
    question: "Do you work with Zoho?",
    answer:
      "Yes. We handle Zoho CRM customisation, Creator applications, Flow automation, Books integration, and connections between Zoho and the rest of your stack.",
  },
  {
    question: "Can you build mobile applications?",
    answer:
      "Yes, native Android in Kotlin and native iOS in Swift and SwiftUI, along with the backend, authentication, payments and notifications they depend on, through to store submission.",
  },
  {
    question: "Can you build an MVP?",
    answer:
      "Yes. For a first version we focus on the smallest build that lets you test the idea properly, and we keep the architecture straightforward so it can change once you learn something.",
  },
  {
    question: "How does the development process work?",
    answer:
      "Six stages: understand the problem, plan the scope and architecture, design the interface, build in increments, test for quality and security, then launch and support. You see working software throughout rather than only at the end.",
  },
  {
    question: "How do we start?",
    answer:
      "Send us a short description of what you are building or the problem you need solved through the contact form. We will reply with our reading of it, what we would need to know next, and a suggested first step.",
  },
];
