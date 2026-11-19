import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";
import { type Swatch, swatchVar } from "@/lib/palette";

/** A flat stand-in for an image: one solid palette swatch. Replace with <img> once you have real pictures. */
export function Placeholder({
	swatch,
	className,
	children,
	label,
}: {
	swatch: Swatch;
	className?: string;
	children?: ReactNode;
	/** Describes the image for screen readers. Omit for decorative placeholders. */
	label?: string;
}) {
	const props = {
		className: cn("relative overflow-hidden", className),
		style: { backgroundColor: swatchVar(swatch), color: swatchVar(swatch, "ink") },
	};
	return label ? (
		<div role="img" aria-label={label} {...props}>
			{children}
		</div>
	) : (
		<div aria-hidden {...props}>
			{children}
		</div>
	);
}
