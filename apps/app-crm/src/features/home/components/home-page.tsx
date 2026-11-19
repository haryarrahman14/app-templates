import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, MapPin, Video } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { ActivityFeed } from "@/components/kit/activity-feed";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { activitiesQuery } from "@/features/activities/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { DEAL_STAGE_META, type DealStage } from "@/features/deals/schemas/deal";
import { todayMeetingsQuery } from "@/features/home/api/queries";
import { AskBox } from "@/features/home/components/ask-box";
import { useUpdateTask } from "@/features/tasks/api/mutations";
import { tasksQuery } from "@/features/tasks/api/queries";
import { formatDay, formatMoney, formatMoneyCompact, formatTime } from "@/lib/format";
import { recordLink } from "@/lib/records";
import { SESSION_MEMBER_ID } from "@/lib/session";
import { openCreate } from "@/lib/ui-state";
import { useLookups } from "@/lib/use-lookups";

function Card({
	title,
	action,
	children,
	className,
}: {
	title: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				"flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-5 shadow-soft",
				className,
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<h2 className="font-semibold text-base">{title}</h2>
				{action}
			</div>
			{children}
		</section>
	);
}

function useGreeting(name: string) {
	const [greeting, setGreeting] = useState("Welcome back");
	useEffect(() => {
		const hour = new Date().getHours();
		setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
	}, []);
	return `${greeting}, ${name}`;
}

const PIPELINE: DealStage[] = ["qualified", "proposal", "negotiation", "won"];

