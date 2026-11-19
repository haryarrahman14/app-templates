import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { account, applyTrade } from "@/lib/sample-data/account-store";

/**
 * Sample order: updates the in-memory sample portfolio only. Nothing is sent anywhere.
 * With a real broker API, call it here and invalidate the same keys on success.
 */
export function useSampleTrade() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: {
			symbol: string;
			side: "buy" | "sell";
			quantity: number;
			price: number;
		}) => {
			await sampleDelay(500);
			return applyTrade(input);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.account }),
	});
}

export function useToggleWatchlist(symbol: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ listId, add }: { listId: string; add: boolean }) => {
			await sampleDelay(200);
			const list = account().watchlists.find((w) => w.id === listId);
			if (!list) throw new Error("That list no longer exists.");
			list.symbols = add
				? [...list.symbols.filter((s) => s !== symbol), symbol]
				: list.symbols.filter((s) => s !== symbol);
			return { list: list.name, add };
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.account }),
	});
}
