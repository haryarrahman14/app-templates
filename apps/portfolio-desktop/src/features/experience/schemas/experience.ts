import { z } from "zod";

export const roleSchema = z.object({
	company: z.string(),
	title: z.string(),
	period: z.string(),
	location: z.string().optional(),
	/** Earlier titles at the same company, newest first. */
	earlier: z.array(z.object({ title: z.string(), period: z.string() })).default([]),
	/** Bodies of work at this company; a group without a title is the whole role. */
	groups: z.array(
		z.object({
			title: z.string().optional(),
			/** Work not released yet: labelled in the UI. */
			ongoing: z.boolean().default(false),
			highlights: z.array(z.string()),
		}),
	),
});

export const experienceSchema = z.object({
	headline: z.string(),
	roles: z.array(roleSchema),
	education: z.array(
		z.object({
			school: z.string(),
			degree: z.string(),
			period: z.string(),
			detail: z.array(z.string()).default([]),
		}),
	),
	/** Optional URL of a real CV file. When empty, the button downloads a generated plain-text CV. */
	cvUrl: z.string().optional(),
	/** File name for the downloaded CV. */
	cvFileName: z.string().optional(),
});

export type Experience = z.infer<typeof experienceSchema>;
export type ExperienceInput = z.input<typeof experienceSchema>;
export type Role = z.infer<typeof roleSchema>;
