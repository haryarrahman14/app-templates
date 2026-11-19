import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Spinner } from "@repo/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { TextField } from "@/components/kit/form-fields";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { useSaveProfile } from "@/features/settings/api/mutations";
import { SettingsCard, SettingsSection } from "@/features/settings/components/settings-layout";
import { type Profile, profileSchema } from "@/features/settings/schemas/settings";
import { meQuery } from "@/features/workspace/api/queries";

export function ProfilePage() {
	const { data: me } = useQuery(meQuery);
	return (
		<SettingsSection
			title="Profile"
			description="How you appear to teammates across the workspace."
		>
			<SettingsCard>
				{me ? (
					<ProfileForm defaults={{ name: me.name, title: me.title, email: me.email }} />
				) : (
					<div className="space-y-3">
						<Skeleton className="size-16 rounded-full" />
						<Skeleton className="h-9 rounded-lg" />
						<Skeleton className="h-9 rounded-lg" />
					</div>
				)}
			</SettingsCard>
		</SettingsSection>
	);
}

function ProfileForm({ defaults }: { defaults: Profile }) {
	const save = useSaveProfile();
	const onboarding = useOnboarding();
	const form = useForm<Profile>({ resolver: zodResolver(profileSchema), defaultValues: defaults });
	const name = form.watch("name");

	return (
		<Form {...form}>
			<form
				noValidate
				className="flex flex-col gap-5"
				onSubmit={form.handleSubmit((values) =>
					save.mutate(values, {
						onSuccess: () => {
							onboarding.complete("profile");
							form.reset(values);
						},
					}),
				)}
			>
				<div className="flex items-center gap-4">
					<InitialsAvatar name={name || "?"} size="xl" />
					<div className="text-sm">
						<p className="font-medium">Avatar</p>
						<p className="text-muted-foreground">
							Initials from your name. Photo upload comes with real storage.
						</p>
					</div>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<TextField control={form.control} name="name" label="Full name" autoComplete="name" />
					<TextField control={form.control} name="title" label="Job title" />
					<TextField
						control={form.control}
						name="email"
						label="Email"
						type="email"
						className="sm:col-span-2"
						description="Used for sign-in and notifications."
					/>
				</div>
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="ghost"
						disabled={!form.formState.isDirty}
						onClick={() => form.reset()}
					>
						Discard
					</Button>
					<Button type="submit" disabled={save.isPending}>
						{save.isPending ? <Spinner /> : null}
						Save profile
					</Button>
				</div>
			</form>
		</Form>
	);
}
