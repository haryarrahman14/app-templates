import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesQuery } from "@/features/companies/api/queries";
import type { Company, NewCompany } from "@/features/companies/schemas/company";
import { patchList } from "@/lib/optimistic";
import { db, delay, newId, nowIso, recordActivity } from "@/lib/sample-db/db";

const key = companiesQuery.queryKey;

function buildCompany(input: NewCompany): Company {
	return {
		id: newId("c"),
		name: input.name,
		domain: input.domain,
		industry: input.industry,
		size: input.size,
		status: input.status,
		city: input.city,
		country: "",
		ownerId: input.ownerId,
		arr: 0,
		description: "",
		createdAt: nowIso(),
		lastContactedAt: null,
	};
}

export function useCreateCompany() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: NewCompany | NewCompany[]) => {
			await delay(450);
			const created = (Array.isArray(input) ? input : [input]).map(buildCompany);
			db.companies.unshift(...created);
			for (const company of created) {
				recordActivity({
					type: "created",
					summary: "Created the company",
					record: { type: "company", id: company.id },
				});
			}
			return created;
		},
		onSuccess: (created) => {
			toast.success(
				created.length === 1 ? `${created[0]?.name} added` : `${created.length} companies imported`,
			);
		},
		onError: () => toast.error("Could not create the company"),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
	});
}

export function useUpdateCompany() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...patch }: Partial<Company> & { id: string }) => {
			await delay(300);
			const company = db.companies.find((item) => item.id === id);
			if (!company) throw new Error("Company not found");
			Object.assign(company, patch);
			return company;
		},
		onMutate: ({ id, ...patch }) =>
			patchList<Company>(queryClient, key, (items) =>
				items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
			),
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not save the change");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

/** Bulk update (e.g. assign owner) for selected rows. */
export function useUpdateCompanies() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ ids, patch }: { ids: string[]; patch: Partial<Company> }) => {
			await delay(400);
			for (const company of db.companies)
				if (ids.includes(company.id)) Object.assign(company, patch);
		},
		onMutate: ({ ids, patch }) =>
			patchList<Company>(queryClient, key, (items) =>
				items.map((item) => (ids.includes(item.id) ? { ...item, ...patch } : item)),
			),
		onSuccess: (_data, { ids }) => toast.success(`Updated ${ids.length} companies`),
		onError: (_error, _input, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useDeleteCompanies() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (ids: string[]) => {
			await delay(400);
			db.companies = db.companies.filter((item) => !ids.includes(item.id));
		},
		onMutate: (ids) =>
			patchList<Company>(queryClient, key, (items) =>
				items.filter((item) => !ids.includes(item.id)),
			),
		onSuccess: (_data, ids) =>
			toast.success(ids.length === 1 ? "Company deleted" : `${ids.length} companies deleted`),
		onError: (_error, _ids, rollback) => {
			rollback?.();
			toast.error("Could not delete");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
