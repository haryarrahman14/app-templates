import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsKeys } from "@/features/calendar/api/queries";
import { eventsStore } from "@/features/calendar/api/store";
import type { CalendarEvent, EventForm } from "@/features/calendar/schemas/event";
import { newId, sampleDelay } from "@/lib/mock-db";

export function useCreateEvent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (values: EventForm) => {
			await sampleDelay();
			return eventsStore.insert({ id: newId("e"), ...values });
		},
		onMutate: async (values) => {
			await queryClient.cancelQueries({ queryKey: eventsKeys.all });
			const previous = queryClient.getQueryData<CalendarEvent[]>(eventsKeys.all);
			queryClient.setQueryData<CalendarEvent[]>(eventsKeys.all, (old) => [
				...(old ?? []),
				{ id: "optimistic", ...values },
			]);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(eventsKeys.all, context?.previous);
			toast.error("Could not add the event.");
		},
		onSuccess: (event) => toast.success(`Added “${event.title}”`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: eventsKeys.all }),
	});
}

export function useDeleteEvent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (event: CalendarEvent) => {
			await sampleDelay(200);
			eventsStore.remove(event.id);
			return event;
		},
		onMutate: async (event) => {
			await queryClient.cancelQueries({ queryKey: eventsKeys.all });
			const previous = queryClient.getQueryData<CalendarEvent[]>(eventsKeys.all);
			queryClient.setQueryData<CalendarEvent[]>(eventsKeys.all, (old) =>
				old?.filter((e) => e.id !== event.id),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(eventsKeys.all, context?.previous);
			toast.error("Could not delete the event.");
		},
		onSuccess: (event) => toast.success(`Deleted “${event.title}”`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: eventsKeys.all }),
	});
}
