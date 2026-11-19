import { toast } from "@repo/ui/components/sonner";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { renderAppView } from "@/components/layout/app-views";
import { profileQuery } from "@/features/about/api/queries";
import { AppLayer } from "@/features/app-shell/components/app-layer";
import { DeviceFrame } from "@/features/device/components/device-frame";
import { DevicePanel } from "@/features/device/components/device-panel";
import { StatusBar } from "@/features/device/components/status-bar";
import { cvQuery } from "@/features/experience/api/queries";
import { HomeScreen } from "@/features/home-screen/components/home-screen";
import { LockScreen } from "@/features/lock-screen/components/lock-screen";
import { projectsQuery } from "@/features/projects/api/queries";
import type { AppId } from "@/lib/apps";
import { usePhoneNav, usePhoneNavSync } from "@/lib/phone-nav";
import { UNLOCK_KEY } from "@/lib/preferences";

const clearUnlockedFlag = () => {
	delete document.documentElement.dataset.unlocked;
};

/** The page: a phone (lock → home → apps) beside a short, server-rendered intro. */
export function PhonePage() {
	const { data: profile } = useSuspenseQuery(profileQuery);
	const { data: projects } = useSuspenseQuery(projectsQuery);
	const { data: cv } = useSuspenseQuery(cvQuery);
	const nav = usePhoneNav();
	usePhoneNavSync();
	const [locked, setLocked] = useState(!nav.app);

	// Unlocked earlier this session, or a deep link on the static page (a head script hid the
	// lock screen before paint). The flag stays until the lock screen has left, so its exit
	// animation is never seen.
	useEffect(() => {
		if ("unlocked" in document.documentElement.dataset) setLocked(false);
	}, []);

	// Arriving at an app via a link or the browser's back/forward skips the lock.
	useEffect(() => {
		if (nav.app) setLocked(false);
	}, [nav.app]);

	const unlock = useCallback(
		(target?: { app: AppId; id?: string }) => {
			try {
				sessionStorage.setItem(UNLOCK_KEY, "1");
			} catch {}
			setLocked(false);
			if (target) nav.open(target.app, target.id);
		},
		[nav.open],
	);

	const lock = useCallback(() => {
		try {
			sessionStorage.removeItem(UNLOCK_KEY);
		} catch {}
		clearUnlockedFlag();
		setLocked(true);
	}, []);

	// Enter, Space or ↑ unlocks when nothing else has focus.
	useEffect(() => {
		if (!locked) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.target !== document.body) return;
			if (event.key === "Enter" || event.key === " " || event.key === "ArrowUp") {
				event.preventDefault();
				unlock();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [locked, unlock]);

	const downloadCv = () => {
		if (cv.cvUrl) {
			window.open(cv.cvUrl, "_blank", "noopener");
			return;
		}
		toast("CV download is a stub", {
			description: "Add the PDF to public/ and set profile.cv.href in packages/content.",
		});
	};

	const openProject = (slug: string) => {
		unlock();
		nav.open("projects", slug);
	};

	return (
		<main className="backdrop min-h-dvh sm:flex sm:flex-col sm:items-center sm:justify-center sm:gap-10 sm:px-6 sm:py-8 lg:flex-row lg:gap-20">
			<DeviceFrame onPower={() => (locked ? unlock() : lock())}>
				<HomeScreen
					owner={profile}
					active={!locked && !nav.app}
					covered={Boolean(nav.app)}
					locked={locked}
				/>
				<AppLayer
					enabled={!locked || Boolean(nav.app)}
					renderApp={(app) => renderAppView(app, { lock })}
				/>
				<AnimatePresence onExitComplete={clearUnlockedFlag}>
					{locked ? <LockScreen key="lock" owner={profile} onUnlock={unlock} /> : null}
				</AnimatePresence>
				<StatusBar
					onWall={locked || !nav.app || (nav.app === "photos" && Boolean(nav.id))}
					hideTime={locked}
				/>
			</DeviceFrame>
			<DevicePanel
				owner={profile}
				projects={projects}
				onDownloadCv={downloadCv}
				onOpenProject={openProject}
			/>
		</main>
	);
}
