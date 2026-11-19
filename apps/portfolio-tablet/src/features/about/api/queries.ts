import { education, formatYearMonth, profile, skillGroups, story } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type About, aboutSchema } from "@/features/about/schemas/about";

/**
 * Story chapters shown in the timeline. "today" is left out: it still describes the MapTrack role, which
 * the profile says ended in Nov 2026.
 */
const STALE_CHAPTERS = new Set(["today"]);

/** Everything here comes from `@repo/content`; replace that package's data to reuse the template. */
async function getAbout() {
	const about: About = {
		profile: {
			name: profile.name,
			initials: profile.initials,
			role: profile.headline,
			pitch: profile.summary[0],
			location: profile.location,
			timezone: profile.timezone,
			availability: profile.availability,
			email: profile.email,
			links: profile.links.map((l) => ({ label: l.label, handle: l.handle, url: l.href })),
			cv: {
				href: profile.cv.href,
				fileName: profile.cv.fileName,
				sizeLabel: profile.cv.sizeLabel,
			},
		},
		bio: [...profile.summary],
		skills: skillGroups.map((g) => ({ title: g.name, items: g.items, ongoing: g.ongoing })),
		timeline: {
			title: story.title,
			items: story.chapters
				.filter((c) => !STALE_CHAPTERS.has(c.slug))
				.map((c) => ({ year: c.year, period: c.period, title: c.title, body: c.body })),
		},
		education: education.map((e) => ({
			school: e.school,
			degree: e.degree,
			years: `${formatYearMonth(e.start)} – ${formatYearMonth(e.end)}${e.expected ? " (expected)" : ""}`,
			gpa: e.gpa,
			notes: e.notes,
		})),
	};
	return aboutSchema.parse(about);
}

export const aboutQuery = queryOptions({
	queryKey: ["about"],
	queryFn: getAbout,
});
