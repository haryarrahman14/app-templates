import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsKeys } from "@/features/notifications/api/queries";
import { notificationsStore } from "@/features/notifications/api/store";
import type { Notification } from "@/features/notifications/schemas/notification";
import { sampleDelay } from "@/lib/mock-db";

/** Marks the given notifications (or all when `ids` is omitted) as read, optimistically. */
export function useMarkRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (ids?: string[]) => {
			await sampleDelay(150);
			for (const n of notificationsStore.all()) {
				if (!ids || ids.includes(n.id)) notificationsStore.update(n.id, { read: true });
			}
		},
		onMutate: async (ids) => {
			await queryClient.cancelQueries({ queryKey: notificationsKeys.all });
			const previous = queryClient.getQueryData<Notification[]>(notificationsKeys.all);
			queryClient.setQueryData<Notification[]>(notificationsKeys.all, (old) =>
				old?.map((n) => (!ids || ids.includes(n.id) ? { ...n, read: true } : n)),
			);
			return { previous };
		},
		onError: (_error, _vars, context) =>
			queryClient.setQueryData(notificationsKeys.all, context?.previous),
		onSettled: () => queryClient.invalidateQueries({ queryKey: notificationsKeys.all }),
	});
}
