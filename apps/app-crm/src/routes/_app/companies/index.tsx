import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { companiesQuery } from "@/features/companies/api/queries";
import { CompaniesPage } from "@/features/companies/components/companies-page";
import { peopleQuery } from "@/features/people/api/queries";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/companies/")({
	// `?list=<id>` shows one saved list.
	validateSearch: z.object({ list: z.string().optional().catch(undefined) }),
	loader: ({ context }) => ensureQueries(context.queryClient, companiesQuery, peopleQuery),
	head: () => pageTitle("Companies"),
	component: function Page() {
		return <CompaniesPage listId={Route.useSearch().list} />;
	},
});
