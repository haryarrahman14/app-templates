import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewTransactionInput } from "@/features/transactions/schemas/transaction";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { account, nextTransactionId } from "@/lib/sample-data/account-store";
import { round } from "@/lib/sample-data/random";

const SIGN = { deposit: 1, dividend: 1, withdrawal: -1, fee: -1 } as const;

/** Records a cash movement in the in-memory sample ledger and adjusts sample cash. */
export function useAddTransaction() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: NewTransactionInput) => {
			await sampleDelay(450);
			const s = account();
			const amount = round(input.amount * SIGN[input.type]);
			if (amount < 0 && s.cash + amount < 0)
				throw new Error("That would take sample cash below zero.");
			const tx = {
				id: nextTransactionId(),
				date: Date.parse(`${input.date}T12:00:00Z`),
				type: input.type,
				symbol: input.type === "dividend" ? input.symbol : null,
				quantity: null,
				price: null,
				amount,
				status: "settled" as const,
				account: input.account,
				note: input.note,
			};
			s.transactions = [tx, ...s.transactions].sort((a, b) => b.date - a.date);
			s.cash = round(s.cash + amount);
			return tx;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.account }),
	});
}
