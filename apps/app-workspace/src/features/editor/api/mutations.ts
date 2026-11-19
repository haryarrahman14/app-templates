import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsKeys } from "@/features/editor/api/queries";
import { commentsStore } from "@/features/editor/api/store";
import type { Comment } from "@/features/editor/schemas/comment";
import { newId, sampleDelay } from "@/lib/mock-db";
import { SAMPLE_USER_ID } from "@/lib/session";

export function useAddComment(docId: string, authorName: string) {
	const queryClient = useQueryClient();
	const key = commentsKeys.forDoc(docId);
	return useMutation({
		mutationFn: async (body: string) => {
			await sampleDelay();
			const comment: Comment = {
				id: newId("c"),
				docId,
				authorId: SAMPLE_USER_ID,
				authorName,
				authorTint: "yellow",
				body,
				createdAt: new Date().toISOString(),
			};
			return commentsStore.insert(comment);
		},
		onMutate: async (body) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<Comment[]>(key);
			queryClient.setQueryData<Comment[]>(key, (old) => [
				...(old ?? []),
				{
					id: "optimistic",
					docId,
					authorId: SAMPLE_USER_ID,
					authorName,
					authorTint: "yellow",
					body,
					createdAt: new Date().toISOString(),
				},
			]);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(key, context?.previous);
			toast.error("Your comment was not posted.");
		},
		onSuccess: () => toast.success("Comment added"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useDeleteComment(docId: string) {
	const queryClient = useQueryClient();
	const key = commentsKeys.forDoc(docId);
	return useMutation({
		mutationFn: async (id: string) => {
			await sampleDelay();
			commentsStore.remove(id);
			return id;
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<Comment[]>(key);
			queryClient.setQueryData<Comment[]>(key, (old) => old?.filter((c) => c.id !== id));
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(key, context?.previous);
			toast.error("Could not delete the comment.");
		},
		onSuccess: () => toast.success("Comment deleted"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
