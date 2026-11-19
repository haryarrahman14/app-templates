import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AboutApp } from "@/features/about/components/about-app";
import { WelcomeApp } from "@/features/about/components/welcome-app";
import type { Profile } from "@/features/about/schemas/profile";
import { ContactApp } from "@/features/contact/components/contact-app";
import { ExperienceApp } from "@/features/experience/components/experience-app";
import { NotesApp } from "@/features/notes/components/notes-app";
import { projectsQuery } from "@/features/projects/api/queries";
import { ProjectsApp } from "@/features/projects/components/projects-app";
import { SettingsApp } from "@/features/settings/components/settings-app";
import { TerminalApp } from "@/features/terminal/components/terminal-app";
import type { AppId } from "@/lib/apps";

/** Terminal needs data from two features; the shell is the one place allowed to join them. */
function TerminalWindow({ profile }: { profile: Profile }) {
	const { data: projects } = useSuspenseQuery(projectsQuery);
	return <TerminalApp profile={profile} projects={projects} />;
}

/**
 * Window contents by app id. To add an app: add its id + meta in lib/apps.ts,
 * build features/<name>/components/<name>-app.tsx, and return it here.
 */
export function renderApp(id: AppId, profile: Profile): ReactNode {
	switch (id) {
		case "home":
			return <WelcomeApp />;
		case "about":
			return <AboutApp />;
		case "projects":
			return <ProjectsApp />;
		case "notes":
			return <NotesApp />;
		case "experience":
			return <ExperienceApp owner={profile} />;
		case "contact":
			return (
				<ContactApp
					to={profile.email}
					ownerName={profile.name}
					links={profile.links.filter((link) => !link.href.startsWith("mailto:"))}
				/>
			);
		case "terminal":
			return <TerminalWindow profile={profile} />;
		case "settings":
			return <SettingsApp />;
	}
}
