import {
	profile as content,
	education,
	formatYearMonth,
	keyFigures,
	skillGroups,
} from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Profile, profileSchema } from "@/features/about/schemas/profile";

/**
 * The phone's owner, read from `@repo/content` (packages/content). The side panel, lock screen,
 * home widgets and About all read this. Replace that package's data to reuse the template.
 */
async function getProfile(): Promise<Profile> {
	return profileSchema.parse({
		name: content.name,
		initials: content.initials,
		headline: content.headline,
		location: content.location,
		timezone: content.timezone,
		pitch: content.summary[0],
		email: content.email,
		bio: content.summary,
		availability: content.availability,
		links: content.links.map(({ kind, label, handle, href }) => ({ kind, label, handle, href })),
		skills: skillGroups.map((group) => ({
			group: group.name,
			items: group.items,
			ongoing: group.ongoing,
		})),
		education: education.map((item) => ({
			school: item.school,
			degree: item.degree,
			period: `${formatYearMonth(item.start)} – ${formatYearMonth(item.end)}${item.expected ? " (expected)" : ""}`,
			detail: [item.gpa ? `GPA ${item.gpa}` : null, ...item.notes].filter(Boolean).join(" · "),
		})),
		facts: keyFigures.map((figure) => ({ label: figure.label, value: figure.value })),
	} satisfies Profile);
}

export const profileQuery = queryOptions({
	queryKey: ["about", "profile"],
	queryFn: getProfile,
});
