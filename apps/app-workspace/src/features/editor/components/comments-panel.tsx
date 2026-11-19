import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Textarea } from "@repo/ui/components/textarea";
import { useQuery } from "@tanstack/react-query";
import { MessageCircleIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { UserAvatar } from "@/components/kit/user-avatar";
import { useAddComment, useDeleteComment } from "@/features/editor/api/mutations";
import { commentsQuery } from "@/features/editor/api/queries";
import { type NewComment, newCommentSchema } from "@/features/editor/schemas/comment";
import { formatRelative } from "@/lib/format";
import { SAMPLE_USER_ID } from "@/lib/session";
import { useSessionUser } from "@/lib/session-context";

export function CommentsPanel({ docId }: { docId: string }) {
	const user = useSessionUser();
	const comments = useQuery(commentsQuery(docId));
	const add = useAddComment(docId, user.name);
	const remove = useDeleteComment(docId);
	const form = useForm<NewComment>({
		resolver: zodResolver(newCommentSchema),
		defaultValues: { body: "" },
	});

	return (
		<div className="flex flex-col gap-4">
			{comments.isPending ? (
				<div className="space-y-3">
					<Skeleton className="h-14" />
					<Skeleton className="h-14" />
				</div>
			) : comments.data?.length ? (
				<ul className="space-y-4">
					{comments.data.map((comment) => (
						<li key={comment.id} className="group flex gap-3">
							<UserAvatar
								name={comment.authorId === SAMPLE_USER_ID ? user.name : comment.authorName}
								size="sm"
								className="mt-0.5"
							/>
							<div className="min-w-0 flex-1">
								<p className="flex items-baseline gap-2 text-sm">
									<span className="font-medium">
										{comment.authorId === SAMPLE_USER_ID ? "You" : comment.authorName}
									</span>
									<span className="text-muted-foreground text-xs">
										{formatRelative(comment.createdAt)}
									</span>
								</p>
								<p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
									{comment.body}
								</p>
							</div>
							{comment.authorId === SAMPLE_USER_ID && comment.id !== "optimistic" ? (
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="Delete comment"
									className="text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
									onClick={() => remove.mutate(comment.id)}
								>
									<Trash2Icon />
								</Button>
							) : null}
						</li>
					))}
				</ul>
			) : (
				<div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center text-muted-foreground text-sm">
					<MessageCircleIcon className="size-5" />
					No comments yet. Start the conversation.
				</div>
			)}

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((values) =>
						add.mutate(values.body, { onSuccess: () => form.reset() }),
					)}
					className="space-y-2"
				>
					<FormField
						control={form.control}
						name="body"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="sr-only">Add a comment</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Add a comment…"
										className="min-h-20 resize-none rounded-xl"
										onKeyDown={(event) => {
											if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
												event.preventDefault();
												void form.handleSubmit((values) =>
													add.mutate(values.body, { onSuccess: () => form.reset() }),
												)();
											}
										}}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-xs">⌘ Enter to post</span>
						<Button type="submit" size="sm" disabled={add.isPending}>
							Comment
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
