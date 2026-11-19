import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, WalletIcon } from "lucide-react";
import { Change } from "@/components/kit/change";
import { PageHeader } from "@/components/kit/page-header";
import { Panel } from "@/components/kit/panel";
import { ChartSkeleton, TableSkeleton, TilesSkeleton } from "@/components/kit/skeletons";
import { useAddSampleCash } from "@/features/portfolio/api/mutations";
import { portfolioQuery } from "@/features/portfolio/api/queries";
import { AllocationDonutCard } from "@/features/portfolio/components/allocation-donut-card";
import { HoldingsTable } from "@/features/portfolio/components/holdings-table";
import { PerformanceCard } from "@/features/portfolio/components/performance-card";
import { useFormat } from "@/lib/use-format";

export function PortfolioPage() {
	const { data } = useQuery(portfolioQuery);
	const addCash = useAddSampleCash();
	const format = useFormat();

	return (
		<>
			<PageHeader
				title="Portfolio"
				description="Holdings, allocation and performance of your sample account."
				actions={
					<Button
						variant="outline"
						disabled={addCash.isPending}
						onClick={() =>
							addCash.mutate(1_000, {
								onSuccess: () =>
									toast.success("Added 1,000 in sample cash", {
										description: "Logged as a deposit in Transactions. No real money moved.",
									}),
							})
						}
					>
						{addCash.isPending ? <Spinner /> : <PlusIcon />}
						Add sample cash
					</Button>
				}
			/>
			{data ? (
				<div className="space-y-6">
					<dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
						<Panel className="p-4 sm:p-5">
							<dt className="text-muted-foreground text-xs">Total value</dt>
							<dd className="mt-1 font-semibold text-xl tabular-nums">
								{format.currency(data.total)}
							</dd>
						</Panel>
						<Panel className="p-4 sm:p-5">
							<dt className="text-muted-foreground text-xs">Today</dt>
							<dd className="mt-1 font-semibold text-xl">
								<Change value={data.dayChange}>
									{format.currency(data.dayChange, { signed: true })}
								</Change>
							</dd>
							<dd className="text-muted-foreground text-xs">
								{format.percent(data.dayChangePct, { signed: true })}
							</dd>
						</Panel>
						<Panel className="p-4 sm:p-5">
							<dt className="text-muted-foreground text-xs">Total return</dt>
							<dd className="mt-1 font-semibold text-xl">
								<Change value={data.pnl}>{format.currency(data.pnl, { signed: true })}</Change>
							</dd>
							<dd className="text-muted-foreground text-xs">
								{format.percent(data.pnlPct, { signed: true })} on cost
							</dd>
						</Panel>
						<Panel className="p-4 sm:p-5">
							<dt className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<WalletIcon aria-hidden className="size-3.5" />
								Cash balance
							</dt>
							<dd className="mt-1 font-semibold text-xl tabular-nums">
								{format.currency(data.cash)}
							</dd>
							<dd className="text-muted-foreground text-xs">
								{format.percent((data.cash / data.total) * 100, { digits: 1 })} of portfolio
							</dd>
						</Panel>
					</dl>
					<div className="grid gap-6 lg:grid-cols-3">
						<div className="min-w-0 lg:col-span-2">
							<PerformanceCard />
						</div>
						<AllocationDonutCard holdings={data.holdings} cash={data.cash} />
					</div>
					<HoldingsTable holdings={data.holdings} />
				</div>
			) : (
				<div className="space-y-6">
					<TilesSkeleton />
					<ChartSkeleton />
					<TableSkeleton />
				</div>
			)}
		</>
	);
}
