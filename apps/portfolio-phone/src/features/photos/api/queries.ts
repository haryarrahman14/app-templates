import { type Shot as ContentShot, experiences, projects } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Shot, shotSchema } from "@/features/photos/schemas/shot";
import { shotId, shotSrc } from "@/lib/content";

const toShot = (shot: ContentShot, project: string, projectSlug?: string): Shot => ({
	id: shotId(shot),
	title: shot.caption,
	alt: shot.alt,
	project,
	projectSlug,
	kind: shot.kind,
	src: shotSrc(shot),
});

/**
 * Every real screenshot in `@repo/content` (packages/content, files copied to public/proof): each
 * project's gallery, then each company's gallery and its bodies of work. Replace that package's data
 * (and the files) to reuse the template.
 */
async function listShots(): Promise<Shot[]> {
	const fromProjects = projects.flatMap((project) =>
		(project.gallery ?? []).map((shot) => toShot(shot, project.name, project.slug)),
	);
	const fromWork = experiences.flatMap((item) => [
		...(item.gallery ?? []).map((shot) => toShot(shot, item.company)),
		...item.sections.flatMap((section) =>
			(section.gallery ?? []).map((shot) =>
				toShot(
					shot,
					`${item.company} · ${section.title}${section.status === "ongoing" ? " (ongoing)" : ""}`,
				),
			),
		),
	]);
	return shotSchema.array().parse([...fromProjects, ...fromWork]);
}

export const shotsQuery = queryOptions({
	queryKey: ["photos", "shots"],
	queryFn: listShots,
});
