import { Panel, PanelHeader } from "@/components/kit/panel";
import { Stat } from "@/components/kit/stat";
import type { Instrument } from "@/features/instruments/schemas/instrument";

export function AboutCard({ instrument }: { instrument: Instrument }) {
	return (
		<Panel aria-labelledby="about-title">
			<PanelHeader
				id="about-title"
				title={`About ${instrument.name}`}
				description="Invented company profile"
			/>
			<p className="text-sm leading-relaxed">{instrument.about}</p>
			<dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<Stat label="Sector" value={instrument.sector} />
				<Stat label="Headquarters" value={instrument.hq} />
				<Stat label="Founded" value={instrument.founded} />
				<Stat label="Employees" value={instrument.employees.toLocaleString("en-US")} />
			</dl>
		</Panel>
	);
}
