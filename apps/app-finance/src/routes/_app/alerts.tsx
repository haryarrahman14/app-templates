import { createFileRoute } from "@tanstack/react-router";
import { ListSkeleton } from "@/components/kit/skeletons";
import { AlertsPage } from "@/features/alerts/components/alerts-page";
import { alertsSearchSchema } from "@/features/alerts/schemas/alert";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/alerts")({
	validateSearch: alertsSearchSchema,
	head: () => ({ meta: [{ title: pageTitle("Alerts") }] }),
	pendingComponent: () => <ListSkeleton rows={4} />,
	component: AlertsPage,
});
