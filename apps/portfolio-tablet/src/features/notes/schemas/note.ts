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
	/** Markdown. */
	body: z.string(),
});

export const notebookSchema = z.object({
	folders: z.array(noteFolderSchema),
	notes: z.array(noteSchema),
});

export type NoteFolder = z.infer<typeof noteFolderSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Notebook = z.infer<typeof notebookSchema>;
