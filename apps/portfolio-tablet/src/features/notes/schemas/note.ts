import { z } from "zod";

export const noteFolderSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export const noteSchema = z.object({
	id: z.string().regex(/^[a-z0-9-]+$/),
	folder: z.string(),
	title: z.string().min(1),
	/** ISO date (YYYY-MM-DD). Omitted for a note that has no date of its own. */
	date: z.iso.date().optional(),
	pinned: z.boolean().default(false),
	/** One line for lists and the widget; the first line of the body when omitted. */
	excerpt: z.string().optional(),
	/** What the note's project is built with (`stack:` in a post's frontmatter), shown after the text. */
	stack: z.array(z.string().min(1)).default([]),
	/** Markdown. */
	body: z.string(),
});

/** A `##` heading of a note, for the "On this note" outline. `id` is the anchor in the reading pane. */
export const noteHeadingSchema = z.object({
	id: z.string().min(1),
	text: z.string().min(1),
});

/** A picture in a note, for the full-screen viewer. `caption` is the italic line right under it, if any. */
export const notePictureSchema = z.object({
	src: z.string().min(1),
	alt: z.string(),
	caption: z.string().optional(),
});

export const notebookSchema = z.object({
	folders: z.array(noteFolderSchema),
	notes: z.array(noteSchema),
});

export type NoteFolder = z.infer<typeof noteFolderSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Notebook = z.infer<typeof notebookSchema>;
export type NoteHeading = z.infer<typeof noteHeadingSchema>;
export type NotePicture = z.infer<typeof notePictureSchema>;
