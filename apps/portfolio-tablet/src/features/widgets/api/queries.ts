import { keyFigures, profile } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type WidgetContent, widgetContentSchema } from "@/features/widgets/schemas/widgets";

/** Home-screen-only content, from `@repo/content`. */
async function getWidgetContent() {
	const [label = profile.availability, ...detail] = profile.availability.split(" · ");
	const content: WidgetContent = {
		availability: { label, detail: detail.join(" · ") },
		stats: { items: keyFigures.filter((f) => /^[~\d]/.test(f.value)).slice(0, 4) },
		clock: { city: profile.location.split(",")[0] ?? profile.location, timeZone: profile.timezone },
	};
	return widgetContentSchema.parse(content);
}

export const widgetContentQuery = queryOptions({
	queryKey: ["widgets"],
	queryFn: getWidgetContent,
});
