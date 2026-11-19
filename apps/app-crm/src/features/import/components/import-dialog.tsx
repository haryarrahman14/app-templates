import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/components/dialog";
import { Label } from "@repo/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { useNavigate } from "@tanstack/react-router";
import { Check, FileSpreadsheet, TriangleAlert, Upload } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useCreateCompany } from "@/features/companies/api/mutations";
import {
	COMPANY_SIZES,
	INDUSTRIES,
	type NewCompany,
	newCompanySchema,
} from "@/features/companies/schemas/company";
import { SAMPLE_CSV, SAMPLE_CSV_NAME } from "@/features/import/constants/sample-csv";
import { parseCsv } from "@/features/import/utils/parse-csv";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { setUi, useUi } from "@/lib/ui-state";

type Target = "name" | "domain" | "industry" | "size" | "city";
const TARGETS: { id: Target; label: string; required?: boolean; guesses: string[] }[] = [
	{ id: "name", label: "Company name", required: true, guesses: ["company", "name", "account"] },
	{ id: "domain", label: "Domain", guesses: ["domain", "website", "url", "site"] },
	{ id: "industry", label: "Industry", guesses: ["industry", "sector", "vertical"] },
	{ id: "size", label: "Size", guesses: ["size", "employees", "headcount"] },
	{ id: "city", label: "City", guesses: ["city", "town", "location"] },
];
const NONE = "__none";
const STEPS = ["Upload", "Map columns", "Review"];

type Parsed = { fileName: string; headers: string[]; rows: string[][] };
type Mapping = Record<Target, string>;
type ReviewRow = { company: NewCompany; warnings: string[]; valid: boolean };

function guessMapping(headers: string[]): Mapping {
	const pick = (guesses: string[]) =>
		headers.find((header) => guesses.some((guess) => header.toLowerCase().includes(guess))) ?? NONE;
	return Object.fromEntries(TARGETS.map((target) => [target.id, pick(target.guesses)])) as Mapping;
}

