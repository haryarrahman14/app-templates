import type { PillTone } from "@/components/kit/pill";
import { PERSON_STAGES, type PersonStage, STAGE_LABEL } from "@/features/people/schemas/person";

export const STAGE_TONE: Record<PersonStage, PillTone> = {
	new: "blue",
	engaged: "teal",
	champion: "green",
	inactive: "gray",
};

export const STAGE_OPTIONS = PERSON_STAGES.map((value) => ({ value, label: STAGE_LABEL[value] }));
