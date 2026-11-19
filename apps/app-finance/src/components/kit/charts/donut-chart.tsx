import { useReducedMotion } from "motion/react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type DonutSlice = { name: string; value: number; color: string };

/** Allocation donut with a centred total. Pair it with a visible legend/list for the numbers. */
export function DonutChart({
	data,
	centerLabel,
	centerValue,
	formatValue,
	size = 200,
}: {
	data: DonutSlice[];
	centerLabel: string;
	centerValue: string;
	formatValue: (value: number) => string;
	size?: number;
}) {
	const reduce = useReducedMotion();
	const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
	const summary = data.map((d) => `${d.name} ${((d.value / total) * 100).toFixed(1)}%`).join(", ");
	return (
		<figure className="relative mx-auto" style={{ width: size, height: size }}>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data.map((d) => ({ ...d, fill: d.color }))}
						dataKey="value"
						nameKey="name"
						innerRadius="72%"
						outerRadius="100%"
						paddingAngle={1.5}
						cornerRadius={4}
						stroke="none"
						isAnimationActive={!reduce}
						animationDuration={500}
					/>
					<Tooltip
						cursor={false}
						content={({ active, payload }) => {
							const item = payload?.[0];
							if (!active || !item) return null;
							return (
								<div className="rounded-lg border bg-popover px-2.5 py-1.5 text-xs shadow-float">
									<p className="font-medium">{String(item.name)}</p>
									<p className="text-muted-foreground tabular-nums">
										{formatValue(Number(item.value))} ·{" "}
										{((Number(item.value) / total) * 100).toFixed(1)}%
									</p>
								</div>
							);
						}}
					/>
				</PieChart>
			</ResponsiveContainer>
			<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
				<span className="text-muted-foreground text-xs">{centerLabel}</span>
				<span className="font-semibold text-lg tabular-nums">{centerValue}</span>
			</div>
			<figcaption className="sr-only">Allocation: {summary}</figcaption>
		</figure>
	);
}
