import { useEffect } from "react";
import { ShortcutsDialog } from "@/components/layout/shortcuts-dialog";
import { NewCompanyDialog } from "@/features/companies/components/new-company-dialog";
import { NewDealDialog } from "@/features/deals/components/new-deal-dialog";
import { EmailComposer } from "@/features/email/components/email-composer";
import { ImportDialog } from "@/features/import/components/import-dialog";
import { OnboardingSheet } from "@/features/onboarding/components/onboarding-sheet";
import { NewPersonDialog } from "@/features/people/components/new-person-dialog";
import { CommandPalette } from "@/features/search/components/command-palette";
import { InviteDialog } from "@/features/settings/components/invite-dialog";
import { TaskDialog } from "@/features/tasks/components/task-dialog";
import { NewListDialog } from "@/features/workspace/components/new-list-dialog";
import { recordRefSchema } from "@/lib/records";
import { setUi, useUi } from "@/lib/ui-state";

const isTyping = (target: EventTarget | null) =>
	target instanceof HTMLElement &&
	(target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** Everything that floats above the pages: palette, composer, create dialogs, sheets. */
export function GlobalOverlays() {
	const create = useUi((state) => state.create);
	const close = (open: boolean) => {
		if (!open) setUi({ create: null });
	};
	const recordDefault = recordRefSchema.safeParse({
		type: create?.defaults?.recordType,
		id: create?.defaults?.recordId,
	});

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setUi((state) => ({ commandOpen: !state.commandOpen }));
			} else if (event.key === "?" && !isTyping(event.target)) {
				setUi({ shortcutsOpen: true });
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	return (
		<>
			<CommandPalette />
			<EmailComposer />
			<OnboardingSheet />
			<ImportDialog />
			<ShortcutsDialog />
			<NewCompanyDialog open={create?.kind === "company"} onOpenChange={close} />
			<NewPersonDialog
				open={create?.kind === "person"}
				onOpenChange={close}
				defaultCompanyId={create?.defaults?.companyId}
			/>
			<NewDealDialog
				open={create?.kind === "deal"}
				onOpenChange={close}
				defaults={create?.kind === "deal" ? create.defaults : undefined}
			/>
			<NewListDialog open={create?.kind === "list"} onOpenChange={close} />
			<TaskDialog
				open={create?.kind === "task"}
				onOpenChange={close}
				defaultRecord={recordDefault.success ? recordDefault.data : null}
			/>
			<InviteDialog open={create?.kind === "invite"} onOpenChange={close} />
		</>
	);
}
