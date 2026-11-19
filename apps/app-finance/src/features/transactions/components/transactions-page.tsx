import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
	type ColumnFiltersState,
	columnFilteringFeature,
	createColumnHelper,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_basic,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { DownloadIcon, PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Change } from "@/components/kit/change";
import { PageHeader } from "@/components/kit/page-header";
import { Panel } from "@/components/kit/panel";
import { TableSkeleton } from "@/components/kit/skeletons";
import { ariaSort, SortableHeader } from "@/components/kit/sortable-header";
import { TablePagination } from "@/components/kit/table-pagination";
import { transactionsQuery } from "@/features/transactions/api/queries";
import { AddTransactionDialog } from "@/features/transactions/components/add-transaction-dialog";
import { TransactionSheet } from "@/features/transactions/components/transaction-sheet";
import { TypeBadge } from "@/features/transactions/components/type-badge";
import { DATE_PRESETS, type DatePreset, TYPE_LABEL } from "@/features/transactions/constants/types";
import type { Transaction, TransactionType } from "@/features/transactions/schemas/transaction";
import { resolveRange } from "@/features/transactions/utils/date-range";
import { downloadCsv, toCsv } from "@/lib/csv";
import { formatDate } from "@/lib/format";
import { useFormat } from "@/lib/use-format";

const features = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	rowSortingFeature,
	rowPaginationFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filterFns: { includesString: filterFn_includesString },
	sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});
const helper = createColumnHelper<typeof features, Transaction>();

