import { createFileRoute } from "@tanstack/react-router";
import { DangerPage } from "@/features/settings/components/danger-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/danger")({
	head: () => pageTitle("Danger zone · Settings"),
	component: DangerPage,
});
