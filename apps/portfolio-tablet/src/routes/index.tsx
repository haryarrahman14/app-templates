import { createFileRoute } from "@tanstack/react-router";
import { preloadContent } from "@/components/layout/app-registry";
import { TabletShell } from "@/components/layout/tablet-shell";
import { stageSearchSchema } from "@/lib/stage-search";

export const Route = createFileRoute("/")({
	validateSearch: stageSearchSchema,
	loader: ({ context }) => preloadContent(context.queryClient),
	head: ({ loaderData }) => {
		const title = loaderData
			? `${loaderData.profile.name} · ${loaderData.profile.role}`
			: "Portfolio";
		const description = loaderData?.profile.pitch ?? "";
		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:type", content: "website" },
				{ name: "twitter:card", content: "summary" },
			],
		};
	},
	component: TabletShell,
});
