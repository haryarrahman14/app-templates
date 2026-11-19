import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().min(1),
	/** The public title, e.g. in the Welcome window and the page title. */
	role: z.string().min(1),
	/** One short paragraph for the Welcome window. */
	pitch: z.string().min(1),
	/** Longer paragraphs for About; the first is the meta description. */
	summary: z.array(z.string()).min(1),
	location: z.string(),
	timeZone: z.string(),
	email: z.email(),
	skills: z.array(
		z.object({
			group: z.string(),
			items: z.array(z.string()),
			/** Items used only in work not released yet: labelled in the UI. */
			ongoing: z.array(z.string()).default([]),
		}),
	),
	/** The story: one entry per chapter. */
	timelineTitle: z.string(),
	timeline: z.array(z.object({ year: z.string(), title: z.string(), detail: z.string() })),
	links: z.array(z.object({ label: z.string(), href: z.string() })),
});

export type Profile = z.infer<typeof profileSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
