import { Button } from "@repo/ui/components/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@repo/ui/components/empty-state";
import { Input } from "@repo/ui/components/input";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, CornerDownLeft, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { PageBody, PageHeader } from "@/components/kit/page-header";
import { newTaskId, useCreateTask } from "@/features/tasks/api/mutations";
import { tasksQuery } from "@/features/tasks/api/queries";
import { TaskDialog } from "@/features/tasks/components/task-dialog";
import { TaskRow } from "@/features/tasks/components/task-row";
import type { Task } from "@/features/tasks/schemas/task";
import {
	fromDateInput,
	groupOf,
	type TaskGroup,
	todayInput,
} from "@/features/tasks/utils/task-dates";
import { pluralize } from "@/lib/format";
import { SESSION_MEMBER_ID } from "@/lib/session";

const FILTERS = [
	{ id: "mine", label: "Mine" },
	{ id: "due", label: "Due" },
	{ id: "upcoming", label: "Upcoming" },
	{ id: "done", label: "Done" },
	{ id: "all", label: "All" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

const EMPTY: Record<Filter, { title: string; description: string }> = {
	mine: { title: "Nothing on your plate", description: "Add a task above, or enjoy the quiet." },
	due: { title: "Nothing due", description: "No open tasks are due today or overdue." },
	upcoming: {
		title: "No upcoming tasks",
		description: "Tasks with a future due date show up here.",
	},
	done: { title: "No finished tasks yet", description: "Tick a task to see it here." },
	all: { title: "No tasks", description: "Add the first one above." },
};

const GROUP_LABEL: Record<TaskGroup, string> = {
	overdue: "Overdue",
	today: "Today",
	upcoming: "Upcoming",
	none: "No date",
};
const GROUP_ORDER: TaskGroup[] = ["overdue", "today", "upcoming", "none"];

function applyFilter(tasks: Task[], filter: Filter) {
	switch (filter) {
		case "mine":
			return tasks.filter((task) => !task.done && task.assigneeId === SESSION_MEMBER_ID);
		case "due":
			return tasks.filter((task) => !task.done && ["overdue", "today"].includes(groupOf(task)));
		case "upcoming":
			return tasks.filter((task) => !task.done && groupOf(task) === "upcoming");
		case "done":
			return tasks.filter((task) => task.done);
		default:
			return tasks;
	}
}

const byDue = (a: Task, b: Task) =>
	(a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999") || a.title.localeCompare(b.title);

export function TasksPage() {
	const { data: tasks } = useSuspenseQuery(tasksQuery);
	const createTask = useCreateTask();
	const [filter, setFilter] = useState<Filter>("mine");
	const [draft, setDraft] = useState("");
	const [editing, setEditing] = useState<Task | undefined>();
	const [dialogOpen, setDialogOpen] = useState(false);

	const visible = useMemo(() => applyFilter(tasks, filter).sort(byDue), [tasks, filter]);
	const groups = useMemo(() => {
		if (filter === "done") return [{ id: "done", label: "Done", items: visible }];
		return GROUP_ORDER.map((group) => ({
			id: group,
			label: GROUP_LABEL[group],
			items: visible.filter((task) => groupOf(task) === group),
		})).filter((group) => group.items.length > 0);
	}, [visible, filter]);

	const openCount = tasks.filter(
		(task) => !task.done && task.assigneeId === SESSION_MEMBER_ID,
	).length;

	function quickAdd() {
		const title = draft.trim();
		if (!title) return;
		createTask.mutate({
			id: newTaskId(),
			title,
			dueDate: fromDateInput(todayInput()),
			assigneeId: SESSION_MEMBER_ID,
			priority: "normal",
			record: null,
		});
		setDraft("");
	}

	function openTask(task?: Task) {
		setEditing(task);
		setDialogOpen(true);
	}

	return (
		<PageBody className="max-w-4xl">
			<PageHeader
				title="Tasks"
				description={`${pluralize(openCount, "open task")} assigned to you`}
				actions={
					<Button onClick={() => openTask()}>
						<Plus /> New task
					</Button>
				}
			/>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					quickAdd();
				}}
				className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 shadow-soft focus-within:ring-3 focus-within:ring-ring/40"
			>
				<Plus className="size-4 text-muted-foreground" />
				<label htmlFor="quick-add-task" className="sr-only">
					Quick add a task due today
				</label>
				<Input
					id="quick-add-task"
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					placeholder="Add a task for today and press Enter"
					className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
					maxLength={120}
				/>
				<Button type="submit" size="sm" variant="ghost" disabled={!draft.trim()}>
					<CornerDownLeft /> Add
				</Button>
			</form>

			<Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
				<TabsList className="h-9 max-w-full overflow-x-auto">
					{FILTERS.map((item) => (
						<TabsTrigger key={item.id} value={item.id} className="px-3">
							{item.label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			{groups.length === 0 ? (
				<Empty className="rounded-2xl border border-dashed py-14">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<CheckCircle2 />
						</EmptyMedia>
						<EmptyTitle>{EMPTY[filter].title}</EmptyTitle>
						<EmptyDescription>{EMPTY[filter].description}</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="flex flex-col gap-5">
					{groups.map((group) => (
						<section key={group.id} aria-labelledby={`group-${group.id}`}>
							<h2
								id={`group-${group.id}`}
								className="mb-2 flex items-center gap-2 px-1 font-medium text-muted-foreground text-xs uppercase tracking-wide"
							>
								<span className={group.id === "overdue" ? "text-destructive" : undefined}>
									{group.label}
								</span>
								<span className="tabular-nums">{group.items.length}</span>
							</h2>
							<ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-soft">
								{group.items.map((task) => (
									<TaskRow key={task.id} task={task} onOpen={openTask} />
								))}
							</ul>
						</section>
					))}
				</div>
			)}

			<TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editing} />
		</PageBody>
	);
}
