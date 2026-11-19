import { createFileRoute } from "@tanstack/react-router";
import { PageSkeleton } from "@/components/kit/skeletons";
import { eventsQuery, moversQuery, newsQuery } from "@/features/overview/api/queries";
import { OverviewPage } from "@/features/overview/components/overview-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/")({
	loader: ({ context: { queryClient } }) =>
		Promise.all([
			queryClient.ensureQueryData(newsQuery),
			queryClient.ensureQueryData(eventsQuery),
			queryClient.ensureQueryData(moversQuery),
		]),
	head: () => ({ meta: [{ title: pageTitle("Overview") }] }),
	pendingComponent: () => <PageSkeleton />,
	component: OverviewPage,
});
