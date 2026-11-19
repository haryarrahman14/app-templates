import { cn } from "@repo/ui/lib/cn";

/** Tiny inline trend line (plain SVG, cheap enough for every table row). Decorative: pair with text. */
export function Sparkline({
	values,
	className,
	width = 96,
	height = 28,
	trend,
}: {
	values: number[];
	className?: string;
	width?: number;
	height?: number;
	/** Force a colour; defaults to last vs first. */
	trend?: "up" | "down";
}) {
	if (values.length < 2)
		return <span className={cn("inline-block", className)} style={{ width, height }} />;
	const min = Math.min(...values);
	const max = Math.max(...values);
	const span = max - min || 1;
	const step = width / (values.length - 1);
	const points = values
		.map(
			(v, i) =>
				`${(i * step).toFixed(1)},${(height - 2 - ((v - min) / span) * (height - 4)).toFixed(1)}`,
		)
		.join(" ");
	const direction = trend ?? ((values[values.length - 1] ?? 0) >= (values[0] ?? 0) ? "up" : "down");
	return (
		<svg
			aria-hidden
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			className={cn(direction === "up" ? "text-gain" : "text-loss", className)}
		>
			<polyline
				points={points}
				fill="none"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinejoin="round"
				strokeLinecap="round"
			/>
		</svg>
	);
}

/** Thin horizontal bar for weights in lists (allocation, sectors). */
export function MeterBar({
	value,
	max = 100,
	className,
	tone = "tint",
}: {
	value: number;
	max?: number;
	className?: string;
	tone?: "tint" | "gain" | "loss" | "muted";
}) {
	const pct = Math.max(2, Math.min(100, (Math.abs(value) / (max || 1)) * 100));
	return (
		<span
			aria-hidden
			className={cn(
				"block h-1 w-full overflow-hidden rounded-full bg-foreground/[0.07]",
				className,
			)}
		>
			<span
				className={cn(
					"block h-full rounded-full",
					tone === "tint" && "bg-tint",
					tone === "gain" && "bg-gain",
					tone === "loss" && "bg-loss",
					tone === "muted" && "bg-muted-foreground/50",
				)}
				style={{ width: `${pct}%` }}
			/>
		</span>
	);
}
