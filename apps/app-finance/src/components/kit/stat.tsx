import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";

export function Stat({
	label,
	value,
	hint,
	className,
}: {
	label: ReactNode;
	value: ReactNode;
	hint?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("min-w-0", className)}>
			<dt className="text-muted-foreground text-xs">{label}</dt>
			<dd className="mt-1 truncate font-medium tabular-nums">{value}</dd>
			{hint ? <dd className="text-muted-foreground text-xs">{hint}</dd> : null}
		</div>
	);
}
