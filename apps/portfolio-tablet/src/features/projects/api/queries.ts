import { projects } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Project, projectSchema } from "@/features/projects/schemas/project";
import type { Swatch } from "@/lib/palette";
import { shotOf } from "@/lib/proof";

/**
 * Projects from `@repo/content`. "portfolio" is left out: its words describe his own site ("the site
 * you're reading"), which this page is not. The first `featured: true` project fills the featured widget.
 */
const LEFT_OUT = new Set(["portfolio"]);
const SWATCHES: Swatch[] = ["teal", "blue", "orange", "graphite"];

async function listProjects() {
	const list: Project[] = projects
		.filter((p) => !LEFT_OUT.has(p.slug))
		.map((p, i) => ({
			slug: p.slug,
			title: p.name,
			tagline: p.tagline,
			category: p.kind,
			year: p.period,
			status: p.status,
			summary: p.summary,
			bullets: p.bullets,
			stack: p.tech,
			metrics: p.metrics,
			links: p.links.map((l) => ({ label: l.label, url: l.href })),
			swatch: SWATCHES[i % SWATCHES.length] ?? "teal",
			gallery: (p.gallery ?? []).map(shotOf),
			featured: p.featured,
		}));
	return projectSchema.array().parse(list);
}

export const projectsQuery = queryOptions({
	queryKey: ["projects"],
	queryFn: listProjects,
});
