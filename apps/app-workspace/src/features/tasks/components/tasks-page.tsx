import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Input } from "@repo/ui/components/input";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
	AlertCircleIcon,
	CalendarIcon,
	CheckCircle2Icon,
	FileTextIcon,
	PlusIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { PageContainer, PageHeader } from "@/components/kit/page-header";
import { StateScreen } from "@/components/kit/state-screen";
import { docsQuery } from "@/features/documents/api/queries";
import { useCreateTask, useUpdateTask } from "@/features/tasks/api/mutations";
import { tasksQuery } from "@/features/tasks/api/queries";
import { TaskDialog } from "@/features/tasks/components/task-dialog";
import type { Priority, Task } from "@/features/tasks/schemas/task";
import { dayFromToday, dueLabel, isOverdue } from "@/features/tasks/utils/days";

const PRIORITY_DOT: Record<Priority, string> = {
	high: "bg-cat-red",
	medium: "bg-cat-orange",
	low: "bg-cat-gray",
};

function groupTasks(tasks: Task[]) {
	const today = dayFromToday(0);
	const byDue = (a: Task, b: Task) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
	return [
		{
			id: "today",
			title: "Today",
			tasks: tasks.filter((t) => !t.done && t.dueDate && t.dueDate <= today).sort(byDue),
		},
		{
			id: "upcoming",
			title: "Upcoming",
			tasks: tasks.filter((t) => !t.done && (!t.dueDate || t.dueDate > today)).sort(byDue),
		},
		{ id: "done", title: "Done", tasks: tasks.filter((t) => t.done) },
	];
}

export function TasksPage() {
	const tasks = useQuery(tasksQuery);
	const docs = useQuery(docsQuery);
	const create = useCreateTask();
	const update = useUpdateTask();
	const reduce = useReducedMotion();
	const [quick, setQuick] = useState("");
	const [dialog, setDialog] = useState<{ open: boolean; task: Task | null }>({
		open: false,
		task: null,
	});

	const docFor = (id: string | null) => docs.data?.find((d) => d.id === id);

	return (
		<PageContainer className="max-w-3xl space-y-8">
			<PageHeader
				title="Tasks"
				description="Small things with a date. Link them to the document they belong to."
				actions={
					<Button onClick={() => setDialog({ open: true, task: null })}>
						<PlusIcon /> New task
					</Button>
				}
			/>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					const title = quick.trim();
					if (!title) return;
					create.mutate({
						title,
						notes: "",
						dueDate: dayFromToday(0),
						priority: "medium",
						docId: "",
					});
					setQuick("");
				}}
				className="flex gap-2"
			>
				<Input
					aria-label="Quick add a task for today"
					placeholder="Add a task for today and press Enter"
					value={quick}
					onChange={(event) => setQuick(event.target.value)}
					className="h-10 rounded-xl bg-card"
				/>
				<Button type="submit" variant="secondary" className="h-10" disabled={!quick.trim()}>
					Add
				</Button>
			</form>

			{tasks.isPending ? (
				<div className="space-y-3">
					{["a", "b", "c", "d"].map((key) => (
						<Skeleton key={key} className="h-14 rounded-xl" />
					))}
				</div>
			) : tasks.isError ? (
				<StateScreen
					icon={AlertCircleIcon}
					title="Tasks could not load"
					description="Try again in a moment."
				>
					<Button onClick={() => tasks.refetch()}>Try again</Button>
				</StateScreen>
			) : (
				groupTasks(tasks.data).map((group) => (
					<section key={group.id} aria-labelledby={`group-${group.id}`} className="space-y-2">
						<h2 id={`group-${group.id}`} className="flex items-center gap-2 font-semibold text-sm">
							{group.title}
							<span className="rounded-full bg-muted px-2 font-medium text-muted-foreground text-xs">
								{group.tasks.length}
							</span>
						</h2>
						{group.tasks.length === 0 ? (
							<p className="flex items-center gap-2 rounded-xl border border-dashed px-4 py-3 text-muted-foreground text-sm">
								<CheckCircle2Icon className="size-4" />
								{group.id === "done"
									? "Completed tasks land here."
									: "Nothing here. Enjoy the quiet."}
							</p>
						) : (
							<ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-soft">
								<AnimatePresence initial={false}>
									{group.tasks.map((task) => {
										const doc = docFor(task.docId);
										const overdue = !task.done && task.dueDate && isOverdue(task.dueDate);
										return (
											<motion.li
												key={task.id}
												layout={!reduce}
												initial={reduce ? false : { opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
												transition={{ duration: 0.18 }}
												className="flex items-start gap-3 px-4 py-3"
											>
												<Checkbox
													aria-label={
														task.done
															? `Mark “${task.title}” as not done`
															: `Complete “${task.title}”`
													}
													checked={task.done}
													disabled={task.id === "optimistic"}
													onCheckedChange={(value) =>
														update.mutate({ id: task.id, patch: { done: value === true } })
													}
													className="mt-1 rounded-full"
												/>
												<button
													type="button"
													onClick={() => setDialog({ open: true, task })}
													disabled={task.id === "optimistic"}
													className="min-w-0 flex-1 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
												>
													<span
														className={cn(
															"block text-[15px]",
															task.done && "text-muted-foreground line-through",
														)}
													>
														{task.title}
													</span>
													<span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
														<span className="flex items-center gap-1.5">
															<span
																className={cn("size-1.5 rounded-full", PRIORITY_DOT[task.priority])}
															/>
															{task.priority}
														</span>
														{task.dueDate ? (
															<span
																className={cn(
																	"flex items-center gap-1",
																	overdue && "text-destructive",
																)}
															>
																<CalendarIcon className="size-3" />
																{overdue
																	? `Overdue · ${dueLabel(task.dueDate)}`
																	: dueLabel(task.dueDate)}
															</span>
														) : (
															<span>No date</span>
														)}
													</span>
												</button>
												{doc ? (
													<Link
														to="/docs/$docId"
														params={{ docId: doc.id }}
														className="hidden max-w-48 items-center gap-1.5 truncate rounded-full border px-2.5 py-1 text-muted-foreground text-xs outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:flex"
													>
														<FileTextIcon className="size-3 shrink-0" />
														<span className="truncate">{doc.title}</span>
													</Link>
												) : null}
											</motion.li>
										);
									})}
								</AnimatePresence>
							</ul>
						)}
					</section>
				))
			)}

			<TaskDialog
				open={dialog.open}
				task={dialog.task}
				onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
			/>
		</PageContainer>
	);
}
