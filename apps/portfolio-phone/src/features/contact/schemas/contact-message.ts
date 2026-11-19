import { z } from "zod";

export const CONTACT_TOPICS = ["Project", "Job", "Just hello"] as const;

export const contactMessageSchema = z.object({
	name: z.string().trim().min(2, "Add your name (2+ letters)."),
	email: z.email("That email doesn't look right."),
	topic: z.enum(CONTACT_TOPICS),
	message: z
		.string()
		.trim()
		.min(20, "A sentence or two, please (20+ characters).")
		.max(1000, "Keep it under 1000 characters."),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
