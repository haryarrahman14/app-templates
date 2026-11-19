import { cn } from "@repo/ui/lib/cn";
import type { Project } from "@/features/projects/schemas/project";
import { glyphOn } from "@/lib/palette";

type Cover = { src?: string; alt?: string };

/**
 * Cover: a real screenshot when `cover.src` is set, otherwise a flat solid fill from the category set with the
 * project's initial in white (dark on yellow).
 */
export function ProjectThumb({
	project,
	className,
	label,
	cover,
}: {
	project: Pick<Project, "title" | "color">;
	className?: string;
	label?: string;
	cover?: Cover;
}) {
	if (cover?.src) {
		return (
			<div className={cn("relative overflow-hidden bg-foreground/[0.04]", className)}>
				<img
					src={cover.src}
					alt={cover.alt ?? ""}
					loading="lazy"
					decoding="async"
					className="size-full object-cover object-top"
				/>
			</div>
		);
	}
	return (
		<div
			className={cn("relative flex items-center justify-center overflow-hidden", className)}
			style={{
				background: project.color,
				color: glyphOn(project.color),
			}}
		>
			{label ? (
				<span className="relative rounded-full bg-card/70 px-3 py-1 font-medium text-foreground text-xs backdrop-blur-sm">
					{label}
				</span>
			) : (
				<span className="relative font-semibold text-4xl tracking-tight">{project.title[0]}</span>
			)}
		</div>
	);
}
