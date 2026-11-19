import { cn } from "@repo/ui/lib/cn";
import { FlaskConicalIcon } from "lucide-react";

/** Persistent reminder that every number on screen is generated sample data. */
export function SampleChip({ className }: { className?: string }) {
	return (
		<span
			title="All instruments, prices and news are invented sample data. Nothing here is real or advice."
			className={cn(
				"inline-flex items-center gap-1 rounded-full border border-dashed border-foreground/20 px-2 py-0.5 font-medium text-[11px] text-muted-foreground uppercase tracking-wide",
				className,
			)}
		>
			<FlaskConicalIcon aria-hidden className="size-3" />
			Sample data
		</span>
	);
}
