import { cn } from "@repo/ui/lib/cn";
import type { LucideIcon } from "lucide-react";
import { type Swatch, swatchVar } from "@/lib/palette";

const SIZES = {
	xs: "size-6 rounded-[7px] [&_svg]:size-3.5",
	sm: "size-8 rounded-[9px] [&_svg]:size-4",
	md: "size-12 rounded-[14px] [&_svg]:size-6",
	lg: "size-14 rounded-[16px] [&_svg]:size-7",
	xl: "size-16 rounded-[18px] [&_svg]:size-8",
} as const;

/** A rounded-square app tile: a flat solid swatch with a white glyph (dark on yellow, deep teal on aqua). */
export function AppIcon({
	icon: Icon,
	swatch,
	size = "md",
	className,
}: {
	icon: LucideIcon;
	swatch: Swatch;
	size?: keyof typeof SIZES;
	className?: string;
}) {
	return (
		<span
			aria-hidden
			className={cn(
				"relative inline-flex shrink-0 items-center justify-center shadow-soft",
				"after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-black/6 after:ring-inset",
				SIZES[size],
				className,
			)}
			style={{ backgroundColor: swatchVar(swatch), color: swatchVar(swatch, "ink") }}
		>
			<Icon strokeWidth={2} className="relative" />
		</span>
	);
}
