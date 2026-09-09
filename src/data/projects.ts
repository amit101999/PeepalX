import type { Project } from "@/types";

/**
 * Project showcase content.
 *
 * IMPORTANT: every entry below is currently a *placeholder* — an illustrative
 * example of the kind of system we build, not a delivered client engagement.
 * `isPlaceholder: true` makes the UI disclose that clearly.
 *
 * To publish real work:
 *   1. Replace the entry (or add a new one) with the real details.
 *   2. Set `isPlaceholder: false` so the disclosure notice disappears.
 *   3. Drop a real image at `public/projects/<slug>.svg` (or .webp/.jpg) and
 *      point `image` at it.
 *
 * The `caseStudy` block is optional. When present, the project detail page at
 * /work/<slug> renders the full case study; when absent it renders the summary
 * only, so a project can be published before its write-up is finished.
 */
export const projects: Project[] = [
  {
    slug: "ai-customer-support-platform",
    title: "AI Customer Support Platform",
    category: "AI / SaaS",
    description:
      "Support platform that answers routine tickets from a company knowledge base and routes the rest to the right person with context attached.",
    technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "LLM APIs"],
    image: "/projects/ai-customer-support-platform.svg",
    imageAlt: "Abstract layered diagram representing an AI customer support platform",
    year: "2025",
    isPlaceholder: true,
    caseStudy: {
      problem:
        "A support team spends most of its day answering the same questions, while genuinely difficult tickets wait in the same queue behind them.",
      context:
        "The answers already exist across help articles, past ticket threads and internal policy documents, but nothing connects them to the inbox.",
      solution:
        "A retrieval layer indexes the existing knowledge sources and drafts an answer for every incoming ticket. High-confidence answers are sent automatically with a citation; anything below the threshold is routed to an agent with the retrieved passages already attached.",
      architecture: [
        "Next.js application for the agent console and admin settings",
        "Node.js API handling ticket intake, routing and webhooks",
        "PostgreSQL with vector search for the knowledge index",
        "Background workers for ingestion and re-indexing",
        "Confidence scoring and human escalation on every response path",
      ],
      challenges: [
        "Setting a confidence threshold that avoids sending a wrong answer to a customer",
        "Keeping the index current as help articles and policies change",
        "Making the source of every generated answer visible to the agent reviewing it",
      ],
      results: [
        "Routine questions answered without an agent touching the ticket",
        "Escalated tickets arrive with relevant context already gathered",
        "Every automated answer carries a citation back to its source document",
      ],
      features: [
        "Knowledge base ingestion and retrieval",
        "Automated response drafting with citations",
        "Confidence-based escalation to a human agent",
        "Agent console with full conversation history",
        "Analytics on deflection rate and answer quality",
      ],
    },
  },
  {
    slug: "business-operations-dashboard",
    title: "Business Operations Dashboard",
    category: "Web Application",
    description:
      "A single operational view pulling together reporting, workflow status and approvals that previously lived in separate tools and spreadsheets.",
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    image: "/projects/business-operations-dashboard.svg",
    imageAlt: "Abstract grid layout representing an operations dashboard",
    year: "2025",
    isPlaceholder: true,
    caseStudy: {
      problem:
        "Operational reporting is assembled by hand each week from several systems, so the numbers are always a few days old and rarely agree with each other.",
      context:
        "Different teams own different tools. Nobody has a current, shared view of where work actually stands.",
      solution:
        "A dashboard that reads from each source system on a schedule, reconciles the records into one model, and presents live operational views with drill-down to the underlying rows.",
      architecture: [
        "Next.js with server-side rendering for fast first paint on data-heavy pages",
        "Scheduled sync jobs per source system, with retry and failure alerting",
        "PostgreSQL as the reconciled reporting store",
        "Role-based access control for team-scoped views",
      ],
      challenges: [
        "Reconciling records that use different identifiers across systems",
        "Keeping dashboard queries fast as historical data accumulates",
        "Making sync failures visible rather than silently serving stale numbers",
      ],
      results: [
        "One reconciled view replacing several manually assembled reports",
        "Reporting refreshed on a schedule instead of on request",
        "Data freshness shown on every panel, so staleness is never hidden",
      ],
      features: [
        "Configurable dashboard panels per team",
        "Scheduled multi-source data synchronisation",
        "Drill-down from summary figures to source records",
        "Export to CSV for finance and reporting",
        "Role-based access control",
      ],
    },
  },
  {
    slug: "mobile-commerce-application",
    title: "Mobile Commerce Application",
    category: "Mobile",
    description:
      "Native shopping application covering product discovery, accounts, checkout and order tracking, with the API layer behind it.",
    technologies: ["Kotlin", "Swift", "Node.js", "PostgreSQL", "Payments"],
    image: "/projects/mobile-commerce-application.svg",
    imageAlt: "Abstract mobile device outlines representing a commerce application",
    year: "2025",
    isPlaceholder: true,
    caseStudy: {
      problem:
        "A retail catalogue works on the web but has no mobile presence, and the checkout flow is too slow to complete comfortably on a phone.",
      context:
        "Customers browse on mobile and buy elsewhere. The existing backend was designed around a desktop session model.",
      solution:
        "Native Android and iOS applications sharing one API, with a checkout reduced to the minimum number of steps and offline-tolerant catalogue browsing.",
      architecture: [
        "Native Kotlin (Android) and Swift/SwiftUI (iOS) clients",
        "Shared Node.js API with versioned endpoints",
        "PostgreSQL for catalogue, cart and order data",
        "Payment provider integration with server-side verification",
        "Push notification service for order status updates",
      ],
      challenges: [
        "Keeping the cart consistent between devices and the web store",
        "Handling intermittent connectivity without losing a session",
        "Meeting both app store review requirements on the first submission",
      ],
      results: [
        "Checkout completed in fewer steps than the web flow",
        "Catalogue browsing continues through short connectivity drops",
        "Order status delivered by push instead of email only",
      ],
      features: [
        "Product discovery, search and filtering",
        "Account creation and secure authentication",
        "Cart synchronised across devices",
        "Payment integration with server-side verification",
        "Push notifications for order status",
      ],
    },
  },
  {
    slug: "workflow-automation-platform",
    title: "Workflow Automation Platform",
    category: "Automation",
    description:
      "Automation layer connecting several third-party systems, so records move between them on events rather than through manual re-entry.",
    technologies: ["Node.js", "REST APIs", "Webhooks", "PostgreSQL", "Queues"],
    image: "/projects/workflow-automation-platform.svg",
    imageAlt: "Abstract connected nodes representing an automation platform",
    year: "2025",
    isPlaceholder: true,
    caseStudy: {
      problem:
        "The same customer record is typed into three systems by hand. Every mismatch between them becomes a support issue later.",
      context:
        "Each tool has an API, but nothing connects them, so staff act as the integration layer.",
      solution:
        "An event-driven automation service that listens for changes in each system and propagates them to the others, with a durable queue, retries and an audit log of every action taken.",
      architecture: [
        "Node.js service receiving inbound webhooks from each system",
        "Durable job queue with exponential backoff and a dead-letter path",
        "PostgreSQL for the audit log and sync state",
        "Per-integration adapters, so a new system is a new adapter rather than a rewrite",
      ],
      challenges: [
        "Preventing sync loops when two systems both emit change events",
        "Handling third-party rate limits and partial outages",
        "Making every automated action traceable after the fact",
      ],
      results: [
        "Customer records entered once instead of three times",
        "Failed syncs surfaced and retried rather than lost",
        "A complete audit trail of every automated change",
      ],
      features: [
        "Webhook intake from multiple third-party systems",
        "Retry with backoff and dead-letter handling",
        "Field mapping and transformation per integration",
        "Full audit log of automated actions",
        "Alerting on repeated failures",
      ],
    },
  },
  {
    slug: "ai-knowledge-assistant",
    title: "AI Knowledge Assistant",
    category: "AI",
    description:
      "Internal assistant that answers staff questions from company documentation and always cites the document it drew the answer from.",
    technologies: ["Python", "LLM APIs", "RAG", "Vector database", "React"],
    image: "/projects/ai-knowledge-assistant.svg",
    imageAlt:
      "Abstract document and retrieval diagram representing a knowledge assistant",
    year: "2025",
    isPlaceholder: true,
    caseStudy: {
      problem:
        "Policy and process documentation is spread across several drives and portals. Staff ask a colleague instead of searching, and answers vary by who was asked.",
      context:
        "The documents exist and are current. Search over them is the missing piece.",
      solution:
        "A retrieval-augmented assistant that indexes the approved document set, answers questions in context, and links to the exact section it used, so the answer can be verified.",
      architecture: [
        "Python ingestion pipeline with document chunking and embeddings",
        "Vector database for semantic retrieval, filtered by access permission",
        "LLM API for answer generation, constrained to retrieved passages",
        "React interface with conversation history and source links",
      ],
      challenges: [
        "Respecting existing document permissions inside retrieval results",
        "Reducing confident answers drawn from outdated document versions",
        "Evaluating retrieval quality against a fixed question set as content changes",
      ],
      results: [
        "Questions answered from the approved document set rather than from memory",
        "Every answer linked to the section it came from",
        "Superseded documents excluded from retrieval automatically",
      ],
      features: [
        "Document ingestion and scheduled re-indexing",
        "Permission-aware retrieval",
        "Answers with inline source citations",
        "Conversation history per user",
        "Retrieval quality evaluation harness",
      ],
    },
  },
  {
    slug: "crm-business-automation",
    title: "CRM & Business Automation",
    category: "Business Automation / Zoho",
    description:
      "Customised CRM with automated lead routing, quote generation and finance handoff, built on Zoho and integrated with existing tools.",
    technologies: ["Zoho CRM", "Zoho Creator", "Zoho Flow", "Deluge", "REST APIs"],
    image: "/projects/crm-business-automation.svg",
    imageAlt: "Abstract pipeline diagram representing CRM automation",
    year: "2025",
    isPlaceholder: true,
    caseStudy: {
      problem:
        "Leads arrive through several channels and are assigned by hand, so response time depends on who happens to check the inbox.",
      context:
        "The company already runs on Zoho, but uses it as a record store rather than an automation platform.",
      solution:
        "CRM customisation with rule-based lead routing, automated quote generation from a Creator application, and a Flow-driven handoff into finance once a deal closes.",
      architecture: [
        "Zoho CRM with custom modules, layouts and assignment rules",
        "Zoho Creator application for quote generation and approvals",
        "Zoho Flow orchestrating CRM, Books and notification steps",
        "Deluge scripts for validation and field-level business rules",
        "REST integration with the existing website enquiry form",
      ],
      challenges: [
        "Mapping an informal, undocumented sales process into explicit rules",
        "Migrating historical records without losing ownership history",
        "Keeping automation understandable to the team that has to maintain it",
      ],
      results: [
        "Leads routed on arrival instead of during a manual review",
        "Quotes generated from CRM data rather than rebuilt in a document",
        "Closed deals handed to finance without re-entry",
      ],
      features: [
        "Custom CRM modules and layouts",
        "Rule-based lead assignment",
        "Automated quote generation and approval",
        "Finance handoff on deal closure",
        "Website enquiry form integration",
      ],
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** True when any published project is still placeholder content. */
export const hasPlaceholderProjects = projects.some((project) => project.isPlaceholder);
