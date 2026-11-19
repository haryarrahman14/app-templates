import { createFileRoute } from "@tanstack/react-router";
import { DangerSettings } from "@/features/settings/components/danger-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/danger")({
	head: () => ({ meta: [{ title: pageTitle("Danger zone · Settings") }] }),
	component: DangerSettings,
});
