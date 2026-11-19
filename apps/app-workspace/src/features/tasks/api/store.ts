import { type Task, taskSchema } from "@/features/tasks/schemas/task";
import { dayFromToday } from "@/features/tasks/utils/days";
import { createCollection, relativeIso } from "@/lib/mock-db";

const task = (t: Omit<Task, "notes" | "createdAt"> & { notes?: string }): Task => ({
	notes: "",
	createdAt: relativeIso(-3),
	...t,
});

export const tasksStore = createCollection<Task>("tasks", taskSchema, () => [
	task({
		id: "k-1",
		title: "Send the launch email draft to the team",
		dueDate: dayFromToday(0),
		priority: "high",
		done: false,
		docId: "d-sync",
	}),
	task({
		id: "k-2",
		title: "Review Wren's onboarding screens",
		dueDate: dayFromToday(0),
		priority: "medium",
		done: false,
		docId: null,
		notes: "Focus on the empty states.",
	}),
	task({
		id: "k-3",
		title: "Collect everyone's dietary notes",
		dueDate: dayFromToday(-1),
		priority: "low",
		done: false,
		docId: "d-lisbon",
	}),
	task({
		id: "k-4",
		title: "Write help article: sharing documents",
		dueDate: dayFromToday(2),
		priority: "medium",
		done: false,
		docId: "d-roadmap",
	}),
	task({
		id: "k-5",
		title: "Plan Friday demo agenda",
		dueDate: dayFromToday(3),
		priority: "low",
		done: false,
		docId: null,
	}),
	task({
		id: "k-6",
		title: "Bakery menu site: first sketches",
		dueDate: dayFromToday(6),
		priority: "high",
		done: false,
		docId: "d-brief",
	}),
	task({
		id: "k-7",
		title: "Tidy the handbook folder",
		dueDate: null,
		priority: "low",
		done: false,
		docId: null,
	}),
	task({
		id: "k-8",
		title: "Book the room for Friday's demo",
		dueDate: dayFromToday(-1),
		priority: "medium",
		done: true,
		docId: "d-sync",
	}),
	task({
		id: "k-9",
		title: "Book train tickets",
		dueDate: dayFromToday(-4),
		priority: "medium",
		done: true,
		docId: "d-lisbon",
	}),
]);
