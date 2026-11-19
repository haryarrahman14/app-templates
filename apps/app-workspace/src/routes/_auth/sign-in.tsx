import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { pageTitle } from "@/lib/site";

/** `next` is where to go after signing in: a path on this site only, never another origin. */
const searchSchema = z.object({
	next: z
		.string()
		.refine((path) => path.startsWith("/") && !path.startsWith("//"))
		.optional()
		.catch(undefined),
});

export const Route = createFileRoute("/_auth/sign-in")({
	validateSearch: searchSchema,
	head: () => pageTitle("Sign in"),
	component: function SignInRoute() {
		const { next } = Route.useSearch();
		return <SignInForm next={next ?? "/"} />;
	},
});
