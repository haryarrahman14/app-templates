import { createFileRoute } from "@tanstack/react-router";
import { TrashPage } from "@/features/trash/components/trash-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/trash")({
	head: () => pageTitle("Trash"),
	component: TrashPage,
});
