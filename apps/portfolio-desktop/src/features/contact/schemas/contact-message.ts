import { z } from "zod";

export const contactMessageSchema = z.object({
	name: z.string().trim().min(2, "Tell me your name."),
	email: z.email("That email doesn't look right."),
	subject: z.string().trim().min(3, "Add a short subject."),
	message: z
		.string()
		.trim()
		.min(20, "A little more detail, please (20 characters or more).")
		.max(2000, "Keep it under 2,000 characters."),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
