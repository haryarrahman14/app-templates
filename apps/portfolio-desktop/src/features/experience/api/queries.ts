import {
	education,
	experiences,
	formatYearMonth,
	profile,
	rowOf,
	type YearMonth,
} from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type ExperienceInput, experienceSchema } from "@/features/experience/schemas/experience";

const period = (start: YearMonth, end: YearMonth | null) =>
	`${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "present"}`;

/** Work history and education, read from @repo/content, in the CV's order. */
async function getExperience() {
	const input: ExperienceInput = {
		headline: profile.summary[0],
		roles: experiences.map((item) => {
			const [current, ...earlier] = item.roles;
			const groups = item.sections.map((section) => ({
				title: section.title,
				ongoing: section.status === "ongoing",
				highlights: section.bullets.map((bullet) => {
					const row = rowOf(bullet);
					return row.status === "ongoing" ? `${row.text} (in development)` : row.text;
				}),
			}));
			const clients = (item.clientProjects ?? []).map(
				(client) =>
					`${client.name}${client.country ? ` (${client.country})` : ""}, ${client.period}: ${client.summary}`,
			);
			return {
				company: item.company,
				title: current?.title ?? item.employmentType,
				period: period(item.start, item.end),
				location:
					[...new Set([item.location, item.workMode].filter(Boolean))].join(" · ") || undefined,
				earlier: earlier.map((role) => ({
					title: role.title,
					period: period(role.start, role.end),
				})),
				groups: clients.length ? [...groups, { highlights: clients }] : groups,
			};
		}),
		education: education.map((item) => ({
			school: item.school,
			degree: item.degree,
			period: `${formatYearMonth(item.start)} – ${formatYearMonth(item.end)}${item.expected ? " (expected)" : ""}`,
			detail: [...(item.gpa ? [`GPA ${item.gpa}`] : []), ...item.notes],
		})),
		cvUrl: profile.cv.href,
		cvFileName: profile.cv.fileName,
	};
	return experienceSchema.parse(input);
}

export const experienceQuery = queryOptions({
	queryKey: ["experience"],
	queryFn: getExperience,
});
