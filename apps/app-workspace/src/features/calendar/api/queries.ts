import { queryOptions } from "@tanstack/react-query";
import { eventsStore } from "@/features/calendar/api/store";
import { eventSchema } from "@/features/calendar/schemas/event";
import { sampleDelay } from "@/lib/mock-db";

export const eventsKeys = { all: ["events"] as const };

/** All events. A real API would take a date range (e.g. the visible month) as part of the key. */
export const eventsQuery = queryOptions({
	queryKey: eventsKeys.all,
	queryFn: async () => {
		await sampleDelay();
		return eventSchema
			.array()
			.parse(eventsStore.all())
			.sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
	},
});
