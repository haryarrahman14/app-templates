import { Button } from "@repo/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { useMarkNotificationsRead } from "@/features/workspace/api/mutations";
import { notificationsQuery } from "@/features/workspace/api/queries";
import { formatAgo } from "@/lib/format";
import { hrefLink } from "@/lib/href-link";

export function NotificationsPopover() {
	const [open, setOpen] = useState(false);
	const { data = [] } = useQuery(notificationsQuery);
	const markRead = useMarkNotificationsRead();
	const unread = data.filter((item) => !item.read).length;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative"
					aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
				>
					<Bell />
					{unread > 0 ? (
						<span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-80 rounded-2xl p-0">
				<div className="flex items-center justify-between border-b px-4 py-3">
					<p className="font-medium text-sm">Notifications</p>
					<Button
						variant="ghost"
						size="xs"
						disabled={unread === 0}
						onClick={() => markRead.mutate("all")}
					>
						<CheckCheck /> Mark all read
					</Button>
				</div>
				<ul className="max-h-80 overflow-y-auto p-1.5">
					{data.length === 0 ? (
						<li className="px-3 py-8 text-center text-muted-foreground text-sm">
							You are all caught up.
						</li>
					) : null}
					{data.map((item) => (
						<li key={item.id}>
							<Link
								{...hrefLink(item.href)}
								onClick={() => {
									markRead.mutate([item.id]);
									setOpen(false);
								}}
								className="flex gap-3 rounded-xl px-3 py-2.5 outline-none transition hover:bg-muted focus-visible:bg-muted"
							>
								<span
									className={cn(
										"mt-1.5 size-2 shrink-0 rounded-full",
										item.read ? "bg-transparent" : "bg-primary",
									)}
								/>
								<span className="min-w-0 flex-1">
									<span className="block font-medium text-sm">{item.title}</span>
									<span className="block truncate text-muted-foreground text-sm">{item.body}</span>
									<span className="block text-muted-foreground text-xs">{formatAgo(item.at)}</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
}
