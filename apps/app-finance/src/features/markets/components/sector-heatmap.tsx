import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { sectorTilesQuery } from "@/features/markets/api/queries";
import { useFormat } from "@/lib/use-format";

/** Sector heatmap: tile size follows market cap, colour runs from the neutral card to green or red with the move (with sign + arrow). */
export function SectorHeatmap({
	selected,
	onSelect,
}: {
	selected: string;
	onSelect: (sector: string) => void;
}) {
	const { data } = useSuspenseQuery(sectorTilesQuery);
	const format = useFormat();
	const sorted = [...data].sort((a, b) => b.capBn - a.capBn);
	const maxMove = Math.max(...data.map((d) => Math.abs(d.changePct)), 0.5);

	return (
		<Panel aria-labelledby="heatmap-title">
			<PanelHeader
				id="heatmap-title"
				title="Sectors today"
				description="Cap-weighted move. Select a sector to filter the screener."
			/>
			<ul className="grid grid-flow-dense auto-rows-[88px] grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
				{sorted.map((tile, index) => {
					const strength = Math.min(1, Math.abs(tile.changePct) / maxMove);
					const tone = tile.changePct >= 0 ? "var(--gain)" : "var(--loss)";
					const active = selected === tile.sector;
					return (
						<li
							key={tile.sector}
							className={cn(
								index < 2 && "sm:col-span-2 sm:row-span-2",
								(index === 2 || index === sorted.length - 1) && "lg:col-span-2",
							)}
						>
							<button
								type="button"
								aria-pressed={active}
								onClick={() => onSelect(active ? "all" : tile.sector)}
								className={cn(
									"flex size-full flex-col justify-between rounded-xl border p-3 text-left transition-[transform,box-shadow] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									active ? "border-foreground/40 shadow-float" : "border-transparent",
								)}
								style={{
									background: `color-mix(in srgb, ${tone} ${Math.round(6 + strength * 30)}%, var(--card))`,
								}}
							>
								<span className="font-medium text-sm leading-tight">{tile.sector}</span>
								<span>
									<span className="block font-semibold tabular-nums">
										{tile.changePct >= 0 ? "▲" : "▼"}{" "}
										{format.percent(tile.changePct, { signed: true })}
									</span>
									<span className="block text-[11px] text-foreground/70">
										{tile.count} names · lead {tile.leader.symbol}
									</span>
								</span>
							</button>
						</li>
					);
				})}
			</ul>
		</Panel>
	);
}
