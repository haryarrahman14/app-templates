import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@repo/ui/components/sheet";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Building2, Mail, Trash2, User } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { ActivityFeed } from "@/components/kit/activity-feed";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { RecordGlyph } from "@/components/kit/record-glyph";
import type { Activity } from "@/features/activities/schemas/activity";
import { useDeleteDeal, useMoveDeal, useUpdateDeal } from "@/features/deals/api/mutations";
import {
	DEAL_STAGE_META,
	DEAL_STAGES,
	type Deal,
	type DealStage,
} from "@/features/deals/schemas/deal";
import { formatMoney } from "@/lib/format";
import { openComposer } from "@/lib/ui-state";
import { useLookups } from "@/lib/use-lookups";

/** Deal detail in a side sheet. Fields save on change (value and date on blur). */
export function DealSheet({
	deal,
	activities,
	onOpenChange,
}: {
	deal: Deal | undefined;
	activities: Activity[];
	onOpenChange: (open: boolean) => void;
}) {
	const id = useId();
	const lookups = useLookups();
	const update = useUpdateDeal();
	const move = useMoveDeal();
	const remove = useDeleteDeal();
	const [confirm, setConfirm] = useState(false);
	const [name, setName] = useState("");
	const [value, setValue] = useState("");
	const [closeDate, setCloseDate] = useState("");

	useEffect(() => {
		if (!deal) return;
		setName(deal.name);
		setValue(String(deal.value));
		setCloseDate(format(new Date(deal.closeDate), "yyyy-MM-dd"));
	}, [deal]);

	const save = (patch: Partial<Deal>) => {
		if (!deal) return;
		update.mutate({ id: deal.id, ...patch }, { onSuccess: () => toast.success("Deal saved") });
	};

	const company = deal ? lookups.company.get(deal.companyId) : undefined;
	const contact = deal?.contactId ? lookups.person.get(deal.contactId) : undefined;
	const weighted = deal ? (deal.value * DEAL_STAGE_META[deal.stage].probability) / 100 : 0;

	return (
		<Sheet open={Boolean(deal)} onOpenChange={onOpenChange}>
			<SheetContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
				{deal ? (
					<>
						<SheetHeader className="gap-2 border-b p-5">
							<div className="flex items-center gap-2 text-muted-foreground text-xs">
								<RecordGlyph type="deal" size="xs" /> Deal
							</div>
							<SheetTitle className="sr-only">{deal.name}</SheetTitle>
							<label htmlFor={`${id}-name`} className="sr-only">
								Deal name
							</label>
							<input
								id={`${id}-name`}
								value={name}
								onChange={(event) => setName(event.target.value)}
								onBlur={() => name.trim() && name !== deal.name && save({ name: name.trim() })}
								onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
								className="-mx-2 rounded-lg px-2 py-1 font-semibold text-xl tracking-tight outline-none transition hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
							/>
							<SheetDescription>
								{formatMoney(deal.value)} · weighted {formatMoney(weighted)} at{" "}
								{DEAL_STAGE_META[deal.stage].probability}%
							</SheetDescription>
						</SheetHeader>

						<div className="grid gap-5 p-5">
							<div className="grid gap-1.5">
								<span className="font-medium text-sm">Stage</span>
								<div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Stage">
									{DEAL_STAGES.map((stage) => (
										// biome-ignore lint/a11y/useSemanticElements: a styled chip radio; aria-checked carries the state.
										<button
											key={stage}
											type="button"
											role="radio"
											aria-checked={deal.stage === stage}
											onClick={() =>
												stage !== deal.stage && move.mutate({ id: deal.id, stage, rank: deal.rank })
											}
											className={cn(
												"inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
												deal.stage === stage &&
													"border-primary/40 bg-primary/10 font-medium text-primary",
											)}
										>
											<span
												className={cn(
													"size-1.5 rounded-full",
													DEAL_STAGE_META[stage as DealStage].dot,
												)}
											/>
											{DEAL_STAGE_META[stage as DealStage].label}
										</button>
									))}
								</div>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="grid gap-1.5">
									<Label htmlFor={`${id}-value`}>Value (USD)</Label>
									<Input
										id={`${id}-value`}
										type="number"
										min={0}
										inputMode="numeric"
										value={value}
										onChange={(event) => setValue(event.target.value)}
										onBlur={() => {
											const next = Number(value);
											if (Number.isFinite(next) && next >= 0 && next !== deal.value)
												save({ value: next });
											else setValue(String(deal.value));
										}}
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={`${id}-close`}>Close date</Label>
									<Input
										id={`${id}-close`}
										type="date"
										value={closeDate}
										onChange={(event) => setCloseDate(event.target.value)}
										onBlur={() =>
											closeDate &&
											save({ closeDate: new Date(`${closeDate}T12:00:00Z`).toISOString() })
										}
									/>
								</div>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor={`${id}-owner`}>Owner</Label>
								<Select value={deal.ownerId} onValueChange={(ownerId) => save({ ownerId })}>
									<SelectTrigger id={`${id}-owner`} className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{lookups.members.map((member) => (
											<SelectItem key={member.id} value={member.id}>
												{member.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="grid gap-2">
								<span className="font-medium text-sm">Related</span>
								{company ? (
									<Link
										to="/companies/$id"
										params={{ id: company.id }}
										className="flex items-center gap-3 rounded-xl border p-3 text-sm outline-none transition hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
									>
										<InitialsAvatar name={company.name} square size="md" />
										<span className="min-w-0 flex-1">
											<span className="block truncate font-medium">{company.name}</span>
											<span className="block text-muted-foreground text-xs">
												{company.industry}
											</span>
										</span>
										<Building2 className="size-4 text-muted-foreground" />
									</Link>
								) : null}
								{contact ? (
									<div className="flex items-center gap-3 rounded-xl border p-3 text-sm">
										<InitialsAvatar name={`${contact.firstName} ${contact.lastName}`} size="md" />
										<Link
											to="/people/$id"
											params={{ id: contact.id }}
											className="min-w-0 flex-1 outline-none hover:underline focus-visible:underline"
										>
											<span className="block truncate font-medium">
												{contact.firstName} {contact.lastName}
											</span>
											<span className="block text-muted-foreground text-xs">{contact.title}</span>
										</Link>
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={`Email ${contact.firstName}`}
											onClick={() => openComposer([contact.email], deal.name)}
										>
											<Mail />
										</Button>
									</div>
								) : (
									<p className="flex items-center gap-2 text-muted-foreground text-sm">
										<User className="size-4" /> No contact linked
									</p>
								)}
							</div>

							<div className="grid gap-2">
								<span className="font-medium text-sm">Activity</span>
								{activities.length ? (
									<ActivityFeed
										items={activities.slice(0, 5)}
										showRecord={false}
										recordLabel={(activity) => lookups.recordLabel(activity.record)}
										memberName={lookups.memberName}
									/>
								) : (
									<p className="text-muted-foreground text-sm">Nothing logged yet.</p>
								)}
							</div>
						</div>

						<SheetFooter className="mt-auto flex-row justify-between border-t p-4">
							<Button variant="destructive" size="sm" onClick={() => setConfirm(true)}>
								<Trash2 /> Delete
							</Button>
							<Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
								Done
							</Button>
						</SheetFooter>
						<ConfirmDialog
							open={confirm}
							onOpenChange={setConfirm}
							title={`Delete ${deal.name}?`}
							description="The deal is removed from the pipeline for everyone."
							onConfirm={() => {
								remove.mutate(deal.id);
								onOpenChange(false);
							}}
						/>
					</>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
