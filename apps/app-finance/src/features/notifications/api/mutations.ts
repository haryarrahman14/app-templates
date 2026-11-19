import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inbox } from "@/features/notifications/api/queries";
import { queryRoots } from "@/lib/query-keys";

export function useMarkAllRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			for (const n of inbox) n.read = true;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.notifications }),
	});
}
