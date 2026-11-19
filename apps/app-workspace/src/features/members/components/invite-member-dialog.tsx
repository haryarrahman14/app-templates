import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/components/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Spinner } from "@repo/ui/components/spinner";
import { useForm } from "react-hook-form";
import { useInviteMember } from "@/features/members/api/mutations";
import {
	type InviteMemberInput,
	inviteMemberSchema,
	ROLE_LABELS,
} from "@/features/members/schemas/member";

export function InviteMemberDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const invite = useInviteMember();
	const form = useForm<InviteMemberInput>({
		resolver: zodResolver(inviteMemberSchema),
		defaultValues: { email: "", role: "editor" },
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) form.reset();
			}}
		>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Invite a member</DialogTitle>
					<DialogDescription>
						They'll get an email with a link to join this workspace.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						onSubmit={form.handleSubmit((values) =>
							invite.mutate(values, {
								onSuccess: () => {
									form.reset();
									onOpenChange(false);
								},
							}),
						)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="name@company.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{(["admin", "editor", "viewer"] as const).map((role) => (
												<SelectItem key={role} value={role}>
													{ROLE_LABELS[role]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={invite.isPending}>
								{invite.isPending ? <Spinner /> : null} Send invite
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
