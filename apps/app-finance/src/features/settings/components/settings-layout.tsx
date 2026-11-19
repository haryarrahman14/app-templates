import { Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/kit/page-header";
import { SettingsNav } from "@/features/settings/components/settings-nav";

/** Frame for /settings/*: one header, the section nav, and the current section. */
export function SettingsLayout() {
	return (
		<>
			<PageHeader title="Settings" description="Your profile, preferences and sample account." />
			<div className="grid gap-6 lg:grid-cols-[220px_1fr]">
				<SettingsNav />
				<div className="min-w-0">
					<Outlet />
				</div>
			</div>
		</>
	);
}
