import { z } from "zod";

export const PERSON_STAGES = ["new", "engaged", "champion", "inactive"] as const;
export const personStageSchema = z.enum(PERSON_STAGES);
export type PersonStage = z.infer<typeof personStageSchema>;

export const STAGE_LABEL: Record<PersonStage, string> = {
	new: "New",
	engaged: "Engaged",
	champion: "Champion",
	inactive: "Inactive",
};

export const personSchema = z.object({
	id: z.string(),
	firstName: z.string().min(1),
	lastName: z.string(),
	email: z.email(),
	phone: z.string(),
	title: z.string(),
	companyId: z.string().nullable(),
	ownerId: z.string(),
	stage: personStageSchema,
	city: z.string(),
	createdAt: z.string(),
	lastContactedAt: z.string().nullable(),
});
export type Person = z.infer<typeof personSchema>;

export const newPersonSchema = z.object({
	firstName: z.string().trim().min(1, "Enter a first name").max(40),
	lastName: z.string().trim().max(40),
	email: z.email("Enter a valid email address"),
	title: z.string().trim().max(60),
	companyId: z.string(),
	stage: personStageSchema,
	ownerId: z.string().min(1, "Pick an owner"),
});
export type NewPerson = z.infer<typeof newPersonSchema>;

export const fullName = (person: Pick<Person, "firstName" | "lastName">) =>
	`${person.firstName} ${person.lastName}`.trim();
