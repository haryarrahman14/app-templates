import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dealsQuery } from "@/features/deals/api/queries";
import {
	DEAL_STAGE_META,
	type Deal,
	type DealStage,
	type NewDeal,
} from "@/features/deals/schemas/deal";
import { patchList } from "@/lib/optimistic";
import { db, delay, newId, nowIso, recordActivity } from "@/lib/sample-db/db";

const key = dealsQuery.queryKey;

export function useCreateDeal() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: NewDeal) => {
			await delay(450);
			const contact = db.people.find((person) => person.companyId === input.companyId);
			const deal: Deal = {
				id: newId("d"),
				...input,
				contactId: contact?.id ?? null,
				createdAt: nowIso(),
				rank: Math.min(0, ...db.deals.map((item) => item.rank)) - 1,
			};
			db.deals.push(deal);
			recordActivity({
				type: "deal",
				summary: `Opened the deal ${deal.name}`,
				record: { type: "company", id: deal.companyId },
			});
			return deal;
		},
		onSuccess: (deal) => toast.success(`${deal.name} created`),
		onError: () => toast.error("Could not create the deal"),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
	});
}

export function useUpdateDeal() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...patch }: Partial<Deal> & { id: string }) => {
			await delay(300);
			const deal = db.deals.find((item) => item.id === id);
			if (!deal) throw new Error("Deal not found");
			Object.assign(deal, patch);
		},
		onMutate: ({ id, ...patch }) =>
			patchList<Deal>(queryClient, key, (items) =>
				items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
			),
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not save the deal");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

/** Move a deal to a stage (and position). Used by drag and drop and the "Move to" menu. */
export function useMoveDeal() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, stage, rank }: { id: string; stage: DealStage; rank: number }) => {
			await delay(300);
			const deal = db.deals.find((item) => item.id === id);
			if (!deal) throw new Error("Deal not found");
			const changed = deal.stage !== stage;
			deal.stage = stage;
			deal.rank = rank;
			if (changed) {
				recordActivity({
					type: "deal",
					summary: `Moved ${deal.name} to ${DEAL_STAGE_META[stage].label}`,
					record: { type: "company", id: deal.companyId },
				});
			}
			return { deal, changed };
		},
		onMutate: ({ id, stage, rank }) =>
			patchList<Deal>(queryClient, key, (items) =>
				items.map((item) => (item.id === id ? { ...item, stage, rank } : item)),
			),
		onSuccess: ({ deal, changed }) => {
			if (changed) toast.success(`Moved to ${DEAL_STAGE_META[deal.stage].label}`);
		},
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not move the deal");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
	});
}

export function useDeleteDeal() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await delay(350);
			db.deals = db.deals.filter((item) => item.id !== id);
		},
		onMutate: (id) =>
			patchList<Deal>(queryClient, key, (items) => items.filter((d) => d.id !== id)),
		onSuccess: () => toast.success("Deal deleted"),
		onError: (_error, _id, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
