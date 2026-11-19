import {
	BriefcaseBusinessIcon,
	FolderOpenIcon,
	HouseIcon,
	type LucideIcon,
	MailIcon,
	NotebookPenIcon,
	Settings2Icon,
	SquareTerminalIcon,
	UserRoundIcon,
} from "lucide-react";
import { z } from "zod";
import { CATEGORY } from "@/lib/palette";

/** Every window the desktop can open. Add an id here, then register its component in components/layout/app-registry.tsx. */
export const APP_IDS = [
	"home",
	"about",
	"projects",
	"notes",
	"experience",
	"contact",
	"terminal",
	"settings",
] as const;

export const appIdSchema = z.enum(APP_IDS);
export type AppId = z.infer<typeof appIdSchema>;

export type AppMeta = {
	id: AppId;
	title: string;
	/** Short line used in tooltips, the Go menu and the terminal. */
	hint: string;
	icon: LucideIcon;
	/** Solid tile fill: the accent for the primary tile, otherwise one colour from the category set (lib/palette.ts). */
	color: string;
	/** Default window size on desktop, in px. */
	size: { w: number; h: number };
};

export const APPS: Record<AppId, AppMeta> = {
	home: {
		id: "home",
		title: "Welcome",
		hint: "Start here",
		icon: HouseIcon,
		color: "var(--tint)",
		size: { w: 840, h: 520 },
	},
	about: {
		id: "about",
		title: "About me",
		hint: "Profile, skills and story",
		icon: UserRoundIcon,
		color: CATEGORY.blue,
		size: { w: 720, h: 560 },
	},
	projects: {
		id: "projects",
		title: "Projects",
		hint: "Selected work",
		icon: FolderOpenIcon,
		color: CATEGORY.orange,
		size: { w: 880, h: 580 },
	},
	notes: {
		id: "notes",
		title: "Notes",
		hint: "Writing and thoughts",
		icon: NotebookPenIcon,
		color: CATEGORY.yellow,
		size: { w: 860, h: 580 },
	},
	experience: {
		id: "experience",
		title: "Experience",
		hint: "CV and timeline",
		icon: BriefcaseBusinessIcon,
		color: CATEGORY.green,
		size: { w: 700, h: 580 },
	},
	contact: {
		id: "contact",
		title: "Contact",
		hint: "Write me a message",
		icon: MailIcon,
		color: CATEGORY.teal,
		size: { w: 620, h: 560 },
	},
	terminal: {
		id: "terminal",
		title: "Terminal",
		hint: "Type help",
		icon: SquareTerminalIcon,
		color: CATEGORY.graphite,
		size: { w: 640, h: 400 },
	},
	settings: {
		id: "settings",
		title: "Settings",
		hint: "Theme, wallpaper, accent",
		icon: Settings2Icon,
		color: CATEGORY.gray,
		size: { w: 620, h: 540 },
	},
};

export const DOCK_APPS: AppId[] = [
	"home",
	"about",
	"projects",
	"notes",
	"experience",
	"contact",
	"terminal",
	"settings",
];

export const DESKTOP_APPS: AppId[] = ["home", "about", "projects", "notes", "contact"];
