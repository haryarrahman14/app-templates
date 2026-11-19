import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { useNavigate } from "@tanstack/react-router";
import { BookOpenIcon, BriefcaseIcon, GraduationCapIcon, NotebookPenIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";
import { BrandMark } from "@/components/kit/brand-mark";
import { RadioCards } from "@/components/kit/radio-cards";
import { useInviteMember } from "@/features/members/api/mutations";
import {
	type InviteStep,
	inviteStepSchema,
	nameStepSchema,
} from "@/features/onboarding/schemas/onboarding";
import { useUpdateWorkspace } from "@/features/settings/api/mutations";
import type { WorkspaceUse } from "@/features/settings/schemas/settings";
import { firstNameOf, type SessionUser } from "@/lib/session";
import { APP_NAME } from "@/lib/site";

const USES: { value: WorkspaceUse; label: string; hint: string; icon: typeof BookOpenIcon }[] = [
	{
		value: "team-docs",
		label: "Team docs",
		hint: "Handbooks, specs and meeting notes",
		icon: BookOpenIcon,
	},
	{
		value: "projects",
		label: "Projects",
		hint: "Plans, briefs and tasks with dates",
		icon: BriefcaseIcon,
	},
	{
		value: "personal-notes",
		label: "Personal notes",
		hint: "A quiet place to think",
		icon: NotebookPenIcon,
	},
	{
		value: "school",
		label: "School",
		hint: "Lecture notes and coursework",
		icon: GraduationCapIcon,
	},
];

const STEPS = ["Name", "Use", "Invite"];

/** First-run flow: name the workspace, pick a use, invite teammates. Every step can be skipped. */
export function OnboardingFlow({ user }: { user: SessionUser }) {
	const navigate = useNavigate();
	const reduce = useReducedMotion();
	const [step, setStep] = useState(0);
	const [use, setUse] = useState<WorkspaceUse>("team-docs");
	const updateWorkspace = useUpdateWorkspace();
	const invite = useInviteMember();
	const [finishing, setFinishing] = useState(false);

	const nameForm = useForm<z.infer<typeof nameStepSchema>>({
		resolver: zodResolver(nameStepSchema),
		defaultValues: { name: `${firstNameOf(user.name)}'s workspace` },
	});
	const inviteForm = useForm<InviteStep>({
		resolver: zodResolver(inviteStepSchema),
		defaultValues: { emails: [{ value: "" }, { value: "" }, { value: "" }] },
	});
	const emails = useFieldArray({ control: inviteForm.control, name: "emails" });

	const finish = async (values?: InviteStep) => {
		setFinishing(true);
		await updateWorkspace
			.mutateAsync({ name: nameForm.getValues("name"), use })
			.catch(() => undefined);
		for (const email of values?.emails ?? []) {
			if (email.value)
				await invite.mutateAsync({ email: email.value, role: "editor" }).catch(() => undefined);
		}
		navigate({ to: "/" });
	};

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			<header className="flex items-center justify-between px-6 py-5 sm:px-10">
				<span className="flex items-center gap-2 font-semibold">
					<BrandMark /> {APP_NAME}
				</span>
				<Button variant="ghost" onClick={() => navigate({ to: "/" })}>
					Skip setup
				</Button>
			</header>
			<main className="flex flex-1 items-start justify-center px-6 pt-6 pb-16 sm:items-center sm:pt-0">
				<div className="w-full max-w-lg space-y-8">
					<ol aria-label="Progress" className="flex items-center justify-center gap-2">
						{STEPS.map((label, index) => (
							<li key={label} className="flex items-center gap-2">
								<span
									aria-current={index === step ? "step" : undefined}
									className={cn(
										"h-1.5 rounded-full transition-all duration-300",
										index === step
											? "w-8 bg-primary"
											: index < step
												? "w-4 bg-primary/60"
												: "w-4 bg-border",
									)}
								/>
								<span className="sr-only">
									Step {index + 1}: {label}
								</span>
							</li>
						))}
					</ol>

					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={step}
							initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
							animate={{ opacity: 1, x: 0 }}
							exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
							transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
							className="glass space-y-6 rounded-3xl p-6 shadow-float sm:p-8"
						>
							{step === 0 ? (
								<Form {...nameForm}>
									<form
										noValidate
										onSubmit={nameForm.handleSubmit(() => setStep(1))}
										className="space-y-6"
									>
										<div className="space-y-1">
											<h1 className="font-semibold text-2xl tracking-tight">
												Welcome, {firstNameOf(user.name)}
											</h1>
											<p className="text-muted-foreground">
												First, name your workspace. You can change it later.
											</p>
										</div>
										<FormField
											control={nameForm.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Workspace name</FormLabel>
													<FormControl>
														<Input className="h-11 text-base" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button type="submit" className="h-10 w-full">
											Continue
										</Button>
									</form>
								</Form>
							) : step === 1 ? (
								<div className="space-y-6">
									<div className="space-y-1">
										<h1 className="font-semibold text-2xl tracking-tight">
											What will you use it for?
										</h1>
										<p className="text-muted-foreground">We'll suggest templates that fit.</p>
									</div>
									<RadioCards<WorkspaceUse>
										name="workspace-use"
										label="What will you use it for?"
										value={use}
										onValueChange={setUse}
										options={USES}
										className="grid gap-2 sm:grid-cols-2"
										itemClassName="rounded-2xl"
										renderItem={(option, checked) => {
											const item = USES.find((u) => u.value === option.value);
											const Icon = item?.icon ?? BookOpenIcon;
											return (
												<span
													className={cn(
														"flex h-full items-start gap-3 rounded-2xl border bg-card p-4 transition-colors hover:bg-accent",
														checked && "border-tint ring-1 ring-tint",
													)}
												>
													<Icon className="mt-0.5 size-5 text-primary" />
													<span>
														<span className="block font-medium text-sm">{option.label}</span>
														<span className="block text-muted-foreground text-xs">
															{item?.hint}
														</span>
													</span>
												</span>
											);
										}}
									/>
									<div className="flex gap-2">
										<Button variant="outline" className="h-10" onClick={() => setStep(0)}>
											Back
										</Button>
										<Button className="h-10 flex-1" onClick={() => setStep(2)}>
											Continue
										</Button>
									</div>
								</div>
							) : (
								<Form {...inviteForm}>
									<form noValidate onSubmit={inviteForm.handleSubmit(finish)} className="space-y-6">
										<div className="space-y-1">
											<h1 className="font-semibold text-2xl tracking-tight">
												Invite your teammates
											</h1>
											<p className="text-muted-foreground">
												Writing is better together. Leave these empty to do it later.
											</p>
										</div>
										<div className="space-y-3">
											{emails.fields.map((item, index) => (
												<FormField
													key={item.id}
													control={inviteForm.control}
													name={`emails.${index}.value`}
													render={({ field }) => (
														<FormItem>
															<FormLabel className="sr-only">Teammate {index + 1} email</FormLabel>
															<FormControl>
																<Input
																	type="email"
																	placeholder="teammate@company.com"
																	className="h-10"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											))}
										</div>
										<div className="flex gap-2">
											<Button
												type="button"
												variant="outline"
												className="h-10"
												onClick={() => setStep(1)}
											>
												Back
											</Button>
											<Button
												type="button"
												variant="ghost"
												className="h-10"
												disabled={finishing}
												onClick={() => finish()}
											>
												Skip
											</Button>
											<Button type="submit" className="h-10 flex-1" disabled={finishing}>
												{finishing ? <Spinner /> : null} Finish
											</Button>
										</div>
									</form>
								</Form>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</main>
		</div>
	);
}
