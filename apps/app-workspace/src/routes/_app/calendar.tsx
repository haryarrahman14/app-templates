import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/features/calendar/components/calendar-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/calendar")({
	head: () => pageTitle("Calendar"),
	component: CalendarPage,
});
