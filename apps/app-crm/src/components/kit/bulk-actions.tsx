import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { cn } from "@repo/ui/lib/cn";
import { ListPlus, Mail, Plus, Trash2, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { DOT_TONES, type PillTone } from "@/components/kit/pill";

/** Building blocks for a table's floating bulk bar. */

export function AssignMenu({
	members,
	onAssign,
}: {
	members: { id: string; name: string }[];
	onAssign: (memberId: string) => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<UserRoundCheck /> Assign
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top" className="w-52 rounded-xl">
				<DropdownMenuLabel className="text-muted-foreground text-xs">
					Assign owner
				</DropdownMenuLabel>
				{members.map((member) => (
					<DropdownMenuItem key={member.id} onSelect={() => onAssign(member.id)}>
						<InitialsAvatar name={member.name} size="xs" /> {member.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function AddToListMenu({
	lists,
	onAdd,
	onNewList,
}: {
	lists: { id: string; name: string; tone: PillTone }[];
	onAdd: (listId: string) => void;
	onNewList: () => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<ListPlus /> Add to list
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top" className="w-52 rounded-xl">
				<DropdownMenuLabel className="text-muted-foreground text-xs">Lists</DropdownMenuLabel>
				{lists.map((list) => (
					<DropdownMenuItem key={list.id} onSelect={() => onAdd(list.id)}>
						<span className={cn("ml-1 size-2 rounded-full", DOT_TONES[list.tone])} /> {list.name}
					</DropdownMenuItem>
				))}
				{lists.length ? <DropdownMenuSeparator /> : null}
				<DropdownMenuItem onSelect={onNewList}>
					<Plus /> New list…
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function EmailSelected({ onEmail }: { onEmail: () => void }) {
	return (
		<Button variant="ghost" size="sm" onClick={onEmail}>
			<Mail /> Email
		</Button>
	);
}

export function DeleteSelected({
	count,
	noun,
	onConfirm,
}: {
	count: number;
	noun: [string, string];
	onConfirm: () => void;
}) {
	const [open, setOpen] = useState(false);
	const label = count === 1 ? noun[0] : noun[1];
	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				onClick={() => setOpen(true)}
			>
				<Trash2 /> Delete
			</Button>
			<ConfirmDialog
				open={open}
				onOpenChange={setOpen}
				title={`Delete ${count} ${label}?`}
				description="They are removed for everyone in the workspace. In this sample, a reload brings them back."
				onConfirm={onConfirm}
			/>
		</>
	);
}
