import { type Member, memberSchema } from "@/features/members/schemas/member";
import { createCollection, relativeIso } from "@/lib/mock-db";
import { SAMPLE_USER_ID } from "@/lib/session";

/** Sample people for the fictional "Fernhill Studio" workspace. */
export const membersStore = createCollection<Member>("members", memberSchema, () => [
	{
		id: SAMPLE_USER_ID,
		name: "You",
		email: "mara.okoye@fernhill.example",
		role: "owner",
		tint: "yellow",
		status: "active",
		lastActiveAt: relativeIso(0),
	},
	{
		id: "u-ines",
		name: "Ines Calloway",
		email: "ines@fernhill.example",
		role: "admin",
		tint: "orange",
		status: "active",
		lastActiveAt: relativeIso(0, -2),
	},
	{
		id: "u-tomas",
		name: "Tomas Reyhani",
		email: "tomas@fernhill.example",
		role: "editor",
		tint: "green",
		status: "active",
		lastActiveAt: relativeIso(-1),
	},
	{
		id: "u-wren",
		name: "Wren Adebayo",
		email: "wren@fernhill.example",
		role: "editor",
		tint: "blue",
		status: "active",
		lastActiveAt: relativeIso(-3),
	},
	{
		id: "u-kasimir",
		name: "Kasimir Lund",
		email: "kasimir@fernhill.example",
		role: "viewer",
		tint: "teal",
		status: "active",
		lastActiveAt: relativeIso(-9),
	},
	{
		id: "u-odette",
		name: "Odette Marsh",
		email: "odette@fernhill.example",
		role: "viewer",
		tint: "gray",
		status: "invited",
		lastActiveAt: null,
	},
]);
