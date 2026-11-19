import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	type ColumnFiltersState,
	columnFilteringFeature,
	columnVisibilityFeature,
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
import { Columns3Icon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Change } from "@/components/kit/change";
import { Sparkline } from "@/components/kit/charts/sparkline";
import { InstrumentMark } from "@/components/kit/instrument-mark";
import { Panel } from "@/components/kit/panel";
import { ariaSort, SortableHeader } from "@/components/kit/sortable-header";
import { TablePagination } from "@/components/kit/table-pagination";
import { screenerQuery } from "@/features/markets/api/queries";
import { CAP_OPTIONS, CHANGE_OPTIONS } from "@/features/markets/constants/filters";
import type { ScreenerRow } from "@/features/markets/schemas/screener";
import { SECTORS } from "@/lib/sample-data/universe";
import { useFormat } from "@/lib/use-format";

const features = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	rowSortingFeature,
	rowPaginationFeature,
	columnVisibilityFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filterFns: { includesString: filterFn_includesString },
	sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
});

const helper = createColumnHelper<typeof features, ScreenerRow>();

const RIGHT = new Set(["price", "changePct", "capBn", "volume", "pe", "dividendYield"]);

const COLUMN_LABEL: Record<string, string> = {
	symbol: "Instrument",
	sector: "Sector",
	price: "Price",
	changePct: "Change",
	spark: "30-day trend",
	capBn: "Market cap",
	volume: "Volume",
	pe: "P/E",
	dividendYield: "Yield",
};

function useColumns() {
	const format = useFormat();
	return helper.columns([
		helper.accessor("symbol", {
			header: "Instrument",
			enableHiding: false,
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
						<span className="block max-w-44 truncate text-muted-foreground text-xs">
							{row.original.name}
						</span>
					</span>
				</Link>
			),
		}),
		helper.accessor("name", { header: "Name", enableHiding: false }),
		helper.accessor("sector", {
			header: "Sector",
			sortFn: "alphanumeric",
			filterFn: (row, id, value: string) => value === "all" || row.getValue(id) === value,
			cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
		}),
		helper.accessor("price", {
			header: "Price",
			sortFn: "basic",
			cell: ({ getValue }) => format.currency(getValue()),
		}),
		helper.accessor("changePct", {
			header: "Change",
			sortFn: "basic",
			filterFn: (row, id, value: string) => {
				const v = row.getValue<number>(id);
				if (value === "up") return v > 0;
				if (value === "down") return v < 0;
				if (value === "big") return Math.abs(v) >= 1;
				return true;
			},
			cell: ({ getValue }) => (
				<Change value={getValue()} className="justify-end">
					{format.percent(getValue(), { signed: true })}
				</Change>
			),
		}),
		helper.accessor("spark", {
			header: "30-day trend",
			enableSorting: false,
			enableGlobalFilter: false,
			cell: ({ getValue }) => <Sparkline values={getValue()} width={88} height={26} />,
		}),
		helper.accessor("capBn", {
			header: "Market cap",
			sortFn: "basic",
			filterFn: (row, _id, value: string) => value === "all" || row.original.capBucket === value,
			cell: ({ getValue }) => format.currency(getValue() * 1e9, { compact: true }),
		}),
		helper.accessor("volume", {
			header: "Volume",
			sortFn: "basic",
			cell: ({ getValue }) => format.number(getValue(), { compact: true }),
		}),
		helper.accessor("pe", {
			header: "P/E",
			sortFn: "basic",
			cell: ({ getValue }) => {
				const v = getValue();
				return v == null ? (
					<span className="text-muted-foreground">n/a</span>
				) : (
					format.number(v, { digits: 1 })
				);
			},
		}),
		helper.accessor("dividendYield", {
			header: "Yield",
			sortFn: "basic",
			cell: ({ getValue }) => format.percent(getValue(), { digits: 1 }),
		}),
	]);
}

