import { queryOptions } from "@tanstack/react-query";
import { meetingSchema } from "@/features/home/schemas/meeting";
import { db, delay } from "@/lib/sample-db/db";

// ▶ Real API: read today's meetings from your calendar integration.
export const todayMeetingsQuery = queryOptions({
	queryKey: ["meetings", "today"],
	queryFn: async () => {
		await delay();
		return meetingSchema
			.array()
			.parse(db.meetings)
			.sort((a, b) => a.start.localeCompare(b.start));
	},
});
