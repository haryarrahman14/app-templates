import { queryOptions } from "@tanstack/react-query";
import { companySchema } from "@/features/companies/schemas/company";
import { db, delay } from "@/lib/sample-db/db";

// ▶ Real API: `queryFn: () => fetch("/api/companies").then((r) => r.json()).then(companySchema.array().parse)`.
export const companiesQuery = queryOptions({
	queryKey: ["companies"],
	queryFn: async () => {
		await delay();
		return companySchema.array().parse(db.companies);
	},
});
