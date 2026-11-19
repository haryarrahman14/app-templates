import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharesKeys } from "@/features/sharing/api/queries";
import { sharesStore } from "@/features/sharing/api/store";
import type { InviteInput, Share, ShareRole } from "@/features/sharing/schemas/share";
import { newId, sampleDelay } from "@/lib/mock-db";

export function useInvite(targetId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: InviteInput) => {
			await sampleDelay(450);
			if (sharesStore.all().some((s) => s.targetId === targetId && s.email === input.email)) {
				throw new Error(`${input.email} already has access.`);
			}
			return sharesStore.insert({ id: newId("s"), targetId, pending: true, ...input });
		},
		onSuccess: (share) => toast.success(`Invite sent to ${share.email}`),
		onError: (error) => toast.error(error.message),
		onSettled: () => queryClient.invalidateQueries({ queryKey: sharesKeys.forTarget(targetId) }),
	});
}

export function useUpdateShare(targetId: string) {
	const queryClient = useQueryClient();
	const key = sharesKeys.forTarget(targetId);
	return useMutation({
		mutationFn: async ({ id, role }: { id: string; role: ShareRole | null }) => {
			await sampleDelay(200);
			if (role === null) sharesStore.remove(id);
			else sharesStore.update(id, { role });
		},
		onMutate: async ({ id, role }) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<Share[]>(key);
			queryClient.setQueryData<Share[]>(key, (old) =>
				role === null
					? old?.filter((s) => s.id !== id)
					: old?.map((s) => (s.id === id ? { ...s, role } : s)),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(key, context?.previous);
			toast.error("Could not update access.");
		},
		onSuccess: (_data, { role }) =>
			toast.success(role === null ? "Access removed" : "Access updated"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
