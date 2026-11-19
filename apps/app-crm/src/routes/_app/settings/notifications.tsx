import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/features/settings/components/notifications-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/notifications")({
	head: () => pageTitle("Notifications · Settings"),
	component: NotificationsPage,
});
