import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Form } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";
import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import { addDays, setHours, startOfHour } from "date-fns";
import {
	CalendarDays,
	FileText,
	Handshake,
	Mail,
	Paperclip,
	Phone,
	Plus,
	Upload,
} from "lucide-react";
import { type ReactNode, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityFeed } from "@/components/kit/activity-feed";
import { SelectField, TextareaField, TextField } from "@/components/kit/form-fields";
import { useLogActivity } from "@/features/activities/api/mutations";
import { type LogActivity, logActivitySchema } from "@/features/activities/schemas/activity";
import { DEAL_STAGE_META, type Deal } from "@/features/deals/schemas/deal";
import { useCreateNote } from "@/features/notes/api/mutations";
import { useRecordData } from "@/features/records/hooks/use-record-data";
import { newTaskId, useCreateTask, useUpdateTask } from "@/features/tasks/api/mutations";
import { formatAgo, formatDay, formatMoney } from "@/lib/format";
import type { RecordRef } from "@/lib/records";
import { recordLink } from "@/lib/records";
import { SESSION_MEMBER_ID } from "@/lib/session";
import { openComposer, openCreate } from "@/lib/ui-state";
import { useLookups } from "@/lib/use-lookups";

function Section({
	title,
	action,
	children,
}: {
	title: string;
	action?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className="grid min-w-0 gap-3 rounded-2xl border bg-card p-5 shadow-soft">
			<div className="flex items-center justify-between gap-2">
				<h2 className="font-semibold text-base">{title}</h2>
				{action}
			</div>
			{children}
		</section>
	);
}

function Muted({ children }: { children: ReactNode }) {
	return <p className="py-4 text-center text-muted-foreground text-sm">{children}</p>;
}

const ACTIVITY_TYPES = [
	{ value: "call", label: "Call" },
	{ value: "meeting", label: "Meeting" },
	{ value: "email", label: "Email" },
];

function LogActivityForm({ record }: { record: RecordRef }) {
	const log = useLogActivity();
	const form = useForm<LogActivity>({
		resolver: zodResolver(logActivitySchema),
		defaultValues: { type: "call", summary: "", detail: "" },
	});
	const onSubmit = form.handleSubmit((values) => {
		log.mutate(
			{ ...values, record },
			{ onSuccess: () => form.reset({ type: values.type, summary: "", detail: "" }) },
		);
	});
	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="grid gap-3" noValidate>
				<div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
					<SelectField control={form.control} name="type" label="Type" options={ACTIVITY_TYPES} />
					<TextField
						control={form.control}
						name="summary"
						label="Summary"
						placeholder="Talked about the rollout plan"
					/>
				</div>
				<TextareaField control={form.control} name="detail" label="Details (optional)" rows={3} />
				<div className="flex justify-end">
					<Button type="submit" size="sm" disabled={log.isPending}>
						{log.isPending ? <Spinner /> : null} Log activity
					</Button>
				</div>
			</form>
		</Form>
	);
}

function NoteComposer({ record }: { record: RecordRef }) {
	const id = useId();
	const create = useCreateNote();
	const [body, setBody] = useState("");
	const [error, setError] = useState<string | null>(null);
	return (
		<form
			className="grid gap-2"
			onSubmit={(event) => {
				event.preventDefault();
				if (!body.trim()) {
					setError("Write something first");
					return;
				}
				create.mutate({ title: "", body: body.trim(), record }, { onSuccess: () => setBody("") });
			}}
		>
			<label htmlFor={id} className="sr-only">
				New note
			</label>
			<Textarea
				id={id}
				rows={3}
				value={body}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? `${id}-error` : undefined}
				onChange={(event) => {
					setBody(event.target.value);
					setError(null);
				}}
				placeholder="Write a note… the first line becomes the title"
			/>
			{error ? (
				<p id={`${id}-error`} className="text-destructive text-sm">
					{error}
				</p>
			) : null}
			<div className="flex justify-end">
				<Button type="submit" size="sm" disabled={create.isPending}>
					{create.isPending ? <Spinner /> : null} Add note
				</Button>
			</div>
		</form>
	);
}

