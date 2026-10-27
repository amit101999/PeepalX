import type { Project } from "@/types";

/**
 * Delivered client projects, in the order they are featured (usually newest
 * first). The first three appear on the home page; all of them appear on
 * /work, each with a page at /work/<slug>.
 *
 * Rules for adding a project:
 *  - Only real, delivered work. Name a client only with their permission;
 *    otherwise describe them (e.g. "Portfolio Management Services firm, India").
 *  - Never invent figures, outcomes or quotes. Planned work is marked
 *    `status: "next-phase"` and labelled as such on the page.
 *  - Screenshots go in `public/projects/<slug>/`, with their real pixel size in
 *    `width`/`height` (the content tests check they match the file). If a
 *    screenshot uses sample data, say so in its caption.
 */

const commissionImages = "/projects/zoho-creator-commission-management";
const codebeamerImages = "/projects/codebeamer-docs-ai-dataset";
const realEstateImages = "/projects/real-estate-lead-management-crm";
const travelImages = "/projects/zoho-travel-booking-crm";
const millImages = "/projects/zoho-spinning-mill-order-to-dispatch";
const pmsImages = "/projects/zoho-portfolio-accounting-system";

/** Appended to captions of screens that show demo figures, not a client's. */
const SAMPLE_DATA = "Shown with sample data.";

