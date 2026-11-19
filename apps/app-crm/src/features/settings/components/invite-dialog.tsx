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
import { Form } from "@repo/ui/components/form";
import { Spinner } from "@repo/ui/components/spinner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectField, TextareaField } from "@/components/kit/form-fields";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { ROLE_OPTIONS } from "@/features/settings/constants/roles";
import { type Invite, inviteSchema } from "@/features/settings/schemas/settings";
import { useInviteMembers } from "@/features/workspace/api/mutations";

export function InviteDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const invite = useInviteMembers();
	const onboarding = useOnboarding();
	const form = useForm<Invite>({
		resolver: zodResolver(inviteSchema),
		defaultValues: { emails: "", role: "member" },
	});

	useEffect(() => {
		if (open) form.reset({ emails: "", role: "member" });
	}, [open, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Invite teammates</DialogTitle>
					<DialogDescription>
						They get an email with a link to join. (Sample: no email is sent.)
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="flex flex-col gap-4"
						onSubmit={form.handleSubmit((values) =>
							invite.mutate(
								{ emails: values.emails.split(/[\s,;]+/).filter(Boolean), role: values.role },
								{
									onSuccess: () => {
										onboarding.complete("invite");
										onOpenChange(false);
									},
								},
							),
						)}
					>
						<TextareaField
							control={form.control}
							name="emails"
							label="Email addresses"
							placeholder="sam@example.com, alex@example.com"
							rows={3}
							description="Separate several with commas or new lines."
						/>
						<SelectField
							control={form.control}
							name="role"
							label="Role"
							options={ROLE_OPTIONS.map((role) => ({
								value: role.value,
								label: `${role.label} · ${role.hint}`,
							}))}
						/>
						<DialogFooter>
							<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={invite.isPending}>
								{invite.isPending ? <Spinner /> : null}
								Send invites
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
