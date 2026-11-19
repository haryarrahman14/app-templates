import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
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
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Switch } from "@repo/ui/components/switch";
import { useQuery } from "@tanstack/react-query";
import { LaptopIcon, SmartphoneIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
	useChangePassword,
	useRevokeSession,
	useSetTwoFactor,
} from "@/features/settings/api/mutations";
import { securityQuery } from "@/features/settings/api/queries";
import { SampleNote, SettingsSection } from "@/features/settings/components/settings-section";
import {
	type ChangePasswordInput,
	changePasswordSchema,
} from "@/features/settings/schemas/settings";
import { formatDate } from "@/lib/format";

function ChangePassword({ changedAt }: { changedAt: number }) {
	const change = useChangePassword();
	const form = useForm<ChangePasswordInput>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: { current: "", next: "", confirm: "" },
	});
	return (
		<Form {...form}>
			<form
				noValidate
				onSubmit={form.handleSubmit((values) =>
					change.mutate(values, {
						onSuccess: () => {
							form.reset();
							toast.success("Password updated", {
								description: "Sample only: nothing was stored.",
							});
						},
					}),
				)}
			>
				<SettingsSection
					title="Password"
					description={`Last changed ${formatDate(changedAt, "medium")}.`}
					footer={
						<Button type="submit" disabled={change.isPending}>
							{change.isPending ? <Spinner /> : null}
							Update password
						</Button>
					}
				>
					<div className="grid gap-4 sm:grid-cols-3">
						{(
							[
								["current", "Current password", "current-password"],
								["next", "New password", "new-password"],
								["confirm", "Confirm new password", "new-password"],
							] as const
						).map(([name, label, autoComplete]) => (
							<FormField
								key={name}
								control={form.control}
								name={name}
								render={({ field }) => (
									<FormItem>
										<FormLabel>{label}</FormLabel>
										<FormControl>
											<Input type="password" autoComplete={autoComplete} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
					</div>
				</SettingsSection>
			</form>
		</Form>
	);
}

export function SecuritySettings() {
	const { data } = useQuery(securityQuery);
	const setTwoFactor = useSetTwoFactor();
	const revoke = useRevokeSession();
	if (!data) return <Skeleton className="h-96 w-full rounded-2xl" />;

	return (
		<div className="space-y-6">
			<ChangePassword changedAt={data.passwordChangedAt} />
			<SettingsSection
				title="Two-factor authentication"
				description="Ask for a one-time code when signing in on a new device."
			>
				<div className="flex items-center justify-between gap-4 rounded-xl border p-3">
					<div>
						<Label htmlFor="2fa">Authenticator app</Label>
						<p className="text-muted-foreground text-xs">
							{data.twoFactor ? "On for this account." : "Off."}
						</p>
					</div>
					<Switch
						id="2fa"
						checked={data.twoFactor}
						onCheckedChange={(v) =>
							setTwoFactor.mutate(v, {
								onSuccess: () =>
									toast.success(
										v ? "Two-factor turned on (sample)" : "Two-factor turned off (sample)",
									),
							})
						}
					/>
				</div>
				<div className="mt-3">
					<SampleNote>
						This switch is a stub. A real flow would show a QR code, verify a code from the app and
						issue recovery codes; wire it to your auth provider's MFA API.
					</SampleNote>
				</div>
			</SettingsSection>
			<SettingsSection title="Active sessions" description="Devices signed in to your account.">
				<ul className="divide-y">
					{data.sessions.map((s) => {
						const Icon = s.device.toLowerCase().includes("phone") ? SmartphoneIcon : LaptopIcon;
						return (
							<li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
								<span className="flex size-9 items-center justify-center rounded-xl bg-foreground/[0.05]">
									<Icon aria-hidden className="size-4" />
								</span>
								<div className="min-w-0 flex-1">
									<p className="font-medium text-sm">
										{s.device}
										{s.current ? (
											<span className="ml-2 rounded-full bg-foreground/[0.08] px-2 py-0.5 text-[11px]">
												This device
											</span>
										) : null}
									</p>
									<p className="text-muted-foreground text-xs">
										{s.location} · active {formatDate(s.lastActive, "dayTime")}
									</p>
								</div>
								{s.current ? null : (
									<Button
										variant="outline"
										size="sm"
										disabled={revoke.isPending}
										onClick={() =>
											revoke.mutate(s.id, {
												onSuccess: () => toast.success(`Signed out ${s.device}`),
											})
										}
									>
										Sign out
									</Button>
								)}
							</li>
						);
					})}
				</ul>
			</SettingsSection>
		</div>
	);
}
