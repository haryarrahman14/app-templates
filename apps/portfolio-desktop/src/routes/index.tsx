import { createFileRoute } from "@tanstack/react-router";
import { DesktopPage } from "@/components/layout/desktop-page";
import { profileQuery } from "@/features/about/api/queries";
import { widgetsQuery } from "@/features/desktop/api/queries";
import { experienceQuery } from "@/features/experience/api/queries";
import { notesQuery } from "@/features/notes/api/queries";
import { projectsQuery } from "@/features/projects/api/queries";
import { desktopSearchSchema } from "@/features/windows/schemas/desktop-search";

export const Route = createFileRoute("/")({
	validateSearch: desktopSearchSchema,
	loader: async ({ context: { queryClient } }) => {
		const [profile] = await Promise.all([
			queryClient.ensureQueryData(profileQuery),
			queryClient.ensureQueryData(projectsQuery),
			queryClient.ensureQueryData(notesQuery),
			queryClient.ensureQueryData(experienceQuery),
			queryClient.ensureQueryData(widgetsQuery),
		]);
		return { name: profile.name, role: profile.role, description: profile.summary[0] };
	},
	head: ({ loaderData }) => {
		const title = loaderData ? `${loaderData.name} · ${loaderData.role}` : "Portfolio";
		const description = loaderData?.description ?? "";
		return {
			meta: [
				{ title },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:type", content: "profile" },
			],
		};
	},
	component: DesktopPage,
});
