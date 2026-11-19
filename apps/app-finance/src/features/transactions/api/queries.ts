import { queryOptions } from "@tanstack/react-query";
import { transactionSchema } from "@/features/transactions/schemas/transaction";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { account } from "@/lib/sample-data/account-store";

/** The account ledger, newest first (browser-side account data). Swap for your transactions API. */
export const transactionsQuery = queryOptions({
	queryKey: [...queryRoots.transactions],
	queryFn: async () => {
		await sampleDelay(320);
		return transactionSchema.array().parse(account().transactions.map((tx) => ({ ...tx })));
	},
});
