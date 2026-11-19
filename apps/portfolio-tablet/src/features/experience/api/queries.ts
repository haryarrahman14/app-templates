import { education, experiences, formatYearMonth, profile, rowOf } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Experience, experienceSchema } from "@/features/experience/schemas/experience";

const month = (ym: string | null) => (ym ? formatYearMonth(ym) : undefined);

/** The work record from `@repo/content`, in its CV order. "Download CV" links to the real PDF. */
async function getExperience() {
	const experience: Experience = {
		name: profile.name,
		headline: profile.headline,
		cv: { href: profile.cv.href, fileName: profile.cv.fileName, sizeLabel: profile.cv.sizeLabel },
		roles: experiences.map((e) => ({
			company: e.company,
			companyUrl: e.companyUrl,
			start: formatYearMonth(e.start),
			end: month(e.end),
			location: [e.location, e.workMode]
				.filter((x, i, all) => x && all.indexOf(x) === i)
				.join(" · "),
			positions: e.roles.map((r) => ({
				title: r.title,
				start: formatYearMonth(r.start),
				end: month(r.end),
			})),
			summary: e.summary,
			sections: e.sections.map((s) => ({
				title: s.title,
				subtitle: s.subtitle,
				ongoing: s.status === "ongoing",
				bullets: s.bullets.map((b) => {
					const row = rowOf(b);
					return { text: row.text, ongoing: row.status === "ongoing" };
				}),
			})),
			clientProjects: (e.clientProjects ?? []).map((c) => ({
				name: c.name,
				country: c.country,
				period: c.period,
				summary: c.summary,
			})),
			tags: e.tech,
		})),
		education: education.map((e) => ({
			school: e.school,
			degree: e.degree,
			years: `${formatYearMonth(e.start)} – ${formatYearMonth(e.end)}${e.expected ? " (expected)" : ""}`,
		})),
	};
	return experienceSchema.parse(experience);
}

export const experienceQuery = queryOptions({
	queryKey: ["experience"],
	queryFn: getExperience,
});
