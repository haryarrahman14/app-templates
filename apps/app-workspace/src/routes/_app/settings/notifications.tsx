import { createFileRoute } from "@tanstack/react-router";
import { NotificationSettings } from "@/features/settings/components/notification-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/notifications")({
	head: () => pageTitle("Notifications"),
	component: NotificationSettings,
});
