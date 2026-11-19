import { cn } from "@repo/ui/lib/cn";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Header button for a TanStack Table column. Pass the column's sort state and toggle handler. */
export function SortableHeader({
	children,
	sorted,
	onToggle,
	align = "left",
}: {
	children: ReactNode;
	sorted: false | "asc" | "desc";
	onToggle?: (event: unknown) => void;
	align?: "left" | "right";
}) {
	const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;
	return (
		<button
			type="button"
			onClick={onToggle}
			className={cn(
				"-mx-1 inline-flex items-center gap-1 rounded px-1 font-medium text-muted-foreground text-xs hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				align === "right" && "flex-row-reverse",
				sorted && "text-foreground",
			)}
		>
			{children}
			<Icon aria-hidden className={cn("size-3", !sorted && "opacity-40")} />
		</button>
	);
}

export function ariaSort(sorted: false | "asc" | "desc") {
	return sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none";
}
