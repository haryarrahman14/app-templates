import { addDays, format } from "date-fns";
import { type CalendarEvent, eventSchema } from "@/features/calendar/schemas/event";
import { createCollection } from "@/lib/mock-db";

const day = (offset: number) => format(addDays(new Date(), offset), "yyyy-MM-dd");

export const eventsStore = createCollection<CalendarEvent>("events", eventSchema, () => [
	{ id: "e-1", title: "Weekly sync", date: day(0), start: "10:00", end: "10:30", tint: "yellow" },
	{
		id: "e-2",
		title: "Design critique",
		date: day(0),
		start: "14:00",
		end: "15:00",
		tint: "orange",
	},
	{
		id: "e-3",
		title: "Bakery kickoff call",
		date: day(1),
		start: "09:30",
		end: "10:15",
		tint: "green",
	},
	{ id: "e-4", title: "Friday demo", date: day(3), start: "16:00", end: "17:00", tint: "blue" },
	{ id: "e-5", title: "1:1 with Ines", date: day(5), start: "11:00", end: "11:30", tint: "teal" },
	{
		id: "e-6",
		title: "Studio trip planning",
		date: day(8),
		start: "13:00",
		end: "14:00",
		tint: "yellow",
	},
	{ id: "e-7", title: "Launch retro", date: day(-6), start: "15:00", end: "16:00", tint: "green" },
	{
		id: "e-8",
		title: "Interview: reading habits",
		date: day(-2),
		start: "10:00",
		end: "10:40",
		tint: "blue",
	},
]);
