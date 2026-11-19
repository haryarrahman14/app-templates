import { cn } from "@repo/ui/lib/cn";
import {
	ArrowDownLeftIcon,
	ArrowUpRightIcon,
	CoinsIcon,
	MinusCircleIcon,
	ShoppingCartIcon,
	TagIcon,
} from "lucide-react";
import { TYPE_LABEL } from "@/features/transactions/constants/types";
import type { TransactionType } from "@/features/transactions/schemas/transaction";

const ICON = {
	buy: ShoppingCartIcon,
	sell: TagIcon,
	deposit: ArrowDownLeftIcon,
	withdrawal: ArrowUpRightIcon,
	dividend: CoinsIcon,
	fee: MinusCircleIcon,
} as const;

export function TypeBadge({ type, className }: { type: TransactionType; className?: string }) {
	const Icon = ICON[type];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2 py-0.5 font-medium text-xs",
				className,
			)}
		>
			<Icon aria-hidden className="size-3" />
			{TYPE_LABEL[type]}
		</span>
	);
}
