import { z } from "zod";
import { normalizeTint } from "@/lib/palette";

const time = z.string().regex(/^\d{2}:\d{2}$/, "Use a time like 09:30.");

const eventTintSchema = z.enum(["blue", "teal", "green", "yellow", "orange"]);

export const eventSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	start: time,
	end: time,
	// Old palette ids saved in localStorage are mapped on read.
	tint: z.preprocess(normalizeTint, eventTintSchema),
});
export type CalendarEvent = z.infer<typeof eventSchema>;

export const eventFormSchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(1, "Give the event a title.")
			.max(80, "Keep it under 80 characters."),
		date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date."),
		start: time,
		end: time,
		tint: eventTintSchema,
	})
	.refine((value) => value.end > value.start, {
		message: "End time must be after the start.",
		path: ["end"],
	});
export type EventForm = z.infer<typeof eventFormSchema>;

export const EVENT_TINTS: Record<
	CalendarEvent["tint"],
	{ chip: string; dot: string; label: string }
> = {
	blue: { chip: "bg-cat-blue/14 text-cat-blue-ink", dot: "bg-cat-blue", label: "Blue" },
	teal: { chip: "bg-cat-teal/14 text-cat-teal-ink", dot: "bg-cat-teal", label: "Teal" },
	green: { chip: "bg-cat-green/14 text-cat-green-ink", dot: "bg-cat-green", label: "Green" },
	yellow: { chip: "bg-cat-yellow/16 text-cat-yellow-ink", dot: "bg-cat-yellow", label: "Yellow" },
	orange: { chip: "bg-cat-orange/14 text-cat-orange-ink", dot: "bg-cat-orange", label: "Orange" },
};
