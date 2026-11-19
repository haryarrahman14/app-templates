import { Button } from "@repo/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
import { useMarkAllRead } from "@/features/notifications/api/mutations";
import { notificationsQuery } from "@/features/notifications/api/queries";
import { formatDate } from "@/lib/format";

export function NotificationsMenu() {
	const { data = [], isPending } = useQuery(notificationsQuery);
	const markAll = useMarkAllRead();
	const unread = data.filter((n) => !n.read).length;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative rounded-full"
					aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
				>
					<BellIcon />
					{unread ? (
						<span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-tint ring-2 ring-background" />
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="glass w-80 rounded-2xl p-0 shadow-float">
				<div className="flex items-center justify-between border-b px-4 py-3">
					<p className="font-medium text-sm">Notifications</p>
					<Button
						variant="ghost"
						size="xs"
						onClick={() => markAll.mutate()}
						disabled={!unread || markAll.isPending}
					>
						Mark all read
					</Button>
				</div>
				<ul className="max-h-80 divide-y overflow-y-auto">
					{isPending ? <li className="px-4 py-6 text-muted-foreground text-sm">Loading…</li> : null}
					{data.map((n) => (
						<li key={n.id} className="flex gap-3 px-4 py-3">
							<span
								aria-hidden
								className={cn(
									"mt-1.5 size-2 shrink-0 rounded-full",
									n.read ? "bg-transparent" : "bg-tint",
								)}
							/>
							<div className="min-w-0">
								<p className={cn("text-sm", !n.read && "font-medium")}>
									{n.title}
									{!n.read ? <span className="sr-only"> (unread)</span> : null}
								</p>
								<p className="text-muted-foreground text-xs">{n.body}</p>
								<p className="mt-1 text-[11px] text-muted-foreground">
									{formatDate(n.at, "dayTime")}
								</p>
							</div>
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
