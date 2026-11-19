import { queryOptions } from "@tanstack/react-query";
import { activitySchema } from "@/features/activities/schemas/activity";
import { db, delay } from "@/lib/sample-db/db";

// ▶ Real API: swap this queryFn for a fetch to your activity feed endpoint.
export const activitiesQuery = queryOptions({
	queryKey: ["activities"],
	queryFn: async () => {
		await delay();
		return activitySchema
			.array()
			.parse(db.activities)
			.sort((a, b) => b.at.localeCompare(a.at));
	},
});
