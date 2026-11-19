import {
	BriefcaseBusinessIcon,
	FolderIcon,
	type LucideIcon,
	SproutIcon,
	UsersIcon,
} from "lucide-react";
import type { ProjectCategory } from "@/features/projects/schemas/project";

export const CATEGORIES: { id: ProjectCategory | "all"; label: string; icon: LucideIcon }[] = [
	{ id: "all", label: "All projects", icon: FolderIcon },
	{ id: "own", label: "Own projects", icon: SproutIcon },
	{ id: "work", label: "At work", icon: BriefcaseBusinessIcon },
	{ id: "client", label: "Freelance clients", icon: UsersIcon },
];

export const categoryLabel = (id: ProjectCategory) =>
	CATEGORIES.find((category) => category.id === id)?.label ?? id;
