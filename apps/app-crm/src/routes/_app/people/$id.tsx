import { createFileRoute } from "@tanstack/react-router";
import { activitiesQuery } from "@/features/activities/api/queries";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { notesQuery } from "@/features/notes/api/queries";
import { peopleQuery } from "@/features/people/api/queries";
import { fullName } from "@/features/people/schemas/person";
import { PersonDetailPage } from "@/features/records/components/person-detail-page";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/people/$id")({
	loader: async ({ context, params }) => {
		const { queryClient } = context;
		await ensureQueries(
			queryClient,
			peopleQuery,
			companiesQuery,
			dealsQuery,
			activitiesQuery,
			notesQuery,
		);
		const person = queryClient.getQueryData(peopleQuery.queryKey)?.find((p) => p.id === params.id);
		return { name: person ? fullName(person) : undefined };
	},
	head: ({ loaderData }) => pageTitle(loaderData?.name ?? "Person"),
	component: function Page() {
		return <PersonDetailPage id={Route.useParams().id} />;
	},
});
