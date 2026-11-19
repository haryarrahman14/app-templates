import { z } from "zod";

export const noteSchema = z.object({
	slug: z.string().regex(/^[a-z0-9-]+$/),
	title: z.string().min(1),
	/** ISO date, e.g. 2026-11-18. */
	date: z.iso.date(),
	excerpt: z.string(),
	tags: z.array(z.string()),
	/** Markdown. */
	body: z.string(),
});

export type Note = z.infer<typeof noteSchema>;
