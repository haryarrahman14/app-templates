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
import { Building2, Link2, Mail, MoreHorizontal, Phone, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { EditableSelectCell, EditableTextCell } from "@/components/kit/data-table/editable-cell";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { NotFoundState } from "@/components/kit/not-found-state";
import { Pill } from "@/components/kit/pill";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { useDeletePeople, useUpdatePerson } from "@/features/people/api/mutations";
import { peopleQuery } from "@/features/people/api/queries";
import { STAGE_OPTIONS, STAGE_TONE } from "@/features/people/constants/stage";
import { fullName, type PersonStage, STAGE_LABEL } from "@/features/people/schemas/person";
import {
	EditableTitle,
	FavouriteButton,
	PanelSection,
	PropertyRow,
	RecordShell,
} from "@/features/records/components/record-parts";
import { RecordTabs } from "@/features/records/components/record-tabs";
import { membersQuery } from "@/features/workspace/api/queries";
import { formatAgo, formatDate } from "@/lib/format";
import type { RecordRef } from "@/lib/records";
import { openComposer } from "@/lib/ui-state";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NONE = "none";

export function PersonDetailPage({ id }: { id: string }) {
	const navigate = useNavigate();
	const people = useQuery(peopleQuery);
	const companies = useQuery(companiesQuery).data ?? [];
	const deals = useQuery(dealsQuery).data ?? [];
	const members = useQuery(membersQuery).data ?? [];
	const update = useUpdatePerson();
	const remove = useDeletePeople();
	const [confirmDelete, setConfirmDelete] = useState(false);

	const person = people.data?.find((item) => item.id === id);
	const personDeals = useMemo(() => deals.filter((deal) => deal.contactId === id), [deals, id]);
	const refs = useMemo<RecordRef[]>(
		() => [
			{ type: "person", id },
			...personDeals.map((deal) => ({ type: "deal" as const, id: deal.id })),
		],
		[id, personDeals],
	);

	if (people.isPending) {
		return (
			<div className="mx-auto grid max-w-4xl gap-4 px-4 py-8 md:px-8">
				<Skeleton className="h-16 w-80 rounded-2xl" />
				<Skeleton className="h-64 rounded-2xl" />
			</div>
		);
	}
	if (!person) {
		return (
			<NotFoundState
				title="Person not found"
				description="They may have been deleted, or the link is wrong."
				backHref="/people"
				backLabel="Back to people"
			/>
		);
	}

	const name = fullName(person);
	const company = companies.find((item) => item.id === person.companyId);
	const owner = members.find((member) => member.id === person.ownerId);
	const colleagues =
		people.data?.filter(
			(item) => item.companyId && item.companyId === person.companyId && item.id !== id,
		) ?? [];
	const save = (patch: Parameters<typeof update.mutate>[0]) =>
		update.mutate(patch, { onSuccess: () => toast.success("Saved") });

	const panel = (
		<div className="grid gap-6">
			<PanelSection title="About">
				<div className="grid">
					<PropertyRow label="Stage">
						<EditableSelectCell
							label="stage"
							value={person.stage}
							options={STAGE_OPTIONS}
							onSave={(stage) => save({ id, stage: stage as PersonStage })}
						>
							<Pill tone={STAGE_TONE[person.stage]} dot>
								{STAGE_LABEL[person.stage]}
							</Pill>
						</EditableSelectCell>
					</PropertyRow>
					<PropertyRow label="Email">
						<EditableTextCell
							label="email"
							inputType="email"
							value={person.email}
							validate={(value) => (EMAIL.test(value) ? null : "Enter a valid email")}
							onSave={(email) => save({ id, email })}
						/>
					</PropertyRow>
					<PropertyRow label="Phone">
						<EditableTextCell
							label="phone"
							value={person.phone}
							placeholder="Add phone"
							onSave={(phone) => save({ id, phone })}
						/>
					</PropertyRow>
					<PropertyRow label="Title">
						<EditableTextCell
							label="title"
							value={person.title}
							placeholder="Add title"
							onSave={(title) => save({ id, title })}
						/>
					</PropertyRow>
					<PropertyRow label="Company">
						<EditableSelectCell
							label="company"
							value={person.companyId ?? NONE}
							options={[
								{ value: NONE, label: "No company" },
								...companies.map((item) => ({ value: item.id, label: item.name })),
							]}
							onSave={(companyId) => save({ id, companyId: companyId === NONE ? null : companyId })}
						>
							{company ? (
								<span className="flex items-center gap-2">
									<InitialsAvatar name={company.name} square size="xs" />
									{company.name}
								</span>
							) : (
								<span className="text-muted-foreground">No company</span>
							)}
						</EditableSelectCell>
					</PropertyRow>
					<PropertyRow label="Owner">
						<EditableSelectCell
							label="owner"
							value={person.ownerId}
							options={members.map((member) => ({ value: member.id, label: member.name }))}
							onSave={(ownerId) => save({ id, ownerId })}
						>
							<span className="flex items-center gap-2">
								<InitialsAvatar name={owner?.name ?? "?"} size="xs" />
								{owner?.name ?? "Unassigned"}
							</span>
						</EditableSelectCell>
					</PropertyRow>
					<PropertyRow label="City">
						<EditableTextCell
							label="city"
							value={person.city}
							placeholder="Add city"
							onSave={(city) => save({ id, city })}
						/>
					</PropertyRow>
					<PropertyRow label="Last contact">
						<span className="text-muted-foreground">{formatAgo(person.lastContactedAt)}</span>
					</PropertyRow>
					<PropertyRow label="Created">
						<span className="text-muted-foreground">{formatDate(person.createdAt)}</span>
					</PropertyRow>
				</div>
			</PanelSection>
			{company ? (
				<PanelSection title="Company">
					<Link
						to="/companies/$id"
						params={{ id: company.id }}
						className="flex items-center gap-3 rounded-xl border bg-card p-3 outline-none transition hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
					>
						<InitialsAvatar name={company.name} square size="md" />
						<span className="min-w-0">
							<span className="block truncate font-medium text-sm">{company.name}</span>
							<span className="block truncate text-muted-foreground text-xs">
								{company.industry} · {company.city}
							</span>
						</span>
					</Link>
				</PanelSection>
			) : null}
			{colleagues.length ? (
				<PanelSection title={`Colleagues · ${colleagues.length}`}>
					<ul className="grid gap-0.5">
						{colleagues.map((item) => (
							<li key={item.id}>
								<Link
									to="/people/$id"
									params={{ id: item.id }}
									className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
								>
									<InitialsAvatar name={fullName(item)} size="sm" />
									<span className="truncate">{fullName(item)}</span>
								</Link>
							</li>
						))}
					</ul>
				</PanelSection>
			) : null}
		</div>
	);

	const header = (
		<div className="flex flex-wrap items-start gap-4">
			<InitialsAvatar
				name={name}
				size="xl"
				className="shadow-soft max-sm:size-12 max-sm:text-base"
			/>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<RecordGlyph type="person" size="xs" /> Person
				</div>
				<EditableTitle
					label="person"
					value={name}
					onSave={(next) => {
						const [firstName = "", ...rest] = next.split(" ");
						save({ id, firstName, lastName: rest.join(" ") });
					}}
				/>
				<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-sm">
					<span>{person.title}</span>
					{company ? (
						<span className="flex items-center gap-1">
							<Building2 className="size-3.5" /> {company.name}
						</span>
					) : null}
				</div>
			</div>
			<div className="flex items-center gap-1 max-sm:w-full">
				<FavouriteButton record={{ type: "person", id }} label={name} />
				{person.phone ? (
					<Button variant="ghost" size="icon" aria-label={`Call ${person.phone}`} asChild>
						<a href={`tel:${person.phone.replace(/\s/g, "")}`}>
							<Phone />
						</a>
					</Button>
				) : null}
				<Button variant="outline" size="sm" onClick={() => openComposer([person.email])}>
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
								navigator.clipboard?.writeText(person.email);
								toast.success("Email copied");
							}}
						>
							<Link2 /> Copy email
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete(true)}>
							<Trash2 /> Delete person
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<ConfirmDialog
				open={confirmDelete}
				onOpenChange={setConfirmDelete}
				title={`Delete ${name}?`}
				description="They are removed for everyone in the workspace."
				onConfirm={() => {
					remove.mutate([id]);
					navigate({ to: "/people" });
				}}
			/>
		</div>
	);

	return (
		<RecordShell header={header} panel={panel}>
			<RecordTabs
				primary={{ type: "person", id }}
				refs={refs}
				deals={personDeals}
				emails={[person.email]}
				overview={null}
				newDealDefaults={person.companyId ? { companyId: person.companyId } : {}}
			/>
		</RecordShell>
	);
}
