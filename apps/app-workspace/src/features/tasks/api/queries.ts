import { queryOptions } from "@tanstack/react-query";
import { tasksStore } from "@/features/tasks/api/store";
import { taskSchema } from "@/features/tasks/schemas/task";
import { sampleDelay } from "@/lib/mock-db";

export const tasksKeys = { all: ["tasks"] as const };

/** All tasks. Replace the queryFn with your API; grouping happens in the UI. */
export const tasksQuery = queryOptions({
	queryKey: tasksKeys.all,
	queryFn: async () => {
		await sampleDelay();
		return taskSchema.array().parse(tasksStore.all());
	},
});
