import { queryOptions } from "@tanstack/react-query";
import { sharesStore } from "@/features/sharing/api/store";
import { shareSchema } from "@/features/sharing/schemas/share";
import { sampleDelay } from "@/lib/mock-db";

export const sharesKeys = { forTarget: (targetId: string) => ["shares", targetId] as const };

/** People a document (or the workspace) is shared with. Replace the queryFn with your API. */
export const sharesQuery = (targetId: string) =>
	queryOptions({
		queryKey: sharesKeys.forTarget(targetId),
		queryFn: async () => {
			await sampleDelay(180);
			return shareSchema.array().parse(sharesStore.all().filter((s) => s.targetId === targetId));
		},
	});
