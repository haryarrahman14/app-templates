import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { Switch } from "@repo/ui/components/switch";
import { useQuery } from "@tanstack/react-query";
import { useUpdateNotifications } from "@/features/settings/api/mutations";
import { notificationPrefsQuery } from "@/features/settings/api/queries";
import { SettingsSection } from "@/features/settings/components/settings-section";
import type { NotificationPrefs } from "@/features/settings/schemas/settings";

const TOPICS: { key: Exclude<keyof NotificationPrefs, "channel">; label: string; hint: string }[] =
	[
		{ key: "priceAlerts", label: "Price alerts", hint: "When one of your alerts triggers." },
		{ key: "dailyBrief", label: "Daily brief", hint: "A short summary after the market closes." },
		{
			key: "weeklyReport",
			label: "Weekly report",
			hint: "Income, spending and performance every Monday.",
		},
		{ key: "dividends", label: "Dividends", hint: "When a dividend is paid into your account." },
		{ key: "productNews", label: "Product news", hint: "New features, at most once a month." },
	];

export function NotificationSettings() {
	const { data } = useQuery(notificationPrefsQuery);
	const update = useUpdateNotifications();
	if (!data) return <Skeleton className="h-96 w-full rounded-2xl" />;
	const save = (patch: Partial<NotificationPrefs>) =>
		update.mutate(patch, { onSuccess: () => toast.success("Notification settings saved") });

	return (
		<div className="space-y-6">
			<SettingsSection title="What to tell you about" description="Changes save as you go.">
				<ul className="divide-y">
					{TOPICS.map((topic) => (
						<li
							key={topic.key}
							className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
						>
							<div>
								<Label htmlFor={`n-${topic.key}`}>{topic.label}</Label>
								<p className="text-muted-foreground text-xs">{topic.hint}</p>
							</div>
							<Switch
								id={`n-${topic.key}`}
								checked={data[topic.key]}
								onCheckedChange={(v) => save({ [topic.key]: v })}
							/>
						</li>
					))}
				</ul>
			</SettingsSection>
			<SettingsSection
				title="Where"
				description="Sample only: no email or push message is ever sent."
			>
				<RadioGroup
					value={data.channel}
					onValueChange={(v) => save({ channel: v as NotificationPrefs["channel"] })}
					className="grid gap-3 sm:grid-cols-3"
				>
					{(
						[
							["email", "Email"],
							["push", "Push"],
							["both", "Email and push"],
						] as const
					).map(([value, label]) => (
						<Label
							key={value}
							htmlFor={`c-${value}`}
							className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-normal has-[[data-state=checked]]:border-tint has-[[data-state=checked]]:bg-foreground/[0.03]"
						>
							<RadioGroupItem id={`c-${value}`} value={value} />
							{label}
						</Label>
					))}
				</RadioGroup>
			</SettingsSection>
		</div>
	);
}
