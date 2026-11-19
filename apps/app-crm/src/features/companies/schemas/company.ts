import { z } from "zod";

export const INDUSTRIES = [
	"Software",
	"Logistics",
	"Healthcare",
	"Retail",
	"Finance",
	"Manufacturing",
	"Education",
	"Hospitality",
] as const;
export const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–1000", "1000+"] as const;
export const COMPANY_STATUSES = ["lead", "prospect", "customer", "churned"] as const;

export const companyStatusSchema = z.enum(COMPANY_STATUSES);
export type CompanyStatus = z.infer<typeof companyStatusSchema>;

export const companySchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	domain: z.string(),
	industry: z.enum(INDUSTRIES),
	size: z.enum(COMPANY_SIZES),
	status: companyStatusSchema,
	city: z.string(),
	country: z.string(),
	ownerId: z.string(),
	arr: z.number().nonnegative(),
	description: z.string(),
	createdAt: z.string(),
	lastContactedAt: z.string().nullable(),
});
export type Company = z.infer<typeof companySchema>;

/** The "New company" form. */
export const newCompanySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Enter at least 2 characters")
		.max(60, "Keep it under 60 characters"),
	domain: z
		.string()
		.trim()
		.regex(/^([a-z0-9-]+\.)+[a-z]{2,}$/i, "Enter a domain like acme.example.com")
		.or(z.literal("")),
	industry: z.enum(INDUSTRIES, { error: "Pick an industry" }),
	size: z.enum(COMPANY_SIZES, { error: "Pick a size" }),
	status: companyStatusSchema,
	city: z.string().trim().max(40),
	ownerId: z.string().min(1, "Pick an owner"),
});
export type NewCompany = z.infer<typeof newCompanySchema>;

export const STATUS_LABEL: Record<CompanyStatus, string> = {
	lead: "Lead",
	prospect: "Prospect",
	customer: "Customer",
	churned: "Churned",
};
