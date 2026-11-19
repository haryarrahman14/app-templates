import { cn } from "@repo/ui/lib/cn";
import type { Project } from "@/features/projects/schemas/project";
import { CONTENT_ICONS, colorFill } from "@/lib/icons";

/** The project's flat art: a 40px tile (compact) or a wide hero. */
export function ProjectArt({
	project,
	compact,
	className,
}: {
	project: Pick<Project, "icon" | "color" | "name">;
	compact?: boolean;
	className?: string;
}) {
	const Icon = CONTENT_ICONS[project.icon];
	if (compact) {
		return (
			<span
				aria-hidden
				className={cn("grid size-10 shrink-0 place-items-center rounded-[11px]", className)}
				style={colorFill(project.color)}
			>
				<Icon className="size-5" strokeWidth={2} />
			</span>
		);
	}
	return (
		<div
			aria-hidden
			className={cn("relative grid place-items-center overflow-hidden", className)}
			style={colorFill(project.color)}
		>
			<span className="relative grid size-16 place-items-center rounded-[18px] bg-white/20">
				<Icon className="size-8" strokeWidth={1.8} />
			</span>
		</div>
	);
}
