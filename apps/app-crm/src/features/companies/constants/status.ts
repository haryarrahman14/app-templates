import type { PillTone } from "@/components/kit/pill";
import {
	COMPANY_STATUSES,
	type CompanyStatus,
	STATUS_LABEL,
} from "@/features/companies/schemas/company";

export const STATUS_TONE: Record<CompanyStatus, PillTone> = {
	lead: "gray",
	prospect: "blue",
	customer: "green",
	churned: "red",
};

export const STATUS_OPTIONS = COMPANY_STATUSES.map((value) => ({
	value,
	label: STATUS_LABEL[value],
}));
