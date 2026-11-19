import { profile, projects } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type HomeWidgets, homeWidgetsSchema } from "@/features/home-screen/schemas/widgets";
import { englishPosts } from "@/lib/content";
import { projectArt } from "@/lib/icons";

/**
 * What the home-screen widgets say, from `@repo/content` (packages/content). The profile and
 * availability widgets read the owner profile (features/about). A widget whose fact is missing hides.
 */
async function getWidgets(): Promise<HomeWidgets> {
	const index = projects.findIndex((project) => project.featured);
	const featured = projects[index];
	const latest = englishPosts[0];
	return homeWidgetsSchema.parse({
		stats: [
			{ label: "Projects", value: String(projects.length) },
			{ label: englishPosts.length === 1 ? "Post" : "Posts", value: String(englishPosts.length) },
			{ label: "Since", value: profile.careerStart.slice(0, 4) },
		],
		featured: featured
			? {
					projectSlug: featured.slug,
					title: featured.name,
					blurb: featured.tagline,
					...projectArt(featured.slug, index),
				}
			: null,
		latestNote: latest
			? { noteSlug: latest.slug, title: latest.title, excerpt: latest.excerpt }
			: null,
		askPrompt: "Ask about my work, where I’ve worked, or how to reach me.",
	} satisfies HomeWidgets);
}

export const homeWidgetsQuery = queryOptions({
	queryKey: ["home-screen", "widgets"],
	queryFn: getWidgets,
});
