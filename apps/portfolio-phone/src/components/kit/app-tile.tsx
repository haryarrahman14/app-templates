import { cn } from "@repo/ui/lib/cn";
import type { LucideIcon } from "lucide-react";
import { type CategoryColor, colorFill } from "@/lib/icons";

/** A rounded-square icon tile: a solid category colour, hairline edge, glyph in the colour's ink. */
export function AppTile({
	icon: Icon,
	color,
	size = 60,
	className,
}: {
	icon: LucideIcon;
	color: CategoryColor;
	size?: number;
	className?: string;
}) {
	return (
		<span
			aria-hidden
			className={cn(
				"relative grid shrink-0 place-items-center overflow-hidden shadow-[0_1px_2px_#0000001a]",
				className,
			)}
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.27,
				...colorFill(color),
			}}
		>
			<span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-black/5 ring-inset dark:ring-white/10" />
			<Icon
				className="relative"
				style={{ width: size * 0.46, height: size * 0.46 }}
				strokeWidth={1.9}
			/>
		</span>
	);
}
