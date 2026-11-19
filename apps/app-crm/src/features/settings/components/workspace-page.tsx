import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Spinner } from "@repo/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { useSaveWorkspaceSettings } from "@/features/settings/api/mutations";
import { workspaceSettingsQuery } from "@/features/settings/api/queries";
import { SettingsCard, SettingsSection } from "@/features/settings/components/settings-layout";
import {
	CURRENCIES,
	TIMEZONES,
	type WorkspaceSettings,
	workspaceSettingsSchema,
} from "@/features/settings/schemas/settings";

export function WorkspacePage() {
	const { data } = useQuery(workspaceSettingsQuery);
	return (
		<SettingsSection
			title="Workspace"
			description="Name, address and regional defaults for everyone."
		>
			<SettingsCard>
				{data ? (
					<WorkspaceForm defaults={data} />
				) : (
					<div className="grid gap-4 sm:grid-cols-2">
						{[0, 1, 2, 3].map((index) => (
							<Skeleton key={index} className="h-14 rounded-lg" />
						))}
					</div>
				)}
			</SettingsCard>
		</SettingsSection>
	);
}

function WorkspaceForm({ defaults }: { defaults: WorkspaceSettings }) {
	const save = useSaveWorkspaceSettings();
	const form = useForm<WorkspaceSettings>({
		resolver: zodResolver(workspaceSettingsSchema),
		defaultValues: defaults,
	});
	return (
		<Form {...form}>
			<form
				noValidate
				className="flex flex-col gap-5"
				onSubmit={form.handleSubmit((values) =>
					save.mutate(values, { onSuccess: () => form.reset(values) }),
				)}
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<TextField control={form.control} name="name" label="Workspace name" />
					<TextField
						control={form.control}
						name="slug"
						label="Workspace URL"
						description={`app.example.com/${form.watch("slug") || "…"}`}
					/>
					<SelectField
						control={form.control}
						name="currency"
						label="Default currency"
						options={CURRENCIES.map((value) => ({ value, label: value }))}
					/>
					<SelectField
						control={form.control}
						name="timezone"
						label="Time zone"
						options={TIMEZONES.map((value) => ({ value, label: value.replace("_", " ") }))}
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
						Save changes
					</Button>
				</div>
			</form>
		</Form>
	);
}
