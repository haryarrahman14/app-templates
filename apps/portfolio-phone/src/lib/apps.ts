import {
	BriefcaseBusiness,
	Images,
	Layers,
	type LucideIcon,
	MessageCircle,
	NotebookPen,
	Send,
	Settings2,
	UserRound,
} from "lucide-react";
import type { CategoryColor } from "@/lib/icons";

/**
 * Every in-phone app. The id is what `?app=` takes in the URL.
 * To add an app: add its id here, give it a tile below, and render it in
 * `components/layout/app-views.tsx`.
 */
export const APP_IDS = [
	"about",
	"projects",
	"notes",
	"photos",
	"messages",
	"contact",
	"experience",
	"settings",
] as const;

export type AppId = (typeof APP_IDS)[number];

export type AppMeta = {
	id: AppId;
	label: string;
	icon: LucideIcon;
	/** Solid fill of the icon tile (`COLORS` in lib/icons). Only the primary dock app uses the accent. */
	color: CategoryColor;
};

export const APPS: Record<AppId, AppMeta> = {
	about: {
		id: "about",
		label: "About",
		icon: UserRound,
		color: "teal",
	},
	projects: {
		id: "projects",
		label: "Projects",
		icon: Layers,
		color: "accent",
	},
	notes: {
		id: "notes",
		label: "Notes",
		icon: NotebookPen,
		color: "yellow",
	},
	photos: {
		id: "photos",
		label: "Shots",
		icon: Images,
		color: "red",
	},
	messages: {
		id: "messages",
		label: "Ask me",
		icon: MessageCircle,
		color: "orange",
	},
	contact: {
		id: "contact",
		label: "Contact",
		icon: Send,
		color: "blue",
	},
	experience: {
		id: "experience",
		label: "Experience",
		icon: BriefcaseBusiness,
		color: "graphite",
	},
	settings: {
		id: "settings",
		label: "Settings",
		icon: Settings2,
		color: "gray",
	},
};

/** The four apps in the dock; the rest live on the home pages. */
export const DOCK_APPS: AppId[] = ["projects", "notes", "messages", "contact"];
export const PAGE_ONE_APPS: AppId[] = ["about", "photos", "experience", "settings"];
