import { createFileRoute } from "@tanstack/react-router";
import { DangerZone } from "@/features/settings/components/danger-zone";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/danger")({
	head: () => pageTitle("Danger zone"),
	component: DangerZone,
});
