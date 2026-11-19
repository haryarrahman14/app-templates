import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import type { RowData } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Columns3, RotateCcw } from "lucide-react";
import type { DataTableInstance } from "./data-table";

/** Show/hide and reorder columns. Up/down buttons keep reordering keyboard-friendly. */
export function ViewOptions<TData extends RowData>({ table }: { table: DataTableInstance<TData> }) {
	const columns = table.getAllLeafColumns().filter((column) => column.columnDef.meta?.label);
	const order = table.getAllLeafColumns().map((column) => column.id);

	const move = (id: string, delta: -1 | 1) => {
		const movable = columns.map((column) => column.id);
		const index = movable.indexOf(id);
		const target = movable[index + delta];
		if (!target) return;
		const next = [...order];
		const from = next.indexOf(id);
		const to = next.indexOf(target);
		next[from] = target;
		next[to] = id;
		table.setColumnOrder(next);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm">
					<Columns3 /> <span className="hidden sm:inline">Columns</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-64 rounded-xl p-1.5">
				<p className="px-2 py-1.5 font-medium text-muted-foreground text-xs">Visible columns</p>
				<ul className="grid gap-0.5">
					{columns.map((column, index) => (
						<li key={column.id} className="flex items-center gap-1 rounded-lg pr-1 hover:bg-muted">
							{/* biome-ignore lint/a11y/noLabelWithoutControl: the Checkbox inside is the control. */}
							<label className="flex flex-1 cursor-pointer items-center gap-2.5 px-2 py-1.5 text-sm">
								<Checkbox
									checked={column.getIsVisible()}
									disabled={!column.getCanHide()}
									onCheckedChange={(checked) => column.toggleVisibility(Boolean(checked))}
								/>
								{column.columnDef.meta?.label}
							</label>
							<Button
								variant="ghost"
								size="icon-xs"
								disabled={index === 0}
								aria-label={`Move ${column.columnDef.meta?.label} left`}
								onClick={() => move(column.id, -1)}
							>
								<ArrowUp />
							</Button>
							<Button
								variant="ghost"
								size="icon-xs"
								disabled={index === columns.length - 1}
								aria-label={`Move ${column.columnDef.meta?.label} right`}
								onClick={() => move(column.id, 1)}
							>
								<ArrowDown />
							</Button>
						</li>
					))}
				</ul>
				<Button
					variant="ghost"
					size="sm"
					className="mt-1 w-full justify-start text-muted-foreground"
					onClick={() => {
						table.resetColumnOrder();
						table.resetColumnVisibility();
					}}
				>
					<RotateCcw /> Reset columns
				</Button>
			</PopoverContent>
		</Popover>
	);
}
