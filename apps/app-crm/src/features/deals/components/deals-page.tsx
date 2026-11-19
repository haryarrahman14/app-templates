import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Handshake, KanbanSquare, Plus, Rows3 } from "lucide-react";
import { useMemo } from "react";
import { AssignMenu, DeleteSelected } from "@/components/kit/bulk-actions";
import { DataTable, type DataTableView } from "@/components/kit/data-table/data-table";
import { PageBody, PageHeader } from "@/components/kit/page-header";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { activitiesQuery } from "@/features/activities/api/queries";
import { companiesQuery } from "@/features/companies/api/queries";
import { useDeleteDeal, useUpdateDeal } from "@/features/deals/api/mutations";
import { dealsQuery } from "@/features/deals/api/queries";
import { DealBoard } from "@/features/deals/components/deal-board";
import { DealSheet } from "@/features/deals/components/deal-sheet";
import { useDealColumns } from "@/features/deals/hooks/use-deal-columns";
import type { Deal } from "@/features/deals/schemas/deal";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { membersQuery } from "@/features/workspace/api/queries";
import { formatMoney } from "@/lib/format";
import { SESSION_MEMBER_ID } from "@/lib/session";
import { openCreate } from "@/lib/ui-state";

const VIEWS: DataTableView<Deal>[] = [
	{ id: "open", label: "Open", filter: (deal) => deal.stage !== "won" && deal.stage !== "lost" },
	{ id: "mine", label: "My deals", filter: (deal) => deal.ownerId === SESSION_MEMBER_ID },
	{ id: "all", label: "All" },
];

export function DealsPage({ view, openId }: { view: "board" | "table"; openId?: string }) {
	const navigate = useNavigate({ from: "/deals" });

	const deals = useQuery(dealsQuery);
	const companies = useQuery(companiesQuery).data ?? [];
	const members = useQuery(membersQuery).data ?? [];
	const activities = useQuery(activitiesQuery).data ?? [];
	const columns = useDealColumns(members, companies);
	const onboarding = useOnboarding();
	const update = useUpdateDeal();
	const remove = useDeleteDeal();

	const companyName = useMemo(() => {
		const map = new Map(companies.map((company) => [company.id, company.name]));
		return (id: string) => map.get(id) ?? "Unknown company";
	}, [companies]);
	const ownerName = useMemo(() => {
		const map = new Map(members.map((member) => [member.id, member.name]));
		return (id: string) => map.get(id) ?? "Unassigned";
	}, [members]);

	const setParam = (key: "view" | "deal", value: string | null) =>
		navigate({
			search: (prev) => ({ ...prev, [key]: value ?? undefined }),
			replace: true,
			resetScroll: false,
		});

	const all = deals.data ?? [];
	const open = all.filter((deal) => deal.stage !== "won" && deal.stage !== "lost");
	const pipeline = open.reduce((sum, deal) => sum + deal.value, 0);
	const openDeal = all.find((deal) => deal.id === openId);
	const dealActivities = openDeal
		? activities.filter(
				(activity) =>
					(activity.record.type === "deal" && activity.record.id === openDeal.id) ||
					(activity.record.type === "company" &&
						activity.record.id === openDeal.companyId &&
						activity.type === "deal"),
			)
		: [];

	return (
		<PageBody className="max-w-none xl:px-10">
			<PageHeader
				icon={<RecordGlyph type="deal" size="md" />}
				title="Deals"
				description={
					deals.data ? `${open.length} open · ${formatMoney(pipeline)} in pipeline` : "Loading…"
				}
				actions={
					<>
						<div role="tablist" aria-label="Layout" className="flex rounded-lg bg-muted p-0.5">
							{(
								[
									["board", "Board", KanbanSquare],
									["table", "Table", Rows3],
								] as const
							).map(([key, label, Icon]) => (
								<button
									key={key}
									type="button"
									role="tab"
									aria-selected={view === key}
									onClick={() => setParam("view", key === "board" ? null : key)}
									className="flex h-7 items-center gap-1.5 rounded-md px-3 font-medium text-muted-foreground text-sm outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-soft"
								>
									<Icon className="size-4" /> {label}
								</button>
							))}
						</div>
						<Button size="sm" onClick={() => openCreate("deal")}>
							<Plus /> New deal
						</Button>
					</>
				}
			/>

			{view === "board" ? (
				deals.isPending ? (
					<div className="flex gap-3 overflow-hidden">
						{[0, 1, 2, 3].map((index) => (
							<div key={index} className="h-96 w-72 shrink-0 animate-pulse rounded-2xl bg-muted" />
						))}
					</div>
				) : (
					<DealBoard
						deals={all}
						companyName={companyName}
						ownerName={ownerName}
						onOpen={(id) => setParam("deal", id)}
						onMoved={() => onboarding.complete("deal")}
					/>
				)
			) : (
				<DataTable
					data={deals.data}
					isLoading={deals.isPending}
					columns={columns}
					getRowId={(row) => row.id}
					exportName="deals"
					views={VIEWS}
					defaultSorting={[{ id: "closeDate", desc: false }]}
					searchPlaceholder="Search deals"
					onRowClick={(row) => setParam("deal", row.id)}
					bulkActions={(rows, clear) => (
						<>
							<AssignMenu
								members={members}
								onAssign={(ownerId) => {
									for (const row of rows) update.mutate({ id: row.id, ownerId });
								}}
							/>
							<DeleteSelected
								count={rows.length}
								noun={["deal", "deals"]}
								onConfirm={() => {
									for (const row of rows) remove.mutate(row.id);
									clear();
								}}
							/>
						</>
					)}
					empty={
						<div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
							<Handshake className="size-6 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">No deals yet.</p>
							<Button size="sm" onClick={() => openCreate("deal")}>
								<Plus /> New deal
							</Button>
						</div>
					}
				/>
			)}

			<DealSheet
				deal={openDeal}
				activities={dealActivities}
				onOpenChange={(next) => {
					if (!next) setParam("deal", null);
				}}
			/>
		</PageBody>
	);
}
