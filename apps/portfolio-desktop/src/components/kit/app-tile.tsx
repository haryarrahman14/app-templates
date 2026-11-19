import { cn } from "@repo/ui/lib/cn";
import type { LucideIcon } from "lucide-react";
import { glyphOn } from "@/lib/palette";

/** Rounded-square app icon: a flat solid fill with a white glyph (dark on yellow). */
export function AppTile({
	icon: Icon,
	color,
	size = 48,
	className,
}: {
	icon: LucideIcon;
	/** A CSS colour: the accent or one of the category set, e.g. `var(--blue)`. */
	color: string;
	size?: number;
	className?: string;
}) {
	return (
		<span
			aria-hidden
			className={cn(
				"relative inline-flex shrink-0 items-center justify-center overflow-hidden shadow-[0_1px_2px_#0000001f,0_6px_14px_-4px_#00000038]",
				className,
			)}
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.24,
				background: color,
				color: glyphOn(color),
			}}
		>
			<span className="absolute inset-0 rounded-[inherit] ring-1 ring-black/10 ring-inset dark:ring-white/15" />
			<Icon
				className="relative"
				style={{ width: size * 0.5, height: size * 0.5 }}
				strokeWidth={1.75}
			/>
		</span>
	);
}
