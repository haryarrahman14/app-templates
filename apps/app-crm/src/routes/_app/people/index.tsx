import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { companiesQuery } from "@/features/companies/api/queries";
import { peopleQuery } from "@/features/people/api/queries";
import { PeoplePage } from "@/features/people/components/people-page";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/people/")({
	// `?list=<id>` shows one saved list.
	validateSearch: z.object({ list: z.string().optional().catch(undefined) }),
	loader: ({ context }) => ensureQueries(context.queryClient, peopleQuery, companiesQuery),
	head: () => pageTitle("People"),
	component: function Page() {
		return <PeoplePage listId={Route.useSearch().list} />;
	},
});
