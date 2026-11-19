import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().min(1),
	initials: z.string().min(1).max(3),
	/** The headline under the name. */
	role: z.string().min(1),
	/** One or two sentences. Used in the profile widget and the meta description. */
	pitch: z.string().min(1),
	location: z.string(),
	timezone: z.string(),
	/** Whether and how the owner is open to work, in their words. */
	availability: z.string(),
	email: z.email(),
	links: z.array(z.object({ label: z.string(), handle: z.string(), url: z.url() })),
	cv: z.object({ href: z.string(), fileName: z.string(), sizeLabel: z.string() }),
});

/** Plain lists: no proficiency ratings. `ongoing` items are used only in work not released yet. */
export const skillGroupSchema = z.object({
	title: z.string(),
	items: z.array(z.string()),
	ongoing: z.array(z.string()),
});

export const milestoneSchema = z.object({
	year: z.string(),
	period: z.string(),
	title: z.string(),
	body: z.string(),
});

export const educationSchema = z.object({
	school: z.string(),
	degree: z.string(),
	years: z.string(),
	gpa: z.string().optional(),
	notes: z.array(z.string()),
});

export const aboutSchema = z.object({
	profile: profileSchema,
	bio: z.array(z.string()),
	skills: z.array(skillGroupSchema),
	timeline: z.object({ title: z.string(), items: z.array(milestoneSchema) }),
	education: z.array(educationSchema),
});

export type Profile = z.infer<typeof profileSchema>;
export type About = z.infer<typeof aboutSchema>;
