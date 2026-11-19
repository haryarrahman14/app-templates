import { z } from "zod";

export const fileFolderSchema = z.object({
	id: z.string().regex(/^[a-z0-9-]+$/),
	name: z.string(),
	description: z.string(),
});

const previewSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("markdown"), body: z.string() }),
	/** A real PDF under `public/`, shown inline with an open/download link. */
	z.object({ type: z.literal("pdf"), href: z.string().startsWith("/"), fileName: z.string() }),
]);

export const fileSchema = z.object({
	id: z.string(),
	folder: z.string(),
	name: z.string(),
	kind: z.enum(["doc", "pdf"]),
	size: z.string(),
	/** ISO date. Omitted when the document has no date of its own. */
	modified: z.iso.date().optional(),
	preview: previewSchema,
});

export const fileSystemSchema = z.object({
	folders: z.array(fileFolderSchema),
	files: z.array(fileSchema),
});

export type FileFolder = z.infer<typeof fileFolderSchema>;
export type FileItem = z.infer<typeof fileSchema>;
export type FileSystem = z.infer<typeof fileSystemSchema>;
