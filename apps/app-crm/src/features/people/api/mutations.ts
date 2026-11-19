import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { peopleQuery } from "@/features/people/api/queries";
import { fullName, type NewPerson, type Person } from "@/features/people/schemas/person";
import { patchList } from "@/lib/optimistic";
import { db, delay, newId, nowIso, recordActivity } from "@/lib/sample-db/db";

const key = peopleQuery.queryKey;

export function useCreatePerson() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: NewPerson) => {
			await delay(450);
			const company = db.companies.find((item) => item.id === input.companyId);
			const person: Person = {
				id: newId("p"),
				firstName: input.firstName,
				lastName: input.lastName,
				email: input.email,
				phone: "",
				title: input.title,
				companyId: input.companyId || null,
				ownerId: input.ownerId,
				stage: input.stage,
				city: company?.city ?? "",
				createdAt: nowIso(),
				lastContactedAt: null,
			};
			db.people.unshift(person);
			recordActivity({
				type: "created",
				summary: "Added the person",
				record: { type: "person", id: person.id },
			});
			return person;
		},
		onSuccess: (person) => toast.success(`${fullName(person)} added`),
		onError: () => toast.error("Could not add the person"),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
	});
}

export function useUpdatePerson() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...patch }: Partial<Person> & { id: string }) => {
			await delay(300);
			const person = db.people.find((item) => item.id === id);
			if (!person) throw new Error("Person not found");
			Object.assign(person, patch);
		},
		onMutate: ({ id, ...patch }) =>
			patchList<Person>(queryClient, key, (items) =>
				items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
			),
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not save the change");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useUpdatePeople() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ ids, patch }: { ids: string[]; patch: Partial<Person> }) => {
			await delay(400);
			for (const person of db.people) if (ids.includes(person.id)) Object.assign(person, patch);
		},
		onMutate: ({ ids, patch }) =>
			patchList<Person>(queryClient, key, (items) =>
				items.map((item) => (ids.includes(item.id) ? { ...item, ...patch } : item)),
			),
		onSuccess: (_data, { ids }) => toast.success(`Updated ${ids.length} people`),
		onError: (_error, _input, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useDeletePeople() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (ids: string[]) => {
			await delay(400);
			db.people = db.people.filter((item) => !ids.includes(item.id));
		},
		onMutate: (ids) =>
			patchList<Person>(queryClient, key, (items) =>
				items.filter((item) => !ids.includes(item.id)),
			),
		onSuccess: (_data, ids) =>
			toast.success(ids.length === 1 ? "Person deleted" : `${ids.length} people deleted`),
		onError: (_error, _ids, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
