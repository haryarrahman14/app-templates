import { z } from "zod";

export const widgetsSchema = z.object({
	availability: z.object({ title: z.string(), detail: z.string().optional() }),
	latestRole: z.object({ title: z.string(), company: z.string(), period: z.string() }).optional(),
	github: z
		.object({
			handle: z.string(),
			url: z.url(),
			contributions: z.number(),
			/** The span the count covers. */
			period: z.string(),
		})
		.optional(),
	stats: z.array(z.object({ value: z.string(), label: z.string() })).max(4),
});

export type Widgets = z.infer<typeof widgetsSchema>;
