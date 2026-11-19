import { type Share, shareSchema } from "@/features/sharing/schemas/share";
import { createCollection } from "@/lib/mock-db";

export const sharesStore = createCollection<Share>("shares", shareSchema, () => [
	{
		id: "s-1",
		targetId: "d-welcome",
		email: "ines@fernhill.example",
		role: "edit",
		pending: false,
	},
	{
		id: "s-2",
		targetId: "d-welcome",
		email: "tomas@fernhill.example",
		role: "comment",
		pending: false,
	},
	{
		id: "s-3",
		targetId: "d-roadmap",
		email: "wren@fernhill.example",
		role: "edit",
		pending: false,
	},
	{
		id: "s-4",
		targetId: "workspace",
		email: "kasimir@fernhill.example",
		role: "view",
		pending: false,
	},
]);
