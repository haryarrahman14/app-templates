import {
	FormControl,
	FormDescription,
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
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import type { ComponentProps, ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

/** Shorthands over the shadcn Form primitives: label, control, field error. */

type Base<T extends FieldValues> = {
	control: Control<T>;
	name: FieldPath<T>;
	label: string;
	description?: ReactNode;
	className?: string;
};

export function TextField<T extends FieldValues>({
	control,
	name,
	label,
	description,
	className,
	...input
}: Base<T> & Omit<ComponentProps<typeof Input>, "name">) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							{...input}
							{...field}
							value={
								typeof field.value === "number" && Number.isNaN(field.value)
									? ""
									: (field.value ?? "")
							}
							onChange={(event) =>
								field.onChange(
									input.type === "number" ? event.target.valueAsNumber : event.target.value,
								)
							}
						/>
					</FormControl>
					{description ? <FormDescription>{description}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function TextareaField<T extends FieldValues>({
	control,
	name,
	label,
	description,
	className,
	...textarea
}: Base<T> & Omit<ComponentProps<typeof Textarea>, "name">) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Textarea {...textarea} {...field} value={field.value ?? ""} />
					</FormControl>
					{description ? <FormDescription>{description}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export type Option = { value: string; label: string };

export function SelectField<T extends FieldValues>({
	control,
	name,
	label,
	description,
	className,
	options,
	placeholder = "Select…",
}: Base<T> & { options: readonly Option[]; placeholder?: string }) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel>{label}</FormLabel>
					<Select value={field.value || undefined} onValueChange={field.onChange}>
						<FormControl>
							<SelectTrigger className="w-full" onBlur={field.onBlur}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{description ? <FormDescription>{description}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
