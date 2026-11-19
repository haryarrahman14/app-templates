import { createFileRoute } from "@tanstack/react-router";
import { NotificationSettings } from "@/features/settings/components/notification-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/notifications")({
	head: () => ({ meta: [{ title: pageTitle("Notifications · Settings") }] }),
	component: NotificationSettings,
});
