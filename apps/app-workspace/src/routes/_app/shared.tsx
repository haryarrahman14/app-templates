import { createFileRoute } from "@tanstack/react-router";
import { docsQuery } from "@/features/documents/api/queries";
import { SharedPage } from "@/features/documents/components/shared-page";
import { docFiltersSearchSchema } from "@/features/documents/schemas/doc-filters";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/shared")({
	validateSearch: docFiltersSearchSchema,
	loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(docsQuery),
	head: () => pageTitle("Shared with me"),
	component: SharedPage,
});
