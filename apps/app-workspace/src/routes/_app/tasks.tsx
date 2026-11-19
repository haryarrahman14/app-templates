import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/features/tasks/components/tasks-page";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/tasks")({
	head: () => pageTitle("Tasks"),
	component: TasksPage,
});
