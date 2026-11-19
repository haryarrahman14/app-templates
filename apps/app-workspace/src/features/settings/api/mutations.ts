import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "@/features/settings/api/queries";
import {
	notificationPrefsStore,
	profileStore,
	workspacesStore,
} from "@/features/settings/api/store";
import type {
	NotificationPrefs,
	ProfileForm,
	Workspace,
	WorkspaceUse,
} from "@/features/settings/schemas/settings";
import { resetSampleData, sampleDelay } from "@/lib/mock-db";
import { endSession, updateSessionUser } from "@/lib/session";

export function useUpdateWorkspace() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (patch: { name?: string; use?: WorkspaceUse }) => {
			await sampleDelay(300);
			const current = workspacesStore.all().find((w) => w.current);
			if (!current) throw new Error("No workspace selected");
			return workspacesStore.update(current.id, patch);
		},
		onError: () => toast.error("Could not update the workspace."),
		onSettled: () => queryClient.invalidateQueries({ queryKey: settingsKeys.workspaces }),
	});
}

export function useSwitchWorkspace() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await sampleDelay(200);
			for (const workspace of workspacesStore.all()) {
				workspacesStore.update(workspace.id, { current: workspace.id === id });
			}
			return workspacesStore.find(id);
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: settingsKeys.workspaces });
			queryClient.setQueryData<Workspace[]>(settingsKeys.workspaces, (old) =>
				old?.map((w) => ({ ...w, current: w.id === id })),
			);
		},
		onSuccess: (workspace) => toast.success(`Switched to ${workspace?.name ?? "workspace"}`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: settingsKeys.workspaces }),
	});
}

/** Name and email live in the session (PLUG REAL AUTH HERE); job title and bio in the profile. */
export function useUpdateProfile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (values: ProfileForm) => {
			await sampleDelay(400);
			await updateSessionUser({ name: values.name, email: values.email });
			return profileStore.update("me", { jobTitle: values.jobTitle, bio: values.bio });
		},
		onSuccess: () => toast.success("Profile saved"),
		onError: () => toast.error("Could not save your profile."),
		onSettled: () => queryClient.invalidateQueries({ queryKey: settingsKeys.profile }),
	});
}

export function useUpdateNotificationPrefs() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (patch: Partial<Omit<NotificationPrefs, "id">>) => {
			await sampleDelay(200);
			return notificationPrefsStore.update("me", patch);
		},
		onMutate: async (patch) => {
			await queryClient.cancelQueries({ queryKey: settingsKeys.notifications });
			const previous = queryClient.getQueryData<NotificationPrefs>(settingsKeys.notifications);
			queryClient.setQueryData<NotificationPrefs>(settingsKeys.notifications, (old) =>
				old ? { ...old, ...patch } : old,
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(settingsKeys.notifications, context?.previous);
			toast.error("Could not save that preference.");
		},
		onSuccess: () => toast.success("Notification preferences saved"),
		onSettled: () => queryClient.invalidateQueries({ queryKey: settingsKeys.notifications }),
	});
}

/** Sample only: deletes every sample collection and signs out. Wire it to your API. */
export function useDeleteWorkspace() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await sampleDelay(600);
			resetSampleData();
			await endSession();
		},
		onSuccess: () => {
			queryClient.clear();
			toast.success("Workspace deleted. Sample data was reset.");
			window.location.assign("/sign-in");
		},
		onError: () => toast.error("Could not delete the workspace."),
	});
}
