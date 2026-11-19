import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { account } from "@/lib/sample-data/account-store";

/** Watchlist edits against the in-memory sample account. Swap each mutationFn for your API. */
function useWatchlistMutation<TInput, TResult>(fn: (input: TInput) => TResult) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: TInput) => {
			await sampleDelay(220);
			return fn(input);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.account }),
	});
}

function list(id: string) {
	const found = account().watchlists.find((w) => w.id === id);
	if (!found) throw new Error("That list no longer exists.");
	return found;
}

export function useCreateList() {
	return useWatchlistMutation(({ name }: { name: string }) => {
		const s = account();
		s.nextListId += 1;
		const created = { id: `wl-${s.nextListId}`, name, symbols: [] };
		s.watchlists.push(created);
		return created;
	});
}

export function useDeleteList() {
	return useWatchlistMutation(({ id }: { id: string }) => {
		const s = account();
		const removed = list(id);
		s.watchlists = s.watchlists.filter((w) => w.id !== id);
		return removed;
	});
}

export function useAddSymbol() {
	return useWatchlistMutation(({ id, symbol }: { id: string; symbol: string }) => {
		const target = list(id);
		if (!target.symbols.includes(symbol)) target.symbols.push(symbol);
		return { list: target.name, symbol };
	});
}

export function useRemoveSymbol() {
	return useWatchlistMutation(({ id, symbol }: { id: string; symbol: string }) => {
		const target = list(id);
		target.symbols = target.symbols.filter((s) => s !== symbol);
		return { list: target.name, symbol };
	});
}

export function useMoveSymbol() {
	return useWatchlistMutation(({ id, symbol, by }: { id: string; symbol: string; by: -1 | 1 }) => {
		const target = list(id);
		const from = target.symbols.indexOf(symbol);
		const to = from + by;
		if (from < 0 || to < 0 || to >= target.symbols.length) return target.symbols;
		const next = [...target.symbols];
		next.splice(from, 1);
		next.splice(to, 0, symbol);
		target.symbols = next;
		return next;
	});
}
