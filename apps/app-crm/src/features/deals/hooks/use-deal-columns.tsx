import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { EditableSelectCell } from "@/components/kit/data-table/editable-cell";
import { type DataTableColumn, dataTableColumnHelper } from "@/components/kit/data-table/features";
import { selectionColumn } from "@/components/kit/data-table/selection-column";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { Pill } from "@/components/kit/pill";
import type { Company } from "@/features/companies/schemas/company";
import { useMoveDeal } from "@/features/deals/api/mutations";
import {
	DEAL_STAGE_META,
	DEAL_STAGES,
	type Deal,
	type DealStage,
} from "@/features/deals/schemas/deal";
import type { Member } from "@/features/workspace/schemas/workspace";
import { formatDate, formatMoney } from "@/lib/format";

const column = dataTableColumnHelper<Deal>();
const STAGE_OPTIONS = DEAL_STAGES.map((stage) => ({
	value: stage,
	label: DEAL_STAGE_META[stage].label,
}));
const stop = (event: React.MouseEvent) => event.stopPropagation();

export function useDealColumns(members: Member[], companies: Company[]): DataTableColumn<Deal>[] {
	const move = useMoveDeal().mutate;
	return useMemo(() => {
		const memberName = new Map(members.map((member) => [member.id, member.name]));
		const companyName = new Map(companies.map((company) => [company.id, company.name]));
		return column.columns([
			selectionColumn<Deal>(),
			column.accessor("name", {
				id: "name",
				meta: { label: "Deal", filter: { kind: "text" }, cellClassName: "min-w-56 font-medium" },
				enableHiding: false,
				filterFn: "includesString",
			}),
			column.accessor((row) => companyName.get(row.companyId) ?? "", {
				id: "company",
				meta: { label: "Company", filter: { kind: "text" } },
				filterFn: "includesString",
				cell: ({ row, getValue }) => (
					<Link
						to="/companies/$id"
						params={{ id: row.original.companyId }}
						onClick={stop}
						className="flex items-center gap-2 outline-none hover:underline focus-visible:underline"
					>
						<InitialsAvatar name={getValue()} square size="xs" />
						<span className="truncate">{getValue()}</span>
					</Link>
				),
			}),
			column.accessor("stage", {
				id: "stage",
				meta: {
					label: "Stage",
					filter: { kind: "select", options: STAGE_OPTIONS },
					format: (value) => DEAL_STAGE_META[value as DealStage].label,
				},
				filterFn: "inOptions",
				sortFn: (a, b) =>
					DEAL_STAGES.indexOf(a.original.stage) - DEAL_STAGES.indexOf(b.original.stage),
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: stops row click only.
					// biome-ignore lint/a11y/useKeyWithClickEvents: the menu inside handles keys.
					<div onClick={stop}>
						<EditableSelectCell
							label="stage"
							value={row.original.stage}
							options={STAGE_OPTIONS}
							onSave={(stage) =>
								move({ id: row.original.id, stage: stage as DealStage, rank: row.original.rank })
							}
						>
							<Pill>
								<span
									className={cn("size-1.5 rounded-full", DEAL_STAGE_META[row.original.stage].dot)}
								/>
								{DEAL_STAGE_META[row.original.stage].label}
							</Pill>
						</EditableSelectCell>
					</div>
				),
			}),
			column.accessor("value", {
				id: "value",
				meta: { label: "Value", align: "right", format: (value) => String(value) },
				cell: ({ getValue }) => formatMoney(getValue()),
			}),
			column.accessor("ownerId", {
				id: "owner",
				meta: {
					label: "Owner",
					filter: { kind: "select", options: members.map((m) => ({ value: m.id, label: m.name })) },
					format: (value) => memberName.get(String(value)) ?? "",
				},
				filterFn: "inOptions",
				cell: ({ getValue }) => {
					const name = memberName.get(getValue()) ?? "Unassigned";
					return (
						<span className="flex items-center gap-2">
							<InitialsAvatar name={name} size="xs" />
							{name.split(" ")[0]}
						</span>
					);
				},
			}),
			column.accessor("closeDate", {
				id: "closeDate",
				meta: { label: "Close date", format: (value) => String(value) },
				sortFn: (a, b) => a.original.closeDate.localeCompare(b.original.closeDate),
				cell: ({ getValue }) => (
					<span className="text-muted-foreground">{formatDate(getValue())}</span>
				),
			}),
		]) as DataTableColumn<Deal>[];
	}, [members, companies, move]);
}
