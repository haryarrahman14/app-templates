import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { activitiesQuery } from "@/features/activities/api/queries";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { DealsPage } from "@/features/deals/components/deals-page";
import { peopleQuery } from "@/features/people/api/queries";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/deals")({
	// `?view=table` shows the table instead of the board; `?deal=<id>` opens the deal sheet.
	validateSearch: z.object({
		view: z.enum(["board", "table"]).optional().catch(undefined),
		deal: z.string().optional().catch(undefined),
	}),
	loader: ({ context }) =>
		ensureQueries(context.queryClient, dealsQuery, companiesQuery, peopleQuery, activitiesQuery),
	head: () => pageTitle("Deals"),
	component: function Page() {
		const { view, deal } = Route.useSearch();
		return <DealsPage view={view ?? "board"} openId={deal} />;
	},
});
