import {
	type NotificationPrefs,
	notificationPrefsSchema,
	type Profile,
	profileSchema,
	type Workspace,
	workspaceSchema,
} from "@/features/settings/schemas/settings";
import { createCollection } from "@/lib/mock-db";

export const workspacesStore = createCollection<Workspace>("workspaces", workspaceSchema, () => [
	{ id: "w-fernhill", name: "Fernhill Studio", use: "team-docs", current: true, tint: "yellow" },
	{ id: "w-notes", name: "Personal notes", use: "personal-notes", current: false, tint: "green" },
]);

export const profileStore = createCollection<Profile>("profile", profileSchema, () => [
	{
		id: "me",
		jobTitle: "Design lead",
		bio: "I write things down so the team doesn't have to remember them.",
	},
]);

export const notificationPrefsStore = createCollection<NotificationPrefs>(
	"notification-prefs",
	notificationPrefsSchema,
	() => [
		{
			id: "me",
			mentions: true,
			comments: true,
			shares: true,
			taskReminders: true,
			weeklyDigest: false,
			productNews: false,
		},
	],
);
