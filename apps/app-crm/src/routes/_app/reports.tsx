import { createFileRoute } from "@tanstack/react-router";
import { activitiesQuery } from "@/features/activities/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { ReportsPage } from "@/features/reports/components/reports-page";
import { membersQuery } from "@/features/workspace/api/queries";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/reports")({
	loader: ({ context }) =>
		ensureQueries(context.queryClient, dealsQuery, activitiesQuery, membersQuery),
	head: () => pageTitle("Reports"),
	component: ReportsPage,
});
