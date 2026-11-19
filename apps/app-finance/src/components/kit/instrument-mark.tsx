import { cn } from "@repo/ui/lib/cn";

/** Lettermark "logo" for an invented instrument: plain letters on a neutral tile. */
export function InstrumentMark({ symbol, className }: { symbol: string; className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-lettermark font-semibold text-[11px] text-lettermark-foreground tracking-tight",
				className,
			)}
		>
			{symbol.slice(0, 2)}
		</span>
	);
}
