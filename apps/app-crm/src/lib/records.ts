import { Building2, Handshake, type LucideIcon, User } from "lucide-react";
import { z } from "zod";
import { hrefLink } from "@/lib/href-link";

/** The record types of this CRM. Add one here when you add a record type (see README). */
export const recordTypeSchema = z.enum(["company", "person", "deal"]);
export type RecordType = z.infer<typeof recordTypeSchema>;

/** A pointer from a task, note, activity or list to a record. */
export const recordRefSchema = z.object({ type: recordTypeSchema, id: z.string() });
export type RecordRef = z.infer<typeof recordRefSchema>;

export const RECORD_TYPES: Record<
	RecordType,
	{ label: string; plural: string; icon: LucideIcon; tile: string; basePath: string }
> = {
	company: {
		label: "Company",
		plural: "Companies",
		icon: Building2,
		tile: "bg-cat-blue-soft text-cat-blue",
		basePath: "/companies",
	},
	person: {
		label: "Person",
		plural: "People",
		icon: User,
		tile: "bg-cat-orange-soft text-cat-orange",
		basePath: "/people",
	},
	deal: {
		label: "Deal",
		plural: "Deals",
		icon: Handshake,
		tile: "bg-cat-green-soft text-cat-green",
		basePath: "/deals",
	},
};

export function recordHref(ref: RecordRef) {
	if (ref.type === "deal") return `/deals?deal=${ref.id}`;
	return `${RECORD_TYPES[ref.type].basePath}/${ref.id}`;
}

/** Router Link options for a record: `<Link {...recordLink(ref)}>`. */
export function recordLink(ref: RecordRef) {
	return hrefLink(recordHref(ref));
}
