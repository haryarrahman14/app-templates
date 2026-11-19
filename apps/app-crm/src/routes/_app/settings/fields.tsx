import { createFileRoute } from "@tanstack/react-router";
import { FieldsPage } from "@/features/settings/components/fields-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/fields")({
	head: () => pageTitle("Custom fields · Settings"),
	component: FieldsPage,
});
