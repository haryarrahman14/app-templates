import { Button } from "@repo/ui/components/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/components/chart";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { toast } from "@repo/ui/components/sonner";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DownloadIcon, FileTextIcon, SheetIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Change } from "@/components/kit/change";
import { MeterBar } from "@/components/kit/charts/sparkline";
import { PageHeader } from "@/components/kit/page-header";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { reportQuery } from "@/features/reports/api/queries";
import { DEFAULT_REPORT_PERIOD } from "@/features/reports/constants/period";
import {
	type Report,
	type ReportPeriod,
	reportPeriodSchema,
} from "@/features/reports/schemas/report";
import { downloadCsv, toCsv } from "@/lib/csv";
import { formatDate } from "@/lib/format";
import { useFormat } from "@/lib/use-format";

const chartConfig = {
	income: { label: "Income", color: "var(--gain)" },
	spending: { label: "Spending", color: "var(--chart-4)" },
} satisfies ChartConfig;

const PERIOD_LABEL: Record<ReportPeriod, string> = {
	"3": "Last 3 months",
	"6": "Last 6 months",
	"12": "Last 12 months",
};

function Kpis({ report }: { report: Report }) {
	const format = useFormat();
	const { totals } = report;
	const tiles = [
		{
			label: "Income",
			value: format.currency(totals.income),
			change: totals.incomeChange,
			good: totals.incomeChange >= 0,
		},
		{
			label: "Spending",
			value: format.currency(totals.spending),
			change: totals.spendingChange,
			good: totals.spendingChange <= 0,
		},
		{ label: "Net saved", value: format.currency(totals.net), change: null, good: totals.net >= 0 },
		{
			label: "Savings rate",
			value: format.percent(totals.savingsRate, { digits: 1 }),
			change: null,
			good: true,
		},
	];
	return (
		<dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{tiles.map((tile) => (
				<Panel key={tile.label} className="p-4 sm:p-5">
					<dt className="text-muted-foreground text-xs">{tile.label}</dt>
					<dd className="mt-1 font-semibold text-xl tabular-nums">{tile.value}</dd>
					<dd className="text-muted-foreground text-xs">
						{tile.change == null ? (
							PERIOD_LABEL[report.period].toLowerCase()
						) : (
							<>
								<Change value={tile.change} className={tile.good ? "text-gain" : "text-loss"}>
									{format.percent(tile.change, { signed: true, digits: 1 })}
								</Change>{" "}
								vs previous period
							</>
						)}
					</dd>
				</Panel>
			))}
		</dl>
	);
}

function IncomeSpendingChart({ report }: { report: Report }) {
	const format = useFormat();
	const reduce = useReducedMotion();
	const data = report.months.map((m) => ({
		...m,
		label: formatDate(m.month, "month").split(" ")[0],
	}));
	return (
		<Panel aria-labelledby="flow-title">
			<PanelHeader
				id="flow-title"
				title="Income vs spending"
				description="Monthly totals"
				action={
					<div className="flex items-center gap-3 text-muted-foreground text-xs">
						<span className="inline-flex items-center gap-1.5">
							<span aria-hidden className="size-2 rounded-sm bg-gain" />
							Income
						</span>
						<span className="inline-flex items-center gap-1.5">
							<span aria-hidden className="size-2 rounded-sm bg-chart-4" />
							Spending
						</span>
					</div>
				}
			/>
			<ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
				<BarChart data={data} margin={{ left: 0, right: 0, top: 8 }} barGap={4}>
					<CartesianGrid vertical={false} strokeDasharray="3 3" />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis
						tickLine={false}
						axisLine={false}
						width={56}
						tickFormatter={(v: number) => format.currency(v, { compact: true, digits: 0 })}
					/>
					<ChartTooltip
						cursor={{ fillOpacity: 0.4 }}
						content={<ChartTooltipContent indicator="dot" />}
					/>
					<Bar
						dataKey="income"
						fill="var(--color-income)"
						radius={[4, 4, 0, 0]}
						isAnimationActive={!reduce}
						maxBarSize={28}
					/>
					<Bar
						dataKey="spending"
						fill="var(--color-spending)"
						radius={[4, 4, 0, 0]}
						isAnimationActive={!reduce}
						maxBarSize={28}
					/>
				</BarChart>
			</ChartContainer>
			<p className="sr-only">
				{report.months
					.map(
						(m) =>
							`${formatDate(m.month, "month")}: income ${format.currency(m.income)}, spending ${format.currency(m.spending)}`,
					)
					.join("; ")}
			</p>
		</Panel>
	);
}