export const projects: Project[] = [
  {
    slug: "zoho-creator-commission-management",
    title: "Zoho Creator Commission Management and Automation",
    category: "Sales operations / Zoho",
    description:
      "We automated sales and presales commissions in Zoho Creator, calculated from Zoho Books invoices, payments, profitability and KPI performance.",
    technologies: ["Zoho Creator", "Zoho Books", "Deluge", "Zoho API"],
    image: `${commissionImages}/sales-kpi.jpg`,
    imageAlt:
      "Sales KPI form in Zoho Creator with salesperson, quarter, revenue target and achieved fields, and a KPI table listing activities such as customer engagement and opportunity creation with their weightage, frequency, criteria and target",
    imageWidth: 1600,
    imageHeight: 663,
    imageCaption:
      "Sales KPI setup: quarterly revenue target and achievement, and each activity's weightage, frequency, criteria and target.",
    // The cover shows KPI figures, so social cards use a screen without them.
    socialImage: {
      src: `${commissionImages}/presales-commission.jpg`,
      alt: "Presales person commission calculation form in Zoho Creator with presales engineer, quarter, total commission and date range, and a commission details table by customer, invoice number, actual profit and invoice date",
      width: 1600,
      height: 602,
    },
    year: "2026",
    role: "Zoho implementation",
    updatedAt: "2026-10-27",
    caseStudy: {
      context:
        "Sales and presales commissions depended on data spread across Zoho Books: sales orders, invoices, payments and dates, project costs and timesheets.",
      problem:
        "Working commissions out by hand from invoices, payments, profitability and KPI performance was slow and hard to verify, and several presales employees could share commission on the same invoice.",
      goal: "One system that calculates commissions automatically from Zoho Books data and shows every salesperson and presales engineer how their commission was reached.",
      solution:
        "We built a commission management system in Zoho Creator, connected to Zoho Books. Sales orders, invoices, payments, timesheets and banking data flow into Creator, where separate modules calculate sales and presales commissions from payment status, profitability and commission rules, adjust them by KPI performance, and track each commission's status, with dashboards and statement templates for both teams.",

      stages: [
        {
          title: "Zoho Books data",
          summary:
            "The financial and operational data commissions depend on flows from Zoho Books into Zoho Creator automatically.",
          flow: ["Sales order", "Invoice", "Payment", "Commission"],
          capabilities: [
            {
              title: "Zoho Books integration",
              description:
                "Sales orders, invoices, timesheets, banking and other relevant Zoho Books modules are connected to Zoho Creator.",
            },
            {
              title: "Automated data synchronisation",
              description:
                "Financial and operational data is brought into Creator automatically, reducing manual calculation and re-entry.",
            },
            {
              title: "Payment tracking",
              description:
                "Payment information and payment dates are retrieved from Zoho Books to decide when a commission becomes eligible.",
            },
          ],
        },
        {
          title: "Profitability and cost",
          summary:
            "Each invoice's revenue is set against its costs, so commission follows the real profit of the work.",
          capabilities: [
            {
              title: "Project profitability",
              description:
                "Invoice amounts and the relevant cost data from Zoho Books are combined to calculate the profitability of each project.",
            },
            {
              title: "Profit-based commission",
              description:
                "The calculated profitability feeds directly into how much commission is due.",
            },
          ],
        },
        {
          title: "KPI performance",
          summary:
            "Commission is adjusted by how each salesperson performed against defined KPIs.",
          capabilities: [
            {
              title: "KPI module",
              description:
                "Activities such as customer engagement, contacts acquired and opportunities created are defined with a weightage, frequency, criteria and target.",
            },
            {
              title: "Quarterly revenue targets",
              description:
                "Each salesperson's quarterly revenue target is compared with the revenue achieved for the period.",
            },
            {
              title: "KPI-based adjustments",
              description:
                "Commission amounts are adjusted according to KPI results and the defined business rules.",
            },
          ],
          images: [
            {
              src: `${commissionImages}/sales-kpi.jpg`,
              alt: "Sales KPI form in Zoho Creator with salesperson, quarter, revenue target and achieved fields, and a KPI table listing activities such as customer engagement and opportunity creation with their weightage, frequency, criteria and target",
              width: 1600,
              height: 663,
              caption:
                "Sales KPI setup, with each activity's weightage, frequency, criteria and target.",
            },
          ],
        },
        {
          title: "Commission calculation",
          summary:
            "Separate modules calculate sales and presales commissions, each with its own rules.",
          capabilities: [
            {
              title: "Sales commission",
              description:
                "Sales commission is calculated from sales orders, invoices, payment status, payment dates and the applicable commission rules.",
            },
            {
              title: "Presales commission",
              description:
                "A separate presales module calculates commission per presales engineer for each quarter, by customer, invoice and actual profit.",
            },
            {
              title: "Shared invoices",
              description:
                "Several presales employees can receive commission against the same invoice.",
            },
          ],
          images: [
            {
              src: `${commissionImages}/presales-commission.jpg`,
              alt: "Presales person commission calculation form in Zoho Creator with presales engineer, quarter, total commission and date range, and a commission details table by customer, invoice number, actual profit and invoice date",
              width: 1600,
              height: 602,
              caption:
                "Presales commission for an engineer and quarter, broken down by customer, invoice and actual profit.",
            },
          ],
        },
        {
          title: "Status, dashboards and statements",
          summary:
            "Every commission's status is tracked, and both teams can see exactly how their commission was worked out.",
          capabilities: [
            {
              title: "Commission status tracking",
              description:
                "Dedicated modules track the status of sales and presales commissions through to payment.",
            },
            {
              title: "Commission dashboards",
              description:
                "Dashboards show total commissions, individual commission status, calculation summaries and detailed breakdowns.",
            },
            {
              title: "Commission statements",
              description:
                "Separate templates for sales and presales teams show each calculation, its components and its payment status.",
            },
          ],
        },
      ],

      stack: [
        {
          name: "Zoho Creator",
          purpose:
            "The commission application: KPI, sales and presales commission and status modules, dashboards and statement templates.",
        },
        {
          name: "Zoho Books",
          purpose:
            "Source of sales orders, invoices, payments, timesheets, banking and cost data.",
        },
        {
          name: "Deluge",
          purpose: "Commission rules, calculations and workflow automation inside Creator.",
        },
        {
          name: "Zoho API",
          purpose: "Bringing Zoho Books data into Zoho Creator.",
        },
      ],

      challenges: [
        "Bringing sales orders, invoices, payments, timesheets and banking data together from Zoho Books",
        "Splitting commission on one invoice between several presales employees",
        "Basing commission on profitability, payment dates and KPI performance at the same time",
        "Making each calculation transparent enough for employees to follow",
      ],

      results: [
        "Sales and presales commissions calculated automatically from Zoho Books data",
        "Multiple presales commission recipients supported on the same invoice",
        "Commission eligibility tracked against real payment dates",
        "KPI adjustments and profitability built into every calculation",
        "Transparent dashboards and statements for sales and presales teams",
      ],
    },
  },
  {
    slug: "codebeamer-docs-ai-dataset",
    title: "Codebeamer Documentation Scraping for AI-Ready Data",
    category: "Data engineering / AI",
    description:
      "We turned PTC's Codebeamer Developer Guide into a clean, structured JSON dataset, chunked and ready for AI and LLM applications.",
    technologies: ["Python", "Selenium", "Playwright", "JSON"],
    // Our own diagram, not the source page: the documentation belongs to PTC,
    // so it appears only inside the case study, captioned as the source.
    image: `${codebeamerImages}/cover.svg`,
    imageAlt:
      "Diagram of a documentation web page passing through extract, clean and chunk steps into a JSON dataset of structured chunks",
    imageWidth: 1600,
    imageHeight: 840,
    // Share cards need a raster image, so the same diagram is also a PNG.
    socialImage: {
      src: `${codebeamerImages}/cover.png`,
      alt: "Diagram of a documentation web page passing through extract, clean and chunk steps into a JSON dataset of structured chunks",
      width: 1200,
      height: 630,
    },
    year: "2025",
    client: "Software company",
    role: "Data engineering",
    updatedAt: "2026-09-15",
    caseStudy: {
      context:
        "The client wanted the content of PTC's Codebeamer Developer Guide as structured data it could use in AI and LLM-based applications.",
      problem:
        "Documentation web pages mix content with navigation and layout, while AI tools need that content clean, structured and in its original hierarchy.",
      goal: "An automated process that turns the guide into clean, structured, AI-ready JSON.",
      solution:
        "We built a Python scraping workflow with Selenium and Playwright. It reads the Developer Guide's pages, extracts headings, paragraphs, lists, images and links while keeping the document's hierarchy, cleans and organises the content, splits it into chunks suited to AI processing, and writes the result as a structured JSON dataset.",

      stages: [
        {
          title: "Source documentation",
          summary:
            "The Codebeamer Developer Guide is read page by page through browser automation.",
          capabilities: [
            {
              title: "Automated page collection",
              description:
                "Python scripts use Selenium and Playwright to open the Developer Guide's pages in a browser and read their content.",
            },
          ],
          images: [
            {
              src: `${codebeamerImages}/codebeamer-developer-guide.jpg`,
              alt: "Codebeamer Developer Guide page in PTC's help center, with the guide's table of contents and a diagram of the Codebeamer application architecture",
              width: 1600,
              height: 738,
              caption:
                "The source documentation: the Codebeamer Developer Guide in PTC's help center.",
            },
          ],
        },
        {
          title: "Extraction",
          summary:
            "Everything useful on a page is pulled out, in the order and hierarchy it appears.",
          capabilities: [
            {
              title: "Content extraction",
              description:
                "Headings, paragraphs, lists, images, links and other relevant HTML content are extracted from each page.",
            },
            {
              title: "Structure preserved",
              description:
                "The document's structure and heading hierarchy are preserved during extraction.",
            },
          ],
        },
        {
          title: "Cleaning and chunking",
          summary:
            "The raw content is cleaned, organised and split into pieces an AI model can work with.",
          capabilities: [
            {
              title: "Cleaning and organising",
              description:
                "Scraped content is cleaned and organised into structured data.",
            },
            {
              title: "AI-ready chunks",
              description:
                "The documentation is split into meaningful chunks optimised for AI and LLM processing.",
            },
          ],
        },
        {
          title: "JSON dataset",
          summary:
            "The result is a structured JSON dataset, ready for further ingestion and analysis.",
          capabilities: [
            {
              title: "Structured JSON output",
              description:
                "A structured JSON dataset is generated from the cleaned, chunked content.",
            },
            {
              title: "Automated end to end",
              description:
                "The extraction and transformation process is automated using Python.",
            },
          ],
        },
      ],

      stack: [
        {
          name: "Python",
          purpose: "The extraction, cleaning, chunking and JSON generation scripts.",
        },
        {
          name: "Selenium",
          purpose: "Browser automation for loading and reading documentation pages.",
        },
        {
          name: "Playwright",
          purpose: "Browser automation for loading and reading documentation pages.",
        },
        { name: "JSON", purpose: "Format of the structured output dataset." },
      ],

      challenges: [
        "Keeping the documentation's heading hierarchy intact while extracting content",
        "Separating useful content from page navigation and layout",
        "Splitting long documentation into chunks that still make sense on their own",
      ],

      results: [
        "The Codebeamer Developer Guide available as a structured JSON dataset",
        "Content chunked and ready for AI and LLM-based applications",
        "Extraction and transformation automated in Python",
      ],
    },
  },
  {
    slug: "real-estate-lead-management-crm",
    title: "Zoho CRM Lead Management for a Real Estate Sales Company",
    category: "Real estate / Zoho",
    description:
      "We automated a real estate sales company's lead journey in Zoho CRM, from multi-channel capture and fair assignment to deals, commissions and reporting.",
    technologies: ["Zoho CRM", "WhatsApp", "Meta Ads", "Google Ads"],
    // Screens come from the client's live CRM. The browser bar (with the org
    // ID) is cropped off, and real people's and developers' names are covered
    // with solid blocks. The cover shows only test records.
    image: `${realEstateImages}/leads-view.jpg`,
    imageAlt:
      "Lead management screen in Zoho CRM with search and status filters, quick filters such as call back and meeting scheduled, and lead cards showing campaign, owner, status and sub-status",
    imageWidth: 1600,
    imageHeight: 736,
    imageCaption: `Lead management view with status filters and lead cards. ${SAMPLE_DATA}`,
    year: "2025",
    client: "Real estate sales company, UAE",
    role: "Zoho implementation",
    updatedAt: "2026-09-15",
    caseStudy: {
      context:
        "The company's leads came from ads, its website, property events, cold calls and channel partners, and each one had to reach the right sales agent quickly.",
      problem:
        "Handling leads by hand meant manual data entry and the risk of missed or unattended leads, and commissions and incentives were worked out manually, which invited errors.",
      goal: "Connect the complete business process in a single workflow, from lead generation through verification, assignment, follow-up, deals, finance and commissions to reporting.",
      solution:
        "We built the sales operation on Zoho CRM. Leads from every channel land in one CRM, linked to their campaign or source. They are assigned to agents automatically, must be accepted or acted on within a set time, and are reassigned when no one acts. Qualified leads become deals, and closed deals flow into finance, commission and incentive tracking, with WhatsApp notifications, role-based access and dashboards throughout.",

      stages: [
        {
          title: "Lead sources and campaigns",
          summary:
            "Leads from every channel land in one CRM, tied to the campaign, event, caller or partner that produced them.",
          capabilities: [
            {
              title: "Centralized lead management",
              description:
                "Every lead is captured in one CRM and tracked from the moment it enters the system until conversion.",
            },
            {
              title: "Multi-channel lead capture",
              description:
                "Leads from Meta, Instagram, Google Ads, website forms, events, cold calls and channel partners are collected automatically, so no lead is missed.",
            },
            {
              title: "Ad platform integration",
              description:
                "Meta and Google Ads leads come into the CRM automatically and are linked to the right campaign for performance tracking.",
            },
            {
              title: "Website integration",
              description:
                "Website enquiries become CRM leads automatically, with their campaign, project and customer details.",
            },
            {
              title: "Campaigns and sub-campaigns",
              description:
                "Marketing activity is organised into campaigns and sub-campaigns, with leads, agents, performance and conversions tracked separately for each.",
            },
            {
              title: "Event leads",
              description:
                "Leads from exhibitions, property events and other offline activity have their own rules for assignment, availability and follow-up.",
            },
            {
              title: "Cold calls",
              description:
                "Leads from outbound calling are managed separately from digital leads, with their own assignment, follow-up and progress tracking.",
            },
            {
              title: "Channel partners",
              description:
                "Partners are managed from registration and approval to lead submission, each with a profile, lead history, performance data and documents.",
            },
            {
              title: "Partner lead tracking",
              description:
                "Every lead records the partner that sent it, and its journey is followed through qualification, conversion and deal closure.",
            },
          ],
          images: [
            {
              src: `${realEstateImages}/event-management.jpg`,
              alt: "Event management screen in Zoho CRM listing events with status, start and end dates, location, developer and project, each with a view details button",
              width: 1600,
              height: 708,
              caption:
                "Events with their status, dates and locations. Includes test events; one event's name, dates and location are hidden.",
            },
          ],
        },
        {
          title: "Verification and assignment",
          summary:
            "New leads are verified and shared out among agents automatically, and no lead is left waiting.",
          capabilities: [
            {
              title: "Automated lead assignment",
              description:
                "New leads are distributed among sales agents by configurable round-robin and assignment rules, so they are shared fairly and quickly.",
            },
            {
              title: "Lead verification and SLAs",
              description:
                "Agents must accept or act on each new lead within a set time, and the system tracks response times.",
            },
            {
              title: "Automatic reassignment",
              description:
                "If an agent does not respond, rejects a lead or skips the required process, the lead can be reassigned to another available agent automatically.",
            },
            {
              title: "Telecaller verification",
              description:
                "Unverified, abandoned, spam or unreachable leads go to telecallers, who record the outcome and return valid leads to the sales process.",
            },
            {
              title: "Real-time notifications",
              description:
                "Users are notified of new assignments, missed SLAs, reassignments, new tasks, approval requests and deal updates.",
            },
            {
              title: "CRM-to-CRM sync",
              description:
                "Lead, assignment, status and activity information is kept consistent between Zoho CRM and external CRMs such as Prosper CRM.",
            },
          ],
          images: [
            {
              src: `${realEstateImages}/fresh-leads.jpg`,
              alt: "Fresh leads screen listing new leads with status, agent, campaign and the time until which each lead is valid, with lead names, email addresses and campaign names covered",
              width: 1600,
              height: 736,
              caption:
                "Fresh leads, each with the time it is valid until. Lead names, email addresses and campaign names are hidden.",
            },
            {
              src: `${realEstateImages}/agent-lead-assignment-report.jpg`,
              alt: "Agents lead assigned report counting, for each agent and campaign, leads accepted, assigned by automation and missed, with agent and campaign names covered",
              width: 1600,
              height: 736,
              caption:
                "Leads accepted, assigned by automation and missed, by agent and campaign. Agent and campaign names are hidden.",
            },
          ],
        },
        {
          title: "Follow-up and deals",
          summary:
            "Agents work their leads through calls, meetings and site visits, and qualified leads become deals.",
          capabilities: [
            {
              title: "Tasks and follow-ups",
              description:
                "Calls, meetings, callbacks, site visits and other follow-ups are created and managed in the CRM, with automated reminders.",
            },
            {
              title: "WhatsApp automation",
              description:
                "WhatsApp is connected to the CRM to send automated messages to customers, agents and others about assignments, follow-ups, reminders and updates.",
            },
            {
              title: "Sales and deal management",
              description:
                "Qualified leads become contacts and deals with their full interaction history, and teams track deal stages, follow-ups, documents and closure.",
            },
          ],
          images: [
            {
              src: `${realEstateImages}/leads-view.jpg`,
              alt: "Lead management screen in Zoho CRM with search and status filters, quick filters such as call back and meeting scheduled, and lead cards showing campaign, owner, status and sub-status",
              width: 1600,
              height: 736,
              caption: `Lead cards with status and sub-status, and quick filters for follow-up stages. ${SAMPLE_DATA}`,
            },
          ],
        },
        {
          title: "Finance and commissions",
          summary:
            "Closed deals carry their payments and commissions, and incentives are calculated by rule.",
          capabilities: [
            {
              title: "Finance and commission tracking",
              description:
                "Payments, commissions, approvals and pending amounts are tracked against each closed deal.",
            },
            {
              title: "Automated incentive calculation",
              description:
                "Commissions and incentives are calculated from configurable rules such as fixed percentages, slabs or performance tiers, reducing manual calculation and errors.",
            },
          ],
        },
        {
          title: "Reporting and control",
          summary:
            "Managers see performance and spend by campaign, channel and team, while access rules and an audit trail apply at every stage.",
          capabilities: [
            {
              title: "Performance analytics",
              description:
                "Dashboards and reports cover lead volume, conversion rates, agent and campaign performance, response times, revenue and overall sales.",
            },
            {
              title: "Cost per lead",
              description:
                "Advertising spend is tracked against leads generated to show cost per lead by campaign, channel, team and source.",
            },
            {
              title: "Role-based access",
              description:
                "Administrators, managers, sales agents, telecallers, receptionists and channel partners each get only the information and functions their role needs.",
            },
            {
              title: "Audit trail",
              description:
                "Important actions are recorded, so managers can see who changed a lead, when, and what they did.",
            },
          ],
        },
      ],

      stack: [
        {
          name: "Zoho CRM",
          purpose:
            "The central system: leads, campaigns, assignment and SLA rules, deals, finance, commissions, dashboards and audit history.",
        },
        {
          name: "WhatsApp",
          purpose:
            "Automated notifications and messages to customers, agents and other stakeholders.",
        },
        {
          name: "Meta and Google Ads",
          purpose:
            "Advertising leads brought into the CRM automatically and linked to their campaigns.",
        },
        {
          name: "Company website",
          purpose:
            "Enquiries turned into CRM leads with campaign, project and customer details.",
        },
        {
          name: "Prosper CRM",
          purpose:
            "External CRM kept in sync with Zoho CRM for leads, assignments, statuses and activity.",
        },
      ],

      challenges: [
        "Sharing leads fairly and quickly across agents, with separate rules for events",
        "Making sure no lead is left unattended, and reassigning it when an agent does not act in time",
        "Following each channel partner's leads all the way to deal closure",
        "Keeping Zoho CRM and Prosper CRM consistent for leads, assignments, statuses and activity",
        "Calculating commissions and incentives from percentages, slabs and performance tiers without manual errors",
      ],

      results: [
        "Every lead tracked from the moment it enters the system until conversion",
        "Leads shared out fairly and quickly, and reassigned automatically when agents do not respond",
        "Less manual data entry, with leads from every channel captured automatically",
        "Commissions and incentives calculated by rule instead of by hand",
        "Cost per lead and performance visible by campaign, channel, team and source",
        "One connected workflow from lead generation to deals, finance, commissions and reporting",
      ],
    },
  },
  {
    slug: "zoho-travel-booking-crm",
    title: "Zoho CRM Booking System for a Travel Company",
    category: "Travel / Zoho",
    description:
      "We built a travel company's booking system on Zoho CRM, from first inquiry to quotation, payment and final itinerary, with customer emails automated.",
    technologies: ["Zoho CRM", "Zoho Writer", "Zoho Books", "Zoho Analytics"],
    // No screenshots yet, so the cover is our own diagram of the customer
    // journey. Add screens to the stages below when they arrive.
    image: `${travelImages}/cover.svg`,
    imageAlt:
      "Diagram of a travel route with stops for inquiry, lead, deal, quotation, confirmation, payment and final itinerary",
    imageWidth: 1600,
    imageHeight: 840,
    // Share cards need a raster image, so the same diagram is also a PNG.
    socialImage: {
      src: `${travelImages}/cover.png`,
      alt: "Diagram of a travel route with stops for inquiry, lead, deal, quotation, confirmation, payment and final itinerary",
      width: 1200,
      height: 630,
    },
    year: "2025",
    client: "Travel and tourism booking business",
    role: "Zoho implementation",
    updatedAt: "2026-09-15",
    caseStudy: {
      context:
        "The business handled inquiries from several channels, and prepared quotations and followed up with customers by hand.",
      problem:
        "Quotations took hours to put together, follow-ups could be missed, and management had no real-time view of leads, sales or agent workload.",
      goal: "One platform that carries every customer from first inquiry to final trip confirmation.",
      solution:
        "We implemented Zoho CRM as the central system. Every lead channel feeds into it, the deal pipeline routes each part of a trip to the right agent, quotations are generated in one click through Zoho Writer and reviewed by an agent, and every customer email is sent automatically. Zoho Books, Desk, Analytics and other Zoho apps handle payments, support and reporting around it.",

      stages: [
        {
          title: "Inquiries and leads",
          summary:
            "Every inquiry, from any channel, becomes a CRM lead that records what the customer wants.",
          capabilities: [
            {
              title: "Every channel into CRM",
              description:
                "Website live chat through Zoho SalesIQ, WhatsApp, email and phone inquiries are captured in Zoho CRM automatically, without manual entry.",
            },
            {
              title: "WhatsApp and external channels",
              description:
                "Zoho Flow connects WhatsApp and other external channels to CRM, keeping every conversation and lead in sync.",
            },
            {
              title: "Website forms",
              description:
                "Zoho Forms inquiry and special-request forms on the website feed straight into CRM as new leads.",
            },
            {
              title: "What the customer wants",
              description:
                "At first contact, each lead records whether the customer wants a full package or individual services such as tickets, a hotel stay or sightseeing.",
            },
            {
              title: "Instant alerts",
              description:
                "Zoho Cliq notifies the sales team as soon as a high-value lead or urgent booking request comes in.",
            },
            {
              title: "Welcome email",
              description:
                "A welcome email goes out automatically when a customer signs up.",
            },
          ],
        },
        {
          title: "Deals and agents",
          summary:
            "Each part of a customer's trip goes to the agent who handles that service, with the customer's history to hand.",
          capabilities: [
            {
              title: "Routing by service",
              description:
                "A structured deal pipeline automatically routes each requirement — hotel, flights, itinerary or sightseeing — to the right agent for that service.",
            },
            {
              title: "Customer history",
              description:
                "Customer and account records keep a full history of each traveller's past inquiries, bookings and preferences.",
            },
          ],
        },
        {
          title: "Quotations",
          summary:
            "Branded quotations are generated from the deal in one click and checked by an agent before they go out.",
          flow: ["Generate quotation", "Agent review", "Email with PDF"],
          capabilities: [
            {
              title: "One-click quotation",
              description:
                "A Generate Quotation action pulls hotel, flight and sightseeing details from the deal into a ready-to-send quotation PDF.",
            },
            {
              title: "Branded templates",
              description:
                "Zoho Writer merge templates connected to CRM produce professional, branded travel quotations.",
            },
            {
              title: "Agent review",
              description:
                "Agents finalise each quotation before it is sent, so quality control stays in place without anyone building documents by hand.",
            },
            {
              title: "Quotation email",
              description:
                "The quotation is emailed to the customer automatically with the PDF attached.",
            },
          ],
        },
        {
          title: "Confirmation and payment",
          summary:
            "A confirmed package is accepted, booked and paid for, and the customer receives the final itinerary.",
          flow: ["Package confirmation", "Payment", "Final itinerary"],
          capabilities: [
            {
              title: "Digital acceptance",
              description:
                "Zoho Sign collects digital confirmation and acceptance on select high-value packages, reducing back-and-forth before final booking.",
            },
            {
              title: "Package confirmation email",
              description:
                "A confirmation email is sent automatically when the customer confirms a package.",
            },
            {
              title: "Operation status tracking",
              description:
                "Status tracking on every deal shows in real time whether the hotel is booked, tickets are confirmed and sightseeing is arranged.",
            },
            {
              title: "Invoicing and payments",
              description:
                "Zoho Books handles invoicing, payment tracking and account management once a customer confirms and pays for a package.",
            },
            {
              title: "Final itinerary email",
              description:
                "The final itinerary is emailed automatically after checkout and payment.",
            },
            {
              title: "Consistent, branded emails",
              description:
                "CRM email templates and workflow rules keep every automated message consistent and branded, with no manual follow-up.",
            },
          ],
        },
        {
          title: "Support and repeat business",
          summary:
            "After booking, customer support runs separately from sales, and past customers hear about new offers.",
          capabilities: [
            {
              title: "Post-booking support",
              description:
                "Zoho Desk tracks customer queries, changes and cancellations after booking, separately from the sales pipeline.",
            },
            {
              title: "Seasonal offers",
              description:
                "Zoho Campaigns sends seasonal offers and re-engagement emails to past customers based on their travel history in CRM.",
            },
          ],
        },
        {
          title: "Reporting",
          summary:
            "Management sees leads, sales and agent workload in real time, from team dashboards to business-wide reports.",
          capabilities: [
            {
              title: "CRM dashboards",
              description:
                "Custom dashboards and reports in Zoho CRM track lead sources, agent performance, deal conversion and revenue by package type.",
            },
            {
              title: "Business-wide reporting",
              description:
                "Zoho Analytics adds cross-module reporting that gives management a real-time view of overall business performance.",
            },
          ],
        },
      ],

      stack: [
        {
          name: "Zoho CRM",
          purpose:
            "The central system: leads, deals, customer records, email workflows, dashboards and reports.",
        },
        { name: "Zoho SalesIQ", purpose: "Website live chat that creates CRM leads." },
        {
          name: "Zoho Flow",
          purpose: "Connects WhatsApp and other external channels to CRM.",
        },
        {
          name: "Zoho Forms",
          purpose: "Website inquiry and special-request forms that create CRM leads.",
        },
        {
          name: "Zoho Cliq",
          purpose:
            "Alerts the sales team to high-value leads and urgent booking requests.",
        },
        {
          name: "Zoho Writer",
          purpose:
            "Branded quotation PDFs from merge templates filled with deal details.",
        },
        {
          name: "Zoho Sign",
          purpose: "Digital acceptance of select high-value packages.",
        },
        {
          name: "Zoho Books",
          purpose: "Invoicing, payment tracking and account management.",
        },
        {
          name: "Zoho Desk",
          purpose: "Post-booking queries, changes and cancellations.",
        },
        {
          name: "Zoho Campaigns",
          purpose: "Seasonal offers and re-engagement emails to past customers.",
        },
        {
          name: "Zoho Analytics",
          purpose: "Cross-module reporting on overall business performance.",
        },
      ],

      challenges: [
        "Capturing inquiries from live chat, WhatsApp, email, phone and web forms without manual entry",
        "Routing each part of a trip — hotel, flights, itinerary, sightseeing — to the right agent",
        "Automating quotations while keeping an agent's review before anything is sent",
        "Keeping every customer email consistent from signup to final itinerary",
      ],

      results: [
        "Quotation turnaround reduced from hours to minutes, with every quotation still reviewed by an agent",
        "No manual follow-up gaps: every customer message from signup to final itinerary is automated",
        "Real-time visibility for management into leads, sales and agent workload",
        "A system that scales as the business adds agents, packages and service types",
      ],
    },
  },
  {
    slug: "zoho-spinning-mill-order-to-dispatch",
    title: "Zoho Order-to-Dispatch System for a Spinning Mill",
    category: "Manufacturing / Zoho",
    description:
      "We connected a spinning mill's sales, finance, stock, production and quality checks in one Zoho system, tracing every order from lead to dispatch.",
    technologies: ["Zoho CRM", "Zoho Creator", "Zoho Books", "Zoho Inventory"],
    image: `${millImages}/production-dashboard.jpg`,
    imageAlt:
      "Production dashboard with today's output, seven-day output, dispatch, average efficiency and waste, a 14-day output trend chart, and a bar chart of records at each stage from job card to QA reports",
    imageWidth: 1600,
    imageHeight: 581,
    imageCaption: `Daily production output, the 14-day output trend, and records at each stage from job card to QA reports. ${SAMPLE_DATA}`,
    // The cover shows figures, so social cards use a screen without them.
    socialImage: {
      src: `${millImages}/dyeing-blend-advice.jpg`,
      alt: "Two-step form: a dyeing step with blend advice number, dyeing date, quantity and remarks, then a blend advice step with date, lot number, job card number and party name",
      width: 1532,
      height: 752,
    },
    year: "2026",
    client: "Spinning mill, India",
    role: "Zoho implementation",
    updatedAt: "2026-09-15",
    caseStudy: {
      context:
        "The mill's sales, accounts, stock, production and quality records were kept in separate places, so the same order details were entered again at each step.",
      problem:
        "No one could follow an order from the first enquiry through production to dispatch, and quality results were not visible while a lot was still being made.",
      goal: "One connected system that carries every order from lead to dispatch, with production, stock, finance and quality tracked against it.",
      solution:
        "We implemented an end-to-end system on Zoho CRM, Zoho Creator, Zoho Books and Zoho Inventory. Leads are captured automatically and worked through quotation and approval in CRM; confirmed orders flow into invoicing, payments and stock; and each sales order generates a job card that follows the lot through dyeing, blending, spinning, packing and dispatch, with quality data captured at every stage.",

      stages: [
        {
          title: "Leads and customers",
          summary:
            "Enquiries from every channel land in one CRM, and each becomes a contact and an account the whole sales team works from.",
          flow: ["Lead", "Contact", "Account"],
          capabilities: [
            {
              title: "Automatic lead capture",
              description:
                "Leads from the website, WhatsApp and e-commerce are created in Zoho CRM automatically, without anyone typing them in.",
            },
            {
              title: "Lead to account",
              description:
                "A qualified lead becomes a contact and an account, so every quote and order is tied to the right customer.",
            },
          ],
        },
        {
          title: "Deals and quotations",
          summary:
            "Qualified leads move through a 9-stage deal pipeline, and every quote is costed and approved before it reaches the customer.",
          flow: [
            "Quotation",
            "Cost estimate",
            "Pricing and margin",
            "Approval",
            "Proforma invoice",
          ],
          capabilities: [
            {
              title: "Deal pipeline",
              description:
                "A 9-stage deal pipeline in Zoho CRM shows where every opportunity stands.",
            },
            {
              title: "Costed quotations",
              description:
                "Each quotation is costed, then priced with its margin worked out, all in the same workflow.",
            },
            {
              title: "Approval and proforma invoice",
              description:
                "A quote is approved before it goes out, and an approved quote becomes a proforma invoice.",
            },
          ],
        },
        {
          title: "Orders, finance and stock",
          summary:
            "Confirmed orders are invoiced and followed through to payment, against live stock of raw material and finished goods.",
          capabilities: [
            {
              title: "Invoicing and payments",
              description:
                "Confirmed orders are connected to Zoho Books for invoicing and payment tracking.",
            },
            {
              title: "Raw-material and finished-goods stock",
              description:
                "Zoho Inventory tracks the raw materials going into production and the finished goods ready to ship.",
            },
          ],
        },
        {
          title: "Job cards",
          summary:
            "Each sales order becomes a job card that tells the production floor exactly what to make.",
          capabilities: [
            {
              title: "Job cards from sales orders",
              description:
                "A sales order automatically generates its job card in Zoho Creator, so order details are never re-entered for production.",
            },
            {
              title: "Specifications and composition",
              description:
                "Each job card carries the product specifications, raw-material composition and quality parameters for the order.",
            },
            {
              title: "Approvals",
              description: "Job cards are approved before production starts.",
            },
            {
              title: "Product code matching",
              description:
                "The job card's specifications are matched to the right product code automatically.",
            },
          ],
        },
        {
          title: "Production floor",
          summary:
            "Every lot is tracked step by step from dyeing to dispatch, so its full history is on record.",
          flow: [
            "Dyeing",
            "Blend advice",
            "Spinning",
            "Lot control",
            "Production",
            "Packing",
            "Dispatch",
          ],
          capabilities: [
            {
              title: "Dyeing and blend advice",
              description:
                "Dyeing is recorded against the job card, followed by the blend advice that sets the lot's fibre mix.",
            },
            {
              title: "Spinning and lot control",
              description:
                "Each spinning lot has a lot control card holding its raw-material blend and the machine settings for every passage.",
            },
            {
              title: "Production, packing and dispatch",
              description:
                "Daily production is reported by shift and section, and packing and dispatch are recorded against the same lot.",
            },
            {
              title: "Production tracking",
              description:
                "A dashboard shows daily output, dispatch, efficiency and waste, and how many records sit at each stage.",
            },
          ],
          images: [
            {
              src: `${millImages}/dyeing-blend-advice.jpg`,
              alt: "Two-step form: a dyeing step with blend advice number, dyeing date, quantity and remarks, then a blend advice step with date, lot number, job card number and party name",
              width: 1532,
              height: 752,
              caption: `Dyeing recorded against a blend advice, then the blend advice itself. ${SAMPLE_DATA}`,
            },
            {
              src: `${millImages}/lot-control-card.jpg`,
              alt: "Lot control card for a spinning lot showing count, blend, product code and shade, a table of fibre and wool quantities and percentages, and machine settings for pre-combing and re-combing passages",
              width: 1600,
              height: 622,
              caption: `A lot control card with the raw-material blend and the pre-combing and re-combing settings. ${SAMPLE_DATA}`,
            },
            {
              src: `${millImages}/daily-production-report.jpg`,
              alt: "Daily production report form with spinning lot number, date, shift, count and blend, tabs for ring frame, preparatory, spinning, post spinning, packing and dispatch, and a ring frame production table",
              width: 1600,
              height: 806,
              caption: `The daily production report: load a lot, then record each section's output for the shift. ${SAMPLE_DATA}`,
            },
          ],
        },
        {
          title: "Quality assurance",
          summary:
            "Quality data is captured at every stage and compared against standards and earlier lots.",
          capabilities: [
            {
              title: "Stage-wise quality data",
              description:
                "A dedicated QA module records quality results at each production stage.",
            },
            {
              title: "Lot Master",
              description:
                "A Lot Master report brings each lot's quality results together.",
            },
            {
              title: "Comparison reports",
              description:
                "Reports compare a lot's results against the quality standards and against previous production lots.",
            },
          ],
        },
      ],

      stack: [
        {
          name: "Zoho CRM",
          purpose:
            "Lead capture, contacts and accounts, the 9-stage deal pipeline and the quotation workflow.",
        },
        {
          name: "Zoho Creator",
          purpose:
            "Job cards, the production workflow from dyeing to dispatch, and the QA module.",
        },
        {
          name: "Zoho Books",
          purpose: "Invoicing and payment tracking for confirmed orders.",
        },
        {
          name: "Zoho Inventory",
          purpose: "Raw-material and finished-goods stock.",
        },
      ],

      challenges: [
        "Matching each order's specifications to the right product code automatically",
        "Following one lot through dyeing, blending, spinning, packing and dispatch",
        "Keeping sales, accounts, stock and production in step without entering data twice",
        "Comparing quality results against standards and earlier lots while production runs",
      ],

      results: [
        "Complete traceability of every order, from lead to dispatch",
        "Less duplicate data entry across sales, finance, stock and production",
        "Production tracked automatically from job card to dispatch",
        "Inventory and finance connected to confirmed orders",
        "Real-time visibility of quality at every stage",
      ],
    },
  },
  {
    slug: "zoho-portfolio-accounting-system",
    title: "Zoho-Powered Portfolio Accounting System for a PMS Firm",
    category: "Fintech / Zoho",
    description:
      "We helped an Indian PMS firm stop relying on an outsourced fund accounting provider by building its own portfolio accounting system on Zoho.",
    technologies: ["Zoho Catalyst", "Zoho CRM", "Zoho Books", "Zoho Analytics"],
    image: `${pmsImages}/aum-overview.png`,
    imageAlt:
      "Portfolio dashboard showing total assets, strategies, accounts, month-to-date inflow and outflow, and assets under management by strategy",
    imageWidth: 956,
    imageHeight: 549,
    imageCaption: `Assets under management by strategy, with month-to-date inflow and outflow. ${SAMPLE_DATA}`,
    // The cover shows figures, and a share card cannot carry the sample-data
    // caption, so social cards use a screen with no figures on it.
    socialImage: {
      src: `${pmsImages}/custodian-reconciliation.png`,
      alt: "Custody matching screen listing resident and NRE/NRO custodian files, with a panel mapping a file's column headings to the five required fields",
      width: 1880,
      height: 809,
    },
    year: "2025",
    client: "Portfolio Management Services firm, India",
    role: "Full-stack development",
    updatedAt: "2026-09-15",
    caseStudy: {
      context:
        "The firm outsourced its fund accounting. Every day it sent its trade files to an outside provider, and could only log in to view the results.",
      problem:
        "It had no control over how its client data was processed, and it depended on the provider for every key report.",
      goal: "One in-house system that owns the full journey — data in, checks, calculations, reports and client delivery — with a single trusted record for every client portfolio.",
      solution:
        "We built a portfolio accounting system on the Zoho ecosystem. The firm now controls its client data from the day a trade happens to the day a report reaches the client: the operations team uploads, checks and reconciles each day's data itself, holdings, cash, accounting and performance are calculated from it, and reports are generated, signed and delivered from the same system.",

      stages: [
        {
          title: "Clients and securities",
          summary:
            "One shared record of every client, account and security, used by both the relationship and operations teams.",
          capabilities: [
            {
              title: "Client onboarding",
              description:
                "New client and account details are captured in Zoho CRM, so the relationship team and the operations team work from the same client information.",
            },
            {
              title: "Client and security records",
              description:
                "Master lists of clients, accounts and securities, including support for multiple client sub-accounts managed under one broker account.",
            },
            {
              title: "Onboarding forms",
              description: "Client onboarding forms through Zoho Forms.",
              status: "next-phase",
            },
          ],
          images: [
            {
              src: `${pmsImages}/isin-update.png`,
              alt: "Update ISIN screen with fields to replace a security's old ISIN with a new one, and to apply a new security code and name",
              width: 1760,
              height: 810,
              caption:
                "Updating a security's ISIN, code and name in the security records.",
            },
          ],
        },
        {
          title: "Daily data in and checks",
          summary:
            "Each day's files come straight into the system, and nothing reaches client records until it has been checked and reconciled.",
          capabilities: [
            {
              title: "Daily trade upload",
              description:
                "The operations team uploads the day's trade file directly into the system, replacing the old practice of sending files to an outside provider.",
            },
            {
              title: "Upfront file checks",
              description:
                "Every file is checked before it is accepted, and staff are told exactly what to fix, so bad data never enters client records.",
            },
            {
              title: "Custodian reconciliation",
              description:
                "The firm's trades are matched against the custodian's records for both resident and non-resident (NRE/NRO) clients. Nothing is posted until every difference is resolved.",
            },
            {
              title: "Audit trail",
              description:
                "Every uploaded file is saved and can be downloaded again, giving compliance and auditors a clear history of what was received and when.",
            },
            {
              title: "Daily market prices",
              description:
                "Daily stock exchange prices are uploaded so every portfolio is valued at the current market price.",
            },
            {
              title: "Bank and capital movements",
              description:
                "Bank statements and client money in and out — new investments, top-ups and withdrawals — are uploaded and matched automatically, with unmatched items flagged for review.",
            },
          ],
          images: [
            {
              src: `${pmsImages}/custodian-reconciliation.png`,
              alt: "Custody matching screen listing resident and NRE/NRO custodian files, with a panel mapping a file's column headings to the five required fields",
              width: 1880,
              height: 809,
              caption:
                "Custodian files for resident and NRE/NRO accounts, with each file's columns mapped to the fields the system stores.",
            },
          ],
        },
        {
          title: "Portfolio and accounting engine",
          summary:
            "Holdings, cash, accounting, tax and performance stay accurate after every trade and every corporate action.",
          capabilities: [
            {
              title: "Client holdings",
              description:
                "Each client's holdings, average cost, market value and profit or loss stay accurate after every trade.",
            },
            {
              title: "Historical view",
              description:
                "Holdings can be viewed as of any past date, which makes audits, client queries and month-end reviews simple.",
            },
            {
              title: "Corporate actions",
              description:
                "Stock splits, bonus shares, dividends, mergers and demergers are applied to every affected client automatically.",
            },
            {
              title: "Review before changes",
              description:
                "Staff preview exactly which clients a corporate action will affect before confirming it, which prevents costly mistakes across many accounts.",
            },
            {
              title: "Client cash tracking",
              description:
                "A passbook-style cash balance for every client, updated automatically as trades are recorded.",
            },
            {
              title: "Accounting and tax",
              description:
                "Daily portfolio value (NAV), double-entry accounting, trial balance, profit and loss, and balance sheet in Zoho Books, plus TDS and short-term and long-term capital gains classification.",
            },
            {
              title: "Performance reporting",
              description:
                "Client returns calculated using industry-standard methods (TWRR and XIRR) and compared against market benchmarks such as the BSE 500.",
            },
            {
              title: "Reliability for growing portfolios",
              description:
                "Processing was made faster and more dependable so large client books update on time, and staff are always told if a task did not complete.",
            },
            {
              title: "Fee management",
              description:
                "Management, custody, audit, account opening and performance fees (on a high-watermark basis) calculated in-house, verified against third-party figures, and invoiced to clients through Zoho Books.",
              status: "next-phase",
            },
          ],
        },
        {
          title: "Insight and reporting",
          summary:
            "Operations and leadership see activity, holdings and assets under management, and every standard report is one click away.",
          capabilities: [
            {
              title: "Business dashboard",
              description:
                "A quick view of overall activity, holdings and recent trades, with drill-down into any client's portfolio and trade history.",
            },
            {
              title: "Management insights",
              description:
                "Zoho Analytics dashboards give leadership a view of assets under management, strategies, accounts, and money coming in and going out.",
            },
            {
              title: "Reports and exports",
              description:
                "One-click reports for client holdings, transactions, cash statements, client lists and corporate actions, with alerts when each report is ready.",
            },
            {
              title: "Client reports and data requests",
              description:
                "32 ready-made report types (portfolio, performance, capital, financial statements, tax and compliance) and 17 on-request data pulls, delivered as Excel or by email.",
            },
          ],
          images: [
            {
              src: `${pmsImages}/aum-overview.png`,
              alt: "Dashboard with total assets, number of strategies and accounts, month-to-date inflow and outflow, and a table of assets under management by strategy",
              width: 956,
              height: 549,
              caption: `Assets under management by strategy, with month-to-date inflow and outflow. ${SAMPLE_DATA}`,
            },
            {
              src: `${pmsImages}/client-accounts.png`,
              alt: "Account list filtered by strategy, beside one client's summary of current value, net capital, gain or loss and asset allocation",
              width: 977,
              height: 474,
              caption: `Client accounts by strategy, with a portfolio summary for the selected account. ${SAMPLE_DATA}`,
            },
            {
              src: `${pmsImages}/aum-trends.png`,
              alt: "Line chart of assets under management rising over the last 12 months",
              width: 972,
              height: 315,
              caption: `Assets under management over the last 12 months. ${SAMPLE_DATA}`,
            },
          ],
        },
        {
          title: "Client delivery and service",
          summary:
            "Signed statements, scheduled client and regulatory reports, and team alerts go out without anyone assembling them by hand.",
          capabilities: [
            {
              title: "Signed documents",
              description:
                "Audited statements are digitally signed through Zoho Sign and stored in a searchable document library in Zoho WorkDrive.",
            },
            {
              title: "Scheduled client and regulatory delivery",
              description:
                "Daily end-of-day and cash reports, SEBI reports, monthly and quarterly profit and loss and balance sheets, and annual reports are sent automatically by email through Zoho ZeptoMail.",
            },
            {
              title: "Team alerts and automation",
              description:
                "Zoho Flow connects the Zoho apps, and Zoho Cliq alerts the operations team when daily processing finishes or needs attention.",
            },
            {
              title: "Client service",
              description:
                "Client questions and report requests handled through Zoho Desk, linked to each client's CRM record.",
              status: "next-phase",
            },
          ],
          images: [
            {
              src: `${pmsImages}/portfolio-appraisal-report.png`,
              alt: "Portfolio appraisal report for a client account showing opening value, net capital added, closing value and a holdings summary, marked as e-signed",
              width: 734,
              height: 594,
              caption: `A client portfolio appraisal report, digitally signed. ${SAMPLE_DATA}`,
            },
          ],
        },
      ],

      stack: [
        {
          name: "Zoho Catalyst",
          purpose: "Application platform for the portfolio accounting system.",
        },
        {
          name: "Zoho CRM",
          purpose:
            "Client and account onboarding, shared by the relationship and operations teams.",
        },
        {
          name: "Zoho Books",
          purpose:
            "Daily NAV, double-entry accounting, trial balance, profit and loss, and balance sheet.",
        },
        {
          name: "Zoho Analytics",
          purpose:
            "Leadership dashboards for assets under management, strategies, accounts and money in and out.",
        },
        { name: "Zoho Sign", purpose: "Digital signatures on audited statements." },
        { name: "Zoho WorkDrive", purpose: "Searchable library of signed documents." },
        {
          name: "Zoho ZeptoMail",
          purpose: "Scheduled email delivery of client reports and SEBI reports.",
        },
        { name: "Zoho Flow", purpose: "Connects the Zoho apps to each other." },
        {
          name: "Zoho Cliq",
          purpose:
            "Alerts the operations team when daily processing finishes or needs attention.",
        },
        {
          name: "Zoho Desk",
          purpose:
            "Client questions and report requests, linked to each client's CRM record.",
          status: "next-phase",
        },
        { name: "Zoho Forms", purpose: "Client onboarding forms.", status: "next-phase" },
      ],

      challenges: [
        "Reconciling trades against custodian records for resident and NRE/NRO clients before anything is posted",
        "Applying corporate actions across many client accounts without costly mistakes",
        "Keeping large client books updated on time as portfolios grow",
        "Stopping bad data at upload, before it can reach client records",
      ],

      results: [
        "The firm no longer relies on an outsourced fund accounting provider",
        "It controls its client data from the day a trade happens to the day a report reaches the client",
        "Every uploaded file is kept, giving compliance and auditors a clear history",
        "32 ready-made report types and 17 on-request data pulls",
        "Daily, monthly, quarterly and annual client and SEBI reports delivered automatically",
      ],
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
