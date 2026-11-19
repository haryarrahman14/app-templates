import { Button } from "@repo/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@repo/ui/components/empty-state";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Building2, Plus, Upload, X } from "lucide-react";
import { useMemo } from "react";
import {
	AddToListMenu,
	AssignMenu,
	DeleteSelected,
	EmailSelected,
} from "@/components/kit/bulk-actions";
import { DataTable, type DataTableView } from "@/components/kit/data-table/data-table";
import { PageBody, PageHeader } from "@/components/kit/page-header";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { useDeleteCompanies, useUpdateCompanies } from "@/features/companies/api/mutations";
import { companiesQuery } from "@/features/companies/api/queries";
import { useCompanyColumns } from "@/features/companies/hooks/use-company-columns";
import type { Company } from "@/features/companies/schemas/company";
import { peopleQuery } from "@/features/people/api/queries";
import { useAddToList } from "@/features/workspace/api/mutations";
import { listsQuery, membersQuery } from "@/features/workspace/api/queries";
import { pluralize } from "@/lib/format";
import { SESSION_MEMBER_ID } from "@/lib/session";
import { openComposer, openCreate, setUi } from "@/lib/ui-state";

const RECENT_DAYS = 30;

const VIEWS: DataTableView<Company>[] = [
	{ id: "all", label: "All" },
	{ id: "mine", label: "My companies", filter: (row) => row.ownerId === SESSION_MEMBER_ID },
	{
		id: "recent",
		label: "Recently added",
		filter: (row) => Date.now() - new Date(row.createdAt).getTime() < RECENT_DAYS * 86_400_000,
		sorting: [{ id: "created", desc: true }],
	},
];

export function CompaniesPage({ listId }: { listId?: string }) {
	const navigate = useNavigate();
	const companies = useQuery(companiesQuery);
	const members = useQuery(membersQuery).data ?? [];
	const lists = useQuery(listsQuery).data ?? [];
	const people = useQuery(peopleQuery).data ?? [];
	const columns = useCompanyColumns(members);
	const updateMany = useUpdateCompanies();
	const deleteMany = useDeleteCompanies();
	const addToList = useAddToList();

	const list = lists.find((item) => item.id === listId && item.recordType === "company");
	const data = useMemo(
		() =>
			list
				? companies.data?.filter((company) => list.recordIds.includes(company.id))
				: companies.data,
		[companies.data, list],
	);

	return (
		<PageBody className="max-w-none xl:px-10">
			<PageHeader
				icon={<RecordGlyph type="company" size="md" />}
				title={list ? list.name : "Companies"}
				description={
					companies.data
						? `${pluralize(data?.length ?? 0, "company", "companies")}${list ? " in this list" : ""}`
						: "Loading…"
				}
			/>
			<DataTable
				// Remount when the list changes so view state starts fresh.
				key={listId ?? "all"}
				data={data}
				isLoading={companies.isPending}
				columns={columns}
				getRowId={(row) => row.id}
				exportName={
					list ? `companies-${list.name.toLowerCase().replace(/\s+/g, "-")}` : "companies"
				}
				views={VIEWS}
				defaultSorting={[{ id: "name", desc: false }]}
				initialColumnVisibility={{ created: false }}
				searchPlaceholder="Search companies"
				onRowClick={(row) => navigate({ to: "/companies/$id", params: { id: row.id } })}
				chips={
					list ? (
						<Link
							to="/companies"
							className="inline-flex h-7 items-center gap-1.5 rounded-full bg-primary/10 px-3 font-medium text-primary text-xs outline-none hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring"
						>
							List: {list.name} <X className="size-3" aria-label="Show all companies" />
						</Link>
					) : null
				}
				actions={
					<>
						<Button variant="outline" size="sm" onClick={() => setUi({ importOpen: true })}>
							<Upload /> <span className="hidden sm:inline">Import</span>
						</Button>
						<Button size="sm" onClick={() => openCreate("company")}>
							<Plus /> New company
						</Button>
					</>
				}
				bulkActions={(rows, clear) => {
					const ids = rows.map((row) => row.id);
					return (
						<>
							<AssignMenu
								members={members}
								onAssign={(ownerId) => updateMany.mutate({ ids, patch: { ownerId } })}
							/>
							<AddToListMenu
								lists={lists
									.filter((item) => item.recordType === "company")
									.map((item) => ({ id: item.id, name: item.name, tone: item.color }))}
								onAdd={(id) =>
									addToList.mutate({
										listId: id,
										refs: ids.map((rowId) => ({ type: "company", id: rowId })),
									})
								}
								onNewList={() => openCreate("list")}
							/>
							<EmailSelected
								onEmail={() =>
									openComposer(
										people
											.filter((person) => person.companyId && ids.includes(person.companyId))
											.map((person) => person.email)
											.slice(0, 10),
									)
								}
							/>
							<DeleteSelected
								count={rows.length}
								noun={["company", "companies"]}
								onConfirm={() => {
									deleteMany.mutate(ids);
									clear();
								}}
							/>
						</>
					);
				}}
				empty={
					<Empty className="py-14">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Building2 />
							</EmptyMedia>
							<EmptyTitle>{list ? "This list is empty" : "No companies yet"}</EmptyTitle>
							<EmptyDescription>
								{list
									? "Select companies in the table and choose Add to list."
									: "Add your first company, or import a CSV."}
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent className="flex-row justify-center">
							<Button onClick={() => openCreate("company")}>
								<Plus /> New company
							</Button>
						</EmptyContent>
					</Empty>
				}
			/>
		</PageBody>
	);
}
