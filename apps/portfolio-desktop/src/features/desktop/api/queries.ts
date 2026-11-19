import { experiences, formatYearMonth, github, keyFigures, profile } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Widgets, widgetsSchema } from "@/features/desktop/schemas/widgets";

/** What the desktop widgets say, read from @repo/content. A widget with no fact behind it is left out. */
async function getWidgets() {
	const [title = profile.availability, ...rest] = profile.availability.split(" · ");
	// The employment that ended last (or is still running).
	const latest = experiences
		.filter((item) => item.kind === "employment")
		.sort((a, b) => (b.end ?? "9999").localeCompare(a.end ?? "9999"))[0];
	const role = latest?.roles[0];

	const widgets: Widgets = {
		availability: { title, detail: rest.join(" · ") || undefined },
		latestRole:
			latest && role
				? {
						title: role.title,
						company: latest.company,
						period: `${formatYearMonth(role.start)} – ${role.end ? formatYearMonth(role.end) : "present"}`,
					}
				: undefined,
		github: {
			handle: github.login,
			url: github.url,
			contributions: github.contributions.total,
			period: `${formatYearMonth(github.contributions.from.slice(0, 7))} – ${formatYearMonth(github.contributions.to.slice(0, 7))}`,
		},
		// Only the figures that are numbers.
		stats: keyFigures.filter((figure) => /^[~\d]/.test(figure.value)).slice(0, 3),
	};
	return widgetsSchema.parse(widgets);
}

export const widgetsQuery = queryOptions({
	queryKey: ["desktop", "widgets"],
	queryFn: getWidgets,
});
