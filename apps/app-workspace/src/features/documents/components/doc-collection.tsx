import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FilePlus2Icon, SearchXIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { StateScreen } from "@/components/kit/state-screen";
import { docsQuery } from "@/features/documents/api/queries";
import { DocCard, DocCardSkeleton } from "@/features/documents/components/doc-card";
import { DocFilters } from "@/features/documents/components/doc-filters";
import { DocTable } from "@/features/documents/components/doc-table";
import { useDocLookups } from "@/features/documents/hooks/use-doc-lookups";
import { useNewDoc } from "@/features/documents/hooks/use-new-doc";
import {
	type DocFilters as Filters,
	filterDocs,
	isMine,
} from "@/features/documents/utils/doc-helpers";
import { useCollectionView } from "@/lib/view-preference";

const FILTER_KEYS = ["folder", "tag", "owner", "q"] as const;

/**
 * Filters live in the URL (?folder=&tag=&owner=&q=) so the sidebar can link straight to them. The
 * routes that show a collection validate them with `docFiltersSearchSchema`.
 */
function useUrlFilters() {
	const search = useSearch({ strict: false });
	const navigate = useNavigate();
	const filters: Filters = Object.fromEntries(FILTER_KEYS.map((key) => [key, search[key]]));
	const setFilters = useCallback(
		(patch: Filters) => {
			const cleared = Object.fromEntries(
				Object.entries(patch).map(([key, value]) => [key, value || undefined]),
			);
			void navigate({
				to: ".",
				search: (prev) => ({ ...prev, ...cleared }),
				replace: true,
				resetScroll: false,
			});
		},
		[navigate],
	);
	return [filters, setFilters] as const;
}

export function DocCollection({ scope = "all" }: { scope?: "all" | "shared" }) {
	const view = useCollectionView();
	const [filters, setFilters] = useUrlFilters();
	const docs = useQuery(docsQuery);
	const { folders, tags, members, lookups } = useDocLookups();
	const { newDoc, isPending } = useNewDoc();

	const scoped = useMemo(
		() => (docs.data ?? []).filter((doc) => (scope === "shared" ? !isMine(doc) : true)),
		[docs.data, scope],
	);
	// The list view lets TanStack Table do the text search (global filter); the grid filters here.
	const filtered = useMemo(
		() => filterDocs(scoped, view === "list" ? { ...filters, q: undefined } : filters, folders),
		[scoped, filters, folders, view],
	);

	if (docs.isError) {
		return (
			<StateScreen
				icon={SearchXIcon}
				title="Documents could not load"
				description="Check your connection and try again."
			>
				<Button onClick={() => docs.refetch()}>Try again</Button>
			</StateScreen>
		);
	}

	const hasFilters = FILTER_KEYS.some((key) => filters[key]);

	return (
		<section aria-label="Documents" className="space-y-4">
			<DocFilters
				filters={filters}
				onChange={setFilters}
				folders={folders}
				tags={tags}
				members={members}
				showOwner={scope === "all"}
			/>
			{docs.isPending ? (
				view === "grid" ? (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{["a", "b", "c", "d", "e", "f", "g", "h"].map((key) => (
							<DocCardSkeleton key={key} />
						))}
					</div>
				) : (
					<div className="space-y-2 rounded-2xl border bg-card p-4">
						{["a", "b", "c", "d", "e", "f"].map((key) => (
							<Skeleton key={key} className="h-9 w-full" />
						))}
					</div>
				)
			) : filtered.length === 0 ? (
				hasFilters ? (
					<StateScreen
						icon={SearchXIcon}
						title="Nothing matches these filters"
						description="Try another folder or tag, or clear the filters to see everything."
					>
						<Button
							variant="outline"
							onClick={() =>
								setFilters({ folder: undefined, tag: undefined, owner: undefined, q: undefined })
							}
						>
							Clear filters
						</Button>
					</StateScreen>
				) : (
					<StateScreen
						icon={FilePlus2Icon}
						title={scope === "shared" ? "Nothing shared with you yet" : "No documents yet"}
						description={
							scope === "shared"
								? "When teammates share a document with you, it shows up here."
								: "Create your first document to get started."
						}
					>
						<Button disabled={isPending} onClick={() => newDoc()}>
							<FilePlus2Icon /> New document
						</Button>
					</StateScreen>
				)
			) : view === "grid" ? (
				<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filtered.map((doc) => (
						<li key={doc.id}>
							<DocCard
								doc={doc}
								folderName={doc.folderId ? lookups.folderName(doc.folderId) : undefined}
							/>
						</li>
					))}
				</ul>
			) : (
				<DocTable docs={filtered} search={filters.q ?? ""} lookups={lookups} />
			)}
		</section>
	);
}
