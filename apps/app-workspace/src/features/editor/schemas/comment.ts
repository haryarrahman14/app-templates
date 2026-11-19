import { z } from "zod";

export const commentSchema = z.object({
	id: z.string(),
	docId: z.string(),
	authorId: z.string(),
	authorName: z.string(),
	authorTint: z.string(),
	body: z.string(),
	createdAt: z.string(),
});
export type Comment = z.infer<typeof commentSchema>;

export const newCommentSchema = z.object({
	body: z
		.string()
		.trim()
		.min(1, "Write something first.")
		.max(1000, "Keep comments under 1000 characters."),
});
export type NewComment = z.infer<typeof newCommentSchema>;
