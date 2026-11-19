import { useState } from "react";
import { DonutChart } from "@/components/kit/charts/donut-chart";
import { Panel, PanelHeader } from "@/components/kit/panel";
import type { HoldingRow } from "@/features/portfolio/schemas/portfolio";
import { useFormat } from "@/lib/use-format";

const COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
	"var(--chart-7)",
	"var(--chart-6)",
];

export function AllocationDonutCard({ holdings, cash }: { holdings: HoldingRow[]; cash: number }) {
	const [by, setBy] = useState<"sector" | "holding">("sector");
	const format = useFormat();

	const groups = new Map<string, number>();
	for (const h of holdings) {
		const key = by === "sector" ? h.sector : h.symbol;
		groups.set(key, (groups.get(key) ?? 0) + h.value);
	}
	const sorted = [...groups.entries()].sort((a, b) => b[1] - a[1]);
	const top = sorted.slice(0, 5);
	const rest = sorted.slice(5).reduce((s, [, v]) => s + v, 0);
	const slices = [
		...top.map(([name, value]) => ({ name, value })),
		...(rest ? [{ name: "Other", value: rest }] : []),
		{ name: "Cash", value: cash },
	].map((slice, i) => ({ ...slice, color: COLORS[i % COLORS.length] ?? "var(--chart-1)" }));
	const total = slices.reduce((s, d) => s + d.value, 0);

	return (
		<Panel aria-labelledby="alloc-title">
			<PanelHeader
				id="alloc-title"
				title="Allocation"
				action={
					<div
						role="radiogroup"
						aria-label="Group allocation by"
						className="inline-flex rounded-full bg-foreground/[0.05] p-0.5 text-xs"
					>
						{(["sector", "holding"] as const).map((value) => (
							// biome-ignore lint/a11y/useSemanticElements: segmented control, ARIA radio pattern.
							<button
								key={value}
								type="button"
								role="radio"
								aria-checked={by === value}
								onClick={() => setBy(value)}
								className={
									by === value
										? "rounded-full bg-background px-2.5 py-1 font-medium shadow-sm dark:bg-foreground/15"
										: "rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground"
								}
							>
								By {value}
							</button>
						))}
					</div>
				}
			/>
			<DonutChart
				data={slices}
				centerLabel="Total"
				centerValue={format.currency(total, { compact: true })}
				formatValue={(v) => format.currency(v)}
				size={196}
			/>
			<ul className="mt-5 space-y-2 text-sm">
				{slices.map((slice) => (
					<li key={slice.name} className="flex items-center gap-2">
						<span
							aria-hidden
							className="size-2.5 shrink-0 rounded-sm"
							style={{ background: slice.color }}
						/>
						<span className="flex-1 truncate">{slice.name}</span>
						<span className="text-muted-foreground tabular-nums">
							{format.currency(slice.value, { compact: true })}
						</span>
						<span className="w-14 text-right tabular-nums">
							{format.percent((slice.value / total) * 100, { digits: 1 })}
						</span>
					</li>
				))}
			</ul>
		</Panel>
	);
}
