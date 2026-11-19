import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, CalendarRange } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { PageBody, PageHeader } from "@/components/kit/page-header";
import { activitiesQuery } from "@/features/activities/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import {
	activityByType,
	kpis,
	pipelineByStage,
	RANGES,
	type RangeId,
	topOwners,
	wonOverTime,
} from "@/features/reports/utils/aggregate";
import { membersQuery } from "@/features/workspace/api/queries";
import { formatMoney, formatMoneyCompact } from "@/lib/format";

const valueConfig = { value: { label: "Value", color: "var(--chart-1)" } } satisfies ChartConfig;
const wonConfig = { value: { label: "Won", color: "var(--chart-1)" } } satisfies ChartConfig;
const activityConfig = {
	count: { label: "Activities", color: "var(--chart-2)" },
} satisfies ChartConfig;
const ownerConfig = { value: { label: "Won", color: "var(--chart-2)" } } satisfies ChartConfig;
/** Same order and hues as the deal stage dots: lead gray, qualified blue, proposal orange, negotiation yellow. */
const STAGE_FILLS = ["var(--chart-2)", "var(--chart-1)", "var(--chart-4)", "var(--chart-5)"];

const percent = (value: number) => `${Math.round(value * 100)}%`;

function Delta({ value, points = false }: { value: number | null; points?: boolean }) {
	if (value === null) return <span className="text-muted-foreground text-xs">No earlier data</span>;
	const up = value >= 0;
	const Icon = up ? ArrowUpRight : ArrowDownRight;
	const text = points ? `${Math.abs(Math.round(value * 100))} pts` : percent(Math.abs(value));
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 font-medium text-xs",
				up ? "text-cat-green-ink" : "text-cat-red-ink",
			)}
		>
			<Icon className="size-3.5" />
			{text}
			<span className="font-normal text-muted-foreground">&nbsp;vs previous</span>
		</span>
	);
}

function Kpi({ label, value, footer }: { label: string; value: string; footer: ReactNode }) {
	return (
		<div className="flex flex-col gap-1 rounded-2xl border bg-card p-4 shadow-soft">
			<span className="text-muted-foreground text-sm">{label}</span>
			<span className="font-semibold text-2xl tabular-nums tracking-tight">{value}</span>
			{footer}
		</div>
	);
}

function ChartCard({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-soft">
			<header>
				<h2 className="font-medium text-base">{title}</h2>
				<p className="text-muted-foreground text-sm">{description}</p>
			</header>
			{children}
		</section>
	);
}

function NoData() {
	return (
		<div className="flex h-56 items-center justify-center rounded-xl border border-dashed text-muted-foreground text-sm">
			Nothing in this range yet.
		</div>
	);
}

export function ReportsPage() {
	const { data: deals } = useSuspenseQuery(dealsQuery);
	const { data: activities } = useSuspenseQuery(activitiesQuery);
	const { data: members } = useSuspenseQuery(membersQuery);
	const [range, setRange] = useState<RangeId>("90d");

	const stats = useMemo(() => kpis(deals, range), [deals, range]);
	const stages = useMemo(() => pipelineByStage(deals), [deals]);
	const won = useMemo(() => wonOverTime(deals, range), [deals, range]);
	const byType = useMemo(() => activityByType(activities, range), [activities, range]);
	const owners = useMemo(() => topOwners(deals, members, range), [deals, members, range]);

	return (
		<PageBody>
			<PageHeader
				title="Reports"
				description="How the pipeline and the team are doing."
				actions={
					<Select value={range} onValueChange={(value) => setRange(value as RangeId)}>
						<SelectTrigger className="w-44" aria-label="Date range">
							<CalendarRange className="text-muted-foreground" />
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="end">
							{Object.entries(RANGES).map(([id, item]) => (
								<SelectItem key={id} value={id}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
			/>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Kpi
					label="Open pipeline"
					value={formatMoneyCompact(stats.pipeline.value)}
					footer={<Delta value={stats.pipeline.delta} />}
				/>
				<Kpi
					label="Won"
					value={formatMoneyCompact(stats.won.value)}
					footer={<Delta value={stats.won.delta} />}
				/>
				<Kpi
					label="Win rate"
					value={percent(stats.winRate.value)}
					footer={<Delta value={stats.winRate.delta} points />}
				/>
				<Kpi
					label="Avg deal size"
					value={formatMoneyCompact(stats.avgDeal.value)}
					footer={<Delta value={stats.avgDeal.delta} />}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<ChartCard title="Pipeline by stage" description="Value of open deals today.">
					<ChartContainer config={valueConfig} className="aspect-auto h-60 w-full">
						<BarChart data={stages} margin={{ left: 4, right: 4 }}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey="stage" tickLine={false} axisLine={false} tickMargin={8} />
							<YAxis
								tickLine={false}
								axisLine={false}
								width={48}
								tickFormatter={(value: number) => formatMoneyCompact(value)}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										formatter={(value) => formatMoney(Number(value))}
										hideIndicator
									/>
								}
							/>
							<Bar dataKey="value" radius={8}>
								{stages.map((entry, index) => (
									<Cell key={entry.stage} fill={STAGE_FILLS[index % STAGE_FILLS.length]} />
								))}
							</Bar>
						</BarChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard
					title="Deals won over time"
					description={range === "12m" ? "Won value per month." : "Won value per week."}
				>
					<ChartContainer config={wonConfig} className="aspect-auto h-60 w-full">
						<AreaChart data={won} margin={{ left: 4, right: 4 }}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="label"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={24}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								width={48}
								tickFormatter={(value: number) => formatMoneyCompact(value)}
							/>
							<ChartTooltip
								content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} />}
							/>
							<Area
								dataKey="value"
								type="monotone"
								stroke="var(--color-value)"
								strokeWidth={2}
								fill="var(--color-value)"
								fillOpacity={0.12}
							/>
						</AreaChart>
					</ChartContainer>
				</ChartCard>

				<ChartCard title="Activity by type" description="Everything the team logged in the range.">
					{byType.length === 0 ? (
						<NoData />
					) : (
						<ChartContainer config={activityConfig} className="aspect-auto h-60 w-full">
							<BarChart data={byType} margin={{ left: 4, right: 4 }}>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="label"
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									interval={0}
									fontSize={11}
								/>
								<YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
								<ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
								<Bar dataKey="count" fill="var(--color-count)" radius={8} />
							</BarChart>
						</ChartContainer>
					)}
				</ChartCard>

				<ChartCard title="Top owners" description="Won value by deal owner in the range.">
					{owners.length === 0 ? (
						<NoData />
					) : (
						<ChartContainer config={ownerConfig} className="aspect-auto h-60 w-full">
							<BarChart data={owners} layout="vertical" margin={{ left: 4, right: 16 }}>
								<CartesianGrid horizontal={false} />
								<XAxis
									type="number"
									tickLine={false}
									axisLine={false}
									tickFormatter={(value: number) => formatMoneyCompact(value)}
								/>
								<YAxis
									type="category"
									dataKey="name"
									tickLine={false}
									axisLine={false}
									width={64}
								/>
								<ChartTooltip
									cursor={false}
									content={
										<ChartTooltipContent
											formatter={(value) => formatMoney(Number(value))}
											hideIndicator
										/>
									}
								/>
								<Bar dataKey="value" fill="var(--color-value)" radius={8} barSize={22} />
							</BarChart>
						</ChartContainer>
					)}
				</ChartCard>
			</div>
		</PageBody>
	);
}
