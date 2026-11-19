import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsStore } from "@/features/settings/api/sample-store";
import type { NotificationPrefs, PlanId, Profile } from "@/features/settings/schemas/settings";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { account, resetAccount } from "@/lib/sample-data/account-store";
import { SAMPLE_AS_OF } from "@/lib/sample-data/calendar";

/* Every mutation here edits in-memory sample settings. Replace each mutationFn with your API call. */

function useSettingsMutation<TInput, TResult>(fn: (input: TInput) => TResult, delay = 400) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: TInput) => {
			await sampleDelay(delay);
			return fn(input);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.settings }),
	});
}

export const useUpdateProfile = () =>
	useSettingsMutation((profile: Profile) => {
		settingsStore.profile = { ...profile };
		return profile;
	});

export const useUpdateNotifications = () =>
	useSettingsMutation((patch: Partial<NotificationPrefs>) => {
		settingsStore.notifications = { ...settingsStore.notifications, ...patch };
		return settingsStore.notifications;
	}, 200);

/** Sample only: no password is stored or checked. */
export const useChangePassword = () =>
	useSettingsMutation((_input: { current: string; next: string }) => {
		settingsStore.security.passwordChangedAt = SAMPLE_AS_OF + 18 * 3_600_000;
		return true;
	}, 700);

/** 2FA stub: flips a flag. A real app would enrol an authenticator and verify a code. */
export const useSetTwoFactor = () =>
	useSettingsMutation((enabled: boolean) => {
		settingsStore.security.twoFactor = enabled;
		return enabled;
	});

export const useRevokeSession = () =>
	useSettingsMutation((id: string) => {
		settingsStore.security.sessions = settingsStore.security.sessions.filter(
			(s) => s.id !== id || s.current,
		);
		return id;
	});

export const useSetConnection = () =>
	useSettingsMutation(({ id, connected }: { id: string; connected: boolean }) => {
		const item = settingsStore.accounts.find((a) => a.id === id);
		if (!item) throw new Error("Account not found.");
		item.connected = connected;
		item.lastSync = connected ? SAMPLE_AS_OF + 18 * 3_600_000 : null;
		return item;
	}, 600);

export const useChangePlan = () =>
	useSettingsMutation((plan: PlanId) => {
		settingsStore.billing.plan = plan;
		return plan;
	}, 600);

export function useResetSampleData() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await sampleDelay(500);
			resetAccount();
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.account }),
	});
}

/** Snapshot of the sample account for "Export my data". */
export function exportSampleAccount() {
	return JSON.stringify(
		{
			exportedFrom: "Ledgerfinch template (sample data)",
			account: account(),
			settings: settingsStore,
		},
		null,
		2,
	);
}
