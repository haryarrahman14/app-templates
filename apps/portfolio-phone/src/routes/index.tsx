import { createFileRoute } from "@tanstack/react-router";
import { PhonePage } from "@/components/layout/phone-page";
import { profileQuery } from "@/features/about/api/queries";
import { contactInfoQuery } from "@/features/contact/api/queries";
import { cvQuery } from "@/features/experience/api/queries";
import { homeWidgetsQuery } from "@/features/home-screen/api/queries";
import { lockNotificationsQuery } from "@/features/lock-screen/api/queries";
import { conversationQuery } from "@/features/messages/api/queries";
import { notesQuery } from "@/features/notes/api/queries";
import { shotsQuery } from "@/features/photos/api/queries";
import { projectsQuery } from "@/features/projects/api/queries";
import { phoneSearchSchema } from "@/lib/phone-nav";

export const Route = createFileRoute("/")({
	validateSearch: phoneSearchSchema,
	loaderDeps: ({ search }) => ({ app: search.app, id: search.id }),
	loader: async ({ context: { queryClient }, deps }) => {
		const [profile, projects, notes] = await Promise.all([
			queryClient.ensureQueryData(profileQuery),
			queryClient.ensureQueryData(projectsQuery),
			queryClient.ensureQueryData(notesQuery),
			queryClient.ensureQueryData(cvQuery),
			queryClient.ensureQueryData(homeWidgetsQuery),
			queryClient.ensureQueryData(lockNotificationsQuery),
			queryClient.ensureQueryData(conversationQuery),
			queryClient.ensureQueryData(shotsQuery),
			queryClient.ensureQueryData(contactInfoQuery),
		]);
		const project = deps.app === "projects" ? projects.find((p) => p.slug === deps.id) : undefined;
		const note = deps.app === "notes" ? notes.find((n) => n.slug === deps.id) : undefined;
		const page = project
			? { title: project.name, description: project.summary }
			: note
				? { title: note.title, description: note.excerpt }
				: undefined;
		return {
			title: page ? `${page.title} · ${profile.name}` : `${profile.name} · ${profile.headline}`,
			description: page?.description ?? profile.pitch,
			author: profile.name,
		};
	},
	head: ({ loaderData }) => ({
		meta: loaderData
			? [
					{ title: loaderData.title },
					{ name: "description", content: loaderData.description },
					{ property: "og:title", content: loaderData.title },
					{ property: "og:description", content: loaderData.description },
					{ property: "og:type", content: "profile" },
					{ name: "author", content: loaderData.author },
				]
			: [],
	}),
	component: PhonePage,
});
