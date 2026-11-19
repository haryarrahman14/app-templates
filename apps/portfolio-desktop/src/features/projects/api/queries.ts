import { experiences, projects, rowOf, type Shot } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type ProjectInput, projectSchema } from "@/features/projects/schemas/project";
import { CATEGORY } from "@/lib/palette";

const COLORS = [
	CATEGORY.teal,
	CATEGORY.orange,
	CATEGORY.green,
	CATEGORY.blue,
	CATEGORY.yellow,
	CATEGORY.gray,
];

/** A screenshot from the content, served from public/proof as its smaller -800 copy. */
const shot = (item: Shot) => ({
	caption: item.caption,
	alt: item.alt,
	src: item.src.replace(/\.webp$/, "-800.webp"),
	width: item.width,
	height: item.height,
});

/**
 * Projects from @repo/content, plus the experience sections and client projects that describe project work.
 * "This site" (the owner's own portfolio site) is left out: its words describe that site, not this one.
 */
async function listProjects() {
	const own: ProjectInput[] = projects
		.filter((project) => project.slug !== "portfolio")
		.map((project) => ({
			id: project.slug,
			title: project.name,
			tagline: project.tagline,
			category: "own",
			kind: project.kind,
			period: project.period,
			status: project.status,
			summary: project.summary,
			highlights: project.bullets,
			stack: project.tech,
			metrics: project.metrics,
			links: project.links,
			gallery: (project.gallery ?? []).map(shot),
			color: "",
		}));

	const work: ProjectInput[] = experiences.flatMap((item) =>
		item.sections
			.filter((section) => section.title === "BOS")
			.map((section) => ({
				id: `${item.slug}-${section.title.toLowerCase()}`,
				title: section.title,
				tagline: section.subtitle ?? item.company,
				category: "work" as const,
				kind: item.company,
				company: item.company,
				highlights: section.bullets.map((bullet) => rowOf(bullet).text),
				stack: section.tech ?? [],
				metrics: section.metrics ?? [],
				gallery: (section.gallery ?? []).map(shot),
				color: "",
			})),
	);

	const clients: ProjectInput[] = experiences.flatMap((item) =>
		(item.clientProjects ?? []).map((client) => ({
			id: client.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
			title: client.name,
			tagline: client.summary,
			category: "client" as const,
			kind: item.company,
			period: client.period,
			place: client.country,
			stack: client.tech,
			metrics: [],
			links: client.links ?? [],
			gallery: [],
			color: "",
		})),
	);

	const all = [...own, ...work, ...clients].map((project, index) => ({
		...project,
		color: COLORS[index % COLORS.length] ?? CATEGORY.gray,
	}));
	return projectSchema.array().parse(all);
}

export const projectsQuery = queryOptions({
	queryKey: ["projects", "list"],
	queryFn: listProjects,
});
