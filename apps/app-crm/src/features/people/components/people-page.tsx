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
import { Plus, User, X } from "lucide-react";
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
import { companiesQuery } from "@/features/companies/api/queries";
import { useDeletePeople, useUpdatePeople } from "@/features/people/api/mutations";
import { peopleQuery } from "@/features/people/api/queries";
import { usePersonColumns } from "@/features/people/hooks/use-person-columns";
import type { Person } from "@/features/people/schemas/person";
import { useAddToList } from "@/features/workspace/api/mutations";
import { listsQuery, membersQuery } from "@/features/workspace/api/queries";
import { pluralize } from "@/lib/format";
import { SESSION_MEMBER_ID } from "@/lib/session";
import { openComposer, openCreate } from "@/lib/ui-state";

const VIEWS: DataTableView<Person>[] = [
	{ id: "all", label: "All" },
	{ id: "mine", label: "My people", filter: (row) => row.ownerId === SESSION_MEMBER_ID },
	{
		id: "recent",
		label: "Recently added",
		filter: (row) => Date.now() - new Date(row.createdAt).getTime() < 30 * 86_400_000,
		sorting: [{ id: "created", desc: true }],
	},
];

export function PeoplePage({ listId }: { listId?: string }) {
	const navigate = useNavigate();
	const people = useQuery(peopleQuery);
	const members = useQuery(membersQuery).data ?? [];
	const companies = useQuery(companiesQuery).data ?? [];
	const lists = useQuery(listsQuery).data ?? [];
	const columns = usePersonColumns(members, companies);
	const updateMany = useUpdatePeople();
	const deleteMany = useDeletePeople();
	const addToList = useAddToList();

	const list = lists.find((item) => item.id === listId && item.recordType === "person");
	const data = useMemo(
		() =>
			list ? people.data?.filter((person) => list.recordIds.includes(person.id)) : people.data,
		[people.data, list],
	);

	return (
		<PageBody className="max-w-none xl:px-10">
			<PageHeader
				icon={<RecordGlyph type="person" size="md" />}
				title={list ? list.name : "People"}
				description={
					people.data
						? `${pluralize(data?.length ?? 0, "person", "people")}${list ? " in this list" : ""}`
						: "Loading…"
				}
			/>
			<DataTable
				key={listId ?? "all"}
				data={data}
				isLoading={people.isPending}
				columns={columns}
				getRowId={(row) => row.id}
				exportName={list ? `people-${list.name.toLowerCase().replace(/\s+/g, "-")}` : "people"}
				views={VIEWS}
				defaultSorting={[{ id: "name", desc: false }]}
				initialColumnVisibility={{ created: false, phone: false }}
				searchPlaceholder="Search people"
				onRowClick={(row) => navigate({ to: "/people/$id", params: { id: row.id } })}
				chips={
					list ? (
						<Link
							to="/people"
							className="inline-flex h-7 items-center gap-1.5 rounded-full bg-primary/10 px-3 font-medium text-primary text-xs outline-none hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring"
						>
							List: {list.name} <X className="size-3" aria-label="Show all people" />
						</Link>
					) : null
				}
				actions={
					<Button size="sm" onClick={() => openCreate("person")}>
						<Plus /> New person
					</Button>
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
									.filter((item) => item.recordType === "person")
									.map((item) => ({ id: item.id, name: item.name, tone: item.color }))}
								onAdd={(id) =>
									addToList.mutate({
										listId: id,
										refs: ids.map((rowId) => ({ type: "person", id: rowId })),
									})
								}
								onNewList={() => openCreate("list")}
							/>
							<EmailSelected
								onEmail={() => openComposer(rows.map((row) => row.email).slice(0, 10))}
							/>
							<DeleteSelected
								count={rows.length}
								noun={["person", "people"]}
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
								<User />
							</EmptyMedia>
							<EmptyTitle>{list ? "This list is empty" : "No people yet"}</EmptyTitle>
							<EmptyDescription>
								{list
									? "Select people in the table and choose Add to list."
									: "Add the first person you work with."}
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent className="flex-row justify-center">
							<Button onClick={() => openCreate("person")}>
								<Plus /> New person
							</Button>
						</EmptyContent>
					</Empty>
				}
			/>
		</PageBody>
	);
}
