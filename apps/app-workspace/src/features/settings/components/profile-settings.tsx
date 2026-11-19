import { zodResolver } from "@hookform/resolvers/zod";
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
import { Skeleton } from "@repo/ui/components/skeleton";
import { Spinner } from "@repo/ui/components/spinner";
import { Textarea } from "@repo/ui/components/textarea";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserAvatar } from "@/components/kit/user-avatar";
import { useUpdateProfile } from "@/features/settings/api/mutations";
import { profileQuery } from "@/features/settings/api/queries";
import { SettingsCard } from "@/features/settings/components/settings-card";
import { type ProfileForm, profileFormSchema } from "@/features/settings/schemas/settings";
import { useSessionUser } from "@/lib/session-context";

export function ProfileSettings() {
	const user = useSessionUser();
	const profile = useQuery(profileQuery);
	const save = useUpdateProfile();
	const form = useForm<ProfileForm>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: { name: user.name, email: user.email, jobTitle: "", bio: "" },
	});

	useEffect(() => {
		if (profile.data)
			form.reset({
				name: user.name,
				email: user.email,
				jobTitle: profile.data.jobTitle,
				bio: profile.data.bio,
			});
	}, [profile.data, user.name, user.email, form]);

	const name = form.watch("name");

	return (
		<Form {...form}>
			<form noValidate onSubmit={form.handleSubmit((values) => save.mutate(values))}>
				<SettingsCard
					title="Profile"
					description="How you appear to teammates in comments, mentions and shares."
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
							<Button type="submit" disabled={save.isPending || !form.formState.isDirty}>
								{save.isPending ? <Spinner /> : null} Save changes
							</Button>
						</>
					}
				>
					<div className="flex items-center gap-4">
						<UserAvatar name={name || user.name} size="lg" className="size-16 text-xl" />
						<div className="text-sm">
							<p className="font-medium">Avatar</p>
							<p className="text-muted-foreground">
								Your initials, in the workspace accent. Upload support plugs in here.
							</p>
						</div>
					</div>
					{profile.isPending ? (
						<div className="space-y-3">
							<Skeleton className="h-9" />
							<Skeleton className="h-9" />
							<Skeleton className="h-20" />
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
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
								name="jobTitle"
								render={({ field }) => (
									<FormItem className="sm:col-span-2">
										<FormLabel>Role</FormLabel>
										<FormControl>
											<Input placeholder="e.g. Product designer" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="bio"
								render={({ field }) => (
									<FormItem className="sm:col-span-2">
										<FormLabel>Bio</FormLabel>
										<FormControl>
											<Textarea rows={3} className="resize-none" {...field} />
										</FormControl>
										<FormDescription>{field.value.length}/240</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
				</SettingsCard>
			</form>
		</Form>
	);
}
