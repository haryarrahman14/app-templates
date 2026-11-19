import { Button } from "@repo/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { useState } from "react";
import { UserAvatar } from "@/components/kit/user-avatar";
import { useMarkRead } from "@/features/notifications/api/mutations";
import { notificationsQuery } from "@/features/notifications/api/queries";
import { formatRelative } from "@/lib/format";

export function NotificationsPopover() {
	const [open, setOpen] = useState(false);
	const notifications = useQuery(notificationsQuery);
	const markRead = useMarkRead();
	const unread = notifications.data?.filter((n) => !n.read).length ?? 0;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
					className="relative text-muted-foreground"
				>
					<BellIcon />
					{unread ? (
						<span className="absolute top-1 right-1 size-2 rounded-full bg-tint ring-2 ring-background" />
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
				<div className="flex items-center justify-between border-b px-4 py-3">
					<p className="font-semibold text-sm">Notifications</p>
					<Button
						variant="ghost"
						size="xs"
						disabled={!unread}
						onClick={() => markRead.mutate(undefined)}
					>
						<CheckCheckIcon /> Mark all read
					</Button>
				</div>
				{notifications.isPending ? (
					<div className="space-y-2 p-4">
						<Skeleton className="h-10" />
						<Skeleton className="h-10" />
					</div>
				) : notifications.data?.length ? (
					<ul className="max-h-96 overflow-y-auto p-1.5">
						{notifications.data.map((n) => (
							<li key={n.id}>
								<Link
									to={n.href}
									onClick={() => {
										if (!n.read) markRead.mutate([n.id]);
										setOpen(false);
									}}
									className="flex gap-3 rounded-xl p-2.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
								>
									<UserAvatar name={n.actorName} size="sm" className="mt-0.5" />
									<span className="min-w-0 flex-1 text-sm">
										<span className={cn(!n.read && "font-medium")}>
											<span className="font-medium">{n.actorName}</span> {n.text}
										</span>
										<span className="block text-muted-foreground text-xs">
											{formatRelative(n.createdAt)}
										</span>
									</span>
									{!n.read ? (
										<span className="mt-2 size-2 shrink-0 rounded-full bg-tint">
											<span className="sr-only">Unread</span>
										</span>
									) : null}
								</Link>
							</li>
						))}
					</ul>
				) : (
					<p className="p-6 text-center text-muted-foreground text-sm">You are all caught up.</p>
				)}
			</PopoverContent>
		</Popover>
	);
}
