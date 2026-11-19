import {
	type Bullet,
	profile as content,
	education,
	experiences,
	formatYearMonth,
	type YearMonth,
} from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Cv, cvSchema, type Role } from "@/features/experience/schemas/role";

const period = (start: YearMonth, end: YearMonth | null) =>
	`${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "present"}`;

const bulletText = (bullet: Bullet) =>
	typeof bullet === "string"
		? bullet
		: `${bullet.text}${bullet.status === "ongoing" ? " (ongoing)" : ""}`;

/**
 * The work record, read from `@repo/content` (packages/content): experiences in CV order, education,
 * and the CV PDF in public/cv/. Replace that package's data to reuse the template.
 */
async function getCv(): Promise<Cv> {
	const roles: Role[] = experiences.map((item) => {
		const [latest, ...earlier] = item.roles;
		const sections = item.sections.map((section) => ({
			title: section.subtitle ? `${section.title} · ${section.subtitle}` : section.title,
			ongoing: section.status === "ongoing",
			highlights: section.bullets.map(bulletText),
		}));
		if (item.clientProjects?.length) {
			sections.push({
				title: "Client projects",
				ongoing: false,
				highlights: item.clientProjects.map(
					(client) =>
						`${client.name}${client.country ? ` (${client.country})` : ""}, ${client.period}: ${client.summary}`,
				),
			});
		}
		return {
			id: item.slug,
			title: latest?.title ?? item.employmentType,
			company: item.company,
			period: period(item.start, item.end),
			current: item.end === null,
			meta: [item.employmentType, item.workMode, item.location].filter(Boolean).join(" · "),
			summary: item.summary,
			earlier: earlier.map((role) => ({ title: role.title, period: period(role.start, role.end) })),
			sections,
		};
	});

	return cvSchema.parse({
		roles,
		since: formatYearMonth(content.careerStart),
		education: education.map((item) => ({
			title: item.degree,
			school: item.school,
			year: `${formatYearMonth(item.start)} – ${formatYearMonth(item.end)}${item.expected ? " (expected)" : ""}`,
		})),
		cvUrl: content.cv.href,
		cvLabel: `PDF · ${content.cv.pages} pages · ${content.cv.sizeLabel}`,
	} satisfies Cv);
}

export const cvQuery = queryOptions({
	queryKey: ["experience", "cv"],
	queryFn: getCv,
});
