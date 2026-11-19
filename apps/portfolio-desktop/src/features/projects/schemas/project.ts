import { z } from "zod";

export const projectCategorySchema = z.enum(["own", "work", "client"]);

export const projectSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
	tagline: z.string(),
	category: projectCategorySchema,
	/** A label for the kind of project, e.g. "Thesis". */
	kind: z.string(),
	period: z.string().optional(),
	status: z.string().optional(),
	/** The company the work was done at. */
	company: z.string().optional(),
	/** Where the client is. */
	place: z.string().optional(),
	summary: z.string().optional(),
	highlights: z.array(z.string()).default([]),
	stack: z.array(z.string()),
	metrics: z.array(z.object({ value: z.string(), label: z.string() })),
	links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
	/** Real screenshots when `src` is set; otherwise a flat placeholder with the caption. */
	gallery: z.array(
		z.object({
			caption: z.string(),
			src: z.string().optional(),
			alt: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
		}),
	),
	/** Tile colour, any CSS colour. */
	color: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectInput = z.input<typeof projectSchema>;
export type ProjectCategory = z.infer<typeof projectCategorySchema>;
