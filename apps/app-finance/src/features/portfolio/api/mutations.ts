import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { account, nextTransactionId } from "@/lib/sample-data/account-store";
import { SAMPLE_AS_OF } from "@/lib/sample-data/calendar";
import { round } from "@/lib/sample-data/random";

/** Adds sample cash to the in-memory account (logged as a deposit). No real money moves. */
export function useAddSampleCash() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (amount: number) => {
			await sampleDelay(400);
			const s = account();
			s.cash = round(s.cash + amount);
			s.transactions.unshift({
				id: nextTransactionId(),
				date: SAMPLE_AS_OF + 17 * 3_600_000,
				type: "deposit",
				symbol: null,
				quantity: null,
				price: null,
				amount,
				status: "settled",
				account: "Brokerage",
				note: "Sample top-up",
			});
			return amount;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.account }),
	});
}
