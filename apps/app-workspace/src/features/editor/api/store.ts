import { type Comment, commentSchema } from "@/features/editor/schemas/comment";
import { createCollection, relativeIso } from "@/lib/mock-db";

export const commentsStore = createCollection<Comment>("comments", commentSchema, () => [
	{
		id: "c-1",
		docId: "d-welcome",
		authorId: "u-ines",
		authorName: "Ines Calloway",
		authorTint: "orange",
		body: "Love this. Can we add a short section about templates?",
		createdAt: relativeIso(0, -3),
	},
	{
		id: "c-2",
		docId: "d-welcome",
		authorId: "u-tomas",
		authorName: "Tomas Reyhani",
		authorTint: "green",
		body: "Added a note about the slash menu, have a look.",
		createdAt: relativeIso(0, -2),
	},
	{
		id: "c-3",
		docId: "d-roadmap",
		authorId: "u-wren",
		authorName: "Wren Adebayo",
		authorTint: "blue",
		body: "Offline drafts might need two sprints rather than one.",
		createdAt: relativeIso(-1),
	},
	{
		id: "c-4",
		docId: "d-brief",
		authorId: "u-ines",
		authorName: "Ines Calloway",
		authorTint: "orange",
		body: "The owner prefers big type and very few pages.",
		createdAt: relativeIso(0, -6),
	},
]);
