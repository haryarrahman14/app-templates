import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { cn } from "@repo/ui/lib/cn";
import type { Column, RowData } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, ListFilter, X } from "lucide-react";
import type { DataTableFeatures } from "./features";

/** Header with a menu: sort, filter this column, hide it. */
export function ColumnHeader<TData extends RowData>({
	column,
	title,
	onFilter,
	align = "left",
}: {
	column: Column<DataTableFeatures, TData, unknown>;
	title: string;
	onFilter?: (columnId: string) => void;
	align?: "left" | "right";
}) {
	const sorted = column.getIsSorted();
	const canSort = column.getCanSort();
	const canFilter = Boolean(column.columnDef.meta?.filter) && column.getCanFilter();
	const canHide = column.getCanHide();

	if (!canSort && !canFilter && !canHide) {
		return <span className="font-medium">{title}</span>;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					"-mx-1.5 inline-flex h-7 items-center gap-1 rounded-md px-1.5 font-medium outline-none transition hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-muted",
					align === "right" && "ml-auto flex-row-reverse",
				)}
			>
				{title}
				{sorted === "asc" ? (
					<ArrowUp className="size-3.5" />
				) : sorted === "desc" ? (
					<ArrowDown className="size-3.5" />
				) : (
					<ChevronsUpDown className="size-3.5 opacity-40" />
				)}
				{column.getIsFiltered() ? <span className="size-1.5 rounded-full bg-primary" /> : null}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={align === "right" ? "end" : "start"}
				className="w-44 rounded-xl"
				// Keep focus where the filter editor puts it instead of returning it to this header.
				onCloseAutoFocus={(event) => event.preventDefault()}
			>
				{canSort ? (
					<>
						<DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
							<ArrowUp /> Sort ascending
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
							<ArrowDown /> Sort descending
						</DropdownMenuItem>
						{sorted ? (
							<DropdownMenuItem onSelect={() => column.clearSorting()}>
								<X /> Clear sort
							</DropdownMenuItem>
						) : null}
					</>
				) : null}
				{canFilter && onFilter ? (
					<>
						{canSort ? <DropdownMenuSeparator /> : null}
						<DropdownMenuItem onSelect={() => setTimeout(() => onFilter(column.id), 50)}>
							<ListFilter /> Filter…
						</DropdownMenuItem>
					</>
				) : null}
				{canHide ? (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => column.toggleVisibility(false)}>
							<EyeOff /> Hide column
						</DropdownMenuItem>
					</>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
