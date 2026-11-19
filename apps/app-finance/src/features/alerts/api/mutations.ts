import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewAlertInput } from "@/features/alerts/schemas/alert";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { account } from "@/lib/sample-data/account-store";
import { SAMPLE_AS_OF } from "@/lib/sample-data/calendar";

function useAlertMutation<TInput, TResult>(fn: (input: TInput) => TResult) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: TInput) => {
			await sampleDelay(260);
			return fn(input);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: queryRoots.account }),
	});
}

export function useCreateAlert() {
	return useAlertMutation((input: NewAlertInput) => {
		const s = account();
		s.nextAlertId += 1;
		const alert = { id: `al-${s.nextAlertId}`, ...input, enabled: true, createdAt: SAMPLE_AS_OF };
		s.alerts.unshift(alert);
		return alert;
	});
}

export function useToggleAlert() {
	return useAlertMutation(({ id, enabled }: { id: string; enabled: boolean }) => {
		const alert = account().alerts.find((a) => a.id === id);
		if (!alert) throw new Error("Alert not found.");
		alert.enabled = enabled;
		return alert;
	});
}

export function useDeleteAlert() {
	return useAlertMutation(({ id }: { id: string }) => {
		const s = account();
		s.alerts = s.alerts.filter((a) => a.id !== id);
		return id;
	});
}
