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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Spinner } from "@repo/ui/components/spinner";
import { Textarea } from "@repo/ui/components/textarea";
import { useQuery } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { docsQuery } from "@/features/documents/api/queries";
import {
	taskPatchFromForm,
	useCreateTask,
	useDeleteTask,
	useUpdateTask,
} from "@/features/tasks/api/mutations";
import {
	PRIORITY_LABELS,
	prioritySchema,
	type Task,
	type TaskForm,
	taskFormSchema,
} from "@/features/tasks/schemas/task";

const NO_DOC = "__none";

const toForm = (task?: Task | null, dueDate = ""): TaskForm => ({
	title: task?.title ?? "",
	notes: task?.notes ?? "",
	dueDate: task?.dueDate ?? dueDate,
	priority: task?.priority ?? "medium",
	docId: task?.docId ?? "",
});

/** Create (no `task`) or edit a task. */
export function TaskDialog({
	open,
	onOpenChange,
	task,
	defaultDueDate,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | null;
	defaultDueDate?: string;
}) {
	const create = useCreateTask();
	const update = useUpdateTask();
	const remove = useDeleteTask();
	const docs = useQuery({ ...docsQuery, enabled: open });
	const form = useForm<TaskForm>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: toForm(task, defaultDueDate),
	});

	useEffect(() => {
		if (open) form.reset(toForm(task, defaultDueDate));
	}, [open, task, defaultDueDate, form]);

	const submit = (values: TaskForm) => {
		if (task) {
			update.mutate(
				{ id: task.id, patch: taskPatchFromForm(values) },
				{ onSuccess: () => onOpenChange(false) },
			);
		} else {
			create.mutate(values);
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
					<DialogDescription>Give it a date and link a document if it helps.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="What needs doing?" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-3">
							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Due date</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Priority</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{prioritySchema.options.map((p) => (
													<SelectItem key={p} value={p}>
														{PRIORITY_LABELS[p]}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="docId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Linked document</FormLabel>
									<Select
										value={field.value || NO_DOC}
										onValueChange={(value) => field.onChange(value === NO_DOC ? "" : value)}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={NO_DOC}>None</SelectItem>
											<SelectSeparator />
											{(docs.data ?? []).map((doc) => (
												<SelectItem key={doc.id} value={doc.id}>
													{doc.emoji} {doc.title || "Untitled"}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notes</FormLabel>
									<FormControl>
										<Textarea rows={3} placeholder="Optional" className="resize-none" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="sm:justify-between">
							{task ? (
								<Button
									type="button"
									variant="destructive"
									onClick={() => {
										remove.mutate(task);
										onOpenChange(false);
									}}
								>
									<Trash2Icon /> Delete
								</Button>
							) : (
								<span />
							)}
							<div className="flex gap-2">
								<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
									Cancel
								</Button>
								<Button type="submit" disabled={update.isPending}>
									{update.isPending ? <Spinner /> : null}
									{task ? "Save" : "Add task"}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