function toCompany(row: string[], headers: string[], mapping: Mapping): ReviewRow {
	const value = (target: Target) => {
		const index = headers.indexOf(mapping[target]);
		return index >= 0 ? (row[index] ?? "").trim() : "";
	};
	const warnings: string[] = [];
	const rawIndustry = value("industry");
	const industry =
		INDUSTRIES.find((item) => item.toLowerCase() === rawIndustry.toLowerCase()) ?? "Software";
	if (rawIndustry && industry.toLowerCase() !== rawIndustry.toLowerCase())
		warnings.push(`Industry “${rawIndustry}” → Software`);
	const rawSize = value("size").replace("-", "–");
	const size = COMPANY_SIZES.find((item) => item === rawSize) ?? "11–50";
	if (rawSize && size !== rawSize) warnings.push(`Size “${rawSize}” → 11–50`);
	const domain = value("domain")
		.replace(/^https?:\/\//, "")
		.replace(/\/.*$/, "");

	const company: NewCompany = {
		name: value("name"),
		domain,
		industry,
		size,
		status: "lead",
		city: value("city").slice(0, 40),
		ownerId: "m1",
	};
	const parsed = newCompanySchema.safeParse(company);
	if (!parsed.success) {
		if (parsed.error.issues.some((issue) => issue.path[0] === "domain")) {
			company.domain = "";
			warnings.push("Domain dropped (not a valid domain)");
		}
	}
	const valid = newCompanySchema.safeParse(company).success;
	return { company, warnings, valid };
}

export function ImportDialog() {
	const open = useUi((state) => state.importOpen);
	const [step, setStep] = useState(0);
	const [parsed, setParsed] = useState<Parsed | null>(null);
	const [mapping, setMapping] = useState<Mapping | null>(null);
	const [error, setError] = useState<string | null>(null);
	const create = useCreateCompany();
	const onboarding = useOnboarding();
	const navigate = useNavigate();
	const fileId = useId();

	const reset = () => {
		setStep(0);
		setParsed(null);
		setMapping(null);
		setError(null);
	};
	const onOpenChange = (next: boolean) => {
		setUi({ importOpen: next });
		if (!next) reset();
	};

	const load = (fileName: string, text: string) => {
		const result = parseCsv(text);
		if (result.headers.length === 0 || result.rows.length === 0) {
			setError("That file has no rows. Check it has a header row and at least one record.");
			return;
		}
		setError(null);
		setParsed({ fileName, ...result });
		setMapping(guessMapping(result.headers));
		setStep(1);
	};

	const review = useMemo(
		() =>
			parsed && mapping ? parsed.rows.map((row) => toCompany(row, parsed.headers, mapping)) : [],
		[parsed, mapping],
	);
	const validRows = review.filter((row) => row.valid);

	const runImport = () =>
		create.mutate(
			validRows.map((row) => row.company),
			{
				onSuccess: () => {
					onboarding.complete("import");
					onOpenChange(false);
					navigate({ to: "/companies" });
				},
			},
		);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Import companies</DialogTitle>
					<DialogDescription>Bring records in from a CSV file in three steps.</DialogDescription>
				</DialogHeader>

				<ol className="flex items-center gap-2 text-sm" aria-label="Import steps">
					{STEPS.map((label, index) => (
						<li
							key={label}
							className="flex flex-1 items-center gap-2"
							aria-current={index === step ? "step" : undefined}
						>
							<span
								className={cn(
									"flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
									index < step && "border-primary bg-primary text-primary-foreground",
									index === step && "border-primary text-primary",
									index > step && "text-muted-foreground",
								)}
							>
								{index < step ? <Check className="size-3.5" /> : index + 1}
							</span>
							<span
								className={cn("truncate", index === step ? "font-medium" : "text-muted-foreground")}
							>
								{label}
							</span>
							{index < STEPS.length - 1 ? (
								<span className="hidden h-px flex-1 bg-border sm:block" />
							) : null}
						</li>
					))}
				</ol>

				{step === 0 ? (
					<div className="flex flex-col gap-3">
						<label
							htmlFor={fileId}
							className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed bg-muted/30 px-4 py-10 text-center transition hover:bg-muted/60 focus-within:ring-3 focus-within:ring-ring/50"
						>
							<Upload className="size-6 text-muted-foreground" />
							<span className="font-medium text-sm">Choose a CSV file</span>
							<span className="text-muted-foreground text-xs">
								First row should be the column names.
							</span>
							<input
								id={fileId}
								type="file"
								accept=".csv,text/csv"
								className="sr-only"
								onChange={(event) => {
									const file = event.target.files?.[0];
									if (!file) return;
									const reader = new FileReader();
									reader.onload = () => load(file.name, String(reader.result ?? ""));
									reader.onerror = () => setError("Could not read that file.");
									reader.readAsText(file);
									event.target.value = "";
								}}
							/>
						</label>
						<Button variant="outline" onClick={() => load(SAMPLE_CSV_NAME, SAMPLE_CSV)}>
							<FileSpreadsheet /> Use sample CSV
						</Button>
						{error ? (
							<p role="alert" className="text-destructive text-sm">
								{error}
							</p>
						) : null}
					</div>
				) : null}

				{step === 1 && parsed && mapping ? (
					<div className="flex flex-col gap-3">
						<p className="text-muted-foreground text-sm">
							{parsed.fileName} · {parsed.rows.length} rows. Match each field to a column.
						</p>
						<div className="divide-y rounded-2xl border">
							{TARGETS.map((target) => (
								<div
									key={target.id}
									className="flex items-center justify-between gap-3 px-4 py-2.5"
								>
									<Label htmlFor={`map-${target.id}`} className="text-sm">
										{target.label}
										{target.required ? <span className="text-destructive"> *</span> : null}
									</Label>
									<Select
										value={mapping[target.id]}
										onValueChange={(value) => setMapping({ ...mapping, [target.id]: value })}
									>
										<SelectTrigger id={`map-${target.id}`} className="w-44 sm:w-56">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={NONE}>Do not import</SelectItem>
											{parsed.headers.map((header) => (
												<SelectItem key={header} value={header}>
													{header}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							))}
						</div>
						{mapping.name === NONE ? (
							<p role="alert" className="text-destructive text-sm">
								Pick the column that holds the company name.
							</p>
						) : null}
					</div>
				) : null}

				{step === 2 ? (
					<div className="flex flex-col gap-3">
						<p className="text-sm">
							<span className="font-medium">{validRows.length}</span> of {review.length} rows are
							ready. New companies are added as leads owned by you.
						</p>
						<div className="max-h-72 overflow-auto rounded-2xl border">
							<table className="w-full text-sm">
								<thead className="sticky top-0 bg-muted/80 text-left text-muted-foreground text-xs backdrop-blur">
									<tr>
										<th className="px-3 py-2 font-medium">Name</th>
										<th className="hidden px-3 py-2 font-medium sm:table-cell">Domain</th>
										<th className="px-3 py-2 font-medium">Industry</th>
										<th className="hidden px-3 py-2 font-medium sm:table-cell">Size</th>
										<th className="px-3 py-2 font-medium">Status</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{review.map((row, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: CSV rows have no id.
										<tr key={index} className={row.valid ? "" : "text-muted-foreground"}>
											<td className="px-3 py-2 font-medium">{row.company.name || "—"}</td>
											<td className="hidden px-3 py-2 sm:table-cell">
												{row.company.domain || "—"}
											</td>
											<td className="px-3 py-2">{row.company.industry}</td>
											<td className="hidden px-3 py-2 sm:table-cell">{row.company.size}</td>
											<td className="px-3 py-2">
												{!row.valid ? (
													<span className="text-destructive text-xs">Skipped</span>
												) : row.warnings.length ? (
													<span
														className="inline-flex items-center gap-1 text-cat-orange-ink text-xs"
														title={row.warnings.join("\n")}
													>
														<TriangleAlert className="size-3" /> {row.warnings.length} fixed
													</span>
												) : (
													<span className="inline-flex items-center gap-1 text-cat-green-ink text-xs">
														<Check className="size-3" /> OK
													</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				) : null}

				<DialogFooter>
					{step > 0 ? (
						<Button variant="ghost" onClick={() => setStep(step - 1)} disabled={create.isPending}>
							Back
						</Button>
					) : (
						<Button variant="ghost" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
					)}
					{step === 1 ? (
						<Button disabled={!mapping || mapping.name === NONE} onClick={() => setStep(2)}>
							Review
						</Button>
					) : null}
					{step === 2 ? (
						<Button disabled={validRows.length === 0 || create.isPending} onClick={runImport}>
							{create.isPending ? <Spinner /> : null}
							Import {validRows.length} companies
						</Button>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
