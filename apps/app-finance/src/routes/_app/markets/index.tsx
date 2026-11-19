import { createFileRoute } from "@tanstack/react-router";
import { ListSkeleton, TableSkeleton } from "@/components/kit/skeletons";
import { screenerQuery, sectorTilesQuery } from "@/features/markets/api/queries";
import { MarketsPage } from "@/features/markets/components/markets-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/markets/")({
	loader: ({ context: { queryClient } }) =>
		Promise.all([
			queryClient.ensureQueryData(screenerQuery),
			queryClient.ensureQueryData(sectorTilesQuery),
		]),
	head: () => ({ meta: [{ title: pageTitle("Markets") }] }),
	pendingComponent: () => (
		<div className="space-y-6">
			<ListSkeleton rows={2} />
			<TableSkeleton />
		</div>
	),
	component: MarketsPage,
});
