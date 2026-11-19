import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
	Form,
	FormControl,
	FormDescription,
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
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Textarea } from "@repo/ui/components/textarea";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSession } from "@/components/layout/session-context";
import { initials } from "@/components/layout/user-menu";
import { useUpdateProfile } from "@/features/settings/api/mutations";
import { profileOverridesQuery } from "@/features/settings/api/queries";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { TIMEZONES } from "@/features/settings/constants/plans";
import { type Profile, profileSchema } from "@/features/settings/schemas/settings";

function ProfileForm({ initial }: { initial: Profile }) {
	const update = useUpdateProfile();
	const form = useForm<Profile>({ resolver: zodResolver(profileSchema), defaultValues: initial });
	const name = form.watch("name");

	return (
		<Form {...form}>
			<form
				noValidate
				onSubmit={form.handleSubmit((values) =>
					update.mutate(values, {
						onSuccess: (saved) => {
							form.reset(saved);
							toast.success("Profile saved", {
								description: "Stored in this sample session only.",
							});
						},
					}),
				)}
			>
				<SettingsSection
					title="Profile"
					description="How you appear in the app."
					footer={
						<>
							<Button
								type="button"
								variant="ghost"
								disabled={!form.formState.isDirty}
								onClick={() => form.reset()}
							>
								Discard
							</Button>
							<Button type="submit" disabled={update.isPending || !form.formState.isDirty}>
								{update.isPending ? <Spinner /> : null}
								Save changes
							</Button>
						</>
					}
				>
					<div className="mb-6 flex items-center gap-4">
						<Avatar className="size-14">
							<AvatarFallback className="bg-lettermark text-lettermark-foreground font-medium text-lg">
								{initials(name || "?")}
							</AvatarFallback>
						</Avatar>
						<p className="text-muted-foreground text-sm">
							Avatars use your initials in this template.
						</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full name</FormLabel>
									<FormControl>
										<Input autoComplete="name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" autoComplete="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="timezone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Time zone</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Choose a time zone" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{TIMEZONES.map((tz) => (
												<SelectItem key={tz} value={tz}>
													{tz.replace("_", " ")}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem className="sm:col-span-2">
									<FormLabel>Short bio</FormLabel>
									<FormControl>
										<Textarea
											rows={3}
											placeholder="Long-term investor, mostly index funds…"
											{...field}
										/>
									</FormControl>
									<FormDescription>{field.value.length}/160</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</SettingsSection>
			</form>
		</Form>
	);
}

export function ProfileSettings() {
	const session = useSession();
	const { data } = useQuery(profileOverridesQuery);
	if (!data) return <Skeleton className="h-96 w-full rounded-2xl" />;
	return (
		<ProfileForm
			initial={{
				name: data.name ?? session.name,
				email: data.email ?? session.email,
				timezone: data.timezone ?? "UTC",
				bio: data.bio ?? "",
			}}
		/>
	);
}
