import { Button } from "@repo/ui/components/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { useQuery } from "@tanstack/react-query";
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { Pill } from "@/components/kit/pill";
import { InviteDialog } from "@/features/settings/components/invite-dialog";
import { SettingsSection } from "@/features/settings/components/settings-layout";
import { ROLE_OPTIONS } from "@/features/settings/constants/roles";
import { useRemoveMember, useUpdateMember } from "@/features/workspace/api/mutations";
import { membersQuery } from "@/features/workspace/api/queries";
import type { Member, MemberRole } from "@/features/workspace/schemas/workspace";
import { formatDate } from "@/lib/format";
import { SESSION_MEMBER_ID } from "@/lib/session";

export function MembersPage() {
	const { data, isPending } = useQuery(membersQuery);
	const update = useUpdateMember();
	const remove = useRemoveMember();
	const [inviteOpen, setInviteOpen] = useState(false);
	const [removing, setRemoving] = useState<Member | null>(null);

	return (
		<SettingsSection
			title="Members"
			description="Who can see and edit records in this workspace."
			actions={
				<Button onClick={() => setInviteOpen(true)}>
					<UserPlus /> Invite
				</Button>
			}
		>
			<div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
				<ul className="divide-y">
					{isPending
						? [0, 1, 2, 3].map((index) => (
								<li key={index} className="flex items-center gap-3 px-4 py-3.5">
									<Skeleton className="size-8 rounded-full" />
									<Skeleton className="h-4 w-48 rounded" />
								</li>
							))
						: (data ?? []).map((member) => {
								const isMe = member.id === SESSION_MEMBER_ID;
								return (
									<li
										key={member.id}
										className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3.5 sm:flex-nowrap"
									>
										<InitialsAvatar name={member.name} size="md" />
										<div className="min-w-0 flex-1">
											<p className="truncate font-medium text-sm">
												{member.name}
												{isMe ? <span className="text-muted-foreground"> (you)</span> : null}
											</p>
											<p className="truncate text-muted-foreground text-sm">{member.email}</p>
										</div>
										<span className="hidden text-muted-foreground text-xs lg:inline">
											Joined {formatDate(member.joinedAt)}
										</span>
										{member.status === "invited" ? (
											<Pill tone="orange" dot>
												Invited
											</Pill>
										) : (
											<Pill tone="green" dot>
												Active
											</Pill>
										)}
										<Select
											value={member.role}
											disabled={isMe}
											onValueChange={(role) =>
												update.mutate(
													{ id: member.id, role: role as MemberRole },
													{ onSuccess: () => toast.success(`${member.name} is now ${role}`) },
												)
											}
										>
											<SelectTrigger
												size="sm"
												className="w-28"
												aria-label={`Role for ${member.name}`}
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{ROLE_OPTIONS.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Button
											variant="ghost"
											size="icon-sm"
											disabled={isMe}
											aria-label={`Remove ${member.name}`}
											onClick={() => setRemoving(member)}
										>
											<Trash2 />
										</Button>
									</li>
								);
							})}
				</ul>
			</div>
			<InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
			<ConfirmDialog
				open={removing !== null}
				onOpenChange={(open) => {
					if (!open) setRemoving(null);
				}}
				title={`Remove ${removing?.name ?? "member"}?`}
				description="They lose access right away. Records they own stay in the workspace."
				confirmLabel="Remove"
				onConfirm={() => {
					if (removing) remove.mutate(removing.id);
					setRemoving(null);
				}}
			/>
		</SettingsSection>
	);
}
