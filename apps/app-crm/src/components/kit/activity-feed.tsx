import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import {
	CalendarDays,
	CheckCircle2,
	Handshake,
	type LucideIcon,
	Mail,
	NotebookPen,
	Phone,
	Sparkles,
} from "lucide-react";
import type { Activity, ActivityType } from "@/features/activities/schemas/activity";
import { formatAgo } from "@/lib/format";
import { recordLink } from "@/lib/records";

const TYPE_META: Record<ActivityType, { icon: LucideIcon; tone: string; label: string }> = {
	email: { icon: Mail, tone: "bg-cat-blue-soft text-cat-blue-ink", label: "Email" },
	call: {
		icon: Phone,
		tone: "bg-cat-teal-soft text-cat-teal-ink",
		label: "Call",
	},
	meeting: {
		icon: CalendarDays,
		tone: "bg-cat-gray-soft text-cat-gray-ink",
		label: "Meeting",
	},
	note: {
		icon: NotebookPen,
		tone: "bg-cat-yellow-soft text-cat-yellow-ink",
		label: "Note",
	},
	task: {
		icon: CheckCircle2,
		tone: "bg-cat-orange-soft text-cat-orange-ink",
		label: "Task",
	},
	deal: { icon: Handshake, tone: "bg-cat-green-soft text-cat-green-ink", label: "Deal" },
	created: { icon: Sparkles, tone: "bg-muted text-muted-foreground", label: "Created" },
};

export const ACTIVITY_TYPE_LABEL = Object.fromEntries(
	Object.entries(TYPE_META).map(([key, value]) => [key, value.label]),
) as Record<ActivityType, string>;

/** A vertical timeline of activities. Labels for records and people come from the caller. */
export function ActivityFeed({
	items,
	recordLabel,
	memberName,
	showRecord = true,
	className,
}: {
	items: Activity[];
	recordLabel: (activity: Activity) => string;
	memberName: (id: string) => string;
	showRecord?: boolean;
	className?: string;
}) {
	return (
		<ol className={cn("relative grid gap-0", className)}>
			{items.map((activity, index) => {
				const meta = TYPE_META[activity.type];
				const Icon = meta.icon;
				return (
					<li key={activity.id} className="relative flex gap-3 pb-5 last:pb-0">
						{index < items.length - 1 ? (
							<span aria-hidden className="absolute top-8 bottom-0 left-[13px] w-px bg-border" />
						) : null}
						<span
							className={cn(
								"relative flex size-7 shrink-0 items-center justify-center rounded-full",
								meta.tone,
							)}
						>
							<Icon className="size-3.5" />
						</span>
						<div className="min-w-0 flex-1 pt-0.5">
							<p className="text-sm">
								<span className="font-medium">{memberName(activity.actorId).split(" ")[0]}</span>{" "}
								<span className="text-muted-foreground">
									{activity.summary.charAt(0).toLowerCase() + activity.summary.slice(1)}
								</span>
								{showRecord ? (
									<>
										{" "}
										<span className="text-muted-foreground">·</span>{" "}
										<Link
											{...recordLink(activity.record)}
											className="font-medium outline-none hover:underline focus-visible:underline"
										>
											{recordLabel(activity)}
										</Link>
									</>
								) : null}
							</p>
							{activity.detail ? (
								<p className="mt-1 whitespace-pre-line rounded-xl bg-muted/60 px-3 py-2 text-muted-foreground text-sm">
									{activity.detail}
								</p>
							) : null}
							<p className="mt-0.5 text-muted-foreground text-xs">
								{meta.label} · {formatAgo(activity.at)}
							</p>
						</div>
					</li>
				);
			})}
		</ol>
	);
}
