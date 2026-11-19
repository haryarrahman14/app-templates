import { z } from "zod";

export const memberRoleSchema = z.enum(["owner", "admin", "editor", "viewer"]);
export type MemberRole = z.infer<typeof memberRoleSchema>;

export const memberSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	email: z.email(),
	role: memberRoleSchema,
	tint: z.string(),
	status: z.enum(["active", "invited"]),
	lastActiveAt: z.string().nullable(),
});
export type Member = z.infer<typeof memberSchema>;

export const inviteMemberSchema = z.object({
	email: z.email("Enter a valid email address."),
	role: memberRoleSchema.exclude(["owner"]),
});
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const ROLE_LABELS: Record<MemberRole, string> = {
	owner: "Owner",
	admin: "Admin",
	editor: "Editor",
	viewer: "Viewer",
};
