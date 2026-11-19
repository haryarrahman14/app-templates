import { useState } from "react";
import { PageHeader } from "@/components/kit/page-header";
import { ScreenerTable } from "@/features/markets/components/screener-table";
import { SectorHeatmap } from "@/features/markets/components/sector-heatmap";

export function MarketsPage() {
	const [sector, setSector] = useState("all");
	return (
		<>
			<PageHeader
				title="Markets"
				description="Screen the sample universe by sector, size and today's move."
			/>
			<div className="space-y-6">
				<SectorHeatmap selected={sector} onSelect={setSector} />
				<ScreenerTable sector={sector} onSectorChange={setSector} />
			</div>
		</>
	);
}
