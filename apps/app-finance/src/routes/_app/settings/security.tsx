import { createFileRoute } from "@tanstack/react-router";
import { SecuritySettings } from "@/features/settings/components/security-settings";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/security")({
	head: () => ({ meta: [{ title: pageTitle("Security · Settings") }] }),
	component: SecuritySettings,
});
