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
import { Form } from "@repo/ui/components/form";
import { Spinner } from "@repo/ui/components/spinner";
import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { companiesQuery } from "@/features/companies/api/queries";
import { useCreateDeal } from "@/features/deals/api/mutations";
import {
	DEAL_STAGE_META,
	DEAL_STAGES,
	dealStageSchema,
	type NewDeal,
	newDealSchema,
} from "@/features/deals/schemas/deal";
import { membersQuery } from "@/features/workspace/api/queries";
import { SESSION_MEMBER_ID } from "@/lib/session";

const STAGE_OPTIONS = DEAL_STAGES.map((stage) => ({
	value: stage,
	label: DEAL_STAGE_META[stage].label,
}));

export function NewDealDialog({
	open,
	onOpenChange,
	defaults,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaults?: Record<string, string>;
}) {
	const companies = useQuery(companiesQuery).data ?? [];
	const members = useQuery(membersQuery).data ?? [];
	const create = useCreateDeal();
	const form = useForm<NewDeal>({ resolver: zodResolver(newDealSchema) });
	const companyId = defaults?.companyId;
	const stage = defaults?.stage;

	useEffect(() => {
		if (!open) return;
		form.reset({
			name: "",
			companyId: companyId ?? "",
			stage: dealStageSchema.catch("lead").parse(stage),
			value: undefined as unknown as number,
			closeDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
			ownerId: SESSION_MEMBER_ID,
		});
	}, [open, companyId, stage, form]);

	const onSubmit = form.handleSubmit(async (values) => {
		await create.mutateAsync({
			...values,
			closeDate: new Date(`${values.closeDate}T12:00:00Z`).toISOString(),
		});
		onOpenChange(false);
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>New deal</DialogTitle>
					<DialogDescription>
						It lands on the pipeline board in the stage you pick.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className="grid gap-4" noValidate>
						<TextField
							control={form.control}
							name="name"
							label="Deal name"
							placeholder="Annual plan"
							autoFocus
						/>
						<SelectField
							control={form.control}
							name="companyId"
							label="Company"
							placeholder="Pick a company"
							options={companies.map((company) => ({ value: company.id, label: company.name }))}
						/>
						<div className="grid gap-4 sm:grid-cols-2">
							<TextField
								control={form.control}
								name="value"
								label="Value (USD)"
								type="number"
								min={0}
								inputMode="numeric"
								placeholder="12000"
							/>
							<TextField
								control={form.control}
								name="closeDate"
								label="Expected close"
								type="date"
							/>
							<SelectField
								control={form.control}
								name="stage"
								label="Stage"
								options={STAGE_OPTIONS}
							/>
							<SelectField
								control={form.control}
								name="ownerId"
								label="Owner"
								options={members.map((member) => ({ value: member.id, label: member.name }))}
							/>
						</div>
						<DialogFooter className="mt-2">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={create.isPending}>
								{create.isPending ? <Spinner /> : null}
								Create deal
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
