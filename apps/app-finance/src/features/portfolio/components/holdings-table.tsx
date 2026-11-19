import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import {
	createColumnHelper,
	createSortedRowModel,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_basic,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { Change } from "@/components/kit/change";
import { InstrumentMark } from "@/components/kit/instrument-mark";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { ariaSort, SortableHeader } from "@/components/kit/sortable-header";
import type { HoldingRow } from "@/features/portfolio/schemas/portfolio";
import { useFormat } from "@/lib/use-format";

const features = tableFeatures({
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});
const helper = createColumnHelper<typeof features, HoldingRow>();
const RIGHT = new Set(["quantity", "price", "value", "dayChangePct", "pnl", "weight"]);

export function HoldingsTable({ holdings }: { holdings: HoldingRow[] }) {
	const format = useFormat();
	const columns = helper.columns([
		helper.accessor("symbol", {
			header: "Holding",
			sortFn: "alphanumeric",
			cell: ({ row }) => (
				<Link
					to="/markets/$symbol"
					params={{ symbol: row.original.symbol }}
					className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<InstrumentMark symbol={row.original.symbol} />
					<span className="min-w-0">
						<span className="block font-medium">{row.original.symbol}</span>
						<span className="block max-w-40 truncate text-muted-foreground text-xs">
							{row.original.name}
						</span>
					</span>
				</Link>
			),
		}),
		helper.accessor("quantity", {
			header: "Shares",
			sortFn: "basic",
			cell: ({ getValue }) => format.number(getValue()),
		}),
		helper.accessor("price", {
			header: "Price",
			sortFn: "basic",
			cell: ({ row }) => (
				<span>
					<span className="block">{format.currency(row.original.price)}</span>
					<span className="block text-muted-foreground text-xs">
						avg {format.currency(row.original.avgCost)}
					</span>
				</span>
			),
		}),
		helper.accessor("value", {
			header: "Value",
			sortFn: "basic",
			cell: ({ getValue }) => format.currency(getValue()),
		}),
		helper.accessor("dayChangePct", {
			header: "Today",
			sortFn: "basic",
			cell: ({ row }) => (
				<Change value={row.original.dayChange} className="justify-end">
					{format.percent(row.original.dayChangePct, { signed: true })}
				</Change>
			),
		}),
		helper.accessor("pnl", {
			header: "Total P/L",
			sortFn: "basic",
			cell: ({ row }) => (
				<span className="flex flex-col items-end">
					<Change value={row.original.pnl}>
						{format.currency(row.original.pnl, { signed: true })}
					</Change>
					<span className="text-muted-foreground text-xs">
						{format.percent(row.original.pnlPct, { signed: true })}
					</span>
				</span>
			),
		}),
		helper.accessor("weight", {
			header: "Weight",
			sortFn: "basic",
			cell: ({ getValue }) => format.percent(getValue(), { digits: 1 }),
		}),
	]);
	const table = useTable({
		features,
		columns,
		data: holdings,
		initialState: { sorting: [{ id: "value", desc: true }] },
	});

	return (
		<Panel className="p-0 sm:p-0" aria-labelledby="holdings-title">
			<div className="p-5 pb-0 sm:p-6 sm:pb-0">
				<PanelHeader
					id="holdings-title"
					title="Holdings"
					description={`${holdings.length} positions`}
				/>
			</div>
			<div className="relative overflow-x-auto">
				<table className="w-full min-w-[680px] text-sm">
					<thead>
						{table.getHeaderGroups().map((group) => (
							<tr key={group.id} className="border-y">
								{group.headers.map((header) => {
									const sorted = header.column.getIsSorted();
									const right = RIGHT.has(header.column.id);
									return (
										<th
											key={header.id}
											scope="col"
											aria-sort={ariaSort(sorted)}
											className={cn("h-10 px-4 sm:px-6", right ? "text-right" : "text-left")}
										>
											<SortableHeader
												sorted={sorted}
												onToggle={header.column.getToggleSortingHandler()}
												align={right ? "right" : "left"}
											>
												<table.FlexRender header={header} />
											</SortableHeader>
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border/60 last:border-0 hover:bg-foreground/[0.03]"
							>
								{row.getAllCells().map((cell) => (
									<td
										key={cell.id}
										className={cn(
											"px-4 py-3 tabular-nums sm:px-6",
											RIGHT.has(cell.column.id) && "text-right",
										)}
									>
										<table.FlexRender cell={cell} />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Panel>
	);
}
