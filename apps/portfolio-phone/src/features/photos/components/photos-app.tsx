import { useSuspenseQuery } from "@tanstack/react-query";
import { AppScreen } from "@/components/kit/app-screen";
import { shotsQuery } from "@/features/photos/api/queries";
import { Lightbox } from "@/features/photos/components/lightbox";
import type { Shot } from "@/features/photos/schemas/shot";
import { usePhoneNav } from "@/lib/phone-nav";

export function PhotosApp() {
	const { data: shots } = useSuspenseQuery(shotsQuery);
	const nav = usePhoneNav();

	const groups = shots.reduce<Map<string, Shot[]>>((map, shot) => {
		map.set(shot.project, [...(map.get(shot.project) ?? []), shot]);
		return map;
	}, new Map());

	return (
		<>
			<AppScreen
				title="Shots"
				subtitle={`${shots.length} screenshots, ${groups.size} groups`}
				back={{ label: "Home", onClick: nav.back }}
			>
				<div className="flex flex-col gap-6">
					{[...groups].map(([project, items]) => (
						<section key={project}>
							<h2 className="mb-2 px-5 font-semibold text-[15px] tracking-tight">{project}</h2>
							<div className="grid grid-cols-3 gap-1 px-1">
								{items.map((shot) => (
									<button
										key={shot.id}
										type="button"
										onClick={() => nav.open("photos", shot.id)}
										aria-label={`Open ${shot.title} from ${shot.project}`}
										className="overflow-hidden rounded-[6px] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
									>
										<img
											src={shot.src}
											alt=""
											loading="lazy"
											className="aspect-[3/4] w-full bg-foreground/[0.04] object-cover object-top"
										/>
									</button>
								))}
							</div>
						</section>
					))}
				</div>
			</AppScreen>
			<Lightbox shots={shots} activeId={nav.id} />
		</>
	);
}
