import { createFileRoute } from "@tanstack/react-router";
import { DocumentSkeleton } from "@/components/layout/page-skeleton";
import { docQuery } from "@/features/documents/api/queries";
import { DocumentPage } from "@/features/editor/components/document-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/docs/$docId")({
	loader: ({ context: { queryClient }, params }) =>
		queryClient.ensureQueryData(docQuery(params.docId)),
	head: () => pageTitle("Document"),
	pendingComponent: DocumentSkeleton,
	component: function DocumentRoute() {
		const { docId } = Route.useParams();
		return <DocumentPage docId={docId} />;
	},
});
