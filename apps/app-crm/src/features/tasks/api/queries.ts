import { queryOptions } from "@tanstack/react-query";
import { taskSchema } from "@/features/tasks/schemas/task";
import { db, delay } from "@/lib/sample-db/db";

// ▶ Real API: swap this queryFn for a fetch to your tasks endpoint.
export const tasksQuery = queryOptions({
	queryKey: ["tasks"],
	queryFn: async () => {
		await delay();
		return taskSchema.array().parse(db.tasks);
	},
});