function TaskQuickAdd({ record }: { record: RecordRef }) {
	const create = useCreateTask();
	const [title, setTitle] = useState("");
	return (
		<form
			className="flex gap-2"
			onSubmit={(event) => {
				event.preventDefault();
				if (!title.trim()) return;
				create.mutate({
					id: newTaskId(),
					title: title.trim(),
					dueDate: startOfHour(setHours(addDays(new Date(), 1), 17)).toISOString(),
					assigneeId: SESSION_MEMBER_ID,
					priority: "normal",
					record,
				});
				setTitle("");
			}}
		>
			<Input
				aria-label="New task"
				value={title}
				onChange={(event) => setTitle(event.target.value)}
				placeholder="Add a task, due tomorrow… press Enter"
			/>
			<Button type="submit" size="default" variant="outline" disabled={!title.trim()}>
				<Plus /> Add
			</Button>
		</form>
	);
}

/** The tabs under a record header. `refs` are the record plus related records to include. */
export function RecordTabs({
	primary,
	refs,
	deals,
	emails,
	overview,
	newDealDefaults,
}: {
	primary: RecordRef;
	refs: RecordRef[];
	deals: Deal[];
	emails: string[];
	overview: ReactNode;
	newDealDefaults: Record<string, string>;
}) {
	const [tab, setTab] = useState("overview");
	const data = useRecordData(refs);
	const lookups = useLookups();
	const updateTask = useUpdateTask();
	const fileInput = useRef<HTMLInputElement>(null);
	const openTasks = data.tasks.filter((task) => !task.done);

	const feed = (items: typeof data.activities, showRecord: boolean) =>
		items.length ? (
			<ActivityFeed
				items={items}
				showRecord={showRecord}
				recordLabel={(activity) => lookups.recordLabel(activity.record)}
				memberName={lookups.memberName}
			/>
		) : (
			<Muted>No activity yet. Log a call or send an email to start the timeline.</Muted>
		);

	const taskList = (tasks: typeof data.tasks) =>
		tasks.length ? (
			<ul className="grid">
				{tasks.map((task) => (
					<li key={task.id} className="flex items-center gap-3 border-b py-2.5 last:border-b-0">
						<Checkbox
							className="rounded-full"
							checked={task.done}
							aria-label={`Mark “${task.title}” ${task.done ? "not done" : "done"}`}
							onCheckedChange={(checked) =>
								updateTask.mutate({ id: task.id, done: Boolean(checked) })
							}
						/>
						<span
							className={cn("flex-1 text-sm", task.done && "text-muted-foreground line-through")}
						>
							{task.title}
						</span>
						<span
							className={cn(
								"text-xs",
								!task.done && task.dueDate && task.dueDate < new Date().toISOString()
									? "text-destructive"
									: "text-muted-foreground",
							)}
						>
							{formatDay(task.dueDate)}
						</span>
					</li>
				))}
			</ul>
		) : (
			<Muted>No tasks for this record.</Muted>
		);

	const dealList = deals.length ? (
		<ul className="grid gap-2">
			{deals.map((deal) => (
				<li key={deal.id}>
					<Link
						{...recordLink({ type: "deal", id: deal.id })}
						className="flex min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 outline-none transition hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
					>
						<Handshake className="size-4 shrink-0 text-muted-foreground" />
						<span className="min-w-0 flex-1">
							<span className="block truncate font-medium text-sm">{deal.name}</span>
							<span className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<span className={cn("size-1.5 rounded-full", DEAL_STAGE_META[deal.stage].dot)} />
								{DEAL_STAGE_META[deal.stage].label}
							</span>
						</span>
						<span className="shrink-0 text-right font-medium text-sm tabular-nums">
							{formatMoney(deal.value)}
						</span>
					</Link>
				</li>
			))}
		</ul>
	) : (
		<Muted>No deals yet.</Muted>
	);

	return (
		<Tabs value={tab} onValueChange={setTab} className="gap-4">
			<div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
				<TabsList variant="line" className="w-max">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="activity">
						Activity{" "}
						<span className="text-muted-foreground text-xs tabular-nums">
							{data.activities.length}
						</span>
					</TabsTrigger>
					<TabsTrigger value="notes">
						Notes{" "}
						<span className="text-muted-foreground text-xs tabular-nums">{data.notes.length}</span>
					</TabsTrigger>
					<TabsTrigger value="tasks">
						Tasks{" "}
						<span className="text-muted-foreground text-xs tabular-nums">{openTasks.length}</span>
					</TabsTrigger>
					<TabsTrigger value="deals">
						Deals <span className="text-muted-foreground text-xs tabular-nums">{deals.length}</span>
					</TabsTrigger>
					<TabsTrigger value="files">Files</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="overview" className="grid gap-4">
				{overview}
				<div className="grid grid-cols-3 gap-2">
					<Button
						variant="outline"
						className="h-10 justify-center px-2 max-sm:text-xs sm:justify-start"
						onClick={() => openComposer(emails)}
					>
						<Mail /> Send email
					</Button>
					<Button
						variant="outline"
						className="h-10 justify-center px-2 max-sm:text-xs sm:justify-start"
						onClick={() => setTab("activity")}
					>
						<Phone /> Log a call
					</Button>
					<Button
						variant="outline"
						className="h-10 justify-center px-2 max-sm:text-xs sm:justify-start"
						onClick={() => openCreate("task", { recordType: primary.type, recordId: primary.id })}
					>
						<CalendarDays /> Create task
					</Button>
				</div>
				<Section
					title="Recent activity"
					action={
						<Button variant="ghost" size="sm" onClick={() => setTab("activity")}>
							See all
						</Button>
					}
				>
					{feed(data.activities.slice(0, 4), refs.length > 1)}
				</Section>
				<div className="grid gap-4 md:grid-cols-2">
					<Section
						title="Open tasks"
						action={
							<Button variant="ghost" size="sm" onClick={() => setTab("tasks")}>
								<Plus /> Add
							</Button>
						}
					>
						{taskList(openTasks.slice(0, 4))}
					</Section>
					<Section
						title="Deals"
						action={
							<Button variant="ghost" size="sm" onClick={() => openCreate("deal", newDealDefaults)}>
								<Plus /> New
							</Button>
						}
					>
						{dealList}
					</Section>
				</div>
			</TabsContent>

			<TabsContent value="activity" className="grid gap-4">
				<Section title="Log activity">
					<LogActivityForm record={primary} />
				</Section>
				<Section title="Timeline">{feed(data.activities, refs.length > 1)}</Section>
			</TabsContent>

			<TabsContent value="notes" className="grid gap-4">
				<Section title="New note">
					<NoteComposer record={primary} />
				</Section>
				{data.notes.length ? (
					data.notes.map((note) => (
						<article
							key={note.id}
							className="grid gap-1.5 rounded-2xl border bg-card p-5 shadow-soft"
						>
							<header className="flex items-baseline justify-between gap-3">
								<h3 className="font-semibold">{note.title}</h3>
								<span className="shrink-0 text-muted-foreground text-xs">
									{lookups.memberName(note.authorId).split(" ")[0]} · {formatAgo(note.updatedAt)}
								</span>
							</header>
							<p className="whitespace-pre-line text-muted-foreground text-sm">{note.body}</p>
							<Link
								to="/notes"
								search={{ note: note.id }}
								className="text-primary text-sm hover:underline"
							>
								Open in Notes
							</Link>
						</article>
					))
				) : (
					<Muted>No notes yet.</Muted>
				)}
			</TabsContent>

			<TabsContent value="tasks">
				<Section title="Tasks">
					<TaskQuickAdd record={primary} />
					{taskList(data.tasks)}
				</Section>
			</TabsContent>

			<TabsContent value="deals">
				<Section
					title="Deals"
					action={
						<Button size="sm" onClick={() => openCreate("deal", newDealDefaults)}>
							<Plus /> New deal
						</Button>
					}
				>
					{dealList}
				</Section>
			</TabsContent>

			<TabsContent value="files">
				<Section
					title="Files"
					action={
						<Button size="sm" variant="outline" onClick={() => fileInput.current?.click()}>
							<Upload /> Upload
						</Button>
					}
				>
					<input
						ref={fileInput}
						type="file"
						className="sr-only"
						tabIndex={-1}
						aria-hidden
						onChange={(event) => {
							const file = event.target.files?.[0];
							if (file)
								toast("Upload is a stub", {
									description: `${file.name} was not stored. Plug your storage here.`,
								});
							event.target.value = "";
						}}
					/>
					<ul className="grid gap-2">
						{["Proposal v2.pdf", "Security answers.docx"].map((name, index) => (
							<li
								key={name}
								className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm"
							>
								{index === 0 ? (
									<FileText className="size-4 text-cat-red" />
								) : (
									<Paperclip className="size-4 text-cat-gray" />
								)}
								<span className="flex-1 truncate">{name}</span>
								<span className="text-muted-foreground text-xs">Sample file</span>
							</li>
						))}
					</ul>
				</Section>
			</TabsContent>
		</Tabs>
	);
}
