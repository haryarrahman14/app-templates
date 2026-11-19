import type { QueryClient } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { aboutQuery } from "@/features/about/api/queries";
import { AboutPage } from "@/features/about/components/about-page";
import { contactInfoQuery } from "@/features/contact/api/queries";
import { ContactPage } from "@/features/contact/components/contact-page";
import { experienceQuery } from "@/features/experience/api/queries";
import { ExperiencePage } from "@/features/experience/components/experience-page";
import { fileSystemQuery } from "@/features/files/api/queries";
import { FilesPage } from "@/features/files/components/files-page";
import { artworksQuery } from "@/features/gallery/api/queries";
import { GalleryPage } from "@/features/gallery/components/gallery-page";
import { notebookQuery } from "@/features/notes/api/queries";
import { NotesPage } from "@/features/notes/components/notes-page";
import { projectsQuery } from "@/features/projects/api/queries";
import { ProjectsPage } from "@/features/projects/components/projects-page";
import { SettingsPage } from "@/features/settings/components/settings-page";
import { widgetContentQuery } from "@/features/widgets/api/queries";
import type { AppId, AppViewProps } from "@/lib/apps";

/** Which component renders each app. Add your app's page here after adding its id to lib/apps.ts. */
export const APP_VIEWS: Record<AppId, ComponentType<AppViewProps>> = {
	about: AboutPage,
	projects: ProjectsPage,
	notes: NotesPage,
	files: FilesPage,
	gallery: GalleryPage,
	experience: ExperiencePage,
	contact: ContactPage,
	settings: SettingsPage,
};

/** Loads every feature's content before render, so the server HTML is complete (SEO, shared links). */
export async function preloadContent(queryClient: QueryClient) {
	const [about, projects] = await Promise.all([
		queryClient.ensureQueryData(aboutQuery),
		queryClient.ensureQueryData(projectsQuery),
		queryClient.ensureQueryData(notebookQuery),
		queryClient.ensureQueryData(fileSystemQuery),
		queryClient.ensureQueryData(artworksQuery),
		queryClient.ensureQueryData(experienceQuery),
		queryClient.ensureQueryData(contactInfoQuery),
		queryClient.ensureQueryData(widgetContentQuery),
	]);
	return {
		profile: about.profile,
		projects: projects.map((p) => ({ slug: p.slug, title: p.title, summary: p.summary })),
	};
}
