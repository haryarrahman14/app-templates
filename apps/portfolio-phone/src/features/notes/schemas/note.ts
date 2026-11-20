import { z } from "zod";

/** A picture in a note's Markdown, in reading order. */
export const notePictureSchema = z.object({
	src: z.string().min(1),
	alt: z.string(),
	/** The italic line right under the picture, if there is one. */
	caption: z.string().optional(),
});

export const noteSchema = z.object({
	slug: z.string().regex(/^[a-z0-9-]+$/),
	title: z.string().min(1),
	/** ISO date, e.g. 2026-11-18. */
	date: z.iso.date(),
	excerpt: z.string(),
	tags: z.array(z.string()),
	/** `pinned: true` in the frontmatter: listed first, with a Pinned mark. */
	pinned: z.boolean(),
	/** `stack: React, TypeScript, …` in the frontmatter: shown as "Built with" after the text. */
	stack: z.array(z.string().min(1)),
	/** Markdown. */
	body: z.string(),
	pictures: z.array(notePictureSchema),
});

export type Note = z.infer<typeof noteSchema>;
export type NotePicture = z.infer<typeof notePictureSchema>;
