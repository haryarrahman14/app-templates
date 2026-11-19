import type { Education, Metric, Profile, SkillGroup } from "./types.ts";

export const profile: Profile = {
	name: "Hary Arrahman",
	initials: "HA",
	/** Hary, 18 Nov 2026: Applied AI Engineer first, Senior Product Engineer kept ("Senior product engineer nya tetep"). */
	headline: "Applied AI Engineer · Senior Product Engineer",
	role: "Applied AI Engineer",
	/** Said on the hero, the CV and the portfolio PDF (Hary, 17 Nov 2026, after the MapTrack layoff). */
	availability: "Available now · Remote or Jakarta",
	// Hary, 18 Nov 2026: "Applied AI Engineer, Senior Product Engineer, Founding Engineer" (BOS's, never bare).
	titles: ["Applied AI Engineer", "Senior Product Engineer", "Founding engineer, BOS"],
	location: "Jakarta, Indonesia",
	countryCode: "ID",
	timezone: "Asia/Jakarta",
	email: "haryarrahman14@gmail.com",
	summary: [
		"Senior product engineer, full-stack, with 5+ years of experience building and scaling web applications across SaaS, fintech and banking, edtech, and HR tech.",
		"Until Nov 2026 I worked on the MapTrack app and was the founding engineer of BOS, its internal CRM. I work across Next.js, React, Vue, TypeScript, Node.js and PostgreSQL, building with AI agents, MCP and RAG, with Claude Code as my main development environment.",
	],
	intro: {
		hi: "Hi, I’m Hary Arrahman",
		lines: ["Product engineer, full-stack,", "with 5+ years of experience."],
		more: "Building web apps across SaaS, fintech, edtech and HR tech, lately with AI agents, MCP and RAG.",
	},
	industries: ["SaaS", "Fintech & banking", "Edtech", "HR tech"],
	careerStart: "2021-04",
	site: "https://haryarrahman.tech",
	links: [
		{
			kind: "github",
			label: "GitHub",
			handle: "haryarrahman14",
			href: "https://github.com/haryarrahman14",
		},
		{
			kind: "linkedin",
			label: "LinkedIn",
			handle: "hary-arrahman",
			href: "https://www.linkedin.com/in/hary-arrahman",
		},
		{
			kind: "email",
			label: "Email",
			handle: "haryarrahman14@gmail.com",
			href: "mailto:haryarrahman14@gmail.com",
		},
	],
	cv: {
		href: "/cv/hary-arrahman-cv.pdf",
		fileName: "Hary-Arrahman-CV.pdf",
		sizeLabel: "136 KB",
		pages: 4,
		updatedAt: "2026-11-18",
	},
	avatarUrl: null,
};

/** The figures on the Story home, under the hero. The tests tie each one to the record. */
export const keyFigures: Metric[] = [
	{ value: "5+ years", label: "building and scaling web applications" },
	{ value: "~60", label: "MCP tools for AI agents in BOS" },
	{ value: "Agentic AI", label: "agents draft, a person approves" },
	{ value: "Hybrid RAG", label: "pgvector + full-text, in Penawaranku" },
	{ value: "47,000+", label: "emails in BOS" },
	{ value: "13,000+", label: "leads in BOS" },
];

export const education: Education[] = [
	{
		slug: "binus-online",
		school: "BINUS Online",
		degree: "Bachelor of Information Systems",
		start: "2022-08",
		end: "2026-12",
		expected: true,
		gpa: "3.94 / 4.00",
		notes: [
			"Projects: MVC web apps (PHP/MySQLi), Java desktop apps, UI/UX (Figma), data scraping (Selenium).",
		],
	},
	{
		slug: "smkn-26-jakarta",
		school: "SMK Negeri 26 Jakarta",
		degree: "Computer Systems, Networking & Telecommunications",
		start: "2018",
		end: "2022",
		notes: ["Leader of the Intra-School Student Organization (OSIS), 2019 – 2020."],
	},
];

/** A group's items in order, each with the slug of the experience or project its chip links to. */
const group = (
	name: string,
	where: Record<string, string>,
	ongoing: string[] = [],
): SkillGroup => ({
	name,
	items: Object.keys(where),
	where,
	ongoing,
});

/**
 * An item comes from the CV, from the repo record of his own commits, or from his own word (AWS Lambda
 * in Penawaranku, SonarQube and CodeRabbit at MapTrack, NestJS and Neon for this site). `whereUsed()`
 * holds each link to a real experience or project. OpenAI API links to Penawaranku (his CV names it there): MapTrack's
 * AI vendor stays unnamed. Coding assistants are not stack; CodeRabbit is code review. The phone app is not
 * released and this site's backend is only planned, so what only they use says "ongoing".
 */
export const skillGroups: SkillGroup[] = [
	group("Frontend", {
		TypeScript: "maptrack",
		React: "happy5",
		"Next.js": "maptrack",
		"TanStack Start": "portfolio",
		Vue: "btpn-syariah",
		Angular: "edufund",
		Vite: "portfolio",
		"Tailwind CSS": "happy5",
		"Material UI": "freelance",
		"shadcn/ui": "maptrack",
		"Radix UI": "portfolio",
		"React Query": "bosshire",
		"TanStack Router": "portfolio",
		"TanStack Table": "maptrack",
		Zustand: "happy5",
		GSAP: "portfolio",
		MapLibre: "maptrack",
	}),
	group(
		"Mobile",
		{
			"React Native": "maptrack",
			Expo: "maptrack",
			PWA: "arsip-cetak",
			SQLite: "maptrack",
			RxDB: "maptrack",
		},
		["React Native", "Expo", "SQLite"],
	),
	group(
		"Backend & data",
		{
			"Node.js": "maptrack",
			NestJS: "portfolio",
			Go: "edufund",
			"Spring Boot": "btpn-syariah",
			PostgreSQL: "maptrack",
			Supabase: "maptrack",
			Neon: "portfolio",
			MySQL: "edufund",
			MongoDB: "mycelium-network",
			GraphQL: "edufund",
			Hasura: "edufund",
			tRPC: "mycelium-network",
			Xero: "maptrack",
		},
		["NestJS", "Neon"],
	),
	group("AI", {
		"OpenAI API": "penawaranku",
		"Vercel AI SDK": "penawaranku",
		MCP: "maptrack",
		RAG: "penawaranku",
		pgvector: "penawaranku",
		Tavily: "penawaranku",
		JustCall: "maptrack",
		Bluedot: "maptrack",
	}),
	group("Infra", {
		"AWS SES": "maptrack",
		"AWS Lambda": "penawaranku",
		Deno: "maptrack",
		pgmq: "maptrack",
		pg_cron: "maptrack",
		"React Email": "maptrack",
		Docker: "arsip-cetak",
		"GitHub Actions": "maptrack",
		Turborepo: "portfolio",
		pnpm: "portfolio",
		Vercel: "maptrack",
		Cloudflare: "portfolio",
		"Cloudflare Workers": "portfolio",
		"Cloudflare R2": "arsip-cetak",
		Gotenberg: "penawaranku",
	}),
	group("Quality", {
		Playwright: "maptrack",
		Vitest: "maptrack",
		Cypress: "happy5",
		pgTAP: "maptrack",
		Storybook: "maptrack",
		Sentry: "happy5",
		SonarQube: "maptrack",
		Biome: "portfolio",
		CodeRabbit: "maptrack",
		Lighthouse: "bosshire",
	}),
];
