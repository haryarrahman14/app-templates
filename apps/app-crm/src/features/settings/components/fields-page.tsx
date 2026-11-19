import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
	Calendar,
	CheckSquare,
	Hash,
	Link2,
	List,
	type LucideIcon,
	Plus,
	Trash2,
	Type,
} from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { Pill } from "@/components/kit/pill";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { useDeleteField } from "@/features/settings/api/mutations";
import { customFieldsQuery } from "@/features/settings/api/queries";
import { AddFieldDialog } from "@/features/settings/components/add-field-dialog";
import { SettingsSection } from "@/features/settings/components/settings-layout";
import type { CustomField, FieldType } from "@/features/settings/schemas/settings";
import { RECORD_TYPES, type RecordType } from "@/lib/records";

export const FIELD_TYPE_META: Record<FieldType, { label: string; icon: LucideIcon }> = {
	text: { label: "Text", icon: Type },
	number: { label: "Number", icon: Hash },
	date: { label: "Date", icon: Calendar },
	select: { label: "Select", icon: List },
	checkbox: { label: "Checkbox", icon: CheckSquare },
	url: { label: "URL", icon: Link2 },
};

const TYPES: RecordType[] = ["company", "person", "deal"];

export function FieldsPage() {
	const { data, isPending } = useQuery(customFieldsQuery);
	const remove = useDeleteField();
	const [adding, setAdding] = useState<RecordType | null>(null);
	const [removing, setRemoving] = useState<CustomField | null>(null);

	return (
		<SettingsSection
			title="Custom fields"
			description="Extra properties on records, shown in tables and the properties panel."
			actions={
				<Button onClick={() => setAdding("company")}>
					<Plus /> Add field
				</Button>
			}
		>
			<div className="flex flex-col gap-4">
				{TYPES.map((type) => {
					const fields = (data ?? []).filter((field) => field.recordType === type);
					return (
						<div key={type} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
							<div className="flex items-center gap-2 border-b px-4 py-3">
								<RecordGlyph type={type} />
								<p className="font-medium text-sm">{RECORD_TYPES[type].plural}</p>
								<span className="text-muted-foreground text-xs">{fields.length} fields</span>
								<Button
									variant="ghost"
									size="sm"
									className="ml-auto"
									onClick={() => setAdding(type)}
								>
									<Plus /> Add
								</Button>
							</div>
							<ul className="divide-y">
								{isPending ? (
									<li className="px-4 py-3">
										<Skeleton className="h-5 w-40 rounded" />
									</li>
								) : fields.length === 0 ? (
									<li className="px-4 py-4 text-muted-foreground text-sm">No custom fields yet.</li>
								) : (
									fields.map((field) => {
										const meta = FIELD_TYPE_META[field.type];
										return (
											<li key={field.id} className="flex items-center gap-3 px-4 py-3">
												<span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
													<meta.icon className="size-3.5" />
												</span>
												<div className="min-w-0 flex-1">
													<p className="truncate font-medium text-sm">{field.label}</p>
													<p className="truncate text-muted-foreground text-xs">
														{meta.label}
														{field.options.length ? ` · ${field.options.join(", ")}` : ""}
													</p>
												</div>
												{field.required ? <Pill tone="blue">Required</Pill> : null}
												<Button
													variant="ghost"
													size="icon-sm"
													aria-label={`Delete ${field.label}`}
													onClick={() => setRemoving(field)}
												>
													<Trash2 />
												</Button>
											</li>
										);
									})
								)}
							</ul>
						</div>
					);
				})}
			</div>
			<AddFieldDialog
				recordType={adding}
				onOpenChange={(open) => {
					if (!open) setAdding(null);
				}}
			/>
			<ConfirmDialog
				open={removing !== null}
				onOpenChange={(open) => {
					if (!open) setRemoving(null);
				}}
				title={`Delete “${removing?.label ?? "field"}”?`}
				description="Values stored in this field are removed from every record. This cannot be undone."
				onConfirm={() => {
					if (removing) remove.mutate(removing.id);
					setRemoving(null);
				}}
			/>
		</SettingsSection>
	);
}
