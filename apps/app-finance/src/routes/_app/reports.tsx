import { createFileRoute } from "@tanstack/react-router";
import { PageSkeleton } from "@/components/kit/skeletons";
import { reportQuery } from "@/features/reports/api/queries";
import { ReportsPage } from "@/features/reports/components/reports-page";
import { DEFAULT_REPORT_PERIOD } from "@/features/reports/constants/period";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/reports")({
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(reportQuery(DEFAULT_REPORT_PERIOD)),
	head: () => ({ meta: [{ title: pageTitle("Reports") }] }),
	pendingComponent: () => <PageSkeleton />,
	component: ReportsPage,
});
