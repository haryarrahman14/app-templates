import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Switch } from "@repo/ui/components/switch";
import { useQuery } from "@tanstack/react-query";
import { useSetNotificationPref } from "@/features/settings/api/mutations";
import { notificationPrefsQuery } from "@/features/settings/api/queries";
import { SettingsSection } from "@/features/settings/components/settings-layout";

const GROUPS: { title: string; items: { id: string; label: string; hint: string }[] }[] = [
	{
		title: "Activity",
		items: [
			{ id: "assigned", label: "Assigned to me", hint: "A task or record is assigned to you." },
			{ id: "mentioned", label: "Mentions", hint: "Someone mentions you in a note." },
			{ id: "dealStage", label: "Deal stage changes", hint: "A deal you own moves stage." },
		],
	},
	{
		title: "Email",
		items: [
			{ id: "dailyDigest", label: "Daily digest", hint: "Your tasks and meetings each morning." },
			{ id: "weeklyReport", label: "Weekly pipeline report", hint: "Every Monday at 8:00." },
			{ id: "productNews", label: "Product news", hint: "New features, at most once a month." },
		],
	},
];

export function NotificationsPage() {
	const { data } = useQuery(notificationPrefsQuery);
	const setPref = useSetNotificationPref();

	return (
		<SettingsSection title="Notifications" description="Choose what reaches you, and where.">
			{GROUPS.map((group) => (
				<div key={group.title} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
					<p className="border-b px-4 py-3 font-medium text-sm">{group.title}</p>
					<ul className="divide-y">
						{group.items.map((item) => (
							<li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
								<Label htmlFor={`pref-${item.id}`} className="flex flex-col items-start gap-0.5">
									<span className="font-medium text-sm">{item.label}</span>
									<span className="font-normal text-muted-foreground text-sm">{item.hint}</span>
								</Label>
								{data ? (
									<Switch
										id={`pref-${item.id}`}
										checked={data[item.id] ?? false}
										onCheckedChange={(value) => setPref.mutate({ id: item.id, value })}
									/>
								) : (
									<Skeleton className="h-5 w-9 rounded-full" />
								)}
							</li>
						))}
					</ul>
				</div>
			))}
		</SettingsSection>
	);
}
