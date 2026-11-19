import { cn } from "@repo/ui/lib/cn";
import { CHART_RANGES, type ChartRange } from "@/lib/ranges";

/** Segmented control for chart ranges (1D … 1Y). Arrow keys move between options. */
export function RangeTabs({
	value,
	onChange,
	ranges = CHART_RANGES,
	label = "Chart range",
	className,
}: {
	value: ChartRange;
	onChange: (range: ChartRange) => void;
	ranges?: readonly ChartRange[];
	label?: string;
	className?: string;
}) {
	return (
		<div
			role="radiogroup"
			aria-label={label}
			className={cn("inline-flex rounded-full bg-foreground/[0.05] p-0.5", className)}
			onKeyDown={(event) => {
				const index = ranges.indexOf(value);
				const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
				if (!delta) return;
				event.preventDefault();
				const next = ranges[(index + delta + ranges.length) % ranges.length];
				if (next) {
					onChange(next);
					const buttons = event.currentTarget.querySelectorAll("button");
					buttons[ranges.indexOf(next)]?.focus();
				}
			}}
		>
			{ranges.map((range) => {
				const active = range === value;
				return (
					// biome-ignore lint/a11y/useSemanticElements: a styled segmented control, ARIA radio pattern.
					<button
						key={range}
						type="button"
						role="radio"
						aria-checked={active}
						tabIndex={active ? 0 : -1}
						onClick={() => onChange(range)}
						className={cn(
							"rounded-full px-2.5 py-1 font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							active
								? "bg-background text-foreground shadow-sm dark:bg-foreground/15"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{range}
					</button>
				);
			})}
		</div>
	);
}
