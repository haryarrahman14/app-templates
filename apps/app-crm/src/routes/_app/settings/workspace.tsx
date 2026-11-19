import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/features/settings/components/workspace-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/workspace")({
	head: () => pageTitle("Workspace · Settings"),
	component: WorkspacePage,
});
