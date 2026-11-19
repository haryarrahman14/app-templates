import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { EditableSelectCell, EditableTextCell } from "@/components/kit/data-table/editable-cell";
import { type DataTableColumn, dataTableColumnHelper } from "@/components/kit/data-table/features";
import { selectionColumn } from "@/components/kit/data-table/selection-column";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { Pill } from "@/components/kit/pill";
import type { Company } from "@/features/companies/schemas/company";
import { useUpdatePerson } from "@/features/people/api/mutations";
import { STAGE_OPTIONS, STAGE_TONE } from "@/features/people/constants/stage";
import {
	fullName,
	type Person,
	type PersonStage,
	STAGE_LABEL,
} from "@/features/people/schemas/person";
import type { Member } from "@/features/workspace/schemas/workspace";
import { formatAgo, formatDate } from "@/lib/format";

const column = dataTableColumnHelper<Person>();

const stop = (event: React.MouseEvent) => event.stopPropagation();

export function usePersonColumns(
	members: Member[],
	companies: Company[],
): DataTableColumn<Person>[] {
	const mutate = useUpdatePerson().mutate;

	return useMemo(() => {
		const memberName = new Map(members.map((member) => [member.id, member.name]));
		const companyName = new Map(companies.map((company) => [company.id, company.name]));
		const memberOptions = members.map((member) => ({ value: member.id, label: member.name }));
		const companyOptions = companies.map((company) => ({ value: company.id, label: company.name }));

		return column.columns([
			selectionColumn<Person>(),
			column.accessor((row) => fullName(row), {
				id: "name",
				meta: { label: "Name", filter: { kind: "text" }, cellClassName: "min-w-56" },
				enableHiding: false,
				filterFn: "includesString",
				cell: ({ row }) => (
					<div className="flex min-w-0 items-center gap-3">
						<InitialsAvatar name={fullName(row.original)} size="md" />
						<div className="min-w-0">
							<Link
								to="/people/$id"
								params={{ id: row.original.id }}
								onClick={stop}
								className="block truncate font-medium outline-none hover:underline focus-visible:underline"
							>
								{fullName(row.original)}
							</Link>
							<span className="block truncate text-muted-foreground text-xs">
								{row.original.title}
							</span>
						</div>
					</div>
				),
			}),
			column.accessor("email", {
				id: "email",
				meta: { label: "Email", filter: { kind: "text" }, cellClassName: "min-w-52" },
				filterFn: "includesString",
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: stops row navigation only.
					// biome-ignore lint/a11y/useKeyWithClickEvents: the button inside handles keys.
					<div onClick={stop}>
						<EditableTextCell
							label="email"
							inputType="email"
							value={row.original.email}
							validate={(value) =>
								/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Enter a valid email"
							}
							onSave={(email) => mutate({ id: row.original.id, email })}
						/>
					</div>
				),
			}),
			column.accessor((row) => (row.companyId ? (companyName.get(row.companyId) ?? "") : ""), {
				id: "company",
				meta: {
					label: "Company",
					filter: {
						kind: "select",
						options: companyOptions.map((o) => ({ value: o.label, label: o.label })),
					},
				},
				filterFn: "inOptions",
				cell: ({ row, getValue }) =>
					row.original.companyId ? (
						<Link
							to="/companies/$id"
							params={{ id: row.original.companyId }}
							onClick={stop}
							className="flex items-center gap-2 truncate outline-none hover:underline focus-visible:underline"
						>
							<InitialsAvatar name={getValue()} square size="xs" />
							{getValue()}
						</Link>
					) : (
						<span className="text-muted-foreground">—</span>
					),
			}),
			column.accessor("stage", {
				id: "stage",
				meta: {
					label: "Stage",
					filter: { kind: "select", options: STAGE_OPTIONS },
					format: (value) => STAGE_LABEL[value as PersonStage],
				},
				filterFn: "inOptions",
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: stops row navigation only.
					// biome-ignore lint/a11y/useKeyWithClickEvents: the menu inside handles keys.
					<div onClick={stop}>
						<EditableSelectCell
							label="stage"
							value={row.original.stage}
							options={STAGE_OPTIONS}
							onSave={(stage) => mutate({ id: row.original.id, stage: stage as PersonStage })}
						>
							<Pill tone={STAGE_TONE[row.original.stage]} dot>
								{STAGE_LABEL[row.original.stage]}
							</Pill>
						</EditableSelectCell>
					</div>
				),
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
						<span className="flex items-center gap-2">
							<InitialsAvatar name={name} size="xs" />
							<span className="truncate">{name.split(" ")[0]}</span>
						</span>
					);
				},
			}),
			column.accessor("phone", {
				id: "phone",
				meta: { label: "Phone" },
				enableSorting: false,
				cell: ({ getValue }) => (
					<span className="text-muted-foreground tabular-nums">{getValue() || "—"}</span>
				),
			}),
			column.accessor("city", {
				id: "city",
				meta: { label: "City", filter: { kind: "text" } },
				filterFn: "includesString",
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
		]) as DataTableColumn<Person>[];
	}, [members, companies, mutate]);
}
