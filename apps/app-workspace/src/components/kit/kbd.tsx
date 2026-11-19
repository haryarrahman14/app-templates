import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<kbd
			className={cn(
				"inline-flex h-5 min-w-5 items-center justify-center rounded-md border bg-muted px-1 font-medium font-sans text-[11px] text-muted-foreground",
				className,
			)}
		>
			{children}
		</kbd>
	);
}
