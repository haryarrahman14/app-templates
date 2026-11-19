import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	apiKeysQuery,
	customFieldsQuery,
	notificationPrefsQuery,
	settingsStore,
	workspaceSettingsQuery,
} from "@/features/settings/api/queries";
import type {
	ApiKey,
	CustomField,
	NewField,
	NotificationPrefs,
	Profile,
	WorkspaceSettings,
} from "@/features/settings/schemas/settings";
import { patchList } from "@/lib/optimistic";
import { db, delay, newId, nowIso } from "@/lib/sample-db/db";
import { SESSION_MEMBER_ID } from "@/lib/session";

export function useSaveProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (profile: Profile) => {
			await delay(500);
			const me = db.members.find((member) => member.id === SESSION_MEMBER_ID);
			if (me) Object.assign(me, profile);
		},
		onSuccess: () => toast.success("Profile saved"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["workspace"] }),
	});
}

export function useSaveWorkspaceSettings() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: WorkspaceSettings) => {
			await delay(500);
			settingsStore.workspace = input;
		},
		onSuccess: () => toast.success("Workspace settings saved"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: workspaceSettingsQuery.queryKey }),
	});
}

export function useCreateField() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: NewField) => {
			await delay(400);
			const field: CustomField = {
				id: newId("f"),
				label: input.label,
				type: input.type,
				recordType: input.recordType,
				required: input.required,
				options:
					input.type === "select"
						? input.options
								.split(",")
								.map((option) => option.trim())
								.filter(Boolean)
						: [],
			};
			settingsStore.fields.push(field);
			return field;
		},
		onSuccess: (field) => toast.success(`Field “${field.label}” added`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: customFieldsQuery.queryKey }),
	});
}

export function useDeleteField() {
	const queryClient = useQueryClient();
	const key = customFieldsQuery.queryKey;
	return useMutation({
		mutationFn: async (id: string) => {
			await delay(250);
			settingsStore.fields = settingsStore.fields.filter((field) => field.id !== id);
		},
		onMutate: (id) =>
			patchList<CustomField>(queryClient, key, (items) => items.filter((f) => f.id !== id)),
		onSuccess: () => toast.success("Field removed"),
		onError: (_error, _id, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useSetNotificationPref() {
	const queryClient = useQueryClient();
	const key = notificationPrefsQuery.queryKey;
	return useMutation({
		mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
			await delay(200);
			settingsStore.notifications[id] = value;
		},
		onMutate: async ({ id, value }) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<NotificationPrefs>(key);
			if (previous) queryClient.setQueryData<NotificationPrefs>(key, { ...previous, [id]: value });
			return () => queryClient.setQueryData(key, previous);
		},
		onError: (_error, _input, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

let keyCounter = 0;
/** A sample secret, made from a counter so it is predictable. A real API returns the secret once. */
function sampleSecret() {
	keyCounter += 1;
	const body = (keyCounter * 7919 + 104729).toString(16).padStart(8, "0");
	return `tw_sample_${body}${"x".repeat(24 - body.length)}${keyCounter}`;
}

export function useCreateApiKey() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (name: string) => {
			await delay(500);
			const secret = sampleSecret();
			const key: ApiKey = {
				id: newId("k"),
				name,
				prefix: secret.slice(0, 14),
				createdAt: nowIso(),
				lastUsedAt: null,
			};
			settingsStore.apiKeys.unshift(key);
			return { key, secret };
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: apiKeysQuery.queryKey }),
	});
}

export function useRevokeApiKey() {
	const queryClient = useQueryClient();
	const key = apiKeysQuery.queryKey;
	return useMutation({
		mutationFn: async (id: string) => {
			await delay(300);
			settingsStore.apiKeys = settingsStore.apiKeys.filter((item) => item.id !== id);
		},
		onMutate: (id) =>
			patchList<ApiKey>(queryClient, key, (items) => items.filter((k) => k.id !== id)),
		onSuccess: () => toast.success("Key revoked"),
		onError: (_error, _id, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
