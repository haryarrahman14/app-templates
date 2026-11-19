import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";

export function TickerChip({ symbol, className }: { symbol: string; className?: string }) {
	return (
		<Link
			to="/markets/$symbol"
			params={{ symbol: symbol }}
			className={cn(
				"inline-flex items-center rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-medium font-mono text-[11px] tracking-tight transition-colors hover:bg-foreground/[0.12] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				className,
			)}
		>
			{symbol}
		</Link>
	);
}
