import { z } from "zod";
import { colorSchema, contentIconSchema } from "@/lib/icons";

export const homeWidgetsSchema = z.object({
	/** Counted from the record, never typed in. */
	stats: z.array(z.object({ label: z.string(), value: z.string() })).length(3),
	featured: z
		.object({
			projectSlug: z.string(),
			title: z.string(),
			blurb: z.string(),
			color: colorSchema,
			icon: contentIconSchema,
		})
		.nullable(),
	latestNote: z.object({ noteSlug: z.string(), title: z.string(), excerpt: z.string() }).nullable(),
	askPrompt: z.string(),
});

export type HomeWidgets = z.infer<typeof homeWidgetsSchema>;
