import {
	ContactRound,
	FolderClosed,
	Images,
	LayoutGrid,
	type LucideIcon,
	Mail,
	NotebookPen,
	Route,
	Settings2,
} from "lucide-react";
import { z } from "zod";
import type { Swatch } from "@/lib/palette";

/** Every app on the home screen. Add an id here, then register its view in components/layout/app-registry.tsx. */
export const APP_IDS = [
	"about",
	"projects",
	"notes",
	"files",
	"gallery",
	"experience",
	"contact",
	"settings",
] as const;

export const appIdSchema = z.enum(APP_IDS);
export type AppId = z.infer<typeof appIdSchema>;

export type AppMeta = {
	id: AppId;
	name: string;
	/** One line, used in the switcher and for screen readers. */
	description: string;
	icon: LucideIcon;
	/** Palette swatch for the icon tile. */
	swatch: Swatch;
};

export const APPS: Record<AppId, AppMeta> = {
	about: {
		id: "about",
		name: "About",
		description: "Profile, skills, story, education",
		icon: ContactRound,
		swatch: "orange",
	},
	projects: {
		id: "projects",
		name: "Projects",
		description: "Selected work",
		icon: LayoutGrid,
		swatch: "aqua",
	},
	notes: {
		id: "notes",
		name: "Notes",
		description: "Blog posts and the story so far",
		icon: NotebookPen,
		swatch: "yellow",
	},
	files: {
		id: "files",
		name: "Files",
		description: "CV, blog posts, project write-ups",
		icon: FolderClosed,
		swatch: "blue",
	},
	gallery: {
		id: "gallery",
		name: "Gallery",
		description: "Screenshots of the work",
		icon: Images,
		swatch: "red",
	},
	experience: {
		id: "experience",
		name: "Experience",
		description: "CV and timeline",
		icon: Route,
		swatch: "graphite",
	},
	contact: {
		id: "contact",
		name: "Contact",
		description: "Email, LinkedIn, GitHub",
		icon: Mail,
		swatch: "green",
	},
	settings: {
		id: "settings",
		name: "Settings",
		description: "Theme, wallpaper, accent",
		icon: Settings2,
		swatch: "gray",
	},
};

/** Primary apps pinned in the dock. Recently used apps show after the divider. */
export const DOCK_APPS: AppId[] = ["about", "projects", "notes", "files", "contact"];

/** What every app view receives from the stage. */
export type AppViewProps = {
	/** The selected item inside the app (project slug, note id …), from the URL. */
	itemId?: string;
	onItemChange: (id: string | undefined) => void;
	/** Open another app (replaces this pane's neighbour, never this pane). */
	openApp: (app: AppId, id?: string) => void;
};
