import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	favouritesQuery,
	listsQuery,
	membersQuery,
	notificationsQuery,
} from "@/features/workspace/api/queries";
import type {
	Favourite,
	Member,
	MemberRole,
	NewList,
	Notification,
	RecordList,
} from "@/features/workspace/schemas/workspace";
import { patchList } from "@/lib/optimistic";
import type { RecordRef } from "@/lib/records";
import { db, delay, newId, nowIso } from "@/lib/sample-db/db";

export function useToggleFavourite() {
	const queryClient = useQueryClient();
	const key = favouritesQuery.queryKey;
	return useMutation({
		mutationFn: async (favourite: Favourite) => {
			await delay(200);
			const index = db.favourites.findIndex(
				(item) => item.type === favourite.type && item.id === favourite.id,
			);
			if (index >= 0) db.favourites.splice(index, 1);
			else db.favourites.push(favourite);
		},
		onMutate: (favourite) =>
			patchList<Favourite>(queryClient, key, (items) =>
				items.some((item) => item.type === favourite.type && item.id === favourite.id)
					? items.filter((item) => !(item.type === favourite.type && item.id === favourite.id))
					: [...items, favourite],
			),
		onError: (_error, _favourite, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useCreateList() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: NewList) => {
			await delay();
			const list: RecordList = { id: newId("l"), recordIds: [], ...input };
			db.lists.push(list);
			return list;
		},
		onSuccess: (list) => {
			toast.success(`List “${list.name}” created`);
			queryClient.invalidateQueries({ queryKey: listsQuery.queryKey });
		},
	});
}

export function useAddToList() {
	const queryClient = useQueryClient();
	const key = listsQuery.queryKey;
	return useMutation({
		mutationFn: async ({ listId, refs }: { listId: string; refs: RecordRef[] }) => {
			await delay();
			const list = db.lists.find((item) => item.id === listId);
			if (!list) throw new Error("List not found");
			const ids = refs.filter((ref) => ref.type === list.recordType).map((ref) => ref.id);
			list.recordIds = Array.from(new Set([...list.recordIds, ...ids]));
			return { list, added: ids.length };
		},
		onMutate: ({ listId, refs }) =>
			patchList<RecordList>(queryClient, key, (lists) =>
				lists.map((list) =>
					list.id === listId
						? {
								...list,
								recordIds: Array.from(
									new Set([
										...list.recordIds,
										...refs.filter((ref) => ref.type === list.recordType).map((ref) => ref.id),
									]),
								),
							}
						: list,
				),
			),
		onSuccess: ({ list, added }) => toast.success(`Added ${added} to ${list.name}`),
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not add to the list");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useMarkNotificationsRead() {
	const queryClient = useQueryClient();
	const key = notificationsQuery.queryKey;
	return useMutation({
		mutationFn: async (ids: string[] | "all") => {
			await delay(150);
			for (const item of db.notifications) {
				if (ids === "all" || ids.includes(item.id)) item.read = true;
			}
		},
		onMutate: (ids) =>
			patchList<Notification>(queryClient, key, (items) =>
				items.map((item) =>
					ids === "all" || ids.includes(item.id) ? { ...item, read: true } : item,
				),
			),
		onError: (_error, _ids, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useInviteMembers() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ emails, role }: { emails: string[]; role: MemberRole }) => {
			await delay(500);
			const invited: Member[] = emails.map((email) => ({
				id: newId("m"),
				name: email.split("@")[0] ?? email,
				email,
				role,
				status: "invited",
				title: "",
				joinedAt: nowIso(),
			}));
			db.members.push(...invited);
			return invited;
		},
		onSuccess: (invited) => {
			toast.success(
				invited.length === 1
					? `Invite sent to ${invited[0]?.email}`
					: `${invited.length} invites sent`,
			);
			queryClient.invalidateQueries({ queryKey: membersQuery.queryKey });
		},
	});
}

export function useUpdateMember() {
	const queryClient = useQueryClient();
	const key = membersQuery.queryKey;
	return useMutation({
		mutationFn: async ({ id, ...patch }: Partial<Member> & { id: string }) => {
			await delay(250);
			const member = db.members.find((item) => item.id === id);
			if (member) Object.assign(member, patch);
		},
		onMutate: ({ id, ...patch }) =>
			patchList<Member>(queryClient, key, (items) =>
				items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
			),
		onError: (_error, _input, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["workspace"] }),
	});
}

export function useRemoveMember() {
	const queryClient = useQueryClient();
	const key = membersQuery.queryKey;
	return useMutation({
		mutationFn: async (id: string) => {
			await delay(300);
			db.members = db.members.filter((item) => item.id !== id);
		},
		onMutate: (id) =>
			patchList<Member>(queryClient, key, (items) => items.filter((m) => m.id !== id)),
		onSuccess: () => toast.success("Member removed"),
		onError: (_error, _id, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
