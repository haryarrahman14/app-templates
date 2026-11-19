import { createFileRoute } from "@tanstack/react-router";
import { TableSkeleton } from "@/components/kit/skeletons";
import { TransactionsPage } from "@/features/transactions/components/transactions-page";
import { transactionsSearchSchema } from "@/features/transactions/schemas/transaction";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/transactions")({
	validateSearch: transactionsSearchSchema,
	head: () => ({ meta: [{ title: pageTitle("Transactions") }] }),
	pendingComponent: () => <TableSkeleton rows={10} />,
	component: TransactionsPage,
});
