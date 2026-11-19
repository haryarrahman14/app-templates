import { z } from "zod";

export const noteSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
	/** ISO date, e.g. "2026-10-02". */
	date: z.iso.date(),
	pinned: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
	/** One line for the list preview; the body's first line when empty. */
	excerpt: z.string().optional(),
	/** Markdown. Headings, lists, quotes, code, images and emphasis are styled. */
	body: z.string(),
});

export type Note = z.infer<typeof noteSchema>;
export type NoteInput = z.input<typeof noteSchema>;
