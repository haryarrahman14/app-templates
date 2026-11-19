import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { activitiesQuery } from "@/features/activities/api/queries";
import { notesQuery } from "@/features/notes/api/queries";
import { tasksQuery } from "@/features/tasks/api/queries";
import type { RecordRef } from "@/lib/records";

const keyOf = (ref: RecordRef) => `${ref.type}:${ref.id}`;

/** Activities, notes and tasks attached to a record or any of its related records. */
export function useRecordData(refs: RecordRef[]) {
	const activities = useQuery(activitiesQuery);
	const notes = useQuery(notesQuery);
	const tasks = useQuery(tasksQuery);
	const keys = useMemo(() => new Set(refs.map(keyOf)), [refs]);

	return useMemo(() => {
		const matches = (ref: RecordRef | null) => Boolean(ref && keys.has(keyOf(ref)));
		return {
			isLoading: activities.isPending || notes.isPending || tasks.isPending,
			activities: (activities.data ?? []).filter((item) => matches(item.record)),
			notes: (notes.data ?? []).filter((item) => matches(item.record)),
			tasks: (tasks.data ?? []).filter((item) => matches(item.record)),
		};
	}, [
		activities.data,
		notes.data,
		tasks.data,
		activities.isPending,
		notes.isPending,
		tasks.isPending,
		keys,
	]);
}