export function ScreenerTable({
	sector,
	onSectorChange,
}: {
	sector: string;
	onSectorChange: (sector: string) => void;
}) {
	const { data } = useSuspenseQuery(screenerQuery);
	const navigate = useNavigate();
	const columns = useColumns();
	const [search, setSearch] = useState("");
	const [otherFilters, setOtherFilters] = useState<ColumnFiltersState>([]);
	const columnFilters: ColumnFiltersState = [
		...(sector !== "all" ? [{ id: "sector", value: sector }] : []),
		...otherFilters,
	];

	const table = useTable({
		features,
		columns,
		data,
		autoResetPageIndex: false,
		initialState: {
			sorting: [{ id: "capBn", desc: true }],
			pagination: { pageIndex: 0, pageSize: 10 },
			columnVisibility: { name: false, volume: false },
		},
		state: { columnFilters, globalFilter: search },
		onColumnFiltersChange: (updater) => {
			const next = typeof updater === "function" ? updater(columnFilters) : updater;
			onSectorChange(String(next.find((f) => f.id === "sector")?.value ?? "all"));
			setOtherFilters(next.filter((f) => f.id !== "sector"));
		},
		onGlobalFilterChange: (value) => setSearch(String(value ?? "")),
		globalFilterFn: "includesString",
		getColumnCanGlobalFilter: (column) => column.id === "symbol" || column.id === "name",
	});

	const setFilter = (id: string, value: string) => {
		setOtherFilters((prev) => [
			...prev.filter((f) => f.id !== id),
			...(value === "all" ? [] : [{ id, value }]),
		]);
		table.setPageIndex(0);
	};
	const filterValue = (id: string) => String(otherFilters.find((f) => f.id === id)?.value ?? "all");
	const filtered = table.getFilteredRowModel().rows.length;
	const hasFilters = sector !== "all" || otherFilters.length > 0 || search !== "";
	const { pageIndex, pageSize } = table.state.pagination;

	return (
		<Panel className="p-0 sm:p-0" aria-labelledby="screener-title">
			<div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
				<h2 id="screener-title" className="sr-only">
					Screener
				</h2>
				<div className="relative lg:w-64">
					<SearchIcon
						aria-hidden
						className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							table.setPageIndex(0);
						}}
						placeholder="Search ticker or company"
						aria-label="Search instruments"
						className="pl-8"
					/>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Select
						value={sector}
						onValueChange={(v) => {
							onSectorChange(v);
							table.setPageIndex(0);
						}}
					>
						<SelectTrigger aria-label="Sector" className="w-40">
							<SelectValue>{sector === "all" ? "All sectors" : sector}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All sectors</SelectItem>
							{SECTORS.map((s) => (
								<SelectItem key={s} value={s}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={filterValue("capBn")} onValueChange={(v) => setFilter("capBn", v)}>
						<SelectTrigger aria-label="Market cap" className="w-44">
							<SelectValue>
								{CAP_OPTIONS.find((o) => o.value === filterValue("capBn"))?.label}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{CAP_OPTIONS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={filterValue("changePct")} onValueChange={(v) => setFilter("changePct", v)}>
						<SelectTrigger aria-label="Price change" className="w-48">
							<SelectValue>
								{CHANGE_OPTIONS.find((o) => o.value === filterValue("changePct"))?.label}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{CHANGE_OPTIONS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{hasFilters ? (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSearch("");
								setOtherFilters([]);
								onSectorChange("all");
								table.setPageIndex(0);
							}}
						>
							<XIcon />
							Reset
						</Button>
					) : null}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="lg:ml-auto">
							<Columns3Icon />
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuLabel>Show columns</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{table
							.getAllLeafColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(value === true)}
									onSelect={(event) => event.preventDefault()}
								>
									{COLUMN_LABEL[column.id] ?? column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="relative overflow-x-auto">
				<table className="w-full min-w-[720px] text-sm">
					<caption className="sr-only">
						Screener of {filtered} invented instruments. Prices are sample data and update every few
						seconds.
					</caption>
					<thead>
						{table.getHeaderGroups().map((group) => (
							<tr key={group.id} className="border-b">
								{group.headers.map((header) => {
									const sorted = header.column.getIsSorted();
									const right = RIGHT.has(header.column.id);
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
											{header.isPlaceholder ? null : header.column.getCanSort() ? (
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
								onClick={(event) => {
									if ((event.target as HTMLElement).closest("a,button")) return;
									navigate({ to: "/markets/$symbol", params: { symbol: row.original.symbol } });
								}}
								className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-foreground/[0.03]"
							>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className={cn(
											"px-4 py-2.5 tabular-nums",
											RIGHT.has(cell.column.id) && "text-right",
										)}
									>
										<table.FlexRender cell={cell} />
									</td>
								))}
							</tr>
						))}
						{filtered === 0 ? (
							<tr>
								<td
									colSpan={table.getVisibleLeafColumns().length}
									className="px-4 py-12 text-center"
								>
									<p className="font-medium">No instruments match these filters</p>
									<p className="text-muted-foreground text-sm">
										Try a different sector or clear the search.
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
				total={filtered}
				canPrevious={table.getCanPreviousPage()}
				canNext={table.getCanNextPage()}
				onPrevious={() => table.previousPage()}
				onNext={() => table.nextPage()}
				noun="instruments"
			/>
		</Panel>
	);
}
