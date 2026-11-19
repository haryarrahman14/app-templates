import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksKeys } from "@/features/tasks/api/queries";
import { tasksStore } from "@/features/tasks/api/store";
import type { Task, TaskForm } from "@/features/tasks/schemas/task";
import { newId, sampleDelay } from "@/lib/mock-db";

const fromForm = (values: TaskForm) => ({
	title: values.title,
	notes: values.notes,
	dueDate: values.dueDate || null,
	priority: values.priority,
	docId: values.docId || null,
});

export function useCreateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (values: TaskForm) => {
			await sampleDelay();
			const task: Task = {
				id: newId("k"),
				done: false,
				createdAt: new Date().toISOString(),
				...fromForm(values),
			};
			return tasksStore.insert(task);
		},
		onMutate: async (values) => {
			await queryClient.cancelQueries({ queryKey: tasksKeys.all });
			const previous = queryClient.getQueryData<Task[]>(tasksKeys.all);
			queryClient.setQueryData<Task[]>(tasksKeys.all, (old) => [
				{ id: "optimistic", done: false, createdAt: new Date().toISOString(), ...fromForm(values) },
				...(old ?? []),
			]);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(tasksKeys.all, context?.previous);
			toast.error("Could not add the task.");
		},
		onSuccess: (task) => toast.success(`Added “${task.title}”`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKeys.all }),
	});
}

export function useUpdateTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, patch }: { id: string; patch: Partial<Omit<Task, "id">> }) => {
			await sampleDelay(200);
			return tasksStore.update(id, patch);
		},
		onMutate: async ({ id, patch }) => {
			await queryClient.cancelQueries({ queryKey: tasksKeys.all });
			const previous = queryClient.getQueryData<Task[]>(tasksKeys.all);
			queryClient.setQueryData<Task[]>(tasksKeys.all, (old) =>
				old?.map((t) => (t.id === id ? { ...t, ...patch } : t)),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(tasksKeys.all, context?.previous);
			toast.error("Could not update the task.");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKeys.all }),
	});
}

export const taskPatchFromForm = fromForm;

export function useDeleteTask() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (task: Task) => {
			await sampleDelay(200);
			tasksStore.remove(task.id);
			return task;
		},
		onMutate: async (task) => {
			await queryClient.cancelQueries({ queryKey: tasksKeys.all });
			const previous = queryClient.getQueryData<Task[]>(tasksKeys.all);
			queryClient.setQueryData<Task[]>(tasksKeys.all, (old) =>
				old?.filter((t) => t.id !== task.id),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(tasksKeys.all, context?.previous);
			toast.error("Could not delete the task.");
		},
		onSuccess: (task) => toast.success(`Deleted “${task.title}”`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: tasksKeys.all }),
	});
}
