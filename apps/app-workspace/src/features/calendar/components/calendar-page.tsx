import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameMonth,
	isToday,
	parseISO,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import {
	CheckSquareIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	PlusIcon,
	Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PageContainer } from "@/components/kit/page-header";
import { useDeleteEvent } from "@/features/calendar/api/mutations";
import { eventsQuery } from "@/features/calendar/api/queries";
import { EventDialog } from "@/features/calendar/components/event-dialog";
import { EVENT_TINTS } from "@/features/calendar/schemas/event";
import { tasksQuery } from "@/features/tasks/api/queries";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const key = (date: Date) => format(date, "yyyy-MM-dd");

export function CalendarPage() {
	const todayKey = key(new Date());
	const [month, setMonth] = useState<Date | null>(null);
	const [selected, setSelected] = useState<string | null>(null);
	const [dialog, setDialog] = useState(false);
	const events = useQuery(eventsQuery);
	const tasks = useQuery(tasksQuery);
	const removeEvent = useDeleteEvent();

	const visibleMonth = month ?? parseISO(todayKey);
	const selectedKey = selected ?? todayKey;

	const monthKey = key(visibleMonth);
	const days = useMemo(() => {
		const first = parseISO(monthKey);
		return eachDayOfInterval({
			start: startOfWeek(startOfMonth(first), { weekStartsOn: 1 }),
			end: endOfWeek(endOfMonth(first), { weekStartsOn: 1 }),
		});
	}, [monthKey]);

	const eventsOn = (day: string) => (events.data ?? []).filter((e) => e.date === day);
	const tasksOn = (day: string) => (tasks.data ?? []).filter((t) => t.dueDate === day);

	const dayEvents = eventsOn(selectedKey);
	const dayTasks = tasksOn(selectedKey);

	return (
		<PageContainer className="max-w-7xl">
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
					{format(visibleMonth, "MMMM yyyy")}
				</h1>
				<div className="flex items-center gap-1.5">
					<Button
						variant="outline"
						size="icon"
						aria-label="Previous month"
						onClick={() => setMonth(addMonths(visibleMonth, -1))}
					>
						<ChevronLeftIcon />
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							setMonth(null);
							setSelected(null);
						}}
					>
						Today
					</Button>
					<Button
						variant="outline"
						size="icon"
						aria-label="Next month"
						onClick={() => setMonth(addMonths(visibleMonth, 1))}
					>
						<ChevronRightIcon />
					</Button>
					<Button className="ml-1" onClick={() => setDialog(true)}>
						<PlusIcon /> <span className="max-sm:sr-only">New event</span>
					</Button>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
					<div className="grid grid-cols-7 border-b">
						{WEEKDAYS.map((weekday) => (
							<div
								key={weekday}
								className="py-2 text-center font-medium text-muted-foreground text-xs"
							>
								{weekday}
							</div>
						))}
					</div>
					<div className="grid grid-cols-7">
						{days.map((date) => {
							const dayKey = key(date);
							const items = eventsOn(dayKey);
							const due = tasksOn(dayKey);
							const isSelected = dayKey === selectedKey;
							return (
								<button
									key={dayKey}
									type="button"
									aria-pressed={isSelected}
									aria-label={`${format(date, "EEEE, MMMM d")}: ${items.length} events, ${due.length} tasks`}
									onClick={() => setSelected(dayKey)}
									onDoubleClick={() => {
										setSelected(dayKey);
										setDialog(true);
									}}
									className={cn(
										"flex min-h-16 flex-col items-stretch gap-1 border-r border-b p-1.5 text-left outline-none transition-colors hover:bg-accent/60 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring sm:min-h-24 [&:nth-child(7n)]:border-r-0",
										!isSameMonth(date, visibleMonth) && "bg-muted/40 text-muted-foreground",
										isSelected && "bg-primary/8",
									)}
								>
									<span
										className={cn(
											"flex size-6 items-center justify-center self-end rounded-full text-xs tabular-nums sm:self-start",
											isToday(date) && "bg-primary font-semibold text-primary-foreground",
										)}
									>
										{format(date, "d")}
									</span>
									<span className="hidden flex-col gap-0.5 sm:flex">
										{items.slice(0, 2).map((event) => (
											<span
												key={event.id}
												className={cn(
													"truncate rounded-md px-1.5 py-0.5 text-[11px]",
													EVENT_TINTS[event.tint].chip,
												)}
											>
												{event.title}
											</span>
										))}
										{items.length > 2 ? (
											<span className="px-1.5 text-[11px] text-muted-foreground">
												+{items.length - 2} more
											</span>
										) : null}
									</span>
									<span className="mt-auto flex flex-wrap gap-1">
										{items.map((event) => (
											<span
												key={event.id}
												className={cn(
													"size-1.5 rounded-full sm:hidden",
													EVENT_TINTS[event.tint].dot,
												)}
											/>
										))}
										{due.map((task) => (
											<span
												key={task.id}
												className={cn(
													"size-1.5 rounded-full ring-1 ring-foreground/40",
													task.done ? "bg-transparent" : "bg-foreground/40",
												)}
											/>
										))}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				<aside
					aria-label="Selected day"
					className="space-y-5 rounded-2xl border bg-card p-5 shadow-soft lg:self-start"
				>
					<div>
						<p className="text-muted-foreground text-sm">{format(parseISO(selectedKey), "EEEE")}</p>
						<h2 className="font-semibold text-xl tracking-tight">
							{format(parseISO(selectedKey), "MMMM d")}
						</h2>
					</div>
					<section className="space-y-2">
						<h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
							Events
						</h3>
						{events.isPending ? (
							<Skeleton className="h-12" />
						) : dayEvents.length ? (
							<ul className="space-y-2">
								{dayEvents.map((event) => (
									<li
										key={event.id}
										className="group flex items-center gap-3 rounded-xl border p-3"
									>
										<span className={cn("h-8 w-1 rounded-full", EVENT_TINTS[event.tint].dot)} />
										<span className="min-w-0 flex-1">
											<span className="block truncate font-medium text-sm">{event.title}</span>
											<span className="block text-muted-foreground text-xs tabular-nums">
												{event.start} – {event.end}
											</span>
										</span>
										<Button
											variant="ghost"
											size="icon-xs"
											aria-label={`Delete ${event.title}`}
											disabled={event.id === "optimistic"}
											className="text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
											onClick={() => removeEvent.mutate(event)}
										>
											<Trash2Icon />
										</Button>
									</li>
								))}
							</ul>
						) : (
							<p className="text-muted-foreground text-sm">No events.</p>
						)}
						<Button variant="outline" size="sm" className="w-full" onClick={() => setDialog(true)}>
							<PlusIcon /> Add event
						</Button>
					</section>
					<section className="space-y-2">
						<h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
							Tasks due
						</h3>
						{dayTasks.length ? (
							<ul className="space-y-1">
								{dayTasks.map((task) => (
									<li key={task.id}>
										<Link
											to="/tasks"
											className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
										>
											<CheckSquareIcon
												className={cn(
													"size-4",
													task.done ? "fill-tint text-[#1a1a1a]" : "text-muted-foreground",
												)}
											/>
											<span
												className={cn(
													"truncate",
													task.done && "text-muted-foreground line-through",
												)}
											>
												{task.title}
											</span>
										</Link>
									</li>
								))}
							</ul>
						) : (
							<p className="text-muted-foreground text-sm">Nothing due.</p>
						)}
					</section>
				</aside>
			</div>
			<EventDialog open={dialog} onOpenChange={setDialog} date={selectedKey} />
		</PageContainer>
	);
}
