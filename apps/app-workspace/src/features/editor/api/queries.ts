import { queryOptions } from "@tanstack/react-query";
import { commentsStore } from "@/features/editor/api/store";
import { commentSchema } from "@/features/editor/schemas/comment";
import { sampleDelay } from "@/lib/mock-db";

export const commentsKeys = {
	forDoc: (docId: string) => ["comments", docId] as const,
};

/** Comments on one document, oldest first. Replace the queryFn with your API. */
export const commentsQuery = (docId: string) =>
	queryOptions({
		queryKey: commentsKeys.forDoc(docId),
		queryFn: async () => {
			await sampleDelay(200);
			return commentSchema
				.array()
				.parse(commentsStore.all().filter((c) => c.docId === docId))
				.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
		},
	});