export function TransactionsPage() {
	const { data } = useQuery(transactionsQuery);
	const format = useFormat();
	const navigate = useNavigate({ from: "/transactions" });
	const fromUrl = useSearch({ from: "/_app/transactions", select: (s) => s.new === 1 });
	const [addOpen, setAddOpen] = useState(false);
	const [selected, setSelected] = useState<Transaction | null>(null);
	const [search, setSearch] = useState("");
	const [type, setType] = useState<"all" | TransactionType>("all");
	const [preset, setPreset] = useState<DatePreset>("all");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");

	const dialogOpen = addOpen || fromUrl;
	const setDialogOpen = (open: boolean) => {
		setAddOpen(open);
		if (!open && fromUrl) navigate({ search: {}, replace: true });
	};

	const range = resolveRange(preset, from, to);
	const columnFilters: ColumnFiltersState = [
		...(type !== "all" ? [{ id: "type", value: type }] : []),
		...(range ? [{ id: "date", value: range }] : []),
	];

	const columns = useMemo(
		() =>
			helper.columns([
				helper.accessor("date", {
					header: "Date",
					sortFn: "basic",
					filterFn: (row, id, value: [number, number]) => {
						const t = row.getValue<number>(id);
						return t >= value[0] && t <= value[1];
					},
					cell: ({ getValue }) => (
						<span className="whitespace-nowrap">{formatDate(getValue(), "medium")}</span>
					),
				}),
				helper.accessor("type", {
					header: "Type",
					sortFn: "alphanumeric",
					filterFn: (row, id, value: string) => row.getValue(id) === value,
					cell: ({ getValue }) => <TypeBadge type={getValue()} />,
				}),
				helper.accessor((row) => `${row.symbol ?? ""} ${row.note} ${row.id} ${row.account}`, {
					id: "description",
					header: "Description",
					enableSorting: false,
					cell: ({ row }) => (
						<span className="block min-w-0">
							<span className="block font-medium">
								{row.original.symbol
									? `${row.original.symbol}${row.original.quantity ? ` · ${row.original.quantity} sh @ ${format.currency(row.original.price ?? 0)}` : ""}`
									: TYPE_LABEL[row.original.type]}
							</span>
							<span className="block truncate text-muted-foreground text-xs">
								{row.original.note || row.original.account} · {row.original.id}
							</span>
						</span>
					),
				}),
				helper.accessor("status", {
					header: "Status",
					sortFn: "alphanumeric",
					cell: ({ getValue }) => (
						<span
							className={cn(
								"inline-flex items-center gap-1.5 text-xs capitalize",
								getValue() === "pending" ? "text-warning" : "text-muted-foreground",
							)}
						>
							<span
								aria-hidden
								className={cn(
									"size-1.5 rounded-full",
									getValue() === "pending" ? "bg-warning" : "bg-muted-foreground/50",
								)}
							/>
							{getValue()}
						</span>
					),
				}),
				helper.accessor("amount", {
					header: "Amount",
					sortFn: "basic",
					cell: ({ getValue }) => (
						<Change value={getValue()} showIcon={false} className="justify-end font-medium">
							{format.currency(getValue(), { signed: true, compact: false })}
						</Change>
					),
				}),
			]),
		[format],
	);

	const table = useTable({
		features,
		columns,
		data: data ?? [],
		initialState: {
			sorting: [{ id: "date", desc: true }],
			pagination: { pageIndex: 0, pageSize: 12 },
		},
		state: { columnFilters, globalFilter: search },
		onColumnFiltersChange: () => {},
		onGlobalFilterChange: (value) => setSearch(String(value ?? "")),
		globalFilterFn: "includesString",
		getColumnCanGlobalFilter: (column) => column.id === "description",
	});

	const filteredRows = table.getFilteredRowModel().rows.map((r) => r.original);
	const inflow = filteredRows.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
	const outflow = filteredRows.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
	const hasFilters = search !== "" || type !== "all" || preset !== "all";
	const { pageIndex, pageSize } = table.state.pagination;
	const resetPage = () => table.setPageIndex(0);

	const exportCsv = () => {
		const csv = toCsv(
			filteredRows.map((t) => ({
				id: t.id,
				date: new Date(t.date).toISOString(),
				type: t.type,
				symbol: t.symbol,
				quantity: t.quantity,
				price: t.price,
				amount: t.amount,
				status: t.status,
				account: t.account,
				note: t.note,
			})),
		);
		downloadCsv("ledgerfinch-sample-transactions.csv", csv);
		toast.success(`Exported ${filteredRows.length} transactions`, {
			description: "Sample data, CSV format.",
		});
	};

	return (
		<>
			<PageHeader
				title="Transactions"
				description="Every trade, deposit, dividend and fee in your sample account."
				actions={
					<>
						<Button
							variant="outline"
							onClick={exportCsv}
							disabled={!data || filteredRows.length === 0}
						>
							<DownloadIcon />
							Export CSV
						</Button>
						<Button onClick={() => setDialogOpen(true)}>
							<PlusIcon />
							Add transaction
						</Button>
					</>
				}
			/>
			{!data ? (
				<TableSkeleton rows={10} />
			) : (
				<Panel className="p-0 sm:p-0" aria-labelledby="tx-title">
					<h2 id="tx-title" className="sr-only">
						Ledger
					</h2>
					<div className="flex flex-col gap-3 border-b p-4 xl:flex-row xl:items-center">
						<div className="relative xl:w-64">
							<SearchIcon
								aria-hidden
								className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									resetPage();
								}}
								placeholder="Search ticker, note or reference"
								aria-label="Search transactions"
								className="pl-8"
							/>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Select
								value={type}
								onValueChange={(v) => {
									setType(v as typeof type);
									resetPage();
								}}
							>
								<SelectTrigger aria-label="Transaction type" className="w-36">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All types</SelectItem>
									{(Object.keys(TYPE_LABEL) as TransactionType[]).map((t) => (
										<SelectItem key={t} value={t}>
											{TYPE_LABEL[t]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={preset}
								onValueChange={(v) => {
									setPreset(v as DatePreset);
									resetPage();
								}}
							>
								<SelectTrigger aria-label="Date range" className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{DATE_PRESETS.map((p) => (
										<SelectItem key={p.value} value={p.value}>
											{p.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{preset === "custom" ? (
								<div className="flex items-center gap-2">
									<Input
										type="date"
										aria-label="From date"
										value={from}
										max={to || undefined}
										onChange={(e) => {
											setFrom(e.target.value);
											resetPage();
										}}
										className="w-38"
									/>
									<span className="text-muted-foreground text-sm">to</span>
									<Input
										type="date"
										aria-label="To date"
										value={to}
										min={from || undefined}
										onChange={(e) => {
											setTo(e.target.value);
											resetPage();
										}}
										className="w-38"
									/>
								</div>
							) : null}
							{hasFilters ? (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setSearch("");
										setType("all");
										setPreset("all");
										setFrom("");
										setTo("");
										resetPage();
									}}
								>
									<XIcon />
									Reset
								</Button>
							) : null}
						</div>
						<p className="text-muted-foreground text-xs xl:ml-auto xl:text-right">
							In <span className="text-gain">{format.currency(inflow, { signed: true })}</span> ·
							Out <span className="text-loss">{format.currency(outflow, { signed: true })}</span>
						</p>
					</div>
					<div className="relative overflow-x-auto">
						<table className="w-full min-w-[640px] text-sm">
							<caption className="sr-only">Transactions. Select a row to see details.</caption>
							<thead>
								{table.getHeaderGroups().map((group) => (
									<tr key={group.id} className="border-b">
										{group.headers.map((header) => {
											const sorted = header.column.getIsSorted();
											const right = header.column.id === "amount";
											return (
												<th
													key={header.id}
													scope="col"
													aria-sort={header.column.getCanSort() ? ariaSort(sorted) : undefined}
													className={cn(
														"h-10 px-4 font-medium text-muted-foreground text-xs",
														right ? "text-right" : "text-left",
													)}
												>
													{header.column.getCanSort() ? (
														<SortableHeader
															sorted={sorted}
															onToggle={header.column.getToggleSortingHandler()}
															align={right ? "right" : "left"}
														>
															<table.FlexRender header={header} />
														</SortableHeader>
													) : (
														<table.FlexRender header={header} />
													)}
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
										tabIndex={0}
										aria-label={`${TYPE_LABEL[row.original.type]} ${row.original.id}, open details`}
										onClick={() => setSelected(row.original)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setSelected(row.original);
											}
										}}
										className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.05] focus-visible:outline-none"
									>
										{row.getAllCells().map((cell) => (
											<td
												key={cell.id}
												className={cn(
													"px-4 py-2.5 tabular-nums",
													cell.column.id === "amount" && "text-right",
												)}
											>
												<table.FlexRender cell={cell} />
											</td>
										))}
									</tr>
								))}
								{filteredRows.length === 0 ? (
									<tr>
										<td colSpan={5} className="px-4 py-12 text-center">
											<p className="font-medium">No transactions match</p>
											<p className="text-muted-foreground text-sm">
												Widen the date range or clear the filters.
											</p>
										</td>
									</tr>
								) : null}
							</tbody>
						</table>
					</div>
					<TablePagination
						pageIndex={pageIndex}
						pageSize={pageSize}
						pageCount={table.getPageCount()}
						total={filteredRows.length}
						canPrevious={table.getCanPreviousPage()}
						canNext={table.getCanNextPage()}
						onPrevious={() => table.previousPage()}
						onNext={() => table.nextPage()}
						noun="transactions"
					/>
				</Panel>
			)}
			<TransactionSheet
				transaction={selected}
				onOpenChange={(open) => !open && setSelected(null)}
			/>
			<AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
		</>
	);
}
