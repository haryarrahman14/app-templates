import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksQuery } from "@/features/tasks/api/queries";
import type { Task } from "@/features/tasks/schemas/task";
import { patchList } from "@/lib/optimistic";
import { db, delay, newId, nowIso, recordActivity } from "@/lib/sample-db/db";

const key = tasksQuery.queryKey;

export type TaskInput = Pick<Task, "title" | "dueDate" | "assigneeId" | "priority" | "record">;

export function useCreateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: TaskInput & { id: string }) => {
			await delay(350);
			const task: Task = { ...input, done: false, createdAt: nowIso() };
			db.tasks.unshift(task);
			return task;
		},
		// The id is made on the client so the optimistic row and the saved row match.
		onMutate: (input) =>
			patchList<Task>(queryClient, key, (items) => [
				{ ...input, done: false, createdAt: nowIso() },
				...items,
			]),
		onSuccess: () => toast.success("Task added"),
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not add the task");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export const newTaskId = () => newId("t");

export function useUpdateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...patch }: Partial<Task> & { id: string }) => {
			await delay(250);
			const task = db.tasks.find((item) => item.id === id);
			if (!task) throw new Error("Task not found");
			const completed = patch.done === true && !task.done;
			Object.assign(task, patch);
			if (completed && task.record) {
				recordActivity({ type: "task", summary: `Completed “${task.title}”`, record: task.record });
			}
			return task;
		},
		onMutate: ({ id, ...patch }) =>
			patchList<Task>(queryClient, key, (items) =>
				items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
			),
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not update the task");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
	});
}

export function useDeleteTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await delay(250);
			db.tasks = db.tasks.filter((item) => item.id !== id);
		},
		onMutate: (id) =>
			patchList<Task>(queryClient, key, (items) => items.filter((t) => t.id !== id)),
		onSuccess: () => toast.success("Task deleted"),
		onError: (_error, _id, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
