import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { Label } from "@repo/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Switch } from "@repo/ui/components/switch";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, GlobeIcon, LinkIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserAvatar } from "@/components/kit/user-avatar";
import { useInvite, useUpdateShare } from "@/features/sharing/api/mutations";
import { sharesQuery } from "@/features/sharing/api/queries";
import {
	type InviteInput,
	inviteSchema,
	SHARE_ROLE_LABELS,
	type ShareRole,
	shareRoleSchema,
} from "@/features/sharing/schemas/share";

const REMOVE = "__remove";

/** Invite people to a document (or the whole workspace when no document is given). */
export function ShareDialog({
	open,
	onOpenChange,
	doc,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	doc?: { id: string; title: string };
}) {
	const targetId = doc?.id ?? "workspace";
	const shares = useQuery({ ...sharesQuery(targetId), enabled: open });
	const invite = useInvite(targetId);
	const updateShare = useUpdateShare(targetId);
	const [linkOn, setLinkOn] = useState(false);
	const [copied, setCopied] = useState(false);
	const form = useForm<InviteInput>({
		resolver: zodResolver(inviteSchema),
		defaultValues: { email: "", role: "edit" },
	});

	const link =
		typeof window === "undefined"
			? ""
			: `${window.location.origin}${doc ? `/docs/${doc.id}` : "/"}`;

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(link);
			setCopied(true);
			toast.success("Link copied");
			setTimeout(() => setCopied(false), 1600);
		} catch {
			toast.error("Copy is blocked in this browser. Select the link and copy it instead.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{doc ? `Share “${doc.title}”` : "Invite to workspace"}</DialogTitle>
					<DialogDescription>
						{doc
							? "Invite people by email and choose what they can do."
							: "Teammates get access to shared folders and documents."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						noValidate
						onSubmit={form.handleSubmit((values) =>
							invite.mutate(values, {
								onSuccess: () => form.reset({ email: "", role: values.role }),
							}),
						)}
						className="flex items-start gap-2"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel className="sr-only">Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="name@company.com"
											autoComplete="off"
											{...field}
										/>
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
									<FormLabel className="sr-only">Role</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className="w-36">
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{shareRoleSchema.options.map((role) => (
												<SelectItem key={role} value={role}>
													{SHARE_ROLE_LABELS[role]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
						<Button type="submit" disabled={invite.isPending}>
							{invite.isPending ? <Spinner /> : null} Invite
						</Button>
					</form>
				</Form>

				<div className="space-y-2">
					<p className="font-medium text-muted-foreground text-xs">People with access</p>
					{shares.isPending ? (
						<div className="space-y-2">
							<Skeleton className="h-9" />
							<Skeleton className="h-9" />
						</div>
					) : shares.data?.length ? (
						<ul className="max-h-52 space-y-1 overflow-y-auto">
							{shares.data.map((share) => (
								<li key={share.id} className="flex items-center gap-3 py-1">
									<UserAvatar name={share.email} size="sm" />
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm">{share.email}</p>
										{share.pending ? (
											<p className="text-muted-foreground text-xs">Invite pending</p>
										) : null}
									</div>
									<Select
										value={share.role}
										onValueChange={(value) =>
											updateShare.mutate({
												id: share.id,
												role: value === REMOVE ? null : (value as ShareRole),
											})
										}
									>
										<SelectTrigger
											size="sm"
											aria-label={`Access for ${share.email}`}
											className="w-34 border-none shadow-none"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent align="end">
											{shareRoleSchema.options.map((role) => (
												<SelectItem key={role} value={role}>
													{SHARE_ROLE_LABELS[role]}
												</SelectItem>
											))}
											<SelectSeparator />
											<SelectItem value={REMOVE} className="text-destructive">
												Remove access
											</SelectItem>
										</SelectContent>
									</Select>
								</li>
							))}
						</ul>
					) : (
						<p className="text-muted-foreground text-sm">Only you, for now.</p>
					)}
				</div>

				<Separator />

				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<span className="flex size-8 items-center justify-center rounded-full bg-muted">
							<GlobeIcon className="size-4" />
						</span>
						<div className="min-w-0 flex-1">
							<Label htmlFor="link-access">Anyone with the link can view</Label>
							<p className="text-muted-foreground text-xs">
								{linkOn ? "Link sharing is on" : "Only invited people"}
							</p>
						</div>
						<Switch
							id="link-access"
							checked={linkOn}
							onCheckedChange={(on) => {
								setLinkOn(on);
								toast.success(on ? "Link sharing on" : "Link sharing off");
							}}
						/>
					</div>
					<div className="flex gap-2">
						<Input
							readOnly
							value={link}
							aria-label="Share link"
							className="text-muted-foreground"
						/>
						<Button variant="outline" onClick={copy}>
							{copied ? <CheckIcon /> : <LinkIcon />} {copied ? "Copied" : "Copy link"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
