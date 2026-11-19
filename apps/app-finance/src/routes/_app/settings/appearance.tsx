import { createFileRoute } from "@tanstack/react-router";
import { AppearanceSettings } from "@/features/settings/components/appearance-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/appearance")({
	head: () => ({ meta: [{ title: pageTitle("Appearance · Settings") }] }),
	component: AppearanceSettings,
});
