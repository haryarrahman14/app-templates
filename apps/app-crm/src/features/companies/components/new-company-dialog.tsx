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
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { useCreateCompany } from "@/features/companies/api/mutations";
import { STATUS_OPTIONS } from "@/features/companies/constants/status";
import {
	COMPANY_SIZES,
	INDUSTRIES,
	type NewCompany,
	newCompanySchema,
} from "@/features/companies/schemas/company";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { membersQuery } from "@/features/workspace/api/queries";
import { SESSION_MEMBER_ID } from "@/lib/session";

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

const EMPTY = {
	name: "",
	domain: "",
	industry: undefined,
	size: undefined,
	status: "lead",
	city: "",
	ownerId: SESSION_MEMBER_ID,
} as unknown as NewCompany;

export function NewCompanyDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const navigate = useNavigate();
	const members = useQuery(membersQuery).data ?? [];
	const create = useCreateCompany();
	const onboarding = useOnboarding();
	const form = useForm<NewCompany>({
		resolver: zodResolver(newCompanySchema),
		defaultValues: EMPTY,
	});

	useEffect(() => {
		if (open) form.reset(EMPTY);
	}, [open, form]);

	const onSubmit = form.handleSubmit(async (values) => {
		const [company] = await create.mutateAsync(values);
		onboarding.complete("company");
		onOpenChange(false);
		if (company) navigate({ to: "/companies/$id", params: { id: company.id } });
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>New company</DialogTitle>
					<DialogDescription>
						Only the name is needed now; everything else can wait.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className="grid gap-4" noValidate>
						<TextField
							control={form.control}
							name="name"
							label="Name"
							placeholder="Brightloom Labs"
							autoFocus
						/>
						<TextField
							control={form.control}
							name="domain"
							label="Website"
							placeholder="brightloom.example.com"
						/>
						<div className="grid gap-4 sm:grid-cols-2">
							<SelectField
								control={form.control}
								name="industry"
								label="Industry"
								options={toOptions(INDUSTRIES)}
							/>
							<SelectField
								control={form.control}
								name="size"
								label="Employees"
								options={toOptions(COMPANY_SIZES)}
							/>
							<SelectField
								control={form.control}
								name="status"
								label="Status"
								options={STATUS_OPTIONS}
							/>
							<SelectField
								control={form.control}
								name="ownerId"
								label="Owner"
								options={members.map((member) => ({ value: member.id, label: member.name }))}
							/>
						</div>
						<TextField control={form.control} name="city" label="City" placeholder="Lisbon" />
						<DialogFooter className="mt-2">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={create.isPending}>
								{create.isPending ? <Spinner /> : null}
								Create company
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
