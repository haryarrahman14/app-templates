import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membersKeys } from "@/features/members/api/queries";
import { membersStore } from "@/features/members/api/store";
import type { InviteMemberInput, Member, MemberRole } from "@/features/members/schemas/member";
import { newId, sampleDelay } from "@/lib/mock-db";

const TINTS = ["blue", "green", "orange", "teal", "yellow"];

export function useInviteMember() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: InviteMemberInput) => {
			await sampleDelay(500);
			if (membersStore.all().some((m) => m.email === input.email)) {
				throw new Error(`${input.email} is already in this workspace.`);
			}
			const member: Member = {
				id: newId("u"),
				name: (input.email.split("@")[0] ?? input.email)
					.replace(/[._-]+/g, " ")
					.replace(/\b\w/g, (c) => c.toUpperCase()),
				email: input.email,
				role: input.role,
				tint: TINTS[Math.floor(Math.random() * TINTS.length)] ?? "blue",
				status: "invited",
				lastActiveAt: null,
			};
			return membersStore.insert(member);
		},
		onSuccess: (member) => toast.success(`Invitation sent to ${member.email}`),
		onError: (error) => toast.error(error.message),
		onSettled: () => queryClient.invalidateQueries({ queryKey: membersKeys.all }),
	});
}

export function useUpdateMemberRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, role }: { id: string; role: MemberRole }) => {
			await sampleDelay();
			return membersStore.update(id, { role });
		},
		onMutate: async ({ id, role }) => {
			await queryClient.cancelQueries({ queryKey: membersKeys.all });
			const previous = queryClient.getQueryData<Member[]>(membersKeys.all);
			queryClient.setQueryData<Member[]>(membersKeys.all, (old) =>
				old?.map((m) => (m.id === id ? { ...m, role } : m)),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(membersKeys.all, context?.previous);
			toast.error("Could not change the role.");
		},
		onSuccess: (member) => toast.success(`${member.name} is now ${member.role}`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: membersKeys.all }),
	});
}

export function useRemoveMember() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (member: Member) => {
			await sampleDelay();
			membersStore.remove(member.id);
			return member;
		},
		onMutate: async (member) => {
			await queryClient.cancelQueries({ queryKey: membersKeys.all });
			const previous = queryClient.getQueryData<Member[]>(membersKeys.all);
			queryClient.setQueryData<Member[]>(membersKeys.all, (old) =>
				old?.filter((m) => m.id !== member.id),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(membersKeys.all, context?.previous);
			toast.error("Could not remove that member.");
		},
		onSuccess: (member) => toast.success(`${member.name} was removed`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: membersKeys.all }),
	});
}
