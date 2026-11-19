import { createFileRoute } from "@tanstack/react-router";
import { ApiKeysPage } from "@/features/settings/components/api-keys-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/settings/api-keys")({
	head: () => pageTitle("API keys · Settings"),
	component: ApiKeysPage,
});
