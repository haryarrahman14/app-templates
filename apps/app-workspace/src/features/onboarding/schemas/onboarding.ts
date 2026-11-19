import { z } from "zod";
import { workspaceNameSchema, workspaceUseSchema } from "@/features/settings/schemas/settings";

export const nameStepSchema = z.object({ name: workspaceNameSchema });
export const useStepSchema = z.object({ use: workspaceUseSchema });
export const inviteStepSchema = z.object({
	emails: z.array(
		z.object({
			value: z.union([z.literal(""), z.email("That doesn't look like an email address.")]),
		}),
	),
});
export type InviteStep = z.infer<typeof inviteStepSchema>;
