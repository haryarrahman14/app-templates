import { AboutApp } from "@/features/about/components/about-app";
import { ContactApp } from "@/features/contact/components/contact-app";
import { ExperienceApp } from "@/features/experience/components/experience-app";
import { MessagesApp } from "@/features/messages/components/messages-app";
import { NotesApp } from "@/features/notes/components/notes-app";
import { PhotosApp } from "@/features/photos/components/photos-app";
import { ProjectsApp } from "@/features/projects/components/projects-app";
import { SettingsApp } from "@/features/settings/components/settings-app";
import type { AppId } from "@/lib/apps";

/** Which feature renders each in-phone app. Add a line here when you add an app. */
export function renderAppView(app: AppId, actions: { lock: () => void }) {
	switch (app) {
		case "about":
			return <AboutApp />;
		case "projects":
			return <ProjectsApp />;
		case "notes":
			return <NotesApp />;
		case "photos":
			return <PhotosApp />;
		case "messages":
			return <MessagesApp />;
		case "contact":
			return <ContactApp />;
		case "experience":
			return <ExperienceApp />;
		case "settings":
			return <SettingsApp onLock={actions.lock} />;
	}
}
