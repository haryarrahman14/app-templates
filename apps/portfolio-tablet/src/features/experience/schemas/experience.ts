import { z } from "zod";

const bulletSchema = z.object({
	text: z.string(),
	/** Built or in progress, not released: always labelled. */
	ongoing: z.boolean(),
});

export const roleSchema = z.object({
	company: z.string(),
	companyUrl: z.url().optional(),
	/** "Aug 2024", or "2018" for coarse dates. */
	start: z.string(),
	/** Omit for a current role. */
	end: z.string().optional(),
	location: z.string(),
	/** Titles inside the company, newest first. */
	positions: z.array(
		z.object({ title: z.string(), start: z.string(), end: z.string().optional() }),
	),
	summary: z.string(),
	sections: z.array(
		z.object({
			title: z.string(),
			subtitle: z.string().optional(),
			ongoing: z.boolean(),
			bullets: z.array(bulletSchema),
		}),
	),
	clientProjects: z.array(
		z.object({
			name: z.string(),
			country: z.string().optional(),
			period: z.string(),
			summary: z.string(),
		}),
	),
	tags: z.array(z.string()),
});

export const educationSchema = z.object({
	school: z.string(),
	degree: z.string(),
	years: z.string(),
});

export const experienceSchema = z.object({
	name: z.string(),
	headline: z.string(),
	cv: z.object({ href: z.string().startsWith("/"), fileName: z.string(), sizeLabel: z.string() }),
	roles: z.array(roleSchema),
	education: z.array(educationSchema),
});

export type Role = z.infer<typeof roleSchema>;
export type Experience = z.infer<typeof experienceSchema>;
