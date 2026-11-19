import { z } from "zod";

export const emailDraftSchema = z.object({
	to: z.array(z.email()).min(1, "Add at least one recipient"),
	subject: z
		.string()
		.trim()
		.min(1, "Add a subject")
		.max(160, "Keep the subject under 160 characters"),
	body: z.string().max(10_000),
});
export type EmailDraft = z.infer<typeof emailDraftSchema>;
