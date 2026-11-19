import { z } from "zod";

export const shotSchema = z.object({
	id: z.string().regex(/^[a-z0-9-]+$/),
	/** The record's caption, word for word. */
	title: z.string(),
	alt: z.string(),
	/** The group it shows under: a project, or a company (and body of work). */
	project: z.string(),
	/** Slug in Projects, so a shot can link to its case study. */
	projectSlug: z.string().optional(),
	kind: z.enum(["web", "phone"]),
	/** A real screenshot: a path in public/ or a URL. */
	src: z.string(),
});

export type Shot = z.infer<typeof shotSchema>;
