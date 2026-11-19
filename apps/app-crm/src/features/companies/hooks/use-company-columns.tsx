import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { EditableSelectCell, EditableTextCell } from "@/components/kit/data-table/editable-cell";
import { type DataTableColumn, dataTableColumnHelper } from "@/components/kit/data-table/features";
import { selectionColumn } from "@/components/kit/data-table/selection-column";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { Pill } from "@/components/kit/pill";
import { useUpdateCompany } from "@/features/companies/api/mutations";
import { STATUS_OPTIONS, STATUS_TONE } from "@/features/companies/constants/status";
import {
	COMPANY_SIZES,
	type Company,
	type CompanyStatus,
	INDUSTRIES,
	STATUS_LABEL,
} from "@/features/companies/schemas/company";
import type { Member } from "@/features/workspace/schemas/workspace";
import { formatAgo, formatDate, formatMoney } from "@/lib/format";

const column = dataTableColumnHelper<Company>();
const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

/** Column definitions for the companies table: this is the file to copy for a new record type. */
export function useCompanyColumns(members: Member[]): DataTableColumn<Company>[] {
	const update = useUpdateCompany();
	const mutate = update.mutate;

	return useMemo(() => {
		const memberName = new Map(members.map((member) => [member.id, member.name]));
		const memberOptions = members.map((member) => ({ value: member.id, label: member.name }));

		return column.columns([
			selectionColumn<Company>(),
			column.accessor("name", {
				id: "name",
				meta: { label: "Company", filter: { kind: "text" }, cellClassName: "min-w-56" },
				enableHiding: false,
				filterFn: "includesString",
				cell: ({ row }) => (
					<div className="flex min-w-0 items-center gap-3">
						<InitialsAvatar name={row.original.name} square size="md" />
						<div className="min-w-0">
							<Link
								to="/companies/$id"
								params={{ id: row.original.id }}
								onClick={(event) => event.stopPropagation()}
								className="block truncate font-medium outline-none hover:underline focus-visible:underline"
							>
								{row.original.name}
							</Link>
							<span className="block truncate text-muted-foreground text-xs">
								{row.original.domain || "No website"}
							</span>
						</div>
					</div>
				),
			}),
			column.accessor("status", {
				id: "status",
				meta: {
					label: "Status",
					filter: { kind: "select", options: STATUS_OPTIONS },
					format: (value) => STATUS_LABEL[value as CompanyStatus],
				},
				filterFn: "inOptions",
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: stops row navigation only.
					// biome-ignore lint/a11y/useKeyWithClickEvents: the menu inside handles keys.
					<div onClick={(event) => event.stopPropagation()}>
						<EditableSelectCell
							label="status"
							value={row.original.status}
							options={STATUS_OPTIONS}
							onSave={(status) => mutate({ id: row.original.id, status: status as CompanyStatus })}
						>
							<Pill tone={STATUS_TONE[row.original.status]} dot>
								{STATUS_LABEL[row.original.status]}
							</Pill>
						</EditableSelectCell>
					</div>
				),
			}),
			column.accessor("industry", {
				id: "industry",
				meta: { label: "Industry", filter: { kind: "select", options: toOptions(INDUSTRIES) } },
				filterFn: "inOptions",
			}),
			column.accessor("ownerId", {
				id: "owner",
				meta: {
					label: "Owner",
					filter: { kind: "select", options: memberOptions },
					format: (value) => memberName.get(String(value)) ?? "",
				},
				filterFn: "inOptions",
				sortFn: (a, b) =>
					(memberName.get(a.original.ownerId) ?? "").localeCompare(
						memberName.get(b.original.ownerId) ?? "",
					),
				cell: ({ row }) => {
					const name = memberName.get(row.original.ownerId) ?? "Unassigned";
					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: stops row navigation only.
						// biome-ignore lint/a11y/useKeyWithClickEvents: the menu inside handles keys.
						<div onClick={(event) => event.stopPropagation()}>
							<EditableSelectCell
								label="owner"
								value={row.original.ownerId}
								options={memberOptions}
								onSave={(ownerId) => mutate({ id: row.original.id, ownerId })}
							>
								<span className="flex items-center gap-2">
									<InitialsAvatar name={name} size="xs" />
									<span className="truncate">{name.split(" ")[0]}</span>
								</span>
							</EditableSelectCell>
						</div>
					);
				},
			}),
			column.accessor("size", {
				id: "size",
				meta: { label: "Employees", filter: { kind: "select", options: toOptions(COMPANY_SIZES) } },
				filterFn: "inOptions",
				sortFn: (a, b) =>
					COMPANY_SIZES.indexOf(a.original.size) - COMPANY_SIZES.indexOf(b.original.size),
				cell: ({ getValue }) => <span className="text-muted-foreground">{getValue()}</span>,
			}),
			column.accessor("city", {
				id: "city",
				meta: { label: "City", filter: { kind: "text" }, cellClassName: "min-w-36" },
				filterFn: "includesString",
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: stops row navigation only.
					// biome-ignore lint/a11y/useKeyWithClickEvents: the button inside handles keys.
					<div onClick={(event) => event.stopPropagation()}>
						<EditableTextCell
							label="city"
							value={row.original.city}
							placeholder="Add city"
							validate={(value) => (value.length > 40 ? "Keep it under 40 characters" : null)}
							onSave={(city) => mutate({ id: row.original.id, city })}
						/>
					</div>
				),
			}),
			column.accessor("arr", {
				id: "arr",
				meta: { label: "ARR", align: "right", format: (value) => String(value) },
				cell: ({ getValue }) =>
					getValue() ? formatMoney(getValue()) : <span className="text-muted-foreground">—</span>,
			}),
			column.accessor("lastContactedAt", {
				id: "lastContacted",
				meta: { label: "Last contact", format: (value) => (value ? String(value) : "") },
				sortFn: (a, b) =>
					(a.original.lastContactedAt ?? "").localeCompare(b.original.lastContactedAt ?? ""),
				cell: ({ getValue }) => (
					<span className="text-muted-foreground">{formatAgo(getValue())}</span>
				),
			}),
			column.accessor("createdAt", {
				id: "created",
				meta: { label: "Created", format: (value) => String(value) },
				sortFn: (a, b) => a.original.createdAt.localeCompare(b.original.createdAt),
				cell: ({ getValue }) => (
					<span className="text-muted-foreground">{formatDate(getValue())}</span>
				),
			}),
		]) as DataTableColumn<Company>[];
	}, [members, mutate]);
}
