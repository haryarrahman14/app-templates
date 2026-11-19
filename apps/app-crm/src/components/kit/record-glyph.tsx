import { cn } from "@repo/ui/lib/cn";
import { RECORD_TYPES, type RecordType } from "@/lib/records";

/** Small coloured tile with the record type's icon (Companies, People, Deals …). */
export function RecordGlyph({
	type,
	size = "sm",
	className,
}: {
	type: RecordType;
	size?: "xs" | "sm" | "md";
	className?: string;
}) {
	const meta = RECORD_TYPES[type];
	const Icon = meta.icon;
	return (
		<span
			aria-hidden
			className={cn(
				"inline-flex shrink-0 items-center justify-center",
				size === "xs" && "size-4 rounded-[5px] [&_svg]:size-2.5",
				size === "sm" && "size-5 rounded-md [&_svg]:size-3",
				size === "md" && "size-7 rounded-lg [&_svg]:size-4",
				meta.tile,
				className,
			)}
		>
			<Icon strokeWidth={2.25} />
		</span>
	);
}
