import { z } from "zod";

export const noteSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
	/** ISO date, e.g. "2026-10-02". */
	date: z.iso.date(),
	/** `pinned: true` in the frontmatter: listed first, with a quiet "Pinned" mark. */
	pinned: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
	/** `stack: React, TypeScript, …` in the frontmatter: shown as "Built with" after the text. */
	stack: z.array(z.string()).default([]),
	/** One line for the list preview; the body's first line when empty. */
	excerpt: z.string().optional(),
	/** Markdown. Headings, lists, quotes, code, images and emphasis are styled. */
	body: z.string(),
});

/** A `##` heading of a note body; `line` is its 1-based line in the body, as the Markdown renderer reports it. */
export const noteHeadingSchema = z.object({
	id: z.string(),
	text: z.string(),
	line: z.number().int().positive(),
});

/** A picture of a note body. `caption` is the italic line right under it, if any. */
export const notePictureSchema = z.object({
	src: z.string(),
	alt: z.string(),
	caption: z.string().optional(),
	line: z.number().int().positive(),
});

export type Note = z.infer<typeof noteSchema>;
export type NoteInput = z.input<typeof noteSchema>;
export type NoteHeading = z.infer<typeof noteHeadingSchema>;
export type NotePicture = z.infer<typeof notePictureSchema>;
