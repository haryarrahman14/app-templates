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
import { Form, FormControl, FormField, FormItem, FormLabel } from "@repo/ui/components/form";
import { Spinner } from "@repo/ui/components/spinner";
import { Switch } from "@repo/ui/components/switch";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { useCreateField } from "@/features/settings/api/mutations";
import { FIELD_TYPES, type NewField, newFieldSchema } from "@/features/settings/schemas/settings";
import { RECORD_TYPES, type RecordType } from "@/lib/records";

const TYPE_LABELS: Record<(typeof FIELD_TYPES)[number], string> = {
	text: "Text",
	number: "Number",
	date: "Date",
	select: "Select (options)",
	checkbox: "Checkbox",
	url: "URL",
};

/** Opens when `recordType` is set; that type is preselected. */
export function AddFieldDialog({
	recordType,
	onOpenChange,
}: {
	recordType: RecordType | null;
	onOpenChange: (open: boolean) => void;
}) {
	const create = useCreateField();
	const form = useForm<NewField>({
		resolver: zodResolver(newFieldSchema),
		defaultValues: { label: "", type: "text", recordType: "company", required: false, options: "" },
	});
	const type = form.watch("type");

	useEffect(() => {
		if (recordType)
			form.reset({ label: "", type: "text", recordType, required: false, options: "" });
	}, [recordType, form]);

	return (
		<Dialog open={recordType !== null} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add a custom field</DialogTitle>
					<DialogDescription>It appears on every record of that type.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="flex flex-col gap-4"
						onSubmit={form.handleSubmit((values) =>
							create.mutate(values, { onSuccess: () => onOpenChange(false) }),
						)}
					>
						<TextField
							control={form.control}
							name="label"
							label="Field name"
							placeholder="e.g. Lead source"
						/>
						<div className="grid gap-4 sm:grid-cols-2">
							<SelectField
								control={form.control}
								name="recordType"
								label="Record type"
								options={(Object.keys(RECORD_TYPES) as RecordType[]).map((value) => ({
									value,
									label: RECORD_TYPES[value].plural,
								}))}
							/>
							<SelectField
								control={form.control}
								name="type"
								label="Type"
								options={FIELD_TYPES.map((value) => ({ value, label: TYPE_LABELS[value] }))}
							/>
						</div>
						{type === "select" ? (
							<TextField
								control={form.control}
								name="options"
								label="Options"
								placeholder="Referral, Event, Website"
								description="Separate options with commas."
							/>
						) : null}
						<FormField
							control={form.control}
							name="required"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between rounded-xl border px-3 py-2.5">
									<FormLabel className="font-normal">Required on new records</FormLabel>
									<FormControl>
										<Switch checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={create.isPending}>
								{create.isPending ? <Spinner /> : null}
								Add field
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