function Categories({ report }: { report: Report }) {
	const format = useFormat();
	const max = Math.max(...report.categories.map((c) => c.amount));
	return (
		<Panel aria-labelledby="cat-title">
			<PanelHeader id="cat-title" title="Where it went" description="Spending by category" />
			<ul className="space-y-3">
				{report.categories.map((c) => (
					<li key={c.name} className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 text-sm">
						<span>{c.name}</span>
						<span className="flex items-center gap-3">
							<span className="tabular-nums">{format.currency(c.amount, { digits: 0 })}</span>
							<span className="w-10 text-right text-muted-foreground text-xs tabular-nums">
								{format.percent(c.share, { digits: 0 })}
							</span>
						</span>
						<MeterBar value={c.amount} max={max} tone="muted" className="col-span-2" />
					</li>
				))}
			</ul>
			<div className="mt-6 border-t pt-4">
				<p className="mb-3 font-medium text-sm">Income sources</p>
				<ul className="space-y-2 text-sm">
					{report.incomeSources.map((s) => (
						<li key={s.name} className="flex justify-between">
							<span className="text-muted-foreground">{s.name}</span>
							<span className="tabular-nums">
								{format.currency(s.amount, { digits: 0 })}{" "}
								<span className="text-muted-foreground text-xs">
									({format.percent(s.share, { digits: 0 })})
								</span>
							</span>
						</li>
					))}
				</ul>
			</div>
		</Panel>
	);
}

function MonthlyTable({ report }: { report: Report }) {
	const format = useFormat();
	return (
		<Panel className="p-0 sm:p-0" aria-labelledby="monthly-title">
			<div className="p-5 pb-0 sm:p-6 sm:pb-0">
				<PanelHeader id="monthly-title" title="By month" />
			</div>
			<div className="relative overflow-x-auto">
				<table className="w-full min-w-[520px] text-sm">
					<thead>
						<tr className="border-y text-muted-foreground text-xs">
							<th scope="col" className="h-10 px-4 text-left font-medium sm:px-6">
								Month
							</th>
							<th scope="col" className="px-4 text-right font-medium">
								Income
							</th>
							<th scope="col" className="px-4 text-right font-medium">
								Spending
							</th>
							<th scope="col" className="px-4 text-right font-medium">
								Net
							</th>
							<th scope="col" className="px-4 text-right font-medium sm:px-6">
								Savings rate
							</th>
						</tr>
					</thead>
					<tbody>
						{[...report.months].reverse().map((m) => (
							<tr key={m.month} className="border-b border-border/60 last:border-0">
								<th scope="row" className="px-4 py-2.5 text-left font-medium sm:px-6">
									{formatDate(m.month, "month")}
								</th>
								<td className="px-4 text-right tabular-nums">{format.currency(m.income)}</td>
								<td className="px-4 text-right tabular-nums">{format.currency(m.spending)}</td>
								<td className="px-4 text-right">
									<Change value={m.net} showIcon={false} className="justify-end">
										{format.currency(m.net, { signed: true })}
									</Change>
								</td>
								<td className="px-4 text-right tabular-nums sm:px-6">
									{format.percent(m.savingsRate, { digits: 1 })}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Panel>
	);
}

export function ReportsPage() {
	const [period, setPeriod] = useState<ReportPeriod>(DEFAULT_REPORT_PERIOD);
	const { data: report, isPlaceholderData } = useQuery({
		...reportQuery(period),
		placeholderData: keepPreviousData,
	});

	const exportCsv = () => {
		if (!report) return;
		downloadCsv(
			`ledgerfinch-sample-report-${period}m.csv`,
			toCsv(
				report.months.map((m) => ({
					month: formatDate(m.month, "month"),
					income: m.income,
					spending: m.spending,
					net: m.net,
					savings_rate: m.savingsRate,
				})),
			),
		);
		toast.success("Report exported as CSV");
	};

	return (
		<>
			<PageHeader
				title="Reports"
				description="Cash flow across your sample accounts."
				actions={
					<>
						<Select value={period} onValueChange={(v) => setPeriod(reportPeriodSchema.parse(v))}>
							<SelectTrigger aria-label="Report period" className="w-40">
								<SelectValue>{PERIOD_LABEL[period]}</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{reportPeriodSchema.options.map((p) => (
									<SelectItem key={p} value={p}>
										{PERIOD_LABEL[p]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<DownloadIcon />
									Export
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onSelect={exportCsv}>
									<SheetIcon />
									CSV (monthly table)
								</DropdownMenuItem>
								<DropdownMenuItem
									onSelect={() =>
										toast.info("PDF export is a stub in this template", {
											description: "Wire it to your PDF service in features/reports.",
										})
									}
								>
									<FileTextIcon />
									PDF report (sample)
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				}
			/>
			{report ? (
				<div
					className={
						isPlaceholderData
							? "space-y-6 opacity-60 transition-opacity"
							: "space-y-6 transition-opacity"
					}
					aria-busy={isPlaceholderData}
				>
					<Kpis report={report} />
					<div className="grid gap-6 lg:grid-cols-3">
						<div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
							<IncomeSpendingChart report={report} />
							<MonthlyTable report={report} />
						</div>
						<Categories report={report} />
					</div>
				</div>
			) : null}
		</>
	);
}
