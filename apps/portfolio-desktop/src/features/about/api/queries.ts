import { profile, skillGroups, story } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type ProfileInput, profileSchema } from "@/features/about/schemas/profile";

/** The person behind the desktop, read from @repo/content. Everything else reads from here. */
async function getProfile() {
	const input: ProfileInput = {
		name: profile.name,
		role: profile.headline,
		pitch: `${profile.intro.lines.join(" ")} ${profile.intro.more}`,
		summary: profile.summary,
		location: profile.location,
		timeZone: profile.timezone,
		email: profile.email,
		skills: skillGroups.map((group) => ({
			group: group.name,
			items: group.items,
			ongoing: group.ongoing,
		})),
		timelineTitle: story.title,
		// "Today" still says he works on MapTrack's app, which the profile and experience end (Nov 2026) contradict.
		timeline: story.chapters
			.filter((chapter) => chapter.slug !== "today")
			.map((chapter) => ({
				year: chapter.period,
				title: chapter.title,
				detail: chapter.body,
			})),
		links: profile.links.map((link) => ({ label: link.label, href: link.href })),
	};
	return profileSchema.parse(input);
}

export const profileQuery = queryOptions({
	queryKey: ["about", "profile"],
	queryFn: getProfile,
});
