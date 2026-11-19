import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/components/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/cn";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RadioCards } from "@/components/kit/radio-cards";
import { useCreateEvent } from "@/features/calendar/api/mutations";
import { EVENT_TINTS, type EventForm, eventFormSchema } from "@/features/calendar/schemas/event";

export function EventDialog({
	open,
	onOpenChange,
	date,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	date: string;
}) {
	const create = useCreateEvent();
	const form = useForm<EventForm>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: { title: "", date, start: "09:00", end: "10:00", tint: "blue" },
	});

	useEffect(() => {
		if (open) form.reset({ title: "", date, start: "09:00", end: "10:00", tint: "blue" });
	}, [open, date, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>New event</DialogTitle>
					<DialogDescription>Add something to the shared calendar.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						onSubmit={form.handleSubmit((values) => {
							create.mutate(values);
							onOpenChange(false);
						})}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Planning session" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="start"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Starts</FormLabel>
										<FormControl>
											<Input type="time" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="end"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ends</FormLabel>
										<FormControl>
											<Input type="time" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="tint"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Colour</FormLabel>
									<RadioCards<EventForm["tint"]>
										name="event-tint"
										label="Colour"
										value={field.value}
										onValueChange={field.onChange}
										options={Object.entries(EVENT_TINTS).map(([value, tint]) => ({
											value: value as EventForm["tint"],
											label: tint.label,
										}))}
										className="flex gap-2"
										itemClassName="rounded-full"
										renderItem={(option, checked) => (
											<span
												className={cn(
													"block size-7 rounded-full ring-offset-2 ring-offset-background",
													EVENT_TINTS[option.value].dot,
													checked && "ring-2 ring-foreground/60",
												)}
											/>
										)}
									/>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit">Add event</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
