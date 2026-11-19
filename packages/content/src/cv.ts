import type { Cv } from "./types.ts";

/**
 * The CV's own words: Hary's CV (Hary-Arrahman-CV.pdf, 31 Oct 2026), which an ATS has to read, as he wrote
 * it, with only what he has asked for since (the app before BOS, AI, IoT and the native app, today's BOS
 * figures) and what the repo surveys corrected. The rest of the site keeps to a few words; this does not.
 * Three pages at most, as his was, so a project without words here stays off it. Names, roles, dates and
 * links come from the records (experience.ts, projects.ts, profile.ts), by slug. Work not released says so.
 * Never the phone number. `**` marks a figure in bold.
 */
export const cv: Cv = {
	summary:
		"Senior Product Engineer, full-stack, with 5+ years of experience building and scaling web applications across SaaS, fintech and banking, edtech, and HR tech. Until Nov 2026, senior engineer on MapTrack’s asset-management app and founding engineer of BOS, its internal CRM and business operating system: BOS replaced HubSpot as the system of record, reconciles billing against Xero, and runs agentic AI through MCP, with a person approving what agents draft. Strong across the stack — Next.js, React, Vue, TypeScript, Node.js, and PostgreSQL/Supabase — and AI-native day to day, with Claude Code as the primary development environment.",
	experience: {
		maptrack: {
			place: "Remote · Australia",
			groups: [
				{
					title: "Core product",
					note: "asset management platform",
					bullets: [
						"Own and deliver end-to-end product features, from technical planning to implementation and release.",
						"Work directly with the CTO to translate product and business priorities into scalable technical solutions.",
						"Built the drag-and-drop Form Builder and original Form Renderer on a teammate’s forms backend, with conditional logic, repeatable sections, and runtime validation.",
						"Built the data-table toolkit: nested filters, saved views, inline row editing, and bulk edit.",
						"Built the CSV and Excel import wizard with column mapping and failed-row reports.",
						"Built the first versions of the transactional email service and most of its templates.",
						"Ship features on the team’s RxDB offline mode: they work without a connection and sync back.",
						"Improved UX with unsaved-change warnings and thumbnail previews, and fixed form-validation edge cases.",
					],
					tech: [
						"Next.js",
						"TypeScript",
						"Supabase",
						"PostgreSQL",
						"RxDB",
						"PWA",
						"TanStack Table",
						"AWS SES",
						"Deno",
						"GitHub Actions",
						"Playwright",
						"Vitest",
						"Storybook",
						"SonarQube",
						"CodeRabbit",
					],
				},
				{
					title: "AI",
					note: "live in the app",
					bullets: [
						"Co-built the first version of AI asset creation from photos, using LLM structured output: the add-asset form fills in a category and custom field values for a person to review.",
						"Built the client-side image compression behind the app’s photo AI. Also live, from the team: part prefill from photos, forms and procedures from documents, and meter and serial reading from the camera.",
					],
					tech: ["LLM structured output"],
				},
				{
					title: "IoT, native app & public API",
					note: "IoT live, the rest in development",
					bullets: [
						"Surfaced GPS tracker data on the web map. Also live, from the team: asset telemetry and device status.",
						"Building a React Native and Expo phone app, not yet released, with tag scanning, forms, and offline sync.",
						"Co-building an AI apps connector over MCP under the user’s permissions, and extending the public REST API.",
					],
					tech: ["IoT", "MapLibre", "React Native", "Expo", "SQLite", "MCP", "REST APIs"],
				},
				{
					title: "BOS",
					note: "internal CRM & business operating system · founding engineer",
					bullets: [
						"Built BOS from the ground up as the CRM and operating system MapTrack’s sales, ops, and finance teams run on daily, owning architecture, data model, and delivery end to end.",
						"Built agentic AI into BOS: agents draft email replies, meeting recaps, follow-ups, CRM fixes, and first outreach into a human approve/reject queue. Only the app sends, and an owner kill switch stops them.",
						"Built the MCP server behind them (~60 tools), with a Postgres job queue fed by new emails, calls, and notes.",
						"Replaced HubSpot as the system of record: migrated 7,400+ records at go-live with custom-field and contact-relationship mapping, with a leads webhook that deduplicates by email and matches companies by domain. BOS now holds 47,000+ emails and 13,000+ leads.",
						"Built Billing Health for finance to replace a hand-kept spreadsheet: it reconciles Xero invoices against expected MRR per customer to flag under- and over-billing, with remarks and sign-off, and handles non-monthly billing and mid-year MRR changes.",
						"Built the foundation of Product Usage: an hourly pull of MapTrack account usage into BOS, showing who to call and who’s at risk.",
						"Built Gmail and Google Calendar sync, designed a provider-agnostic mailbox adapter around Google’s restricted-scope (CASA) requirements, and integrated call transcription (JustCall, Bluedot).",
						"Improved performance and security: deduplicated redundant auth calls, added global record search with trigram GIN indexes on generated columns, and set up least-privilege read-only database access for stakeholders.",
						"Ship daily with AI coding agents (Claude Code): custom skills and semi-autonomous runs reviewed at PR.",
					],
					tech: [
						"Next.js",
						"TypeScript",
						"Supabase",
						"PostgreSQL",
						"shadcn/ui",
						"Vercel",
						"MCP",
						"Agentic AI",
						"Xero",
						"Stripe",
						"GoCardless",
					],
				},
			],
		},
		"btpn-syariah": {
			place: "Jakarta, Indonesia · Hybrid",
			groups: [
				{
					bullets: [
						"Developed full-stack features for an internal customer-support application in an enterprise banking environment.",
						"Contributed to backend service implementation and frontend integration.",
						"Worked on enterprise-grade application development within a regulated banking environment.",
					],
					tech: ["Vue.js", "Java", "Spring Boot"],
				},
			],
		},
		bosshire: {
			groups: [
				{
					bullets: [
						"Built and delivered a Job Fair Event feature.",
						"Improved Lighthouse performance score from **30 to 80+** within two months.",
						"Migrated the platform from Next.js 12 to 14 and from Pages Router to App Router.",
						"Optimized caching and data fetching with reusable React Query hooks, and converted images to WebP.",
						"Maintained a Lighthouse SEO score of **92/100** through targeted SEO improvements.",
					],
					tech: ["Next.js", "TypeScript", "React Query", "SEO", "Web Performance Optimization"],
				},
			],
		},
		edufund: {
			place: "Jakarta, Indonesia · Hybrid",
			groups: [
				{
					bullets: [
						"Developed backend and full-stack features in Go, working with PostgreSQL, MySQL, Hasura, and GraphQL-based services.",
						"Migrated frontend applications from Angular to Next.js within three months and built a new Next.js application from scratch, including authentication, layout structure, and core UI components.",
					],
					tech: [
						"Go",
						"PostgreSQL",
						"MySQL",
						"Hasura",
						"Apollo GraphQL",
						"TypeScript",
						"Next.js",
						"Angular",
						"React.js",
						"Tailwind CSS",
						"REST APIs",
						"Material UI",
					],
				},
			],
		},
		happy5: {
			place: "Jakarta, Indonesia",
			groups: [
				{
					bullets: [
						"Migrated styling from Styled Components to Tailwind CSS for better maintainability.",
						"Built Cypress end-to-end tests to improve reliability, and resolved production issues reported through Sentry.",
						"Implemented client-side WebSocket features for real-time interactions and Amplitude event tracking.",
						"Created PDF templates and Storybook documentation, and built reusable React Query hooks.",
						"As an intern, migrated React class components to function components and supported the TypeScript migration.",
					],
					tech: [
						"TypeScript",
						"JavaScript",
						"Styled Components",
						"Cypress",
						"Sentry",
						"Amplitude",
						"React.js",
						"Tailwind CSS",
						"WebSocket",
						"Storybook",
						"Zustand",
					],
				},
			],
		},
		freelance: {
			heading: "Web Developer — Freelance",
			place: "Japan & Indonesia",
			groups: [
				{
					bullets: [
						"Delivered web applications for clients across Japan and Indonesia, from UI implementation to backend integration.",
						"Selected projects: JA Hakui Attendance System (JP), Catering System for Doi Masaru (JP), My Siloam (ID).",
					],
					tech: [
						"TypeScript",
						"JavaScript",
						"Next.js",
						"React.js",
						"Tailwind CSS",
						"Material UI",
						"React Query",
						"Figma",
					],
				},
			],
		},
		"mycelium-network": {
			place: "Remote",
			groups: [
				{
					bullets: [
						"Developed web application features using Next.js and modern full-stack technologies.",
						"Built interactive frontend experiences and integrated blockchain-related tooling.",
					],
					tech: ["Next.js", "tRPC", "MongoDB", "Fabric.js", "Wagmi"],
				},
			],
		},
	},
	projects: {
		penawaranku: {
			heading: "Penawaranku — AI Cost-Estimation (RAB) Document Generator",
			label: "Final-Year Thesis",
			bullets: [
				"Built an AI system that generates drilling-operation cost-estimation (RAB) documents using a hybrid RAG pipeline with a two-phase flow — an AI draft, then confirm & save, with prices from a material database.",
				"Combined pgvector embeddings and full-text search to produce structured, reference-grounded documents with DOCX/PDF export; delivered under Scrum with defined NFR/SLA targets.",
			],
			tech: [
				"Next.js",
				"Supabase",
				"pgvector",
				"RAG",
				"OpenAI API",
				"text-embedding-3-small",
				"Vercel AI SDK",
				"Tavily",
				"AWS Lambda",
				"Gotenberg",
			],
		},
		"arsip-cetak": {
			heading: "Arsip Cetak — Multi-Tenant SaaS for Print Shops",
			label: "Side Project",
			bullets: [
				"Building a multi-tenant SaaS for print shops (inventory & invoicing), in development, with cost-efficient infrastructure designed to scale across many tenants.",
			],
			tech: ["Next.js", "Supabase", "Docker", "Cloudflare R2", "Gotenberg"],
		},
	},
	education: {
		"binus-online": [
			"Projects: MVC web applications (PHP/MySQLi), Java desktop apps, UI/UX (Figma), data scraping (Selenium).",
		],
		"smkn-26-jakarta": ["Leader of the Intra-School Student Organization (OSIS), 2019 – 2020."],
	},
};
