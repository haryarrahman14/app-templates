import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import {
	type ColumnFiltersState,
	type ColumnVisibilityState,
	type ReactTable,
	type RowData,
	type SortingState,
	useTable,
} from "@tanstack/react-table";
import { Download, Search, SearchX } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { BulkBar } from "./bulk-bar";
import { ColumnHeader } from "./column-header";
import { downloadCsv, toCsv } from "./csv";
import { type DataTableColumn, type DataTableFeatures, dataTableFeatures } from "./features";
import { FilterBar } from "./filter-bar";
import { ViewOptions } from "./view-options";

export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>;

/** A saved view: a tab that narrows rows and can set its own sort. */
export type DataTableView<TData> = {
	id: string;
	label: string;
	filter?: (row: TData) => boolean;
	sorting?: SortingState;
};

export type DataTableProps<TData extends RowData> = {
	data: TData[] | undefined;
	columns: DataTableColumn<TData>[];
	getRowId: (row: TData) => string;
	/** Name used for the CSV file, e.g. "companies". */
	exportName: string;
	isLoading?: boolean;
	views?: DataTableView<TData>[];
	defaultSorting?: SortingState;
	initialColumnFilters?: ColumnFiltersState;
	initialColumnVisibility?: ColumnVisibilityState;
	searchPlaceholder?: string;
	pageSize?: number;
	/** Right side of the toolbar, e.g. a "New" button. */
	actions?: ReactNode;
	/** Extra chips at the start of the filter bar (e.g. the active list). */
	chips?: ReactNode;
	/** Rendered inside the floating bar while rows are selected. */
	bulkActions?: (rows: TData[], clear: () => void) => ReactNode;
	onRowClick?: (row: TData) => void;
	/** Shown when there is no data at all (not when filters hide everything). */
	empty: ReactNode;
};

const SKELETON_ROWS = Array.from({ length: 8 }, (_, index) => index);

/**
 * The app's generic data table on TanStack Table v9: saved views, search, filter chips, sort,
 * column visibility/order, selection with a bulk bar, CSV export and "load more".
 * Pages pass columns (see features/companies/components/company-columns.tsx) and data.
 */
