import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";
import { normalizeTint } from "@/lib/palette";

/** Tag colours from the category set (literal classes so Tailwind generates them): the colour at
 * 12–16% alpha with a darker text of the same hue. */
export const TAG_TINTS: Record<string, string> = {
	blue: "bg-cat-blue/14 text-cat-blue-ink",
	green: "bg-cat-green/14 text-cat-green-ink",
	orange: "bg-cat-orange/14 text-cat-orange-ink",
	teal: "bg-cat-teal/14 text-cat-teal-ink",
	red: "bg-cat-red/14 text-cat-red-ink",
	yellow: "bg-cat-yellow/16 text-cat-yellow-ink",
	gray: "bg-cat-gray/14 text-cat-gray-ink",
};

export const TAG_DOTS: Record<string, string> = {
	blue: "bg-cat-blue",
	green: "bg-cat-green",
	orange: "bg-cat-orange",
	teal: "bg-cat-teal",
	red: "bg-cat-red",
	yellow: "bg-cat-yellow",
	gray: "bg-cat-gray",
};

export const TAG_TINT_KEYS = Object.keys(TAG_TINTS);

export function TagDot({ tint, className }: { tint: string; className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"inline-block size-2 shrink-0 rounded-full",
				TAG_DOTS[String(normalizeTint(tint))] ?? "bg-cat-gray",
				className,
			)}
		/>
	);
}

export function TagPill({
	tint,
	children,
	className,
}: {
	tint: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex h-5 items-center gap-1 rounded-full px-2 font-medium text-[11px]",
				TAG_TINTS[String(normalizeTint(tint))] ?? "bg-muted text-muted-foreground",
				className,
			)}
		>
			{children}
		</span>
	);
}
