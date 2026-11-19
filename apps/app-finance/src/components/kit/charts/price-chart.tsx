import { useReducedMotion } from "motion/react";
import { useId } from "react";
import {
	Area,
	Bar,
	ComposedChart,
	Line,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { formatDate } from "@/lib/format";
import type { ChartRange } from "@/lib/ranges";

export type ChartPoint = {
	t: number;
	close: number;
	open?: number;
	high?: number;
	low?: number;
	/** Optional second series (e.g. a benchmark), drawn as a thin dashed line. */
	compare?: number;
};

type Props = {
	data: ChartPoint[];
	range: ChartRange;
	/** Reference value the change is measured from (previous close / starting value). */
	base: number;
	mode?: "line" | "candle";
	height?: number;
	formatValue: (value: number) => string;
	formatChange: (value: number, pct: number) => string;
	/** Name read out in the text summary, e.g. "NVRA price" or "Portfolio value". */
	label: string;
	compareLabel?: string;
	baseLabel?: string;
	/** "direction" colours the line by gain/loss; "tint" draws it in the brand accent (headline portfolio chart). */
	tone?: "direction" | "tint";
};

const isIntraday = (range: ChartRange) => range === "1D" || range === "1W";

function tickLabel(t: number, range: ChartRange) {
	if (range === "1D") return formatDate(t, "time");
	if (range === "1W") return formatDate(t, "weekday").split(",")[0] ?? "";
	return formatDate(t, "day");
}

type CandleShapeProps = {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	payload?: ChartPoint;
};

function Candle({ x = 0, y = 0, width = 0, height = 0, payload }: CandleShapeProps) {
	if (!payload || payload.open == null || payload.high == null || payload.low == null) return null;
	const { open, close, high, low } = payload;
	const span = high - low || 1;
	const ppu = height / span;
	const up = close >= open;
	const top = y + (high - Math.max(open, close)) * ppu;
	const bodyHeight = Math.max(1, Math.abs(open - close) * ppu);
	const center = x + width / 2;
	const bodyWidth = Math.max(1, Math.min(width * 0.7, 10));
	const color = up ? "var(--gain)" : "var(--loss)";
	return (
		<g>
			<line x1={center} x2={center} y1={y} y2={y + height} stroke={color} strokeWidth={1} />
			<rect
				x={center - bodyWidth / 2}
				y={top}
				width={bodyWidth}
				height={bodyHeight}
				rx={1}
				fill={color}
				fillOpacity={up ? 0.85 : 1}
			/>
		</g>
	);
}

/**
 * The big price chart: area line or candles, previous-close reference line, crosshair tooltip and a
 * screen-reader summary. Colour follows the range's direction (gain/loss tokens) unless `tone="tint"`.
 */
export function PriceChart({
	data,
	range,
	base,
	mode = "line",
	height = 300,
	formatValue,
	formatChange,
	label,
	compareLabel,
	baseLabel = "Previous close",
	tone = "direction",
}: Props) {
	const id = useId().replace(/:/g, "");
	const reduce = useReducedMotion();
	const first = data[0];
	const last = data[data.length - 1];
	if (!first || !last) {
		return (
			<div
				className="flex items-center justify-center text-muted-foreground text-sm"
				style={{ height }}
			>
				No data for this range.
			</div>
		);
	}
	const up = last.close >= base;
	const color = tone === "tint" ? "var(--tint)" : up ? "var(--gain)" : "var(--loss)";
	const values = data.flatMap((d) => [d.low ?? d.close, d.high ?? d.close, d.compare ?? d.close]);
	values.push(base);
	const min = Math.min(...values);
	const max = Math.max(...values);
	const pad = (max - min) * 0.08 || max * 0.01;
	const change = last.close - base;
	const pct = (change / base) * 100;
	const high = Math.max(...data.map((d) => d.high ?? d.close));
	const low = Math.min(...data.map((d) => d.low ?? d.close));
	const chartData = data.map((d) => ({ ...d, range: [d.low ?? d.close, d.high ?? d.close] }));

	return (
		<figure className="relative w-full">
			<div style={{ height }} className="w-full [&_.recharts-surface]:outline-none">
				<ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 600, height }}>
					<ComposedChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
						<defs>
							<linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor={color} stopOpacity={0.18} />
								<stop offset="100%" stopColor={color} stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis
							dataKey="t"
							type="category"
							tickFormatter={(t: number) => tickLabel(t, range)}
							tickLine={false}
							axisLine={false}
							minTickGap={48}
							tickMargin={8}
							className="text-[11px]"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<YAxis
							orientation="right"
							domain={[min - pad, max + pad]}
							tickFormatter={(v: number) => formatValue(v)}
							tickLine={false}
							axisLine={false}
							width={72}
							tickCount={5}
							className="text-[11px]"
							tick={{ fill: "var(--muted-foreground)" }}
						/>
						<ReferenceLine
							y={base}
							stroke="var(--muted-foreground)"
							strokeOpacity={0.5}
							strokeDasharray="2 4"
						/>
						<Tooltip
							cursor={{
								stroke: "var(--muted-foreground)",
								strokeDasharray: "3 3",
								strokeOpacity: 0.7,
							}}
							isAnimationActive={false}
							content={({ active, payload }) => {
								const point = payload?.[0]?.payload as ChartPoint | undefined;
								if (!active || !point) return null;
								const delta = point.close - base;
								return (
									<div className="min-w-36 rounded-xl border bg-popover/95 px-3 py-2 text-xs shadow-float backdrop-blur">
										<p className="text-muted-foreground">
											{formatDate(point.t, isIntraday(range) ? "dayTime" : "medium")}
										</p>
										<p className="mt-0.5 font-semibold text-sm tabular-nums">
											{formatValue(point.close)}
										</p>
										<p className={delta >= 0 ? "text-gain" : "text-loss"}>
											{delta >= 0 ? "▲" : "▼"} {formatChange(delta, (delta / base) * 100)}
										</p>
										{mode === "candle" && point.open != null ? (
											<p className="mt-1 text-muted-foreground tabular-nums">
												O {formatValue(point.open)} · H {formatValue(point.high ?? point.close)} · L{" "}
												{formatValue(point.low ?? point.close)}
											</p>
										) : null}
										{point.compare != null && compareLabel ? (
											<p className="mt-1 text-muted-foreground tabular-nums">
												{compareLabel} {formatValue(point.compare)}
											</p>
										) : null}
									</div>
								);
							}}
						/>
						{mode === "line" ? (
							<Area
								type="monotone"
								dataKey="close"
								stroke={color}
								strokeWidth={1.75}
								fill={`url(#fill-${id})`}
								activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--background)", fill: color }}
								isAnimationActive={!reduce}
								animationDuration={450}
							/>
						) : (
							<Bar
								dataKey="range"
								shape={(props: unknown) => <Candle {...(props as CandleShapeProps)} />}
								isAnimationActive={false}
							/>
						)}
						{data.some((d) => d.compare != null) ? (
							<Line
								type="monotone"
								dataKey="compare"
								stroke="var(--muted-foreground)"
								strokeWidth={1.25}
								strokeDasharray="4 3"
								dot={false}
								activeDot={false}
								isAnimationActive={!reduce}
								animationDuration={450}
							/>
						) : null}
					</ComposedChart>
				</ResponsiveContainer>
			</div>
			<figcaption className="sr-only">
				{label}, {range}: from {formatValue(first.close)} to {formatValue(last.close)} (
				{formatChange(change, pct)} against {baseLabel.toLowerCase()} {formatValue(base)}). High{" "}
				{formatValue(high)}, low {formatValue(low)}.
			</figcaption>
		</figure>
	);
}
