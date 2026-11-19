import { queryOptions } from "@tanstack/react-query";
import { personSchema } from "@/features/people/schemas/person";
import { db, delay } from "@/lib/sample-db/db";

// ▶ Real API: swap this queryFn for a fetch to your people endpoint.
export const peopleQuery = queryOptions({
	queryKey: ["people"],
	queryFn: async () => {
		await delay();
		return personSchema.array().parse(db.people);
	},
});
