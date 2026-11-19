import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import {
	type ColumnVisibilityState,
	columnFilteringFeature,
	columnVisibilityFeature,
	createColumnHelper,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	FlexRender,
	filterFn_includesString,
	globalFilteringFeature,
	type RowSelectionState,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	type SortingState,
	sortFn_alphanumeric,
	sortFn_datetime,
	sortFn_text,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import {
	ArrowDownIcon,
	ArrowUpDownIcon,
	ArrowUpIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	Columns3Icon,
	StarIcon,
	StarOffIcon,
	Trash2Icon,
	XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { TagPill } from "@/components/kit/tag-pill";
import { UserAvatar } from "@/components/kit/user-avatar";
import { useToggleStar, useTrashDocs } from "@/features/documents/api/mutations";
import { DocActionsMenu } from "@/features/documents/components/doc-actions-menu";
import type { Doc, Tag } from "@/features/documents/schemas/document";
import { docTitle } from "@/features/documents/utils/doc-helpers";
import { formatRelative } from "@/lib/format";

const features = tableFeatures({
	rowSortingFeature,
	columnFilteringFeature,
	globalFilteringFeature,
	rowSelectionFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	sortedRowModel: createSortedRowModel(),
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, datetime: sortFn_datetime },
	filterFns: { includesString: filterFn_includesString },
});

const columnHelper = createColumnHelper<typeof features, Doc>();

const COLUMN_LABELS: Record<string, string> = {
	folder: "Folder",
	tags: "Tags",
	owner: "Owner",
	updatedAt: "Updated",
};

export type DocTableLookups = {
	folderName: (id: string | null) => string;
	owner: (id: string) => { name: string };
	tagsById: Map<string, Tag>;
};

export function DocTable({
	docs,
	search,
	lookups,
}: {
	docs: Doc[];
	search: string;
	lookups: DocTableLookups;
}) {
	const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
	const star = useToggleStar();
	const trash = useTrashDocs();

	const columns = useMemo(
		() =>
			columnHelper.columns([
				columnHelper.display({
					id: "select",
					enableHiding: false,
					header: ({ table }) => (
						<Checkbox
							aria-label="Select all on this page"
							checked={
								table.getIsAllPageRowsSelected()
									? true
									: table.getIsSomePageRowsSelected()
										? "indeterminate"
										: false
							}
							onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						/>
					),
					cell: ({ row }) => (
						<Checkbox
							aria-label={`Select ${docTitle(row.original)}`}
							checked={row.getIsSelected()}
							onCheckedChange={(value) => row.toggleSelected(!!value)}
						/>
					),
				}),
				columnHelper.accessor((doc) => docTitle(doc), {
					id: "title",
					header: "Name",
					enableHiding: false,
					sortFn: "text",
					cell: ({ row }) => (
						<Link
							to="/docs/$docId"
							params={{ docId: row.original.id }}
							className="flex min-w-0 items-center gap-2.5 rounded-md font-medium outline-none hover:text-link focus-visible:ring-2 focus-visible:ring-ring"
						>
							<span aria-hidden className="text-base">
								{row.original.emoji}
							</span>
							<span className="truncate">{docTitle(row.original)}</span>
							{row.original.starred ? (
								<StarIcon
									aria-label="Starred"
									className="size-3.5 shrink-0 fill-primary text-primary"
								/>
							) : null}
						</Link>
					),
				}),
				columnHelper.accessor((doc) => lookups.folderName(doc.folderId), {
					id: "folder",
					header: "Folder",
					sortFn: "text",
					cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
				}),
				columnHelper.accessor((doc) => doc.tagIds.length, {
					id: "tags",
					header: "Tags",
					enableSorting: false,
					enableGlobalFilter: false,
					cell: ({ row }) => (
						<div className="flex flex-wrap gap-1">
							{row.original.tagIds.map((id) => {
								const tag = lookups.tagsById.get(id);
								return tag ? (
									<TagPill key={id} tint={tag.tint}>
										{tag.name}
									</TagPill>
								) : null;
							})}
						</div>
					),
				}),
				columnHelper.accessor((doc) => lookups.owner(doc.ownerId).name, {
					id: "owner",
					header: "Owner",
					sortFn: "text",
					cell: ({ row }) => {
						const owner = lookups.owner(row.original.ownerId);
						return (
							<span className="flex items-center gap-2 whitespace-nowrap">
								<UserAvatar name={owner.name} size="sm" />
								{owner.name}
							</span>
						);
					},
				}),
				columnHelper.accessor("updatedAt", {
					header: "Updated",
					enableGlobalFilter: false,
					sortFn: "alphanumeric",
					cell: (info) => (
						<span className="whitespace-nowrap text-muted-foreground">
							{formatRelative(info.getValue())}
						</span>
					),
				}),
				columnHelper.display({
					id: "actions",
					enableHiding: false,
					header: () => <span className="sr-only">Actions</span>,
					cell: ({ row }) => <DocActionsMenu doc={row.original} />,
				}),
			]),
		[lookups],
	);

	const table = useTable({
		features,
		columns,
		data: docs,
		getRowId: (doc) => doc.id,
		state: { sorting, rowSelection, columnVisibility, globalFilter: search },
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		globalFilterFn: "includesString",
		initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
	});

	// Only rows that pass the current search count; hidden rows stay selected but are not acted on.
	const selectedIds = table
		.getFilteredRowModel()
		.rows.filter((row) => rowSelection[row.id])
		.map((row) => row.id);
	const pageCount = Math.max(1, table.getPageCount());
	const { pageIndex } = table.state.pagination;

	return (
		<div className="space-y-3">
			<div className="flex min-h-9 flex-wrap items-center justify-between gap-2">
				{selectedIds.length > 0 ? (
					<div className="flex flex-wrap items-center gap-1.5 rounded-xl border bg-card px-2 py-1 shadow-soft">
						<span className="px-1.5 font-medium text-sm">{selectedIds.length} selected</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => star.mutate({ ids: selectedIds, starred: true })}
						>
							<StarIcon /> Star
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => star.mutate({ ids: selectedIds, starred: false })}
						>
							<StarOffIcon /> Unstar
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive"
							onClick={() => {
								trash.mutate(selectedIds);
								setRowSelection({});
							}}
						>
							<Trash2Icon /> Move to trash
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							aria-label="Clear selection"
							onClick={() => setRowSelection({})}
						>
							<XIcon />
						</Button>
					</div>
				) : (
					<p className="text-muted-foreground text-sm">
						{table.getFilteredRowModel().rows.length} documents
					</p>
				)}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Columns3Icon /> Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						<DropdownMenuLabel>Show columns</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{table
							.getAllLeafColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
									onSelect={(event) => event.preventDefault()}
								>
									{COLUMN_LABELS[column.id] ?? column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map((header) => {
									const sorted = header.column.getIsSorted();
									return (
										<TableHead
											key={header.id}
											className={cn(
												"h-10 text-xs",
												header.column.id === "select" && "w-10 pl-4",
												header.column.id === "actions" && "w-12",
											)}
											aria-sort={
												sorted === "asc"
													? "ascending"
													: sorted === "desc"
														? "descending"
														: undefined
											}
										>
											{header.isPlaceholder ? null : header.column.getCanSort() ? (
												<button
													type="button"
													onClick={header.column.getToggleSortingHandler()}
													className="-ml-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
												>
													<FlexRender header={header} />
													{sorted === "asc" ? (
														<ArrowUpIcon className="size-3" />
													) : sorted === "desc" ? (
														<ArrowDownIcon className="size-3" />
													) : (
														<ArrowUpDownIcon className="size-3 opacity-40" />
													)}
												</button>
											) : (
												<FlexRender header={header} />
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={table.getVisibleLeafColumns().length}
									className="h-28 text-center text-muted-foreground"
								>
									No documents match “{search}”.
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={cn(
												"py-2.5",
												cell.column.id === "select" && "pl-4",
												cell.column.id === "title" && "max-w-72",
											)}
										>
											<FlexRender cell={cell} />
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-end gap-2 text-muted-foreground text-sm">
				<span>
					Page {pageIndex + 1} of {pageCount}
				</span>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Previous page"
					disabled={!table.getCanPreviousPage()}
					onClick={() => table.previousPage()}
				>
					<ChevronLeftIcon />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Next page"
					disabled={!table.getCanNextPage()}
					onClick={() => table.nextPage()}
				>
					<ChevronRightIcon />
				</Button>
			</div>
		</div>
	);
}
