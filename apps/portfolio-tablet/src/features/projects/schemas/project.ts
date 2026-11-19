import { z } from "zod";
import { swatchSchema } from "@/lib/palette";

/** A real screenshot under `public/` (the 800px variant), with its own caption. */
export const shotSchema = z.object({
	src: z.string().startsWith("/"),
	alt: z.string(),
	caption: z.string(),
	/** Width / height. */
	ratio: z.number().positive(),
	kind: z.enum(["web", "phone"]),
});

export const projectSchema = z.object({
	slug: z.string().regex(/^[a-z0-9-]+$/),
	title: z.string().min(1),
	tagline: z.string(),
	/** Thesis, Side project, Community … */
	category: z.string(),
	year: z.string(),
	status: z.string(),
	/** One sentence. Shown in lists, the featured widget and the server-rendered project list. */
	summary: z.string(),
	bullets: z.array(z.string()),
	stack: z.array(z.string()),
	metrics: z.array(z.object({ label: z.string(), value: z.string() })),
	links: z.array(z.object({ label: z.string(), url: z.url() })),
	/** Palette swatch for the cover when there is no screenshot. Design only. */
	swatch: swatchSchema,
	gallery: z.array(shotSchema),
	featured: z.boolean().default(false),
});

export type Shot = z.infer<typeof shotSchema>;
export type Project = z.infer<typeof projectSchema>;
