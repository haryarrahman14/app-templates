import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BellPlusIcon } from "lucide-react";
import { useState } from "react";
import { Change } from "@/components/kit/change";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { Stat } from "@/components/kit/stat";
import { positionQuery } from "@/features/instruments/api/queries";
import { TradeDialog } from "@/features/instruments/components/trade-dialog";
import { useFormat } from "@/lib/use-format";

export function PositionCard({ symbol, price }: { symbol: string; price: number }) {
	const { data } = useQuery(positionQuery(symbol));
	const format = useFormat();
	const [side, setSide] = useState<"buy" | "sell" | null>(null);

	if (!data) {
		return (
			<Panel>
				<Skeleton className="mb-4 h-4 w-28" />
				<Skeleton className="h-16 w-full" />
			</Panel>
		);
	}
	const value = data.quantity * price;
	const pnl = value - data.quantity * data.avgCost;
	const pnlPct = data.avgCost ? (pnl / (data.quantity * data.avgCost)) * 100 : 0;

	return (
		<Panel aria-labelledby="position-title">
			<PanelHeader id="position-title" title="Your position" description="Sample portfolio" />
			{data.quantity > 0 ? (
				<dl className="grid grid-cols-2 gap-4">
					<Stat label="Shares" value={format.number(data.quantity)} />
					<Stat label="Market value" value={format.currency(value)} />
					<Stat label="Average cost" value={format.currency(data.avgCost)} />
					<Stat
						label="Return"
						value={<Change value={pnl}>{format.currency(pnl, { signed: true })}</Change>}
						hint={format.percent(pnlPct, { signed: true })}
					/>
				</dl>
			) : (
				<p className="text-muted-foreground text-sm">
					You don't hold {symbol} yet. Sample cash: {format.currency(data.cash)}.
				</p>
			)}
			<div className="mt-5 grid grid-cols-2 gap-2">
				<Button onClick={() => setSide("buy")}>Buy</Button>
				<Button variant="outline" onClick={() => setSide("sell")} disabled={data.quantity === 0}>
					Sell
				</Button>
			</div>
			<Button variant="ghost" size="sm" className="mt-2 w-full" asChild>
				<Link to="/alerts" search={{ new: 1, symbol }}>
					<BellPlusIcon />
					{data.alerts ? `Add alert (${data.alerts} set)` : "Set a price alert"}
				</Link>
			</Button>
			<TradeDialog
				key={side ?? "closed"}
				open={side !== null}
				onOpenChange={(open) => !open && setSide(null)}
				symbol={symbol}
				price={price}
				cash={data.cash}
				held={data.quantity}
				initialSide={side ?? "buy"}
			/>
		</Panel>
	);
}
