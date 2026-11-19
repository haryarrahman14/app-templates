import { Checkbox } from "@repo/ui/components/checkbox";
import type { RowData } from "@tanstack/react-table";
import type { DataTableColumn } from "./features";

/** The leading checkbox column. Add it first in a table's columns array. */
export function selectionColumn<TData extends RowData>(): DataTableColumn<TData> {
	return {
		id: "select",
		enableSorting: false,
		enableHiding: false,
		enableColumnFilter: false,
		header: ({ table }) => (
			<Checkbox
				aria-label="Select all rows on this page"
				checked={
					table.getIsAllPageRowsSelected()
						? true
						: table.getIsSomePageRowsSelected()
							? "indeterminate"
							: false
				}
				onCheckedChange={(checked) => table.toggleAllPageRowsSelected(Boolean(checked))}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				aria-label="Select row"
				checked={row.getIsSelected()}
				onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
				onClick={(event) => event.stopPropagation()}
			/>
		),
		meta: { headerClassName: "w-10", cellClassName: "w-10" },
	};
}
