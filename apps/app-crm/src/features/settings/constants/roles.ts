import type { MemberRole } from "@/features/workspace/schemas/workspace";

export const ROLE_OPTIONS: { value: MemberRole; label: string; hint: string }[] = [
	{ value: "owner", label: "Owner", hint: "Everything, including billing" },
	{ value: "admin", label: "Admin", hint: "Manage members and settings" },
	{ value: "member", label: "Member", hint: "Create and edit records" },
	{ value: "guest", label: "Guest", hint: "View shared records only" },
];
