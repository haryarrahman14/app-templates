import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Switch } from "@repo/ui/components/switch";
import { useQuery } from "@tanstack/react-query";
import { useUpdateNotificationPrefs } from "@/features/settings/api/mutations";
import { notificationPrefsQuery } from "@/features/settings/api/queries";
import { SettingsCard } from "@/features/settings/components/settings-card";
import type { NotificationPrefs } from "@/features/settings/schemas/settings";

type PrefKey = Exclude<keyof NotificationPrefs, "id">;

const GROUPS: {
	title: string;
	description: string;
	items: { key: PrefKey; label: string; hint: string }[];
}[] = [
	{
		title: "Activity",
		description: "Things teammates do that involve you.",
		items: [
			{ key: "mentions", label: "Mentions", hint: "Someone mentions you in a document or comment" },
			{ key: "comments", label: "Comments", hint: "New comments on documents you own" },
			{ key: "shares", label: "Shares", hint: "A document is shared with you" },
			{ key: "taskReminders", label: "Task reminders", hint: "On the morning a task is due" },
		],
	},
	{
		title: "Email",
		description: "Occasional summaries in your inbox.",
		items: [
			{ key: "weeklyDigest", label: "Weekly digest", hint: "A Monday summary of what changed" },
			{ key: "productNews", label: "Product news", hint: "New features, a few times a year" },
		],
	},
];

export function NotificationSettings() {
	const prefs = useQuery(notificationPrefsQuery);
	const update = useUpdateNotificationPrefs();

	return (
		<>
			{GROUPS.map((group) => (
				<SettingsCard key={group.title} title={group.title} description={group.description}>
					<ul className="divide-y">
						{group.items.map((item) => (
							<li
								key={item.key}
								className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
							>
								<div>
									<Label htmlFor={`pref-${item.key}`}>{item.label}</Label>
									<p className="text-muted-foreground text-sm">{item.hint}</p>
								</div>
								{prefs.data ? (
									<Switch
										id={`pref-${item.key}`}
										checked={prefs.data[item.key]}
										onCheckedChange={(checked) => update.mutate({ [item.key]: checked })}
									/>
								) : (
									<Skeleton className="h-5 w-9 rounded-full" />
								)}
							</li>
						))}
					</ul>
				</SettingsCard>
			))}
		</>
	);
}
