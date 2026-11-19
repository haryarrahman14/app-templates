import { z } from "zod";

export const shareRoleSchema = z.enum(["view", "comment", "edit"]);
export type ShareRole = z.infer<typeof shareRoleSchema>;

export const shareSchema = z.object({
	id: z.string(),
	/** A document id, or "workspace" for the workspace-wide invite. */
	targetId: z.string(),
	email: z.email(),
	role: shareRoleSchema,
	pending: z.boolean(),
});
export type Share = z.infer<typeof shareSchema>;

export const inviteSchema = z.object({
	email: z.email("Enter a valid email address, like name@company.com."),
	role: shareRoleSchema,
});
export type InviteInput = z.infer<typeof inviteSchema>;

export const SHARE_ROLE_LABELS: Record<ShareRole, string> = {
	view: "Can view",
	comment: "Can comment",
	edit: "Can edit",
};
