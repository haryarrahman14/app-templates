import { z } from "zod";

export const TOPICS = ["New project", "Full-time role", "Just saying hi"] as const;

export const contactMessageSchema = z.object({
	name: z.string().trim().min(2, "Tell me your name (at least 2 characters)."),
	email: z.email("That email doesn't look right."),
	topic: z.enum(TOPICS, "Pick what this is about."),
	message: z
		.string()
		.trim()
		.min(20, "A little more detail helps (20 characters or more).")
		.max(2000, "Keep it under 2000 characters."),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

export const contactInfoSchema = z.object({
	email: z.email(),
	location: z.string(),
	availability: z.string(),
	/** GitHub and LinkedIn. */
	links: z.array(z.object({ label: z.string(), handle: z.string(), url: z.url() })),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;
