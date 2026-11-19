import { Checkbox } from "@repo/ui/components/checkbox";
import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Flag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { InitialsAvatar } from "@/components/kit/initials-avatar";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { useUpdateTask } from "@/features/tasks/api/mutations";
import type { Task } from "@/features/tasks/schemas/task";
import { isOverdue } from "@/features/tasks/utils/task-dates";
import { formatDay } from "@/lib/format";
import { recordLink } from "@/lib/records";
import { useLookups } from "@/lib/use-lookups";

export function TaskRow({ task, onOpen }: { task: Task; onOpen: (task: Task) => void }) {
	const { recordLabel, memberName } = useLookups();
	const updateTask = useUpdateTask();
	const reduceMotion = useReducedMotion();
	const overdue = isOverdue(task);
	const assignee = memberName(task.assigneeId);

	return (
		<li className="group flex min-h-14 items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40">
			<motion.span
				key={String(task.done)}
				initial={reduceMotion || !task.done ? false : { scale: 0.7 }}
				animate={{ scale: 1 }}
				transition={{ type: "spring", stiffness: 500, damping: 18 }}
				className="flex"
			>
				<Checkbox
					checked={task.done}
					onCheckedChange={(checked) => updateTask.mutate({ id: task.id, done: checked === true })}
					aria-label={
						task.done ? `Mark “${task.title}” as not done` : `Mark “${task.title}” as done`
					}
					className="size-[18px] rounded-full"
				/>
			</motion.span>
			<button
				type="button"
				onClick={() => onOpen(task)}
				className="flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
			>
				<span
					className={cn(
						"max-w-full truncate text-sm transition-colors",
						task.done && "text-muted-foreground line-through",
					)}
				>
					{task.title}
				</span>
				<span className="flex items-center gap-3 text-muted-foreground text-xs">
					<span
						className={cn(
							"inline-flex items-center gap-1",
							overdue && "font-medium text-destructive",
						)}
					>
						<CalendarDays className="size-3" />
						{task.dueDate ? formatDay(task.dueDate) : "No date"}
					</span>
					{task.priority !== "normal" ? (
						<span
							className={cn(
								"inline-flex items-center gap-1",
								task.priority === "high" ? "text-cat-orange-ink" : "",
							)}
						>
							<Flag className="size-3" />
							{task.priority === "high" ? "High" : "Low"}
						</span>
					) : null}
				</span>
			</button>
			{task.record ? (
				<Link
					{...recordLink(task.record)}
					className="hidden max-w-48 items-center gap-1.5 rounded-full border bg-background px-2 py-0.5 text-xs outline-none transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 sm:inline-flex"
				>
					<RecordGlyph type={task.record.type} size="xs" />
					<span className="truncate">{recordLabel(task.record)}</span>
				</Link>
			) : null}
			<span title={assignee}>
				<InitialsAvatar name={assignee} size="sm" />
				<span className="sr-only">Assigned to {assignee}</span>
			</span>
		</li>
	);
}
