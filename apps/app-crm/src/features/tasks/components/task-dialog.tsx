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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Spinner } from "@repo/ui/components/spinner";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { SelectField, TextField } from "@/components/kit/form-fields";
import {
	newTaskId,
	useCreateTask,
	useDeleteTask,
	useUpdateTask,
} from "@/features/tasks/api/mutations";
import { type Task, type TaskForm, taskFormSchema } from "@/features/tasks/schemas/task";
import {
	fromDateInput,
	refToValue,
	toDateInput,
	todayInput,
} from "@/features/tasks/utils/task-dates";
import { type RecordRef, recordRefSchema } from "@/lib/records";
import { SESSION_MEMBER_ID } from "@/lib/session";
import { useLookups } from "@/lib/use-lookups";

const NONE = "none";

const PRIORITIES = [
	{ value: "low", label: "Low" },
	{ value: "normal", label: "Normal" },
	{ value: "high", label: "High" },
];

function parseRef(value: string): RecordRef | null {
	if (!value) return null;
	const [type, id] = value.split(":");
	const parsed = recordRefSchema.safeParse({ type, id });
	return parsed.success ? parsed.data : null;
}

function defaultsFor(task?: Task, defaultRecord?: RecordRef | null): TaskForm {
	return {
		title: task?.title ?? "",
		dueDate: task ? toDateInput(task.dueDate) : todayInput(),
		assigneeId: task?.assigneeId ?? SESSION_MEMBER_ID,
		priority: task?.priority ?? "normal",
		record: refToValue(task ? task.record : (defaultRecord ?? null)),
	};
}

/** Create a task (no `task`) or edit one. */
export function TaskDialog({
	open,
	onOpenChange,
	task,
	defaultRecord,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task;
	defaultRecord?: RecordRef | null;
}) {
	const { members, companies, people, deals } = useLookups();
	const createTask = useCreateTask();
	const updateTask = useUpdateTask();
	const deleteTask = useDeleteTask();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [saving, setSaving] = useState(false);

	const form = useForm<TaskForm>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: defaultsFor(task, defaultRecord),
	});

	// Reset whenever the dialog opens (for a different task or record). Keyed on a string so a
	// parent re-render with an equal record does not wipe what is being typed.
	const recordKey = refToValue(defaultRecord ?? null);
	useEffect(() => {
		if (open) form.reset(defaultsFor(task, parseRef(recordKey)));
	}, [open, task, recordKey, form]);

	async function onSubmit(values: TaskForm) {
		const payload = {
			title: values.title,
			dueDate: fromDateInput(values.dueDate),
			assigneeId: values.assigneeId,
			priority: values.priority,
			record: parseRef(values.record),
		};
		setSaving(true);
		try {
			if (task) await updateTask.mutateAsync({ id: task.id, ...payload });
			else await createTask.mutateAsync({ id: newTaskId(), ...payload });
			onOpenChange(false);
		} catch {
			// The mutation already shows an error toast.
		} finally {
			setSaving(false);
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="rounded-2xl sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
						<DialogDescription>
							{task
								? "Change the details, then save."
								: "Add a to-do and, if it helps, link it to a record."}
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
							<TextField
								control={form.control}
								name="title"
								label="Title"
								placeholder="Follow up on the proposal"
								autoFocus
							/>
							<div className="grid gap-4 sm:grid-cols-2">
								<TextField control={form.control} name="dueDate" label="Due date" type="date" />
								<SelectField
									control={form.control}
									name="priority"
									label="Priority"
									options={PRIORITIES}
								/>
							</div>
							<SelectField
								control={form.control}
								name="assigneeId"
								label="Assignee"
								options={members.map((member) => ({ value: member.id, label: member.name }))}
							/>
							<FormField
								control={form.control}
								name="record"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Linked record</FormLabel>
										<Select
											value={field.value || NONE}
											onValueChange={(value) => field.onChange(value === NONE ? "" : value)}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="None" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="max-h-72">
												<SelectItem value={NONE}>None</SelectItem>
												<SelectGroup>
													<SelectLabel>Companies</SelectLabel>
													{companies.map((company) => (
														<SelectItem key={company.id} value={`company:${company.id}`}>
															{company.name}
														</SelectItem>
													))}
												</SelectGroup>
												<SelectGroup>
													<SelectLabel>People</SelectLabel>
													{people.map((person) => (
														<SelectItem key={person.id} value={`person:${person.id}`}>
															{person.firstName} {person.lastName}
														</SelectItem>
													))}
												</SelectGroup>
												<SelectGroup>
													<SelectLabel>Deals</SelectLabel>
													{deals.map((deal) => (
														<SelectItem key={deal.id} value={`deal:${deal.id}`}>
															{deal.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="gap-2 sm:justify-between">
								{task ? (
									<Button type="button" variant="destructive" onClick={() => setConfirmOpen(true)}>
										<Trash2 /> Delete
									</Button>
								) : (
									<span />
								)}
								<div className="flex gap-2">
									<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
										Cancel
									</Button>
									<Button type="submit" disabled={saving}>
										{saving ? <Spinner /> : null}
										{task ? "Save" : "Create task"}
									</Button>
								</div>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
			{task ? (
				<ConfirmDialog
					open={confirmOpen}
					onOpenChange={setConfirmOpen}
					title="Delete this task?"
					description={`“${task.title}” will be removed. This cannot be undone.`}
					onConfirm={() => {
						deleteTask.mutate(task.id);
						onOpenChange(false);
					}}
				/>
			) : null}
		</>
	);
}
