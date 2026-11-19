import { createFileRoute } from "@tanstack/react-router";
import { activitiesQuery } from "@/features/activities/api/queries";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { notesQuery } from "@/features/notes/api/queries";
import { peopleQuery } from "@/features/people/api/queries";
import { CompanyDetailPage } from "@/features/records/components/company-detail-page";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/companies/$id")({
	loader: async ({ context, params }) => {
		const { queryClient } = context;
		await ensureQueries(
			queryClient,
			companiesQuery,
			peopleQuery,
			dealsQuery,
			activitiesQuery,
			notesQuery,
		);
		return {
			name: queryClient.getQueryData(companiesQuery.queryKey)?.find((c) => c.id === params.id)
				?.name,
		};
	},
	head: ({ loaderData }) => pageTitle(loaderData?.name ?? "Company"),
	component: function Page() {
		return <CompanyDetailPage id={Route.useParams().id} />;
	},
});