export function DataTable<TData extends RowData>({
	data,
	columns,
	getRowId,
	exportName,
	isLoading = false,
	views,
	defaultSorting = [],
	initialColumnFilters = [],
	initialColumnVisibility = {},
	searchPlaceholder = "Search…",
	pageSize = 25,
	actions,
	chips,
	bulkActions,
	onRowClick,
	empty,
}: DataTableProps<TData>) {
	const [viewId, setViewId] = useState(views?.[0]?.id);
	const [openFilterId, setOpenFilterId] = useState<string | null>(null);
	const view = views?.find((item) => item.id === viewId);

	const rows = useMemo(
		() => (view?.filter ? (data ?? []).filter(view.filter) : (data ?? [])),
		[data, view],
	);

	const table = useTable({
		features: dataTableFeatures,
		columns,
		data: rows,
		getRowId,
		globalFilterFn: "includesString",
		initialState: {
			sorting: view?.sorting ?? defaultSorting,
			columnFilters: initialColumnFilters,
			columnVisibility: initialColumnVisibility,
			columnOrder: columns.map((column) => column.id ?? ""),
			pagination: { pageIndex: 0, pageSize },
			globalFilter: "",
			rowSelection: {},
		},
	});

	const selected = table.getSelectedRowModel().rows.map((row) => row.original);
	const clearSelection = () => table.resetRowSelection();
	const visibleRows = table.getRowModel().rows;
	const total = table.getPrePaginatedRowModel().rows.length;
	const headerGroups = table.getHeaderGroups();
	const columnCount = table.getVisibleLeafColumns().length;

	const changeView = (next: DataTableView<TData>) => {
		setViewId(next.id);
		table.setSorting(next.sorting ?? defaultSorting);
		table.resetRowSelection();
		table.setPageSize(pageSize);
	};

	const exportCsv = () => {
		const exportable = table
			.getVisibleLeafColumns()
			.filter((column) => column.columnDef.meta?.label && column.id !== "select");
		const csvRows = table.getPrePaginatedRowModel().rows.map((row) =>
			exportable.map((column) => {
				const value = row.getValue(column.id);
				const format = column.columnDef.meta?.format;
				return format ? format(value) : value == null ? "" : String(value);
			}),
		);
		downloadCsv(
			`${exportName}${view ? `-${view.id}` : ""}`,
			toCsv(
				exportable.map((column) => column.columnDef.meta?.label ?? column.id),
				csvRows,
			),
		);
	};

	return (
		<div className="flex min-w-0 flex-col gap-3">
			<div className="flex flex-wrap items-center gap-2">
				{views && views.length > 1 ? (
					<div role="tablist" aria-label="Saved views" className="flex rounded-lg bg-muted p-0.5">
						{views.map((item) => (
							<button
								key={item.id}
								type="button"
								role="tab"
								aria-selected={item.id === viewId}
								onClick={() => changeView(item)}
								className="h-7 whitespace-nowrap rounded-md px-3 font-medium text-muted-foreground text-sm outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-soft"
							>
								{item.label}
							</button>
						))}
					</div>
				) : null}
				<div className="relative order-last w-full sm:order-none sm:ml-auto sm:w-60">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<input
						type="search"
						aria-label={searchPlaceholder}
						placeholder={searchPlaceholder}
						value={String(table.state.globalFilter ?? "")}
						onChange={(event) => table.setGlobalFilter(event.target.value)}
						className="h-8 w-full rounded-lg border bg-background pr-2.5 pl-8 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
					/>
				</div>
				<div className="ml-auto flex items-center gap-2 sm:ml-0">
					<ViewOptions table={table} />
					<Button variant="outline" size="sm" onClick={exportCsv} disabled={total === 0}>
						<Download /> <span className="hidden sm:inline">Export</span>
					</Button>
					{actions}
				</div>
			</div>

			<FilterBar table={table} openId={openFilterId} onOpenIdChange={setOpenFilterId}>
				{chips}
			</FilterBar>

			<div className="max-h-[calc(100dvh-15rem)] min-h-64 overflow-auto rounded-2xl border bg-card shadow-soft">
				<table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
					<thead className="sticky top-0 z-10">
						{headerGroups.map((group) => (
							<tr key={group.id}>
								{group.headers.map((header) => {
									const meta = header.column.columnDef.meta;
									return (
										<th
											key={header.id}
											scope="col"
											className={cn(
												"h-10 whitespace-nowrap border-b bg-card/90 px-4 text-left align-middle font-normal text-muted-foreground backdrop-blur-xl first:pl-5",
												meta?.align === "right" && "text-right",
												meta?.headerClassName,
											)}
										>
											{header.isPlaceholder ? null : header.column.id === "select" ? (
												<table.FlexRender header={header} />
											) : (
												<ColumnHeader
													column={header.column}
													title={meta?.label ?? header.column.id}
													onFilter={setOpenFilterId}
													align={meta?.align}
												/>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{isLoading ? (
							SKELETON_ROWS.map((index) => (
								<tr key={index} aria-hidden>
									{Array.from({ length: columnCount }, (_, cell) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cells.
										<td key={cell} className="h-13 border-b px-4 first:pl-5">
											<Skeleton className={cn("h-4 rounded-md", cell === 0 ? "w-4" : "w-3/4")} />
										</td>
									))}
								</tr>
							))
						) : visibleRows.length === 0 ? (
							<tr>
								<td colSpan={columnCount} className="p-0">
									{rows.length === 0 && !data?.length ? (
										empty
									) : (
										<div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
											<SearchX className="size-6 text-muted-foreground" />
											<p className="text-muted-foreground text-sm">
												No rows match this view and filters.
											</p>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													table.resetColumnFilters();
													table.setGlobalFilter("");
												}}
											>
												Clear filters
											</Button>
										</div>
									)}
								</td>
							</tr>
						) : (
							visibleRows.map((row) => (
								<tr
									key={row.id}
									data-selected={row.getIsSelected() || undefined}
									onClick={onRowClick ? () => onRowClick(row.original) : undefined}
									className={cn(
										"group/row transition-colors hover:bg-muted/50 data-selected:bg-muted",
										onRowClick && "cursor-pointer",
									)}
								>
									{row.getVisibleCells().map((cell) => {
										const meta = cell.column.columnDef.meta;
										return (
											// biome-ignore lint/a11y/useKeyWithClickEvents: mouse-only convenience; the checkbox inside is the keyboard control.
											<td
												key={cell.id}
												// The whole selection cell toggles the row, so a near-miss never opens the record.
												onClick={
													cell.column.id === "select"
														? (event) => {
																event.stopPropagation();
																if (event.target === event.currentTarget) row.toggleSelected();
															}
														: undefined
												}
												className={cn(
													"h-13 whitespace-nowrap border-b px-4 align-middle group-last/row:border-b-0 first:pl-5",
													meta?.align === "right" && "text-right tabular-nums",
													meta?.cellClassName,
												)}
											>
												<table.FlexRender cell={cell} />
											</td>
										);
									})}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{!isLoading && total > 0 ? (
				<div className="flex items-center justify-between gap-3 text-muted-foreground text-sm">
					<span className="tabular-nums">
						Showing {visibleRows.length} of {total}
					</span>
					{table.getCanNextPage() ? (
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.setPageSize(table.state.pagination.pageSize + pageSize)}
						>
							Load more
						</Button>
					) : null}
				</div>
			) : null}

			{bulkActions ? (
				<BulkBar count={selected.length} onClear={clearSelection}>
					{bulkActions(selected, clearSelection)}
				</BulkBar>
			) : null}
		</div>
	);
}
