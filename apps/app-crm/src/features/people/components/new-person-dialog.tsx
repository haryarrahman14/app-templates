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
import { companiesQuery } from "@/features/companies/api/queries";
import { useCreatePerson } from "@/features/people/api/mutations";
import { STAGE_OPTIONS } from "@/features/people/constants/stage";
import { type NewPerson, newPersonSchema } from "@/features/people/schemas/person";
import { membersQuery } from "@/features/workspace/api/queries";
import { SESSION_MEMBER_ID } from "@/lib/session";

const NONE = "none";

export function NewPersonDialog({
	open,
	onOpenChange,
	defaultCompanyId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultCompanyId?: string;
}) {
	const navigate = useNavigate();
	const members = useQuery(membersQuery).data ?? [];
	const companies = useQuery(companiesQuery).data ?? [];
	const create = useCreatePerson();
	const form = useForm<NewPerson>({ resolver: zodResolver(newPersonSchema) });

	useEffect(() => {
		if (open) {
			form.reset({
				firstName: "",
				lastName: "",
				email: "",
				title: "",
				companyId: defaultCompanyId ?? NONE,
				stage: "new",
				ownerId: SESSION_MEMBER_ID,
			});
		}
	}, [open, defaultCompanyId, form]);

	const onSubmit = form.handleSubmit(async (values) => {
		const person = await create.mutateAsync({
			...values,
			companyId: values.companyId === NONE ? "" : values.companyId,
		});
		onOpenChange(false);
		navigate({ to: "/people/$id", params: { id: person.id } });
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>New person</DialogTitle>
					<DialogDescription>
						Add someone you work with. You can link them to a company now or later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className="grid gap-4" noValidate>
						<div className="grid gap-4 sm:grid-cols-2">
							<TextField control={form.control} name="firstName" label="First name" autoFocus />
							<TextField control={form.control} name="lastName" label="Last name" />
						</div>
						<TextField
							control={form.control}
							name="email"
							type="email"
							label="Email"
							placeholder="name@example.com"
						/>
						<TextField
							control={form.control}
							name="title"
							label="Job title"
							placeholder="Head of Operations"
						/>
						<SelectField
							control={form.control}
							name="companyId"
							label="Company"
							options={[
								{ value: NONE, label: "No company" },
								...companies.map((company) => ({ value: company.id, label: company.name })),
							]}
						/>
						<div className="grid gap-4 sm:grid-cols-2">
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
								Add person
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
