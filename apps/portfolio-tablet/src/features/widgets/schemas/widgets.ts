import { z } from "zod";

/** Content that only exists on the home screen. Profile, projects, notes … come from their own apps. */
export const widgetContentSchema = z.object({
	/** The owner's own availability line, split at " · " into a headline and a detail. */
	availability: z.object({ label: z.string(), detail: z.string() }),
	/** Key figures from the record, the numeric ones only (they fit the large type). */
	stats: z.object({
		items: z
			.array(z.object({ label: z.string(), value: z.string() }))
			.min(1)
			.max(4),
	}),
	clock: z.object({ city: z.string(), timeZone: z.string() }),
});

export type WidgetContent = z.infer<typeof widgetContentSchema>;
