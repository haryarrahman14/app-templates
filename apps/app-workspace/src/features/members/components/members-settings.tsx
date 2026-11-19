import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import { UserMinusIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { UserAvatar } from "@/components/kit/user-avatar";
import { useRemoveMember, useUpdateMemberRole } from "@/features/members/api/mutations";
import { membersQuery } from "@/features/members/api/queries";
import { InviteMemberDialog } from "@/features/members/components/invite-member-dialog";
import { type Member, type MemberRole, ROLE_LABELS } from "@/features/members/schemas/member";
import { formatRelative } from "@/lib/format";
import { SAMPLE_USER_ID } from "@/lib/session";
import { useSessionUser } from "@/lib/session-context";

export function MembersSettings() {
	const user = useSessionUser();
	const members = useQuery(membersQuery);
	const updateRole = useUpdateMemberRole();
	const remove = useRemoveMember();
	const [inviteOpen, setInviteOpen] = useState(false);
	const [removing, setRemoving] = useState<Member | null>(null);

	const rows = (members.data ?? []).map((m) =>
		m.id === SAMPLE_USER_ID ? { ...m, name: user.name, email: user.email } : m,
	);

	return (
		<section className="overflow-hidden rounded-2xl border bg-card shadow-soft">
			<header className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
				<div className="space-y-1">
					<h2 className="font-semibold text-lg tracking-tight">Members</h2>
					<p className="text-muted-foreground text-sm">
						{members.data
							? `${members.data.length} people in this workspace.`
							: "People in this workspace."}
					</p>
				</div>
				<Button onClick={() => setInviteOpen(true)}>
					<UserPlusIcon /> Invite
				</Button>
			</header>
			<div className="overflow-x-auto border-t">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="pl-5 sm:pl-6">Name</TableHead>
							<TableHead className="hidden md:table-cell">Last active</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="pr-5 sm:pr-6">
								<span className="sr-only">Remove</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{members.isPending
							? ["a", "b", "c"].map((key) => (
									<TableRow key={key}>
										<TableCell colSpan={4} className="px-5 sm:px-6">
											<Skeleton className="h-9" />
										</TableCell>
									</TableRow>
								))
							: rows.map((member) => {
									const isMe = member.id === SAMPLE_USER_ID;
									return (
										<TableRow key={member.id}>
											<TableCell className="pl-5 sm:pl-6">
												<div className="flex items-center gap-3">
													<UserAvatar name={member.name} />
													<div className="min-w-0">
														<p className="flex items-center gap-2 truncate font-medium">
															{member.name}
															{isMe ? <Badge variant="secondary">You</Badge> : null}
															{member.status === "invited" ? (
																<Badge variant="outline">Invited</Badge>
															) : null}
														</p>
														<p className="truncate text-muted-foreground text-xs">{member.email}</p>
													</div>
												</div>
											</TableCell>
											<TableCell className="hidden text-muted-foreground md:table-cell">
												{member.lastActiveAt ? formatRelative(member.lastActiveAt) : "—"}
											</TableCell>
											<TableCell>
												{member.role === "owner" ? (
													<span className="px-2.5 text-sm">{ROLE_LABELS.owner}</span>
												) : (
													<Select
														value={member.role}
														onValueChange={(role) =>
															updateRole.mutate({ id: member.id, role: role as MemberRole })
														}
													>
														<SelectTrigger
															size="sm"
															aria-label={`Role for ${member.name}`}
															className="w-28"
														>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{(["admin", "editor", "viewer"] as const).map((role) => (
																<SelectItem key={role} value={role}>
																	{ROLE_LABELS[role]}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												)}
											</TableCell>
											<TableCell className="pr-5 text-right sm:pr-6">
												{isMe || member.role === "owner" ? null : (
													<Button
														variant="ghost"
														size="icon-sm"
														aria-label={`Remove ${member.name}`}
														className="text-muted-foreground hover:text-destructive"
														onClick={() => setRemoving(member)}
													>
														<UserMinusIcon />
													</Button>
												)}
											</TableCell>
										</TableRow>
									);
								})}
					</TableBody>
				</Table>
			</div>
			<InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
			<ConfirmDialog
				open={removing !== null}
				onOpenChange={(open) => !open && setRemoving(null)}
				destructive
				title={`Remove ${removing?.name ?? "member"}?`}
				description="They lose access to this workspace right away. Their documents stay."
				confirmLabel="Remove"
				onConfirm={() => {
					if (removing) remove.mutate(removing);
					setRemoving(null);
				}}
			/>
		</section>
	);
}
