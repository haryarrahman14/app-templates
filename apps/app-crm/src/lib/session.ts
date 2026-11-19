/**
 * Sample session, kept in localStorage: the app is static files, so the browser is the only place to
 * keep it. The `_app` layout route redirects to /sign-in without it, and `_auth` sends signed-in
 * visitors to /home.
 *
 * ▶ PLUG REAL AUTH HERE. Replace signIn/signOut with your provider's calls, and make isSignedIn read
 *   your provider's session (for example its SDK's current user, or a token whose expiry you check).
 *   The route guards only call isSignedIn, so they keep working unchanged. Real access control still
 *   belongs to your API: a static app can hide screens, not protect data.
 */
const SESSION_KEY = "tidewell_session";
export const SESSION_MEMBER_ID = "m1";

/**
 * The previews open straight into the app: with this off, nobody is asked to sign in and a sample user is
 * used. The sign-in screens still exist at /sign-in. Turn it on when you plug real auth in.
 */
export const REQUIRE_SIGN_IN = false;

export function isSignedIn() {
	if (!REQUIRE_SIGN_IN) return true;
	try {
		return Boolean(localStorage.getItem(SESSION_KEY));
	} catch {
		return false;
	}
}

export async function signIn(_credentials: { email: string; password?: string }) {
	await new Promise((resolve) => setTimeout(resolve, 700));
	try {
		localStorage.setItem(SESSION_KEY, SESSION_MEMBER_ID);
	} catch {}
}

export function signOut() {
	try {
		localStorage.removeItem(SESSION_KEY);
	} catch {}
}

/** Where to go after signing in: the `next` search param set by the guard, if it is a local path. */
export function safeNext(next: string | undefined) {
	return next?.startsWith("/") && !next.startsWith("//") ? next : "/home";
}
