import { z } from "zod";

/** One real screenshot of the owner's work, served from `public/proof`. */
export const artworkSchema = z.object({
	id: z.string().regex(/^[a-z0-9-]+$/),
	src: z.string().startsWith("/"),
	alt: z.string(),
	/** The screenshot's own caption. */
	caption: z.string(),
	/** The company or project it belongs to. */
	source: z.string(),
	/** Width / height. Drives the masonry rhythm. */
	ratio: z.number().positive(),
	kind: z.enum(["web", "phone"]),
});

export type Artwork = z.infer<typeof artworkSchema>;
