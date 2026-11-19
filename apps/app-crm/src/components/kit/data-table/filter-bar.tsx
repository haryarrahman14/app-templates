import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Input } from "@repo/ui/components/input";
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from "@repo/ui/components/popover";
import type { Column, RowData } from "@tanstack/react-table";
import { ListFilter, X } from "lucide-react";
import { useId, useState } from "react";
import type { DataTableInstance } from "./data-table";
import type { DataTableFeatures } from "./features";

type AnyColumn<TData extends RowData> = Column<DataTableFeatures, TData, unknown>;

function describe<TData extends RowData>(column: AnyColumn<TData>) {
	const filter = column.columnDef.meta?.filter;
	const value = column.getFilterValue();
	if (!filter || value === undefined) return "any";
	if (filter.kind === "text") return `contains “${String(value)}”`;
	const selected = (value as string[]).map(
		(item) => filter.options.find((option) => option.value === item)?.label ?? item,
	);
	return selected.length > 2 ? `is ${selected.length} values` : `is ${selected.join(", ")}`;
}

function FilterEditor<TData extends RowData>({ column }: { column: AnyColumn<TData> }) {
	const id = useId();
	const filter = column.columnDef.meta?.filter;
	if (!filter) return null;
	if (filter.kind === "text") {
		return (
			<div className="grid gap-2 p-1">
				<label htmlFor={id} className="font-medium text-xs text-muted-foreground">
					{column.columnDef.meta?.label} contains
				</label>
				<Input
					id={id}
					autoFocus
					value={String(column.getFilterValue() ?? "")}
					onChange={(event) => column.setFilterValue(event.target.value || undefined)}
					placeholder="Type to filter…"
				/>
			</div>
		);
	}
	const selected = (column.getFilterValue() as string[] | undefined) ?? [];
	return (
		<fieldset className="grid gap-0.5 p-1">
			<legend className="mb-1 px-1 font-medium text-muted-foreground text-xs">
				{column.columnDef.meta?.label} is any of
			</legend>
			{filter.options.map((option) => {
				const checked = selected.includes(option.value);
				return (
					// biome-ignore lint/a11y/noLabelWithoutControl: the Checkbox inside is the control.
					<label
						key={option.value}
						className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
					>
						<Checkbox
							checked={checked}
							onCheckedChange={(next) => {
								const values = next
									? [...selected, option.value]
									: selected.filter((item) => item !== option.value);
								column.setFilterValue(values.length ? values : undefined);
							}}
						/>
						{option.label}
					</label>
				);
			})}
		</fieldset>
	);
}

/** "Filter" button: pick a column, then edit its value in the same popover. */
function AddFilter<TData extends RowData>({
	columns,
	available,
}: {
	columns: AnyColumn<TData>[];
	available: AnyColumn<TData>[];
}) {
	const [open, setOpen] = useState(false);
	const [pickedId, setPickedId] = useState<string | null>(null);
	const picked = columns.find((column) => column.id === pickedId);
	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) setPickedId(null);
			}}
		>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
					<ListFilter /> Filter
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-64 rounded-xl p-1.5">
				{picked ? (
					<FilterEditor column={picked} />
				) : (
					<div className="grid">
						<p className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
							{available.length ? "Filter by" : "Every column already has a filter"}
						</p>
						{available.map((column) => (
							<button
								key={column.id}
								type="button"
								onClick={() => setPickedId(column.id)}
								className="rounded-lg px-2 py-1.5 text-left text-sm outline-none hover:bg-muted focus-visible:bg-muted"
							>
								{column.columnDef.meta?.label}
							</button>
						))}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}

/**
 * The filter chips row. `openId` is the column whose editor is open (also set from the header menu);
 * a column being edited shows a chip even before it has a value.
 */
export function FilterBar<TData extends RowData>({
	table,
	openId,
	onOpenIdChange,
	children,
}: {
	table: DataTableInstance<TData>;
	openId: string | null;
	onOpenIdChange: (id: string | null) => void;
	children?: React.ReactNode;
}) {
	const filterable = table
		.getAllLeafColumns()
		.filter((column) => column.columnDef.meta?.filter && column.getCanFilter());
	const active = filterable.filter((column) => column.getIsFiltered() || column.id === openId);
	const available = filterable.filter((column) => !active.includes(column));

	return (
		<div className="flex flex-wrap items-center gap-2">
			{children}
			{active.map((column) => (
				<Popover
					key={column.id}
					open={openId === column.id}
					onOpenChange={(open) => onOpenIdChange(open ? column.id : null)}
				>
					<PopoverAnchor asChild>
						<span className="inline-flex h-7 items-center overflow-hidden rounded-full border bg-background text-xs shadow-soft">
							<button
								type="button"
								onClick={() => onOpenIdChange(column.id)}
								className="flex h-full items-center gap-1 pr-1 pl-3 outline-none hover:bg-muted focus-visible:bg-muted"
							>
								<span className="font-medium">{column.columnDef.meta?.label}</span>
								<span className="text-muted-foreground">{describe(column)}</span>
							</button>
							<button
								type="button"
								aria-label={`Remove ${column.columnDef.meta?.label} filter`}
								onClick={() => {
									column.setFilterValue(undefined);
									onOpenIdChange(null);
								}}
								className="flex h-full items-center px-2 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:bg-muted"
							>
								<X className="size-3" />
							</button>
						</span>
					</PopoverAnchor>
					<PopoverContent
						align="start"
						className="w-64 rounded-xl p-2"
						// Menus that open this editor hand focus back to their trigger; do not treat that as dismiss.
						onFocusOutside={(event) => event.preventDefault()}
					>
						<FilterEditor column={column} />
					</PopoverContent>
				</Popover>
			))}
			<AddFilter columns={filterable} available={available} />
			{table.state.columnFilters.length > 1 ? (
				<Button
					variant="ghost"
					size="sm"
					className="rounded-full text-muted-foreground"
					onClick={() => table.resetColumnFilters()}
				>
					Clear all
				</Button>
			) : null}
		</div>
	);
}
