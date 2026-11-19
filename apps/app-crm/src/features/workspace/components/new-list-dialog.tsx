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
import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { DOT_TONES } from "@/components/kit/pill";
import { useCreateList } from "@/features/workspace/api/mutations";
import { LIST_COLORS, type NewList, newListSchema } from "@/features/workspace/schemas/workspace";
import { RECORD_TYPES } from "@/lib/records";

export function NewListDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const navigate = useNavigate();
	const create = useCreateList();
	const form = useForm<NewList>({
		resolver: zodResolver(newListSchema),
		defaultValues: { name: "", color: "blue", recordType: "company" },
	});

	useEffect(() => {
		if (open) form.reset({ name: "", color: "blue", recordType: "company" });
	}, [open, form]);

	const onSubmit = form.handleSubmit(async (values) => {
		const list = await create.mutateAsync(values);
		onOpenChange(false);
		navigate({ href: `${RECORD_TYPES[list.recordType].basePath}?list=${list.id}` });
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-2xl p-6 sm:max-w-md">
				<DialogHeader>
					<DialogTitle>New list</DialogTitle>
					<DialogDescription>Lists group records you want to keep an eye on.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={onSubmit} className="grid gap-4" noValidate>
						<TextField
							control={form.control}
							name="name"
							label="Name"
							placeholder="Follow up in spring"
							autoFocus
						/>
						<SelectField
							control={form.control}
							name="recordType"
							label="Holds"
							options={[
								{ value: "company", label: "Companies" },
								{ value: "person", label: "People" },
							]}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Colour</FormLabel>
									<FormControl>
										<div role="radiogroup" aria-label="Colour" className="flex gap-2">
											{LIST_COLORS.map((color) => (
												// biome-ignore lint/a11y/useSemanticElements: a styled chip radio; aria-checked carries the state.
												<button
													key={color}
													type="button"
													role="radio"
													aria-checked={field.value === color}
													aria-label={color}
													onClick={() => field.onChange(color)}
													className={cn(
														"flex size-8 items-center justify-center rounded-full border outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
														field.value === color && "border-foreground/40 bg-muted",
													)}
												>
													<span className={cn("size-3.5 rounded-full", DOT_TONES[color])} />
												</button>
											))}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="mt-2">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={create.isPending}>
								{create.isPending ? <Spinner /> : null}
								Create list
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
