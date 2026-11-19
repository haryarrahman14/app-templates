import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";

/** Category tones from the shared system set (gray is the neutral default). */
export type PillTone = "gray" | "blue" | "green" | "orange" | "red" | "yellow" | "teal";

const TONES: Record<PillTone, string> = {
	gray: "bg-cat-gray-soft text-cat-gray-ink",
	blue: "bg-cat-blue-soft text-cat-blue-ink",
	green: "bg-cat-green-soft text-cat-green-ink",
	orange: "bg-cat-orange-soft text-cat-orange-ink",
	red: "bg-cat-red-soft text-cat-red-ink",
	yellow: "bg-cat-yellow-soft text-cat-yellow-ink",
	teal: "bg-cat-teal-soft text-cat-teal-ink",
};

export const DOT_TONES: Record<PillTone, string> = {
	gray: "bg-cat-gray",
	blue: "bg-cat-blue",
	green: "bg-cat-green",
	orange: "bg-cat-orange",
	red: "bg-cat-red",
	yellow: "bg-cat-yellow",
	teal: "bg-cat-teal",
};

/** A soft status pill with an optional dot. */
export function Pill({
	tone = "gray",
	dot = false,
	children,
	className,
}: {
	tone?: PillTone;
	dot?: boolean;
	children: ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 font-medium text-xs",
				TONES[tone],
				className,
			)}
		>
			{dot ? <span className={cn("size-1.5 rounded-full", DOT_TONES[tone])} /> : null}
			{children}
		</span>
	);
}
