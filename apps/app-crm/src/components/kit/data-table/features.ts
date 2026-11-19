import {
	type ColumnDef,
	columnFilteringFeature,
	columnOrderingFeature,
	columnVisibilityFeature,
	createColumnHelper,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFn_includesString,
	globalFilteringFeature,
	type RowData,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_basic,
	sortFn_datetime,
	sortFn_text,
	tableFeatures,
} from "@tanstack/react-table";

/** Extra column metadata the kit understands. */
export type DataTableColumnMeta = {
	/** Human label for menus, filter chips and the CSV header. */
	label?: string;
	/** Makes the column filterable from the filter bar and the header menu. */
	filter?: { kind: "text" } | { kind: "select"; options: { value: string; label: string }[] };
	/** CSV export formatter; defaults to String(value). */
	format?: (value: unknown) => string;
	align?: "left" | "right";
	headerClassName?: string;
	cellClassName?: string;
};

/** Value is one of the selected options. Removed from state when nothing is selected. */
const inOptions = Object.assign(
	(
		row: { getValue: (id: string) => unknown },
		columnId: string,
		filterValue: string[] | undefined,
	) => !filterValue?.length || filterValue.includes(String(row.getValue(columnId))),
	{ autoRemove: (value: unknown) => !Array.isArray(value) || value.length === 0 },
);

/**
 * The one feature set every data table in the app uses (TanStack Table v9 makes features opt-in).
 * Keep it stable at module level; `typeof dataTableFeatures` types columns and rows.
 */
export const dataTableFeatures = tableFeatures({
	rowSortingFeature,
	columnFilteringFeature,
	globalFilteringFeature,
	rowSelectionFeature,
	columnVisibilityFeature,
	columnOrderingFeature,
	rowPaginationFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filterFns: { includesString: filterFn_includesString, inOptions },
	sortFns: {
		alphanumeric: sortFn_alphanumeric,
		text: sortFn_text,
		datetime: sortFn_datetime,
		basic: sortFn_basic,
	},
	columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;

// biome-ignore lint/suspicious/noExplicitAny: column value types differ per column.
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>;

export const dataTableColumnHelper = <TData extends RowData>() =>
	createColumnHelper<DataTableFeatures, TData>();
