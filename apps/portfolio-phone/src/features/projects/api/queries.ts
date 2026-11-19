import { profile, projects } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Project, projectSchema } from "@/features/projects/schemas/project";
import { shotSrc } from "@/lib/content";
import { projectArt } from "@/lib/icons";

/**
 * The record calls his portfolio "This site", in the words of that site. Here it is another site, so it
 * goes by its address (`profile.site`) and its summary drops the "you're reading" lead.
 */
const OWN_SITE = "portfolio";
const siteHost = profile.site.replace(/^https?:\/\//, "");
const selfReference = /^The site you’re reading: (.)/;

/** Projects, read from `@repo/content` (packages/content). Replace that package's data to reuse the template. */
async function listProjects(): Promise<Project[]> {
	return projectSchema.array().parse(
		projects.map((item, index) => {
			const own = item.slug === OWN_SITE;
			return {
				slug: item.slug,
				name: own ? siteHost : item.name,
				tagline: item.tagline,
				period: item.period,
				kind: item.kind,
				status: item.status,
				featured: item.featured,
				summary: own
					? item.summary.replace(selfReference, (_, first: string) => first.toUpperCase())
					: item.summary,
				...projectArt(item.slug, index),
				stack: item.tech,
				metrics: item.metrics.map((metric) => ({ label: metric.label, value: metric.value })),
				highlights: item.bullets,
				links: own && !item.links.length ? [{ label: siteHost, href: profile.site }] : item.links,
				gallery: (item.gallery ?? []).map((shot) => ({
					src: shotSrc(shot),
					alt: shot.alt,
					caption: shot.caption,
					kind: shot.kind,
				})),
			} satisfies Project;
		}),
	);
}

export const projectsQuery = queryOptions({
	queryKey: ["projects"],
	queryFn: listProjects,
});
