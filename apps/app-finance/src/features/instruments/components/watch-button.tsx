import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "@repo/ui/components/sonner";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";
import { useToggleWatchlist } from "@/features/instruments/api/mutations";
import { positionQuery } from "@/features/instruments/api/queries";

export function WatchButton({ symbol }: { symbol: string }) {
	const { data } = useQuery(positionQuery(symbol));
	const toggle = useToggleWatchlist(symbol);
	const watched = data?.watchlists.some((w) => w.contains) ?? false;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={watched ? "secondary" : "outline"} disabled={!data}>
					<StarIcon className={watched ? "fill-current text-tint-ink" : undefined} />
					{watched ? "Watching" : "Add to watchlist"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>Watchlists</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{data?.watchlists.map((list) => (
					<DropdownMenuCheckboxItem
						key={list.id}
						checked={list.contains}
						onSelect={(event) => event.preventDefault()}
						onCheckedChange={(checked) =>
							toggle.mutate(
								{ listId: list.id, add: checked === true },
								{
									onSuccess: (result) =>
										toast.success(
											result.add
												? `Added ${symbol} to ${result.list}`
												: `Removed ${symbol} from ${result.list}`,
										),
									onError: (error) => toast.error(error.message),
								},
							)
						}
					>
						{list.name}
					</DropdownMenuCheckboxItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to="/watchlist">Manage lists</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
