import { createFileRoute } from "@tanstack/react-router";
import { activitiesQuery } from "@/features/activities/api/queries";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { todayMeetingsQuery } from "@/features/home/api/queries";
import { HomePage } from "@/features/home/components/home-page";
import { peopleQuery } from "@/features/people/api/queries";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/home")({
	loader: ({ context }) =>
		ensureQueries(
			context.queryClient,
			dealsQuery,
			activitiesQuery,
			companiesQuery,
			peopleQuery,
			todayMeetingsQuery,
		),
	head: () => pageTitle("Home"),
	component: HomePage,
});
