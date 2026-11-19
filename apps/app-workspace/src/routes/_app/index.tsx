import { createFileRoute } from "@tanstack/react-router";
import { docsQuery } from "@/features/documents/api/queries";
import { HomePage } from "@/features/documents/components/home-page";
import { docFiltersSearchSchema } from "@/features/documents/schemas/doc-filters";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/")({
	validateSearch: docFiltersSearchSchema,
	loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(docsQuery),
	head: () => pageTitle("All docs"),
	component: HomePage,
});