export function HomePage() {
	const lookups = useLookups();
	const me = lookups.member.get(SESSION_MEMBER_ID);
	const greeting = useGreeting(me?.name.split(" ")[0] ?? "there");
	const meetingsQuery = useQuery(todayMeetingsQuery);
	const meetings = meetingsQuery.data ?? [];
	const tasks = useQuery(tasksQuery).data ?? [];
	const deals = useQuery(dealsQuery).data ?? [];
	const activities = useQuery(activitiesQuery).data ?? [];
	const updateTask = useUpdateTask();
	const [today, setToday] = useState("");
	useEffect(() => setToday(format(new Date(), "EEEE, MMMM d")), []);

	const myTasks = tasks
		.filter((task) => task.assigneeId === SESSION_MEMBER_ID && !task.done)
		.sort((a, b) => (a.dueDate ?? "9").localeCompare(b.dueDate ?? "9"))
		.slice(0, 6);
	const now = new Date().toISOString();

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
			<div className="mx-auto grid w-full max-w-2xl gap-5">
				<div className="text-center">
					<p className="h-5 text-muted-foreground text-sm">{today}</p>
					<h1 className="font-semibold text-3xl">{greeting}</h1>
				</div>
				<AskBox />
			</div>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				{PIPELINE.map((stage) => {
					const inStage = deals.filter((deal) => deal.stage === stage);
					const total = inStage.reduce((sum, deal) => sum + deal.value, 0);
					return (
						<Link
							key={stage}
							to="/deals"
							className="group rounded-2xl border bg-card p-4 shadow-soft outline-none transition hover:shadow-float focus-visible:ring-2 focus-visible:ring-ring"
						>
							<span className="flex items-center gap-2 text-muted-foreground text-sm">
								<span className={cn("size-2 rounded-full", DEAL_STAGE_META[stage].dot)} />
								{DEAL_STAGE_META[stage].label}
								<ArrowRight className="ml-auto size-3.5 opacity-0 transition group-hover:opacity-100" />
							</span>
							<span className="mt-2 block font-semibold text-2xl tabular-nums tracking-tight">
								{formatMoneyCompact(total)}
							</span>
							<span className="text-muted-foreground text-xs">
								{inStage.length} {inStage.length === 1 ? "deal" : "deals"}
							</span>
						</Link>
					);
				})}
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card
					title="Today’s meetings"
					action={
						<span className="text-muted-foreground text-xs">{meetings.length} scheduled</span>
					}
				>
					{meetingsQuery.isPending ? (
						<div className="grid gap-2" aria-busy="true">
							{[0, 1, 2].map((index) => (
								<Skeleton key={index} className="h-12 rounded-xl" />
							))}
						</div>
					) : meetings.length ? (
						<ul className="grid gap-1">
							{meetings.map((meeting) => {
								const past = meeting.end < now;
								return (
									<li
										key={meeting.id}
										className={cn(
											"flex min-w-0 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-muted/60",
											past && "opacity-55",
										)}
									>
										<div className="w-16 shrink-0 text-right text-xs tabular-nums">
											<div className="font-medium">{formatTime(meeting.start)}</div>
											<div className="text-muted-foreground">{formatTime(meeting.end)}</div>
										</div>
										<span className="h-9 w-0.5 shrink-0 rounded-full bg-primary" />
										<div className="min-w-0 flex-1">
											<p className="truncate font-medium text-sm">{meeting.title}</p>
											<p className="flex items-center gap-1 truncate text-muted-foreground text-xs">
												{meeting.location === "Video call" ? (
													<Video className="size-3" />
												) : (
													<MapPin className="size-3" />
												)}
												{meeting.location}
												{meeting.record ? (
													<>
														{" · "}
														<Link {...recordLink(meeting.record)} className="hover:underline">
															{lookups.recordLabel(meeting.record)}
														</Link>
													</>
												) : null}
											</p>
										</div>
										{meeting.location === "Video call" && !past ? (
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													toast("Joining calls is not part of the sample", {
														description: meeting.title,
													})
												}
											>
												Join
											</Button>
										) : null}
									</li>
								);
							})}
						</ul>
					) : (
						<p className="flex flex-col items-center gap-2 py-6 text-muted-foreground text-sm">
							<CalendarDays className="size-5" /> No meetings today.
						</p>
					)}
				</Card>

				<Card
					title="My tasks"
					action={
						<div className="flex items-center gap-1">
							<Button variant="ghost" size="sm" onClick={() => openCreate("task")}>
								New
							</Button>
							<Button variant="ghost" size="sm" asChild>
								<Link to="/tasks">View all</Link>
							</Button>
						</div>
					}
				>
					{myTasks.length ? (
						<ul className="grid">
							{myTasks.map((task) => {
								const overdue = task.dueDate !== null && task.dueDate < now;
								return (
									<li
										key={task.id}
										className="flex min-w-0 items-center gap-3 border-b py-2.5 last:border-b-0"
									>
										<Checkbox
											className="rounded-full"
											checked={task.done}
											aria-label={`Mark “${task.title}” done`}
											onCheckedChange={(checked) =>
												updateTask.mutate({ id: task.id, done: Boolean(checked) })
											}
										/>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm">{task.title}</p>
											{task.record ? (
												<Link
													{...recordLink(task.record)}
													className="flex items-center gap-1.5 truncate text-muted-foreground text-xs hover:underline"
												>
													<RecordGlyph type={task.record.type} size="xs" />
													{lookups.recordLabel(task.record)}
												</Link>
											) : null}
										</div>
										<span
											className={cn(
												"shrink-0 text-xs",
												overdue ? "text-destructive" : "text-muted-foreground",
											)}
										>
											{formatDay(task.dueDate)}
										</span>
									</li>
								);
							})}
						</ul>
					) : (
						<p className="py-6 text-center text-muted-foreground text-sm">
							Nothing on your plate. Enjoy the calm.
						</p>
					)}
				</Card>
			</div>

			<Card
				title="Recent activity"
				action={
					<span className="text-muted-foreground text-xs">
						Won to date{" "}
						{formatMoney(
							deals
								.filter((deal) => deal.stage === "won")
								.reduce((sum, deal) => sum + deal.value, 0),
						)}
					</span>
				}
			>
				<ActivityFeed
					items={activities.slice(0, 8)}
					recordLabel={(activity) => lookups.recordLabel(activity.record)}
					memberName={lookups.memberName}
				/>
			</Card>
		</div>
	);
}
