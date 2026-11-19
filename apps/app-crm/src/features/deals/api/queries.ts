import { queryOptions } from "@tanstack/react-query";
import { dealSchema } from "@/features/deals/schemas/deal";
import { db, delay } from "@/lib/sample-db/db";

// ▶ Real API: swap this queryFn for a fetch to your deals endpoint.
export const dealsQuery = queryOptions({
	queryKey: ["deals"],
	queryFn: async () => {
		await delay();
		return dealSchema.array().parse(db.deals);
	},
});
