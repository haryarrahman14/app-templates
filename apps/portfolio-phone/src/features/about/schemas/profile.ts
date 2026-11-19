import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().min(1),
	initials: z.string().min(1).max(3),
	/** Public title, e.g. shown under the name everywhere. */
	headline: z.string(),
	location: z.string(),
	timezone: z.string(),
	/** One-paragraph pitch: the first paragraph of the summary. */
	pitch: z.string(),
	email: z.email(),
	/** The full summary, one string per paragraph. */
	bio: z.array(z.string()),
	/** How he is open to work, in his words. Empty hides every availability slot. */
	availability: z.string(),
	links: z.array(
		z.object({
			kind: z.enum(["github", "linkedin", "email"]),
			label: z.string(),
			handle: z.string(),
			href: z.string(),
		}),
	),
	skills: z.array(
		z.object({
			group: z.string(),
			items: z.array(z.string()),
			/** Items used only in work not released yet: labelled as such. */
			ongoing: z.array(z.string()),
		}),
	),
	education: z.array(
		z.object({
			school: z.string(),
			degree: z.string(),
			period: z.string(),
			detail: z.string(),
		}),
	),
	facts: z.array(z.object({ label: z.string(), value: z.string() })),
});

export type Profile = z.infer<typeof profileSchema>;
