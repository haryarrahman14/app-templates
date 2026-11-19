import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Globe, Link2, ListPlus, Mail, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { EditableSelectCell, EditableTextCell } from "@/components/kit/data-table/editable-cell";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { NotFoundState } from "@/components/kit/not-found-state";
import { Pill } from "@/components/kit/pill";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { useDeleteCompanies, useUpdateCompany } from "@/features/companies/api/mutations";
import { companiesQuery } from "@/features/companies/api/queries";
import { STATUS_OPTIONS, STATUS_TONE } from "@/features/companies/constants/status";
import {
	COMPANY_SIZES,
	type CompanyStatus,
	INDUSTRIES,
	STATUS_LABEL,
} from "@/features/companies/schemas/company";
import { dealsQuery } from "@/features/deals/api/queries";
import { peopleQuery } from "@/features/people/api/queries";
import { fullName } from "@/features/people/schemas/person";
import {
	EditableTitle,
	FavouriteButton,
	PanelSection,
	PropertyRow,
	RecordShell,
} from "@/features/records/components/record-parts";
import { RecordTabs } from "@/features/records/components/record-tabs";
import { useAddToList } from "@/features/workspace/api/mutations";
import { listsQuery, membersQuery } from "@/features/workspace/api/queries";
import { formatAgo, formatDate, formatMoney } from "@/lib/format";
import type { RecordRef } from "@/lib/records";
import { openComposer, openCreate } from "@/lib/ui-state";

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

