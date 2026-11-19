import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { peopleQuery } from "@/features/people/api/queries";
import { membersQuery } from "@/features/workspace/api/queries";
import type { RecordRef } from "@/lib/records";

/**
 * Id → name lookups across record types, for labels such as "Owner" or a task's linked record.
 * Reads the same cached queries the pages use, so it costs nothing extra once they are loaded.
 */
export function useLookups() {
	const members = useQuery(membersQuery).data;
	const companies = useQuery(companiesQuery).data;
	const people = useQuery(peopleQuery).data;
	const deals = useQuery(dealsQuery).data;

	const maps = useMemo(
		() => ({
			member: new Map((members ?? []).map((item) => [item.id, item])),
			company: new Map((companies ?? []).map((item) => [item.id, item])),
			person: new Map((people ?? []).map((item) => [item.id, item])),
			deal: new Map((deals ?? []).map((item) => [item.id, item])),
		}),
		[members, companies, people, deals],
	);

	const recordLabel = useCallback(
		(ref: RecordRef | null) => {
			if (!ref) return "";
			if (ref.type === "company") return maps.company.get(ref.id)?.name ?? "Unknown company";
			if (ref.type === "deal") return maps.deal.get(ref.id)?.name ?? "Unknown deal";
			const person = maps.person.get(ref.id);
			return person ? `${person.firstName} ${person.lastName}` : "Unknown person";
		},
		[maps],
	);

	const memberName = useCallback((id: string) => maps.member.get(id)?.name ?? "Unassigned", [maps]);

	return {
		...maps,
		members: members ?? [],
		companies: companies ?? [],
		people: people ?? [],
		deals: deals ?? [],
		recordLabel,
		memberName,
	};
}
