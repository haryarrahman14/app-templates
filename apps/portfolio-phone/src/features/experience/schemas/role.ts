import { z } from "zod";

export const roleSchema = z.object({
	id: z.string(),
	/** The latest title at the company. */
	title: z.string(),
	company: z.string(),
	/** "Aug 2024 – Nov 2026"; "present" when it has no end. */
	period: z.string(),
	current: z.boolean(),
	/** "Full-time · Remote · Australia"; empty when the record has none. */
	meta: z.string(),
	summary: z.string(),
	/** Earlier titles at the same company, newest first. */
	earlier: z.array(z.object({ title: z.string(), period: z.string() })),
	/** The work, grouped as the record groups it. */
	sections: z.array(
		z.object({
			title: z.string(),
			/** Not released yet: always labelled. */
			ongoing: z.boolean(),
			highlights: z.array(z.string()),
		}),
	),
});

export const cvSchema = z.object({
	roles: z.array(roleSchema),
	/** "Apr 2021": when the record starts. */
	since: z.string(),
	education: z.array(z.object({ title: z.string(), school: z.string(), year: z.string() })),
	/** Path or URL of the PDF; null keeps the button as a stub. */
	cvUrl: z.string().nullable(),
	/** "PDF · 4 pages · 136 KB"; empty when unknown. */
	cvLabel: z.string(),
});

export type Role = z.infer<typeof roleSchema>;
export type Cv = z.infer<typeof cvSchema>;