export function CompanyDetailPage({ id }: { id: string }) {
	const navigate = useNavigate();
	const companies = useQuery(companiesQuery);
	const people = useQuery(peopleQuery).data ?? [];
	const deals = useQuery(dealsQuery).data ?? [];
	const members = useQuery(membersQuery).data ?? [];
	const lists = useQuery(listsQuery).data ?? [];
	const update = useUpdateCompany();
	const remove = useDeleteCompanies();
	const addToList = useAddToList();
	const [confirmDelete, setConfirmDelete] = useState(false);

	const company = companies.data?.find((item) => item.id === id);
	const contacts = useMemo(() => people.filter((person) => person.companyId === id), [people, id]);
	const companyDeals = useMemo(() => deals.filter((deal) => deal.companyId === id), [deals, id]);
	const refs = useMemo<RecordRef[]>(
		() => [
			{ type: "company", id },
			...contacts.map((person) => ({ type: "person" as const, id: person.id })),
			...companyDeals.map((deal) => ({ type: "deal" as const, id: deal.id })),
		],
		[id, contacts, companyDeals],
	);

	if (companies.isPending) {
		return (
			<div className="mx-auto grid max-w-4xl gap-4 px-4 py-8 md:px-8">
				<Skeleton className="h-16 w-80 rounded-2xl" />
				<Skeleton className="h-64 rounded-2xl" />
			</div>
		);
	}
	if (!company) {
		return (
			<NotFoundState
				title="Company not found"
				description="It may have been deleted, or the link is wrong."
				backHref="/companies"
				backLabel="Back to companies"
			/>
		);
	}

	const save = (patch: Parameters<typeof update.mutate>[0]) =>
		update.mutate(patch, { onSuccess: () => toast.success("Saved") });
	const owner = members.find((member) => member.id === company.ownerId);
	const openDeals = companyDeals.filter((deal) => deal.stage !== "won" && deal.stage !== "lost");
	const companyLists = lists.filter((list) => list.recordType === "company");

	const panel = (
		<div className="grid gap-6">
			<PanelSection title="About">
				<div className="grid">
					<PropertyRow label="Status">
						<EditableSelectCell
							label="status"
							value={company.status}
							options={STATUS_OPTIONS}
							onSave={(status) => save({ id, status: status as CompanyStatus })}
						>
							<Pill tone={STATUS_TONE[company.status]} dot>
								{STATUS_LABEL[company.status]}
							</Pill>
						</EditableSelectCell>
					</PropertyRow>
					<PropertyRow label="Owner">
						<EditableSelectCell
							label="owner"
							value={company.ownerId}
							options={members.map((member) => ({ value: member.id, label: member.name }))}
							onSave={(ownerId) => save({ id, ownerId })}
						>
							<span className="flex items-center gap-2">
								<InitialsAvatar name={owner?.name ?? "?"} size="xs" />
								{owner?.name ?? "Unassigned"}
							</span>
						</EditableSelectCell>
					</PropertyRow>
					<PropertyRow label="Website">
						<EditableTextCell
							label="website"
							value={company.domain}
							placeholder="Add website"
							onSave={(domain) => save({ id, domain })}
						/>
					</PropertyRow>
					<PropertyRow label="Industry">
						<EditableSelectCell
							label="industry"
							value={company.industry}
							options={toOptions(INDUSTRIES)}
							onSave={(industry) => save({ id, industry: industry as typeof company.industry })}
						>
							{company.industry}
						</EditableSelectCell>
					</PropertyRow>
					<PropertyRow label="Employees">
						<EditableSelectCell
							label="employees"
							value={company.size}
							options={toOptions(COMPANY_SIZES)}
							onSave={(size) => save({ id, size: size as typeof company.size })}
						>
							{company.size}
						</EditableSelectCell>
					</PropertyRow>
					<PropertyRow label="City">
						<EditableTextCell
							label="city"
							value={company.city}
							placeholder="Add city"
							onSave={(city) => save({ id, city })}
						/>
					</PropertyRow>
					<PropertyRow label="ARR">
						<span className="tabular-nums">{company.arr ? formatMoney(company.arr) : "—"}</span>
					</PropertyRow>
					<PropertyRow label="Last contact">
						<span className="text-muted-foreground">{formatAgo(company.lastContactedAt)}</span>
					</PropertyRow>
					<PropertyRow label="Created">
						<span className="text-muted-foreground">{formatDate(company.createdAt)}</span>
					</PropertyRow>
				</div>
			</PanelSection>
			<PanelSection
				title={`People · ${contacts.length}`}
				action={
					<Button
						variant="ghost"
						size="icon-xs"
						aria-label="Add person to this company"
						onClick={() => openCreate("person", { companyId: id })}
					>
						<Plus />
					</Button>
				}
			>
				<ul className="grid gap-0.5">
					{contacts.map((person) => (
						<li key={person.id}>
							<Link
								to="/people/$id"
								params={{ id: person.id }}
								className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
							>
								<InitialsAvatar name={fullName(person)} size="sm" />
								<span className="min-w-0 flex-1">
									<span className="block truncate font-medium">{fullName(person)}</span>
									<span className="block truncate text-muted-foreground text-xs">
										{person.title}
									</span>
								</span>
							</Link>
						</li>
					))}
					{contacts.length === 0 ? (
						<li className="text-muted-foreground text-sm">No people yet.</li>
					) : null}
				</ul>
			</PanelSection>
			<PanelSection title="Lists">
				<div className="flex flex-wrap gap-1.5">
					{companyLists
						.filter((list) => list.recordIds.includes(id))
						.map((list) => (
							<Link key={list.id} to="/companies" search={{ list: list.id }}>
								<Pill tone={list.color} dot>
									{list.name}
								</Pill>
							</Link>
						))}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="xs" className="rounded-full">
								<ListPlus /> Add
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="rounded-xl">
							{companyLists.map((list) => (
								<DropdownMenuItem
									key={list.id}
									disabled={list.recordIds.includes(id)}
									onSelect={() =>
										addToList.mutate({ listId: list.id, refs: [{ type: "company", id }] })
									}
								>
									{list.name}
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={() => openCreate("list")}>
								<Plus /> New list…
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</PanelSection>
		</div>
	);

	const header = (
		<div className="flex flex-wrap items-start gap-4">
			<InitialsAvatar
				name={company.name}
				square
				size="xl"
				className="shadow-soft max-sm:size-12 max-sm:text-base"
			/>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<RecordGlyph type="company" size="xs" /> Company
				</div>
				<EditableTitle label="company" value={company.name} onSave={(name) => save({ id, name })} />
				<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
					{company.domain ? (
						<span className="flex items-center gap-1">
							<Globe className="size-3.5" /> {company.domain}
						</span>
					) : null}
					<span>{company.industry}</span>
					<span>{company.city}</span>
				</div>
			</div>
			<div className="flex items-center gap-1 max-sm:w-full">
				<FavouriteButton record={{ type: "company", id }} label={company.name} />
				<Button
					variant="outline"
					size="sm"
					onClick={() => openComposer(contacts.slice(0, 3).map((p) => p.email))}
				>
					<Mail /> Email
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" aria-label="More actions">
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48 rounded-xl">
						<DropdownMenuItem
							onSelect={() => {
								navigator.clipboard?.writeText(window.location.href);
								toast.success("Link copied");
							}}
						>
							<Link2 /> Copy link
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => openCreate("deal", { companyId: id })}>
							<Plus /> New deal
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete(true)}>
							<Trash2 /> Delete company
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<ConfirmDialog
				open={confirmDelete}
				onOpenChange={setConfirmDelete}
				title={`Delete ${company.name}?`}
				description="The company is removed for everyone. People and deals stay."
				onConfirm={() => {
					remove.mutate([id]);
					navigate({ to: "/companies" });
				}}
			/>
		</div>
	);

	const overview = (
		<div className="grid grid-cols-3 gap-2 sm:gap-4">
			{[
				{
					label: "Open pipeline",
					value: formatMoney(openDeals.reduce((sum, deal) => sum + deal.value, 0)),
				},
				{ label: "Open deals", value: String(openDeals.length) },
				{ label: "People", value: String(contacts.length) },
			].map((stat) => (
				<div key={stat.label} className="rounded-2xl border bg-card p-4 shadow-soft">
					<p className="text-muted-foreground text-xs">{stat.label}</p>
					<p className="mt-1 font-semibold text-xl tabular-nums tracking-tight">{stat.value}</p>
				</div>
			))}
			{company.description ? (
				<p className="col-span-3 text-muted-foreground text-sm">{company.description}</p>
			) : null}
		</div>
	);

	return (
		<RecordShell header={header} panel={panel}>
			<RecordTabs
				primary={{ type: "company", id }}
				refs={refs}
				deals={companyDeals}
				emails={contacts.slice(0, 3).map((person) => person.email)}
				overview={overview}
				newDealDefaults={{ companyId: id }}
			/>
		</RecordShell>
	);
}
