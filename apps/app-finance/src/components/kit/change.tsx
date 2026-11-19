import { cn } from "@repo/ui/lib/cn";
import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react";
import { trend } from "@/lib/format";

const COLOR = { up: "text-gain", down: "text-loss", flat: "text-muted-foreground" } as const;
const ICON = { up: ArrowUpRightIcon, down: ArrowDownRightIcon, flat: MinusIcon } as const;
const WORD = { up: "up", down: "down", flat: "unchanged" } as const;

/**
 * A change value that never relies on colour alone: it carries an arrow, an explicit sign in the text,
 * and a screen-reader word ("up" / "down").
 */
export function Change({
	value,
	children,
	className,
	showIcon = true,
}: {
	/** Drives direction; usually the percent or amount. */
	value: number;
	/** Already-formatted text (with sign). */
	children: React.ReactNode;
	className?: string;
	showIcon?: boolean;
}) {
	const direction = trend(value);
	const Icon = ICON[direction];
	return (
		<span
			className={cn("inline-flex items-center gap-0.5 tabular-nums", COLOR[direction], className)}
		>
			{showIcon ? <Icon aria-hidden className="size-3.5 shrink-0" /> : null}
			<span className="sr-only">{WORD[direction]} </span>
			{children}
		</span>
	);
}

export function ChangePill({ value, children }: { value: number; children: React.ReactNode }) {
	const direction = trend(value);
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 font-medium text-xs",
				direction === "up" && "bg-gain/12",
				direction === "down" && "bg-loss/12",
				direction === "flat" && "bg-muted",
			)}
		>
			<Change value={value}>{children}</Change>
		</span>
	);
}
