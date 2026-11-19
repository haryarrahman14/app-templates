import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SettingsLayout } from "@/features/settings/components/settings-layout";

export const Route = createFileRoute("/_app/settings")({
	component: () => (
		<SettingsLayout>
			<Outlet />
		</SettingsLayout>
	),
});
