import { z } from "zod";

/**
 * Sample session, kept in this browser's localStorage: a display name and an email, nothing secret.
 * The app is a static single-page app, so there is no server to hold a cookie.
 *
 * PLUG REAL AUTH HERE: replace these three functions with your auth provider's browser SDK.
 * - `readSession` → the SDK's current user (e.g. `getSession()` / `currentUser`), or null when signed out.
 *   The guards in `routes/_app.tsx` and `routes/_auth.tsx` call it before every navigation.
 * - `startSession` → the SDK's sign-in / sign-up (it verifies the password, not this file).
 * - `endSession` → the SDK's sign-out, which revokes the provider session.
 * A browser guard only decides what to show; your API must still verify the provider's token on every request.
 */
export const SESSION_KEY = "ledgerfinch.session";

export const sessionSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
});
export type Session = z.infer<typeof sessionSchema>;

/**
 * The previews open straight into the app: with this off, nobody is asked to sign in and a sample user is
 * used. The sign-in screens still exist at /sign-in. Turn it on when you plug real auth in.
 */
export const REQUIRE_SIGN_IN = false;

/** Who the app shows when nobody has signed in and sign-in is not required. */
const SAMPLE_SESSION: Session = { name: "Ava Lindqvist", email: "ava@ledgerfinch.example" };

export function readSession(): Session | null {
	const fallback = REQUIRE_SIGN_IN ? null : SAMPLE_SESSION;
	try {
		const raw = localStorage.getItem(SESSION_KEY);
		return raw ? sessionSchema.parse(JSON.parse(raw)) : fallback;
	} catch {
		return fallback;
	}
}

/** PLUG REAL AUTH HERE: verify credentials with your provider instead of storing the name. */
export function startSession(input: Session) {
	const session = sessionSchema.parse(input);
	localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	return session;
}

/** PLUG REAL AUTH HERE: revoke the provider session as well. */
export function endSession() {
	try {
		localStorage.removeItem(SESSION_KEY);
	} catch {}
}

/** Only same-origin paths, so `?next=` cannot send a visitor to another site after sign-in. */
export function safeNext(next: string | undefined) {
	return next?.startsWith("/") && !next.startsWith("//") ? next : "/";
}
