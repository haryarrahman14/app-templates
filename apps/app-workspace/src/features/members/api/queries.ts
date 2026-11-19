import { queryOptions } from "@tanstack/react-query";
import { membersStore } from "@/features/members/api/store";
import { memberSchema } from "@/features/members/schemas/member";
import { sampleDelay } from "@/lib/mock-db";

/** Swap these queryFns for real API calls; the rest of the app only sees the query keys and shapes. */
export const membersKeys = { all: ["members"] as const };

export const membersQuery = queryOptions({
	queryKey: membersKeys.all,
	queryFn: async () => {
		await sampleDelay();
		const order = { owner: 0, admin: 1, editor: 2, viewer: 3 } as const;
		// Active people first (by role), pending invites last.
		return memberSchema
			.array()
			.parse(membersStore.all())
			.sort(
				(a, b) =>
					Number(a.status === "invited") - Number(b.status === "invited") ||
					order[a.role] - order[b.role],
			);
	},
});
