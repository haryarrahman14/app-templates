import { Button } from "@repo/ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@repo/ui/components/sheet";
import { cn } from "@repo/ui/lib/cn";
import { useNavigate } from "@tanstack/react-router";
import { Check, RotateCcw } from "lucide-react";
import { Progress } from "@/components/kit/progress";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { openComposer, openCreate, setUi, useUi } from "@/lib/ui-state";

export function OnboardingSheet() {
	const open = useUi((state) => state.onboardingOpen);
	const navigate = useNavigate();
	const { steps, done, completed, total, toggle, reset } = useOnboarding();

	const close = () => setUi({ onboardingOpen: false });
	const run = (id: string) => {
		close();
		if (id === "profile") navigate({ to: "/settings/profile" });
		else if (id === "import") setUi({ importOpen: true });
		else if (id === "company") openCreate("company");
		else if (id === "deal") navigate({ to: "/deals" });
		else if (id === "email") openComposer();
		else if (id === "invite") openCreate("invite");
	};

	return (
		<Sheet open={open} onOpenChange={(next) => setUi({ onboardingOpen: next })}>
			<SheetContent className="w-full gap-0 sm:max-w-md">
				<SheetHeader className="gap-3 border-b p-5">
					<SheetTitle className="text-lg">Getting started</SheetTitle>
					<SheetDescription>
						Six small steps to make this workspace yours. {completed} of {total} done.
					</SheetDescription>
					<Progress value={(completed / total) * 100} />
				</SheetHeader>
				<ol className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
					{steps.map((step, index) => {
						const isDone = done.includes(step.id);
						return (
							<li
								key={step.id}
								className={cn(
									"flex gap-3 rounded-2xl border p-4 transition",
									isDone ? "bg-muted/40" : "bg-card shadow-soft",
								)}
							>
								<button
									type="button"
									onClick={() => toggle(step.id)}
									aria-pressed={isDone}
									aria-label={
										isDone ? `Mark “${step.title}” as not done` : `Mark “${step.title}” as done`
									}
									className={cn(
										"mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs outline-none transition focus-visible:ring-3 focus-visible:ring-ring/50",
										isDone
											? "border-primary bg-primary text-primary-foreground"
											: "text-muted-foreground hover:border-primary",
									)}
								>
									{isDone ? <Check className="size-3.5" /> : index + 1}
								</button>
								<div className="flex min-w-0 flex-1 flex-col gap-2">
									<div>
										<p
											className={cn(
												"font-medium text-sm",
												isDone && "text-muted-foreground line-through",
											)}
										>
											{step.title}
										</p>
										<p className="text-muted-foreground text-sm">{step.description}</p>
									</div>
									{isDone ? null : (
										<Button
											size="sm"
											variant="outline"
											className="self-start"
											onClick={() => run(step.id)}
										>
											{step.action}
										</Button>
									)}
								</div>
							</li>
						);
					})}
				</ol>
				<div className="border-t p-4">
					<Button variant="ghost" size="sm" onClick={reset}>
						<RotateCcw /> Reset checklist
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
