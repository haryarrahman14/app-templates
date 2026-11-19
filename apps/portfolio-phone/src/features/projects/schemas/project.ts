import { z } from "zod";
import { colorSchema, contentIconSchema } from "@/lib/icons";

export const projectSchema = z.object({
	slug: z.string().regex(/^[a-z0-9-]+$/),
	name: z.string().min(1),
	tagline: z.string(),
	/** "2025 – 2026" */
	period: z.string(),
	/** "Thesis", "Side project" … */
	kind: z.string(),
	/** "Live", "In development", "Completed" */
	status: z.string(),
	featured: z.boolean(),
	summary: z.string(),
	/** Art only (not content): the tile's glyph and solid fill (see `COLORS` in lib/icons). */
	icon: contentIconSchema,
	color: colorSchema,
	stack: z.array(z.string()),
	metrics: z.array(z.object({ label: z.string(), value: z.string() })),
	highlights: z.array(z.string()),
	links: z.array(z.object({ label: z.string(), href: z.url() })),
	/** Real screenshots in public/proof. Empty hides the gallery. */
	gallery: z.array(
		z.object({
			src: z.string(),
			alt: z.string(),
			caption: z.string(),
			kind: z.enum(["web", "phone"]),
		}),
	),
});

export type Project = z.infer<typeof projectSchema>;
