import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesQuery } from "@/features/activities/api/queries";
import type { Activity, LogActivity } from "@/features/activities/schemas/activity";
import { patchList } from "@/lib/optimistic";
import type { RecordRef } from "@/lib/records";
import { db, delay, newId, nowIso } from "@/lib/sample-db/db";
import { SESSION_MEMBER_ID } from "@/lib/session";

const key = activitiesQuery.queryKey;

/** Log a call, meeting or email against a record (and, for people, their company too). */
export function useLogActivity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: LogActivity & { record: RecordRef; silent?: boolean }) => {
			await delay(300);
			const activity: Activity = {
				id: newId("a"),
				type: input.type,
				summary: input.summary,
				detail: input.detail,
				record: input.record,
				actorId: SESSION_MEMBER_ID,
				at: nowIso(),
			};
			db.activities.unshift(activity);
			const table = input.record.type === "company" ? db.companies : db.people;
			const target = table.find((item) => item.id === input.record.id);
			if (target) target.lastContactedAt = activity.at;
			return activity;
		},
		onMutate: (input) =>
			patchList<Activity>(queryClient, key, (items) => [
				{
					id: "optimistic",
					type: input.type,
					summary: input.summary,
					detail: input.detail,
					record: input.record,
					actorId: SESSION_MEMBER_ID,
					at: nowIso(),
				},
				...items,
			]),
		onSuccess: (_activity, input) => {
			if (!input.silent) toast.success("Activity logged");
		},
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not log the activity");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
			queryClient.invalidateQueries({ queryKey: ["companies"] });
			queryClient.invalidateQueries({ queryKey: ["people"] });
		},
	});
}
